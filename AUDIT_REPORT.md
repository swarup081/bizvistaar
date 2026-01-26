# Security Audit Report

**Security Score:** 35/100

---

## 🔴 CRITICAL RISKS (Money/Data Loss)

### 1. Subscription Hijacking & Account Takeover (Financial/Data Loss)
**Location:** `src/app/actions/publishActions.js` -> `verifyAndPublishUserSite`

**Vulnerability:** The function allows a user to pass a `fallbackSubscriptionId`. The code validates this ID against Razorpay but **fails to verify if the subscription belongs to the current user**.

**Exploit Scenario:**
1.  Attacker obtains a valid `sub_ID` (e.g., from a leaked screenshot, logs, or by guessing).
2.  Attacker calls `verifyAndPublishUserSite("sub_LEAKED_ID")`.
3.  The system fetches the subscription from Razorpay (Status: Active).
4.  The system **overwrites** the subscription record in the database using `upsert`.
5.  The subscription is now linked to the Attacker's `user_id`.
6.  **Result:** The original paying customer loses access (Data Loss/Denial of Service), and the Attacker gets a free subscription (Financial Loss).

**Recommendation:**
Verify that `rzpSub.notes.user_id` matches `user.id` before processing the fallback.

### 2. Strict Environment Variable Policy Violation (Security Breach)
**Location:** Global
**Vulnerability:** The codebase uses multiple environment variables that are **NOT** on the allowed whitelist. The instructions were explicit: "YOU MUST REJECT any variable not on this list."

**Unauthorized Variables Found:**
*   `process.env.NEXT_PUBLIC_RAZORPAY_MODE` (Used in `razorpay-config.js`)
*   `process.env.RAZORPAY_WEBHOOK_SECRET` (Used in `webhooks/razorpay/route.js`)
*   `process.env.RAZORPAY_Live_Key_ID` (Used in `razorpayActions.js`, `razorpay-config.js`)
*   `process.env.RAZORPAY_TEST_KEY_ID` (Used in `razorpay-config.js`)
*   `process.env.RAZORPAY_Test_Key_Secret` (Used in `publishActions.js`)

**Risk:** Use of unapproved keys allows developers to bypass security controls or use insecure test keys in production environments.

---

## 🟡 SECURITY WARNINGS

### 1. Potential Service Key Leakage
**Location:** `src/app/site/[slug]/page.js` (and `shop`, `checkout`, `product` pages)
**Issue:** `SUPABASE_SERVICE_ROLE_KEY` is instantiated directly in Server Component page files.
```javascript
const supabaseAdmin = createClient(..., process.env.SUPABASE_SERVICE_ROLE_KEY);
```
**Risk:** While currently safe (Server Components), this pattern is fragile. If a developer accidentally adds `'use client'` to the top of the file or passes `supabaseAdmin` to a client component, the Admin Key will leak to the browser, allowing full database destruction.
**Recommendation:** Move `supabaseAdmin` instantiation to a dedicated server-only utility file (e.g., `src/lib/supabaseAdmin.js`) which creates a boundary.

### 2. Inconsistent Client-Side Key Usage
**Location:** `src/app/config/razorpay-config.js`
**Issue:** The code attempts to access non-public env vars in client-side code:
```javascript
return process.env.NEXT_PUBLIC_RAZORPAY_LIVE_KEY_ID || process.env.RAZORPAY_Live_Key_ID;
```
**Risk:** `process.env.RAZORPAY_Live_Key_ID` will be undefined in the browser, potentially causing confusion or fallback errors. Relying on the fallback masks the configuration issue.

### 3. Frontend Price Display Discrepancy
**Location:** `src/app/checkout/page.js`
**Issue:** The checkout page calculates the display price using frontend logic (`monthlyRate * 12`).
**Risk:** While the actual charge is secured by the backend `plan_id`, if the frontend logic desyncs from the backend config, the user might see one price but be charged another, leading to chargebacks and reputational damage.

---

## 🟢 ENV VAR CHECK

| Variable | Status | Notes |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ PASS | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ PASS | |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ PASS | **Warning:** Risky usage in page files |
| `CONTACT_FOUNDER` | ✅ PASS | |
| `OPENAI_API_KEY` | ✅ PASS | |
| `NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID` | ✅ PASS | |
| `NEXT_PUBLIC_RAZORPAY_LIVE_KEY_ID` | ✅ PASS | |
| `RAZORPAY_TEST_KEY_SECRET` | ✅ PASS | |
| `RAZORPAY_LIVE_KEY_SECRET` | ✅ PASS | |
| `RAZORPAY_WEBHOOK_SECRET_LIVE` | ✅ PASS | |
| `RAZORPAY_WEBHOOK_SECRET_TEST` | ✅ PASS | |
| `NEXT_PUBLIC_RAZORPAY_MODE` | ❌ FAIL | **Unauthorized** |
| `RAZORPAY_WEBHOOK_SECRET` | ❌ FAIL | **Unauthorized** |
| `RAZORPAY_Live_Key_ID` | ❌ FAIL | **Unauthorized / Format** |
| `RAZORPAY_TEST_KEY_ID` | ❌ FAIL | **Unauthorized / Format** |
| `RAZORPAY_Test_Key_Secret` | ❌ FAIL | **Unauthorized / Format** |
