import re
from playwright.sync_api import Page, expect

def test_wallet_login(page: Page):
    # Start a local server to avoid CORS issues
    # This assumes the test is run from the root of the repository
    # and the HTML files are in the same directory.

    # Navigate to the account page
    page.goto("http://localhost:8000/account.html")

    # Fill in the phone number
    page.get_by_label("Phone Number (e.g., 60123456789)").fill("60123456789")

    # Click the login button
    page.get_by_role("button", name="Log In / Register").click()

    # Wait for the wallet details to be visible
    wallet_details = page.locator("#walletDetails")
    expect(wallet_details).to_be_visible(timeout=10000)

    # Check that the welcome message is displayed
    welcome_message = page.locator("#welcomeMessage")
    expect(welcome_message).to_contain_text("Welcome")

    # Check that the balance is displayed
    balance_display = page.locator("#balanceDisplay")
    expect(balance_display).to_contain_text("RM")
