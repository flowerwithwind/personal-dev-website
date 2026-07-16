from pathlib import Path
from playwright.sync_api import sync_playwright

out = Path(__file__).resolve().parent / "previews"
out.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_context(
        viewport={"width": 1440, "height": 1100},
        device_scale_factor=1.5,
    ).new_page()
    page.goto("https://www.coze.cn/overview", wait_until="domcontentloaded", timeout=60000)
    page.wait_for_timeout(5000)
    page.screenshot(path=str(out / "coze-ref.png"), full_page=False)
    styles = page.evaluate(
        """() => {
      const pick = (sel) => document.querySelector(sel);
      const body = getComputedStyle(document.body);
      const h = pick('h1') || pick('h2') || document.body;
      const hs = getComputedStyle(h);
      const btn = pick('button, a[class*="btn"], a[class*="Button"]') || h;
      const bs = getComputedStyle(btn);
      return {
        bodyFont: body.fontFamily,
        bodyBg: body.backgroundColor,
        bodyColor: body.color,
        hFont: hs.fontFamily,
        hSize: hs.fontSize,
        hWeight: hs.fontWeight,
        hColor: hs.color,
        hLetter: hs.letterSpacing,
        hLine: hs.lineHeight,
        btnRadius: bs.borderRadius,
        btnBg: bs.backgroundColor,
        btnColor: bs.color,
      };
    }"""
    )
    print(styles)
    browser.close()
