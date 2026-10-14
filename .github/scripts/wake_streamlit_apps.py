"""Wake the Streamlit Community Cloud apps and keep them awake.

Streamlit puts an app to sleep when nobody visits it for a while, and the app's
URL then shows a "Yes, get this app back up!" button instead of the app. Just
loading that page does not wake anything, so this script opens every app in a
real browser, clicks the button when an app is asleep, and waits until the app
itself has loaded inside the page.

It works in two passes so the sleeping apps start up at the same time: the first
pass clicks every wake-up button, the second waits for those apps to finish
starting. The run fails if any app could not be confirmed running.
"""

import os
import sys
import time

from playwright.sync_api import Error as PlaywrightError
from playwright.sync_api import sync_playwright

APPS = [
    "https://ze-video-downloader.streamlit.app",
    "https://ze-matrix.streamlit.app",
    "https://nmaptest.streamlit.app",
    "https://smart-room-iot.streamlit.app",
    "https://ciphershield.streamlit.app",
    "https://logoscope.streamlit.app",
    "https://zequiz.streamlit.app",
    "https://digital-wallet.streamlit.app",
    "https://ze-base.streamlit.app",
]

WAKE_BUTTON = '[data-testid^="wakeup-button"]'  # "Yes, get this app back up!"
APP_FRAME = 'iframe[title="streamlitApp"]'      # the running app is embedded here
APP_VIEW = '[data-testid="stAppViewContainer"]'  # rendered by the app itself

PAGE_TIMEOUT_MS = 90_000          # first response from streamlit.app
FIRST_PASS_TIMEOUT_MS = 90_000    # an awake app shows up within seconds
BOOT_TIMEOUT_MS = 6 * 60_000      # a woken app can take a few minutes to start
STAY_SECONDS = 20                 # keep the session open so the visit counts
SCREENSHOT_DIR = "heartbeat-screenshots"

LABELS = {"awake": "Awake", "woke": "Woke up", "waking": "Waking up"}


def app_name(url):
    return url.split("//")[1].split(".")[0]


def visit(browser, url, timeout_ms, leave_after_wake, screenshot_on_fail):
    """Open one app and return "awake", "woke", "waking" or "failed: <reason>"."""
    context = browser.new_context(viewport={"width": 1280, "height": 900})
    page = context.new_page()
    woke = False
    try:
        page.goto(url, wait_until="domcontentloaded", timeout=PAGE_TIMEOUT_MS)
        # Streamlit shows either the sleep screen or the app frame; while an app
        # is starting it shows a loading screen first, so wait for either one.
        page.locator(f"{WAKE_BUTTON}, {APP_FRAME}").first.wait_for(timeout=timeout_ms)
        if page.locator(WAKE_BUTTON).count():
            page.locator(WAKE_BUTTON).first.click()
            woke = True
            if leave_after_wake:
                return "waking"
        page.frame_locator(APP_FRAME).locator(APP_VIEW).first.wait_for(timeout=timeout_ms)
        page.wait_for_timeout(STAY_SECONDS * 1000)
        return "woke" if woke else "awake"
    except PlaywrightError as e:
        if screenshot_on_fail:
            os.makedirs(SCREENSHOT_DIR, exist_ok=True)
            try:
                page.screenshot(path=f"{SCREENSHOT_DIR}/{app_name(url)}.png", full_page=True)
            except PlaywrightError:
                pass
        return f"failed: {e.message.splitlines()[0]}"
    finally:
        context.close()


def write_summary(results):
    path = os.environ.get("GITHUB_STEP_SUMMARY")
    if not path:
        return
    lines = ["| App | Result |", "|---|---|"]
    for url, result in results.items():
        lines.append(f"| [{app_name(url)}]({url}) | {LABELS.get(result, result)} |")
    with open(path, "a", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")


def main():
    results = {}
    was_asleep = set()
    start = time.time()
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        print(f"Pass 1: checking {len(APPS)} apps and waking the sleeping ones", flush=True)
        for url in APPS:
            results[url] = visit(browser, url, FIRST_PASS_TIMEOUT_MS, True, False)
            if results[url] == "waking":
                was_asleep.add(url)
            print(f"  {app_name(url)}: {LABELS.get(results[url], results[url])}", flush=True)

        pending = [url for url in APPS if results[url] != "awake"]
        if pending:
            print(f"Pass 2: waiting for {len(pending)} apps to start", flush=True)
        for url in pending:
            result = visit(browser, url, BOOT_TIMEOUT_MS, False, True)
            if result == "awake" and url in was_asleep:
                result = "woke"
            results[url] = result
            print(f"  {app_name(url)}: {LABELS.get(result, result)}", flush=True)

        browser.close()

    write_summary(results)
    failed = [url for url, result in results.items() if result.startswith("failed")]
    print(
        f"Done in {time.time() - start:.0f}s: {len(APPS) - len(failed)}/{len(APPS)} apps running, "
        f"{len([u for u in results if results[u] == 'woke'])} woken up.",
        flush=True,
    )
    if failed:
        print(f"Not running: {', '.join(app_name(url) for url in failed)}", flush=True)
        sys.exit(1)


if __name__ == "__main__":
    main()
