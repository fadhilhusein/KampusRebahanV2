# Graph Report - KampusRebahanV2  (2026-11-06)

## Corpus Check
- 134 files · ~48,004 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 2, .ico 2, .css 1)

## Summary
- 639 nodes · 1628 edges · 34 communities (27 shown, 7 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 41 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f2402e4c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- prisma.ts
- Balance & History Tables
- 2. Komponen
- types.ts
- loyalty.ts
- Docs, Audit & Design Notes
- Password Reset UI Kit
- fulfillOrder
- react
- Dev Dependencies
- order/route.ts
- settings/route.ts
- [id]/page.tsx
- Runtime Dependencies
- auth
- TypeScript Config
- Root Layout & Providers
- next
- reviews/route.ts
- recent-purchases/route.ts
- ESLint Config
- transactions/[orderId]/page.tsx
- Route Protection Middleware
- Prisma Config
- NPM Scripts
- prisma
- admin/page.tsx
- next-themes
- PostCSS Config
- NextAuth Handlers
- pg
- react-dom@19.2.4
- @types/bcryptjs@^2.4.6
- @types/pg@^8.20.0

## God Nodes (most connected - your core abstractions)
1. `next` - 57 edges
2. `react` - 41 edges
3. `lucide-react` - 34 edges
4. `auth` - 32 edges
5. `Navbar()` - 28 edges
6. `buttonClass()` - 28 edges
7. `prisma` - 28 edges
8. `Skeleton()` - 24 edges
9. `Footer()` - 22 edges
10. `requireAdmin()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Missing Error State on Products Page` --conceptually_related_to--> `getProductsWithStats()`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md → lib/products.ts
- `User (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/auth/register/route.ts
- `3.11 Legal` --references--> `LegalArticle()`  [INFERRED]
  design/SPEC.md → components/layout/LegalArticle.tsx
- `3.5 Pembayaran QRIS → `/order/[orderId]` (status pending)` --references--> `GatewayQr()`  [INFERRED]
  design/SPEC.md → components/payment/GatewayQr.tsx
- `Order (Prisma model)` --shares_data_with--> `fulfillOrder()`  [INFERRED]
  prisma/schema.prisma → lib/fulfillOrder.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **User Balance Wallet Ledger (top-up, purchase, refund)** — prisma_schema_user, prisma_schema_balancetopup, prisma_schema_balancetransaction, prisma_schema_balancetxntype, lib_credittopup_credittopup, app_api_balance_topup_route_post [INFERRED 0.85]
- **Order Payment & Fulfillment Lifecycle** — prisma_schema_order, prisma_schema_orderstatus, app_api_order_route_post, app_api_admin_confirm_route_post, app_api_admin_reject_route_post, lib_fulfillorder_fulfillorder, lib_orderstatus_statuslabel [INFERRED 0.85]
- **Password Reset Flow** — prisma_schema_passwordresettoken, prisma_schema_user, app_api_auth_forgot_password_route_post, app_api_auth_reset_password_route_post [INFERRED 0.85]

## Communities (34 total, 7 thin omitted)

### Community 0 - "prisma.ts"
Cohesion: 0.16
Nodes (8): POST(), POST(), POST(), sendResetCodeEmail(), transporter, globalForPrisma, PasswordResetToken (Prisma model), bcryptjs

### Community 1 - "Balance & History Tables"
Cohesion: 0.06
Nodes (58): BalancePage(), handleTopup(), formatPrice(), PRESET_AMOUNTS, DashboardHomePage(), formatDate(), formatPrice(), StatCard() (+50 more)

### Community 2 - "2. Komponen"
Cohesion: 0.05
Nodes (37): copy(), 1.1 Warna (hanya light; dark mode BELUM didesain), 1.2 Tipografi, 1.3 Radius, 1.4 Bayangan, 1.5 Spacing dan layout, 1.6 Navbar, 1. Design tokens (+29 more)

### Community 3 - "types.ts"
Cohesion: 0.07
Nodes (26): TOPUP_MIN_AMOUNT, AccountDetail, ApiResponse, BalanceResponse, BalanceResult, BayarGgCheckPaymentData, BayarGgCreatePaymentData, BayarGgCreatePaymentPayload (+18 more)

### Community 4 - "loyalty.ts"
Cohesion: 0.19
Nodes (13): CouponUnavailableError, POST(), GET(), findCoupon(), generateCouponCode(), getLoyaltyState(), isUniqueViolation(), LOYALTY_REWARD (+5 more)

### Community 5 - "Docs, Audit & Design Notes"
Cohesion: 0.11
Nodes (21): antislop Audit 001 (2026-09-20), WCAG Contrast Failures (text/placeholder/badge), Design Direction Is Web3 Template, Not KampusRebahan Brand, Decorative Emoji Icons, Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast), Glass/Glow Overuse Beyond Dose Limit, middleware.ts Deprecated in Next 16 (use proxy.ts), Missing Error State on Products Page (+13 more)

### Community 6 - "Password Reset UI Kit"
Cohesion: 0.15
Nodes (16): ForgotPasswordPage(), AuthCard(), AuthField(), AuthFieldProps, AuthNotice(), AuthPasswordField(), AuthPasswordFieldProps, AuthShell() (+8 more)

### Community 7 - "fulfillOrder"
Cohesion: 0.23
Nodes (13): Two Admin Mechanisms (isAdmin vs ADMIN_EMAILS), POST(), POST(), BalanceTopUp (Prisma model), BalanceTransaction (Prisma model), BalanceTxnType (Prisma enum), Coupon (Prisma model), CouponStatus (Prisma enum) (+5 more)

### Community 8 - "react"
Cohesion: 0.06
Nodes (57): CheckoutContent(), CheckoutPage(), formatPrice(), PaymentMethod, formatPrice(), TopUp, TopUpPaymentPage(), NotFound() (+49 more)

### Community 9 - "Dev Dependencies"
Cohesion: 0.12
Nodes (22): devDependencies, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20, @types/nodemailer@^8.0.1, @types/qrcode@^1.5.6, @types/react@^19, @types/react-dom@^19 (+14 more)

### Community 10 - "order/route.ts"
Cohesion: 0.22
Nodes (11): GET(), GET(), POST(), bayarGg, QRIS_GATEWAY_MAX_AMOUNT, fulfillOrder(), FulfillOrderResult, call() (+3 more)

### Community 11 - "settings/route.ts"
Cohesion: 0.26
Nodes (14): GET(), POST(), GET(), GET(), getProductsWithStats(), getMarkupPercent(), isBankTransferEnabled(), isQrisBridgeEnabled() (+6 more)

### Community 12 - "[id]/page.tsx"
Cohesion: 0.08
Nodes (40): HomePage(), revalidate, ProductDetailContent(), ProductDetailPage(), Terms(), EditorialLanding(), minPrice(), rupiah (+32 more)

### Community 13 - "Runtime Dependencies"
Cohesion: 0.10
Nodes (21): dependencies, @auth/prisma-adapter@^2.11.2, bcryptjs@^3.0.3, lucide-react@^1.3.0, next@16.2.6, next-auth@^5.0.0-beta.31, nodemailer@^7.0.13, @prisma/adapter-pg@^7.8.0 (+13 more)

### Community 14 - "auth"
Cohesion: 0.17
Nodes (12): GET(), GET(), GET(), GET(), PATCH(), GET(), auth, authConfig (+4 more)

### Community 15 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 16 - "Root Layout & Providers"
Cohesion: 0.17
Nodes (11): inter, interTight, metadata, RootLayout(), NextAuthSessionProvider(), Toast, ToastContext, ToastContextValue (+3 more)

### Community 17 - "next"
Cohesion: 0.21
Nodes (11): POST(), GET(), POST(), REFUND_ELIGIBLE_STATUSES, AdminLayout(), DashboardLayout(), metadata, DashboardFrame() (+3 more)

### Community 18 - "reviews/route.ts"
Cohesion: 0.80
Nodes (4): GET(), getSessionUserId(), mapReview(), POST()

### Community 19 - "recent-purchases/route.ts"
Cohesion: 0.83
Nodes (3): formatRelativeTime(), GET(), getDisplayName()

### Community 20 - "ESLint Config"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.2.6, eslint, eslint-config-next

### Community 21 - "transactions/[orderId]/page.tsx"
Cohesion: 0.15
Nodes (18): AccountDetailsPanel(), AccountGroup, Credential, CredentialRow(), formatDate(), formatPrice(), isPasswordField(), parseAccountDetails() (+10 more)

### Community 22 - "Route Protection Middleware"
Cohesion: 0.40
Nodes (3): config, PROTECTED, SESSION_COOKIES

### Community 23 - "Prisma Config"
Cohesion: 0.40
Nodes (4): dotenv@^17.4.2, prisma@^7.8.0, dotenv, prisma

### Community 24 - "NPM Scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 25 - "prisma"
Cohesion: 0.42
Nodes (6): GET(), POST(), verifyBayarGgWebhookSignature(), creditTopUp(), CreditTopUpResult, prisma

### Community 26 - "admin/page.tsx"
Cohesion: 0.14
Nodes (21): AdminOrder, AdminPage(), formatDate(), formatPrice(), OrderActions(), OrderCard, OrderCardProps, OrderDetails() (+13 more)

## Ambiguous Edges - Review These
- `getProductsWithStats()` → `Missing Error State on Products Page`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md · relation: conceptually_related_to

## Knowledge Gaps
- **14 isolated node(s):** `{ GET, POST }`, `Setting (Prisma model)`, `Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast)`, `Promised Voucher Feature Missing in Checkout`, `Tap Targets Under 44px` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 195 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `prisma.ts`, `Balance & History Tables`, `types.ts`, `loyalty.ts`, `Password Reset UI Kit`, `react`, `Dev Dependencies`, `order/route.ts`, `settings/route.ts`, `[id]/page.tsx`, `Runtime Dependencies`, `auth`, `Root Layout & Providers`, `reviews/route.ts`, `recent-purchases/route.ts`, `transactions/[orderId]/page.tsx`, `Route Protection Middleware`, `prisma`, `admin/page.tsx`?**
  _High betweenness centrality (0.335) - this node is a cross-community bridge._
- **What connects `{ GET, POST }`, `Setting (Prisma model)`, `Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast)` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Balance & History Tables` be split into smaller, more focused modules?**
  _Cohesion score 0.06394027913015254 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Balance & History Tables` to `Password Reset UI Kit`, `react`, `Dev Dependencies`, `[id]/page.tsx`, `Runtime Dependencies`, `Root Layout & Providers`, `transactions/[orderId]/page.tsx`, `admin/page.tsx`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Should `2. Komponen` be split into smaller, more focused modules?**
  _Cohesion score 0.05405405405405406 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `react` to `Balance & History Tables`, `Password Reset UI Kit`, `Dev Dependencies`, `[id]/page.tsx`, `Runtime Dependencies`, `Root Layout & Providers`, `transactions/[orderId]/page.tsx`, `admin/page.tsx`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `getProductsWithStats()` and `Missing Error State on Products Page`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._