from playwright.sync_api import sync_playwright, expect
import time

def verify_open_orders():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Create a new context with desktop viewport
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        try:
            print("Navigating to dashboard...")
            page.goto("http://localhost:3000")

            # Wait for the dashboard header
            print("Waiting for dashboard to load...")
            expect(page.get_by_role("heading", name="Hyperliquid Dashboard")).to_be_visible(timeout=10000)

            # Check for "Open Orders" section
            print("Checking for Open Orders section...")
            expect(page.get_by_role("heading", name="Open Orders")).to_be_visible()

            # Take screenshot of the dashboard with the new section
            print("Taking screenshot...")
            # Scroll a bit to make sure it's visible if needed, though viewport is large enough
            page.screenshot(path="verification/dashboard_open_orders.png")

            print("Verification complete.")

        except Exception as e:
            print(f"Error during verification: {e}")
            page.screenshot(path="verification/error_open_orders.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    verify_open_orders()
