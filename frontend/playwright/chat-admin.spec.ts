import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173'; // Adjust if your frontend runs on a different port

// Utility for unique usernames
function randomUser() {
  return 'user' + Math.floor(Math.random() * 1000000);
}

test('End-to-end: user chat, knowledge base, admin flows', async ({ page }) => {
  // --- Registration ---
  const username = randomUser();
  await page.goto(BASE_URL);
  await page.click('text=Register');
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="password"]', 'testpass123');
  await page.click('text=Register');

  // --- Login ---
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="password"]', 'testpass123');
  await page.click('text=Login');
  await expect(page.locator('text=AI Chat')).toBeVisible();

  // --- Chat ---
  await page.fill('textarea', 'Hello AI!');
  await page.click('button:has-text("Send")');
  await expect(page.locator('.text-right .bg-blue-100')).toContainText('Hello AI!');
  await expect(page.locator('.text-left .bg-gray-100')).not.toBeEmpty(); // AI response

  // --- Knowledge Base Search ---
  await page.fill('input[placeholder="Search articles"]', ''); // Empty or some term
  await page.click('button:has-text("Search")');
  // Optionally check for results
  // await expect(page.locator('.kb-result')).toBeVisible();

  // --- Profile Update ---
  await page.click('button:has-text("Profile")');
  await expect(page.locator('text=Profile & Settings')).toBeVisible();
  await page.click('button:has-text("Edit Profile")');
  await page.fill('input[type="text"]', username + 'x');
  await page.click('button:has-text("Save")');
  await expect(page.locator('text=Profile updated!')).toBeVisible();
  await page.click('button:has-text("✕")');

  // --- Logout ---
  await page.click('button:has-text("Logout")');

  // --- Admin Login ---
  await page.fill('input[name="username"]', 'admin'); // You must have an admin user seeded
  await page.fill('input[name="password"]', 'adminpass');
  await page.click('text=Login');
  await expect(page.locator('button:has-text("Admin")')).toBeVisible();
  await page.click('button:has-text("Admin")');
  await expect(page.locator('text=Admin Dashboard')).toBeVisible();

  // --- Admin: Manage Users ---
  await page.click('button:has-text("Users")');
  // Promote/demote/delete actions can be tested here

  // --- Admin: Manage Articles ---
  await page.click('button:has-text("Articles")');
  // Add/edit/delete actions can be tested here
});
