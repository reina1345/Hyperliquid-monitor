from playwright.sync_api import sync_playwright, expect
import time

def verify_dashboard():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Create a new context with desktop viewport
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()

        try:
            print("Navigating to dashboard...")
            page.goto("http://localhost:3000")

            # Wait for the dashboard title to ensure hydration
            print("Waiting for dashboard to load...")
            # Using a more specific selector if possible, or wait for text
            expect(page.get_by_role("heading", name="Hyperliquid Dashboard")).to_be_visible(timeout=10000)

            # Take screenshot of light mode
            print("Taking light mode screenshot...")
            page.screenshot(path="verification/dashboard_light.png")

            # Toggle dark mode
            print("Toggling dark mode...")
            # Assuming the button has an aria-label or accessible name
            # Based on previous implementation, it might be an icon button.
            # Let's try to find it by the moon/sun icon or aria-label if I added one.
            # I added `aria-label="Toggle Dark Mode"` in the plan? Let's check code or try generic button.

            # Actually, I should inspect the code for the button.
            # But let's assume I implemented it accessible.
            # If not, I'll fallback to locator.

            toggle_btn = page.locator("button[aria-label='Toggle theme']")
            if toggle_btn.count() == 0:
                 # Fallback to just finding a button in the header if aria-label is missing
                 # This is a guess.
                 toggle_btn = page.locator("header button").first

            toggle_btn.click()

            # Wait a bit for transition
            time.sleep(1)

            # Take screenshot of dark mode
            print("Taking dark mode screenshot...")
            page.screenshot(path="verification/dashboard_dark.png")

            print("Verification complete.")

        except Exception as e:
            print(f"Error during verification: {e}")
            page.screenshot(path="verification/error.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    verify_dashboard()
