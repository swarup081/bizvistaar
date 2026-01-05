import time
from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        # Direct to Dashboard (Mocked Auth)
        try:
            print("Navigating to Dashboard (Mocked)...")
            page.goto("http://localhost:3000/dashboard/products")

            # Wait for "Products" title
            page.wait_for_selector("h1:has-text('Products')", timeout=10000)
            print("On Dashboard Products Page.")

            page.screenshot(path="/home/jules/verification/01_products_list.png")

            # Add Product
            print("Adding Product...")
            # Note: The button text is "Add Product"
            page.click("button:has-text('Add Product')")
            page.wait_for_selector("text=Add New Product")

            page.fill("input[name='name']", "Infinite Widget")
            page.fill("input[name='price']", "19.99")

            # Click Unlimited
            page.click("text=Unlimited")

            page.screenshot(path="/home/jules/verification/02_modal_filled.png")

            # Submit (inside modal)
            # The submit button text is "Add Product" inside modal too.
            # Using type=submit is safer
            page.click("button[type='submit']")
            # Wait for sync
            time.sleep(2)

            page.screenshot(path="/home/jules/verification/03_result.png")

            # Verify text "Infinite Widget" and "Unlimited"
            if page.locator("text=Infinite Widget").count() > 0:
                print("PASS: Product found.")
            else:
                print("FAIL: Product not found.")

            if page.locator("text=Unlimited").count() > 0:
                print("PASS: Unlimited stock found.")
            else:
                print("FAIL: Unlimited stock not found.")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="/home/jules/verification/failure.png")

        browser.close()

if __name__ == "__main__":
    run()
