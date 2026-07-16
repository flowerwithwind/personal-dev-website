from pathlib import Path
from playwright.sync_api import sync_playwright

base = Path(__file__).resolve().parent
out = base / "previews"
out.mkdir(exist_ok=True)

pages = [
    ("A-midnight-engineer.html", "A-midnight-engineer.png"),
    ("B-clean-light.html", "B-clean-light.png"),
    ("C-terminal-ide.html", "C-terminal-ide.png"),
    ("D-ai-aurora.html", "D-ai-aurora.png"),
    ("index.html", "00-picker-gallery.png"),
]

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(
        viewport={"width": 1440, "height": 1100},
        device_scale_factor=1.5,
    )
    page = context.new_page()
    for html, png in pages:
        url = (base / html).as_uri()
        page.goto(url, wait_until="networkidle", timeout=60000)
        page.wait_for_timeout(1000)
        page.screenshot(path=str(out / png), full_page=True)
        print("saved", png)
    browser.close()

print("done")
