# Graph Report - KampusRebahanV2  (2026-11-07)

## Corpus Check
- 166 files · ~63,209 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 2, .ico 2, .css 1)

## Summary
- 797 nodes · 2058 edges · 40 communities (36 shown, 4 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 42 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f50d30f7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- order/route.ts
- Balance & History Tables
- 2. Komponen
- AdminPopupSettings.tsx
- affiliate/page.tsx
- Docs, Audit & Design Notes
- Password Reset UI Kit
- types.ts
- buttonClass
- Dev Dependencies
- balance/page.tsx
- referral.ts
- loyalty.ts
- dependencies
- prisma.ts
- TypeScript Config
- app/layout.tsx
- reject/route.ts
- supplierSync.ts
- balance/page.tsx
- ESLint Config
- transactions/[orderId]/page.tsx
- Route Protection Middleware
- Prisma Config
- NPM Scripts
- EditorialLanding.tsx
- admin/page.tsx
- Caption sounding update: November 2026
- PostCSS Config
- NextAuth Handlers
- Caption promo: Beli Claude Pro, gratis Gemini AI Pro
- next
- react
- @radix-ui/react-dropdown-menu
- auth
- GradientBorder.tsx
- Skeleton
- Order (Prisma model)
- Caption WhatsApp — KampusRebahan
- @types/pg@^8.20.0

## God Nodes (most connected - your core abstractions)
1. `next` - 65 edges
2. `react` - 50 edges
3. `lucide-react` - 40 edges
4. `buttonClass()` - 37 edges
5. `prisma` - 37 edges
6. `Skeleton()` - 34 edges
7. `auth` - 34 edges
8. `requireAdmin()` - 30 edges
9. `Navbar()` - 25 edges
10. `AdminPage()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `Missing Error State on Products Page` --conceptually_related_to--> `getProductsWithStats()`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md → lib/products.ts
- `3.5 Pembayaran QRIS → `/order/[orderId]` (status pending)` --references--> `GatewayQr()`  [INFERRED]
  design/SPEC.md → components/payment/GatewayQr.tsx
- `Order (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/admin/confirm/route.ts
- `Order (Prisma model)` --shares_data_with--> `fulfillOrder()`  [INFERRED]
  prisma/schema.prisma → lib/fulfillOrder.ts
- `ProductReview (Prisma model)` --shares_data_with--> `getProductsWithStats()`  [INFERRED]
  prisma/schema.prisma → lib/products.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **User Balance Wallet Ledger (top-up, purchase, refund)** — prisma_schema_user, prisma_schema_balancetopup, prisma_schema_balancetransaction, prisma_schema_balancetxntype, lib_credittopup_credittopup, app_api_balance_topup_route_post [INFERRED 0.85]
- **Order Payment & Fulfillment Lifecycle** — prisma_schema_order, prisma_schema_orderstatus, app_api_order_route_post, app_api_admin_confirm_route_post, app_api_admin_reject_route_post, lib_fulfillorder_fulfillorder, lib_orderstatus_statuslabel [INFERRED 0.85]
- **Password Reset Flow** — prisma_schema_passwordresettoken, prisma_schema_user, app_api_auth_forgot_password_route_post, app_api_auth_reset_password_route_post [INFERRED 0.85]

## Communities (40 total, 4 thin omitted)

### Community 0 - "order/route.ts"
Cohesion: 0.21
Nodes (13): POST(), CouponUnavailableError, POST(), GET(), POST(), warungApi, fulfillOrder(), FulfillOrderResult (+5 more)

### Community 1 - "Balance & History Tables"
Cohesion: 0.09
Nodes (44): DashboardHomePage(), formatDate(), formatPrice(), StatCard(), BalanceHistoryTable(), BalanceTransaction, formatDate(), formatPrice() (+36 more)

### Community 2 - "2. Komponen"
Cohesion: 0.06
Nodes (37): copy(), 1.1 Warna (hanya light; dark mode BELUM didesain), 1.2 Tipografi, 1.3 Radius, 1.4 Bayangan, 1.5 Spacing dan layout, 1.6 Navbar, 1. Design tokens (+29 more)

### Community 3 - "AdminPopupSettings.tsx"
Cohesion: 0.09
Nodes (28): GET(), POST(), GET(), HomePage(), revalidate, AdminPopupSettings(), formatSaved(), CardProps (+20 more)

### Community 4 - "affiliate/page.tsx"
Cohesion: 0.15
Nodes (15): AffiliateData, AffiliatePage(), formatDate(), formatPrice(), METHODS, AdminPayouts(), process(), formatDate() (+7 more)

### Community 5 - "Docs, Audit & Design Notes"
Cohesion: 0.10
Nodes (22): antislop Audit 001 (2026-09-20), WCAG Contrast Failures (text/placeholder/badge), Design Direction Is Web3 Template, Not KampusRebahan Brand, Two Admin Mechanisms (isAdmin vs ADMIN_EMAILS), Decorative Emoji Icons, Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast), Glass/Glow Overuse Beyond Dose Limit, middleware.ts Deprecated in Next 16 (use proxy.ts) (+14 more)

### Community 6 - "Password Reset UI Kit"
Cohesion: 0.12
Nodes (19): ForgotPasswordPage(), authConfig, AuthCard(), AuthField(), AuthFieldProps, AuthNotice(), AuthPasswordField(), AuthPasswordFieldProps (+11 more)

### Community 7 - "types.ts"
Cohesion: 0.07
Nodes (28): GET(), HIDDEN_PRODUCT_IDS, TOPUP_MIN_AMOUNT, getProductsWithStats(), AccountDetail, ApiResponse, BalanceResponse, BalanceResult (+20 more)

### Community 8 - "buttonClass"
Cohesion: 0.06
Nodes (54): CheckoutContent(), CheckoutPage(), formatPrice(), PaymentMethod, NotFound(), CopyButton(), formatDate(), formatPrice() (+46 more)

### Community 9 - "Dev Dependencies"
Cohesion: 0.12
Nodes (22): devDependencies, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20, @types/nodemailer@^8.0.1, @types/qrcode@^1.5.6, @types/react@^19, @types/react-dom@^19 (+14 more)

### Community 10 - "balance/page.tsx"
Cohesion: 0.13
Nodes (17): fetchLoyalty(), formatPrice(), LoyaltyCard(), LoyaltyResult, EASE, item, Props, clientSnapshot() (+9 more)

### Community 11 - "referral.ts"
Cohesion: 0.24
Nodes (20): GET(), POST(), POST(), GET(), GET(), getMarkupPercent(), getNumberSetting(), getReferralCommissionPercent() (+12 more)

### Community 12 - "loyalty.ts"
Cohesion: 0.17
Nodes (16): GET(), IN_PROGRESS, GET(), findCoupon(), generateCouponCode(), getLoyaltyState(), isUniqueViolation(), LOYALTY_REWARD (+8 more)

### Community 13 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, @auth/prisma-adapter@^2.11.2, bcryptjs@^3.0.3, lucide-react@^1.3.0, motion@^12.37.0, next@16.2.6, nodemailer@^7.0.13, pg@^8.20.0 (+14 more)

### Community 14 - "prisma.ts"
Cohesion: 0.20
Nodes (13): POST(), POST(), debitWallet(), generateReferralCode(), getSessionUserId(), isUniqueViolation(), PAYOUT_METHODS, REF_COOKIE (+5 more)

### Community 15 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 16 - "app/layout.tsx"
Cohesion: 0.18
Nodes (10): inter, interTight, metadata, RootLayout(), RefCapture(), NextAuthSessionProvider(), ToastProvider(), WhatsAppButton() (+2 more)

### Community 17 - "reject/route.ts"
Cohesion: 0.29
Nodes (8): GET(), POST(), GET(), POST(), settleLoyaltyOnReject(), creditWallet(), reverseCommission(), previewRefund()

### Community 18 - "supplierSync.ts"
Cohesion: 0.27
Nodes (9): GET(), GET(), POST(), creditCommission(), applySupplierStatus(), FAILED_STATUSES, markOrderCompleted(), syncSupplierOrders() (+1 more)

### Community 19 - "balance/page.tsx"
Cohesion: 0.48
Nodes (6): BalancePage(), handleTopup(), formatPrice(), PRESET_AMOUNTS, CountUp(), Reveal()

### Community 20 - "ESLint Config"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.2.6, eslint, eslint-config-next

### Community 21 - "transactions/[orderId]/page.tsx"
Cohesion: 0.13
Nodes (22): AccountDetailsPanel(), AccountGroup, COMPLAINT_STATUSES, complaintMessage(), Credential, CredentialRow(), formatDate(), formatPrice() (+14 more)

### Community 22 - "Route Protection Middleware"
Cohesion: 0.40
Nodes (3): config, PROTECTED, SESSION_COOKIES

### Community 23 - "Prisma Config"
Cohesion: 0.40
Nodes (4): dotenv@^17.4.2, prisma@^7.8.0, dotenv, prisma

### Community 24 - "NPM Scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 25 - "EditorialLanding.tsx"
Cohesion: 0.11
Nodes (24): CredentialVisual(), EditorialLanding(), minPrice(), PayVisual(), PickVisual(), rupiah, steps, Bubble() (+16 more)

### Community 26 - "admin/page.tsx"
Cohesion: 0.13
Nodes (24): AdminOrder, AdminPage(), formatDate(), formatPrice(), OrderActions(), OrderCard, OrderCardProps, OrderDetails() (+16 more)

### Community 27 - "Caption sounding update: November 2026"
Cohesion: 0.40
Nodes (4): Caption sounding update: November 2026, Teaser promo (kirim 1–2 hari kemudian), Versi lengkap, Versi singkat

### Community 30 - "Caption promo: Beli Claude Pro, gratis Gemini AI Pro"
Cohesion: 0.40
Nodes (4): Caption promo: Beli Claude Pro, gratis Gemini AI Pro, Versi feed (lengkap), Versi santai, Versi story (singkat)

### Community 31 - "next"
Cohesion: 0.15
Nodes (13): GET(), formatRelativeTime(), GET(), getDisplayName(), POST(), verifyBayarGgWebhookSignature(), creditTopUp(), CreditTopUpResult (+5 more)

### Community 32 - "react"
Cohesion: 0.18
Nodes (13): formatPrice(), TopUp, TopUpPaymentPage(), TransactionsPage(), useDashboardUser(), baseTabs, DashboardHeader(), Tab (+5 more)

### Community 33 - "@radix-ui/react-dropdown-menu"
Cohesion: 0.33
Nodes (4): @radix-ui/react-dropdown-menu@^2.1.24, react-dom@19.2.4, @radix-ui/react-dropdown-menu, react-dom

### Community 34 - "auth"
Cohesion: 0.15
Nodes (17): GET(), POST(), GET(), GET(), GET(), GET(), PATCH(), AdminLayout() (+9 more)

### Community 36 - "Skeleton"
Cohesion: 0.19
Nodes (12): AdminLoyalty(), filters, formatDate(), formatPrice(), Row, stateInfo, formatPrice(), RefundDialog() (+4 more)

### Community 37 - "Order (Prisma model)"
Cohesion: 0.13
Nodes (20): POST(), POST(), POST(), GET(), getSessionUserId(), mapReview(), POST(), sendResetCodeEmail() (+12 more)

### Community 38 - "Caption WhatsApp — KampusRebahan"
Cohesion: 0.33
Nodes (5): Caption 1 (lengkap), Caption 2 (singkat, untuk status), Caption 3 (ajakan santai di grup), Caption WhatsApp — KampusRebahan, Jargon pilihan

## Ambiguous Edges - Review These
- `getProductsWithStats()` → `Missing Error State on Products Page`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md · relation: conceptually_related_to

## Knowledge Gaps
- **14 isolated node(s):** `{ GET, POST }`, `Setting (Prisma model)`, `BalanceTxnType (Prisma enum)`, `CouponStatus (Prisma enum)`, `TopUpStatus (Prisma enum)` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 234 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `order/route.ts`, `Balance & History Tables`, `AdminPopupSettings.tsx`, `Password Reset UI Kit`, `types.ts`, `buttonClass`, `Dev Dependencies`, `balance/page.tsx`, `referral.ts`, `loyalty.ts`, `dependencies`, `prisma.ts`, `app/layout.tsx`, `reject/route.ts`, `supplierSync.ts`, `balance/page.tsx`, `transactions/[orderId]/page.tsx`, `Route Protection Middleware`, `EditorialLanding.tsx`, `admin/page.tsx`, `react`, `auth`, `Order (Prisma model)`?**
  _High betweenness centrality (0.336) - this node is a cross-community bridge._
- **What connects `{ GET, POST }`, `Setting (Prisma model)`, `BalanceTxnType (Prisma enum)` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Balance & History Tables` be split into smaller, more focused modules?**
  _Cohesion score 0.08650937689050212 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `Balance & History Tables`, `AdminPopupSettings.tsx`, `affiliate/page.tsx`, `Skeleton`, `Password Reset UI Kit`, `GradientBorder.tsx`, `buttonClass`, `Dev Dependencies`, `balance/page.tsx`, `dependencies`, `app/layout.tsx`, `balance/page.tsx`, `transactions/[orderId]/page.tsx`, `EditorialLanding.tsx`, `admin/page.tsx`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Should `2. Komponen` be split into smaller, more focused modules?**
  _Cohesion score 0.05547652916073969 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `react` to `Balance & History Tables`, `AdminPopupSettings.tsx`, `affiliate/page.tsx`, `Skeleton`, `Password Reset UI Kit`, `buttonClass`, `Dev Dependencies`, `balance/page.tsx`, `dependencies`, `app/layout.tsx`, `balance/page.tsx`, `transactions/[orderId]/page.tsx`, `EditorialLanding.tsx`, `admin/page.tsx`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `getProductsWithStats()` and `Missing Error State on Products Page`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._