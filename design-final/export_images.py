"""Export high-fidelity design prototype PNGs from HTML pages."""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent
PAGES = ROOT / "pages"
IMAGES = ROOT / "images"
IMAGES.mkdir(parents=True, exist_ok=True)

SPECS = [
    ("00-style-board.html", "00-style-board.png"),
    ("01-home.html", "01-home.png"),
    ("02-notes.html", "02-notes.png"),
    ("03-note-detail.html", "03-note-detail.png"),
    ("04-projects.html", "04-projects.png"),
    ("05-project-detail.html", "05-project-detail.png"),
    ("06-about.html", "06-about.png"),
]


def main() -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(
            viewport={"width": 1440, "height": 1100},
            device_scale_factor=1.5,
        )
        page = context.new_page()
        for html, png in SPECS:
            path = PAGES / html
            page.goto(path.resolve().as_uri(), wait_until="networkidle", timeout=60000)
            page.wait_for_timeout(1200)
            out = IMAGES / png
            page.screenshot(path=str(out), full_page=True)
            print("saved", out.name, f"({out.stat().st_size // 1024} KB)")
        browser.close()
    print("done →", IMAGES)


if __name__ == "__main__":
    main()
