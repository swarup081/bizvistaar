# 🛡️ BizVistar Technical Audit Report

**Date:** October 26, 2023
**Auditor:** Jules (AI Senior Software Auditor)
**Scope:** Full Stack Analysis (Source Code, Configuration, Security, Logic)

---

## 1. Authentication & Authorization

### 🔴 Missing Middleware Protection
*   **Component / Area:** `src/middleware.js` (Missing), `src/app/dashboard/layout.js`
*   **Severity:** High
*   **Description:** The application lacks a `middleware.js` file to protect private routes (e.g., `/dashboard/*`) at the server level.
*   **How it occurs:** Routes are protected only by client-side `useEffect` checks in `src/app/dashboard/page.js` and `layout.js`.
*   **Potential Impact:** Unauthenticated users can access the dashboard layout and structure. While data fetching is likely blocked by RLS, the UI is exposed, leading to a poor UX (flashing content) and potential information leakage.
*   **Already handled elsewhere?** No
*   **Confidence level:** High

### 🟠 Open Redirect Vulnerability
*   **Component / Area:** `src/app/(auth)/sign-in/page.js`
*   **Severity:** Medium
*   **Description:** The Sign-In page redirects users to a URL specified in the `redirect` query parameter without validation.
*   **How it occurs:** `router.push(searchParams.get('redirect'))` is called directly after login success.
*   **Potential Impact:** Phishing attacks where users are redirected to a malicious site after a legitimate login.
*   **Already handled elsewhere?** No
*   **Confidence level:** High

---

## 2. Payments / Billing / Transactions

### 🔴 Order Price Tampering
*   **Component / Area:** `src/app/actions/orderActions.js`
*   **Severity:** Critical
*   **Description:** The `submitOrder` function trusts the `totalAmount` sent from the client-side cart.
*   **How it occurs:** The `totalAmount` parameter is directly inserted into the `orders` table without server-side recalculation.
*   **Potential Impact:** A malicious user can purchase items for ₹1 (or any amount) by modifying the payload sent to the server. Financial loss is guaranteed if exploited.
*   **Already handled elsewhere?** No
*   **Confidence level:** High

### ✅ Subscription Flow (Secure)
*   **Component / Area:** `src/app/actions/razorpayActions.js`
*   **Severity:** Low (Positive Finding)
*   **Description:** The Razorpay subscription creation is secure. It ignores client-side pricing and resolves Plan IDs server-side based on configuration.
*   **How it occurs:** N/A
*   **Potential Impact:** N/A
*   **Already handled elsewhere?** N/A
*   **Confidence level:** High

---

## 3. API & Backend Logic

### 🔴 IDOR in Order Management
*   **Component / Area:** `src/app/actions/orderActions.js`
*   **Severity:** Critical
*   **Description:** Administrative actions for orders allow unauthorized modification of any order in the system.
*   **How it occurs:** `updateOrderStatus` and `addOrderLogistics` take an `orderId` and use `supabaseAdmin` to update it without checking if the user owns the order.
*   **Potential Impact:** Any user can cancel, ship, or modify orders belonging to other businesses.
*   **Already handled elsewhere?** No
*   **Confidence level:** High

### 🟡 Trusting Client Input for New Products
*   **Component / Area:** `src/app/actions/orderActions.js`
*   **Severity:** Medium
*   **Description:** `submitOrder` allows creating new products on the fly if they don't exist, using client-provided names and prices.
*   **How it occurs:** Logic falls back to insertion if product lookup fails.
*   **Potential Impact:** Database pollution with fake products; inconsistent pricing logic.
*   **Already handled elsewhere?** No
*   **Confidence level:** Medium

---

## 4. Frontend UI / UX

### 🟡 Unoptimized Images
*   **Component / Area:** Multiple Components (e.g., `EditorSidebar.js`)
*   **Severity:** Low
*   **Description:** Widespread use of standard `<img>` tags instead of Next.js `<Image />`.
*   **How it occurs:** Usage of `<img>` in JSX.
*   **Potential Impact:** Slower Largest Contentful Paint (LCP) and higher bandwidth usage.
*   **Already handled elsewhere?** No
*   **Confidence level:** High

---

## 5. State Management & Data Flow

### 🟠 Synchronous State Updates in Effects
*   **Component / Area:** `src/app/editor/page.js`, `src/components/editor/EditorSidebar.js`
*   **Severity:** Medium
*   **Description:** The Editor component calls `setState` synchronously inside `useEffect`.
*   **How it occurs:** `setBusinessData` or similar setters are called directly in the effect body without conditions.
*   **Potential Impact:** Causes cascading re-renders, impacting performance and potentially causing infinite loops or UI flickering.
*   **Already handled elsewhere?** No
*   **Confidence level:** High

---

## 6. Performance & Load Behavior

### 🟡 Client-Side Auth Checks Delay
*   **Component / Area:** `src/app/dashboard/layout.js`
*   **Severity:** Medium
*   **Description:** Dashboard pages load the UI structure before checking authentication.
*   **How it occurs:** The auth check is in a `useEffect` hook, which runs after the initial render.
*   **Potential Impact:** "Flash of Unauthenticated Content" (FOUC) or layout shift; unnecessary resource loading for unauthorized users.
*   **Already handled elsewhere?** No
*   **Confidence level:** High

---

## 7. Security & Data Protection

### 🟢 Webhook Verification
*   **Component / Area:** `src/app/api/webhooks/razorpay/route.js`
*   **Severity:** Low (Positive Finding)
*   **Description:** The Razorpay webhook correctly verifies the signature.
*   **How it occurs:** Uses `crypto` library and secret comparison.
*   **Potential Impact:** N/A
*   **Already handled elsewhere?** N/A
*   **Confidence level:** High

---

## 8. Error Handling & Logging

### 🟡 Silent Failures in Auth Actions
*   **Component / Area:** `src/app/actions/productActions.js`
*   **Severity:** Low
*   **Description:** `getWebsiteId` returns `null` if auth fails, which flows down to return empty arrays instead of throwing an error.
*   **How it occurs:** `try/catch` or conditional return blocks in helper functions.
*   **Potential Impact:** Difficult debugging; frontend components might show "No products" instead of an auth error.
*   **Already handled elsewhere?** No
*   **Confidence level:** Medium

---

## 🚨 Critical / Massive Issues

1.  **Financial Fraud Risk (Order Tampering):** The system accepts the `totalAmount` for orders directly from the client. **Fix:** Recalculate the total server-side by summing product prices fetched from the database.
2.  **Insecure Direct Object Reference (IDOR):** `updateOrderStatus` allows anyone to modify any order. **Fix:** Verify `await cookies()` -> `getUser()` and check that the `order.website_id` belongs to the authenticated user before updating.
3.  **Missing Authorization Guard:** The Dashboard and associated actions lack a robust server-side protection layer (Middleware), exposing the application structure to unauthenticated access.
