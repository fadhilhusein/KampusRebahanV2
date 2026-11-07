# Graph Report - KampusRebahanV2  (2026-11-07)

## Corpus Check
- 165 files · ~62,528 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 2, .ico 2, .css 1)

## Summary
- 791 nodes · 2057 edges · 43 communities (39 shown, 4 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 42 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d8789e44`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- next
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
- api/transactions/route.ts
- fulfillOrder.ts
- forgot-password/route.ts
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
- recent-purchases/route.ts
- prisma
- react
- [id]/page.tsx
- reviews/route.ts
- order/[orderId]/page.tsx
- Skeleton
- Order (Prisma model)
- Caption WhatsApp — KampusRebahan
- @radix-ui/react-dropdown-menu
- balance/page.tsx
- GradientBorder.tsx
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
9. `Navbar()` - 26 edges
10. `AdminPage()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `Missing Error State on Products Page` --conceptually_related_to--> `getProductsWithStats()`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md → lib/products.ts
- `User (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/auth/register/route.ts
- `3.5 Pembayaran QRIS → `/order/[orderId]` (status pending)` --references--> `GatewayQr()`  [INFERRED]
  design/SPEC.md → components/payment/GatewayQr.tsx
- `Coupon (Prisma model)` --shares_data_with--> `getLoyaltyState()`  [INFERRED]
  prisma/schema.prisma → lib/loyalty.ts
- `Order (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/admin/confirm/route.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **User Balance Wallet Ledger (top-up, purchase, refund)** — prisma_schema_user, prisma_schema_balancetopup, prisma_schema_balancetransaction, prisma_schema_balancetxntype, lib_credittopup_credittopup, app_api_balance_topup_route_post [INFERRED 0.85]
- **Order Payment & Fulfillment Lifecycle** — prisma_schema_order, prisma_schema_orderstatus, app_api_order_route_post, app_api_admin_confirm_route_post, app_api_admin_reject_route_post, lib_fulfillorder_fulfillorder, lib_orderstatus_statuslabel [INFERRED 0.85]
- **Password Reset Flow** — prisma_schema_passwordresettoken, prisma_schema_user, app_api_auth_forgot_password_route_post, app_api_auth_reset_password_route_post [INFERRED 0.85]

## Communities (43 total, 4 thin omitted)

### Community 0 - "next"
Cohesion: 0.15
Nodes (21): POST(), GET(), GET(), GET(), GET(), GET(), GET(), GET() (+13 more)

### Community 1 - "Balance & History Tables"
Cohesion: 0.09
Nodes (42): DashboardHomePage(), formatDate(), formatPrice(), StatCard(), BalanceHistoryTable(), BalanceTransaction, formatDate(), formatPrice() (+34 more)

### Community 2 - "2. Komponen"
Cohesion: 0.06
Nodes (38): copy(), 1.1 Warna (hanya light; dark mode BELUM didesain), 1.2 Tipografi, 1.3 Radius, 1.4 Bayangan, 1.5 Spacing dan layout, 1.6 Navbar, 1. Design tokens (+30 more)

### Community 3 - "AdminPopupSettings.tsx"
Cohesion: 0.09
Nodes (28): GET(), POST(), GET(), HomePage(), revalidate, AdminPopupSettings(), formatSaved(), CardProps (+20 more)

### Community 4 - "affiliate/page.tsx"
Cohesion: 0.17
Nodes (12): AffiliateData, AffiliatePage(), formatDate(), formatPrice(), METHODS, AdminPayouts(), process(), formatDate() (+4 more)

### Community 5 - "Docs, Audit & Design Notes"
Cohesion: 0.11
Nodes (21): antislop Audit 001 (2026-09-20), WCAG Contrast Failures (text/placeholder/badge), Design Direction Is Web3 Template, Not KampusRebahan Brand, Decorative Emoji Icons, Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast), Glass/Glow Overuse Beyond Dose Limit, middleware.ts Deprecated in Next 16 (use proxy.ts), Missing Error State on Products Page (+13 more)

### Community 6 - "Password Reset UI Kit"
Cohesion: 0.15
Nodes (16): ForgotPasswordPage(), AuthCard(), AuthField(), AuthFieldProps, AuthNotice(), AuthPasswordField(), AuthPasswordFieldProps, AuthShell() (+8 more)

### Community 7 - "types.ts"
Cohesion: 0.11
Nodes (23): POST(), call(), sign(), verifyBridgeWebhookSignature(), AccountDetail, ApiResponse, BalanceResponse, BalanceResult (+15 more)

### Community 8 - "buttonClass"
Cohesion: 0.10
Nodes (33): CheckoutContent(), CheckoutPage(), formatPrice(), PaymentMethod, NotFound(), PaymentCancelContent(), PaymentCancelPage(), StatusIcon() (+25 more)

### Community 9 - "Dev Dependencies"
Cohesion: 0.12
Nodes (22): devDependencies, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20, @types/nodemailer@^8.0.1, @types/qrcode@^1.5.6, @types/react@^19, @types/react-dom@^19 (+14 more)

### Community 10 - "balance/page.tsx"
Cohesion: 0.16
Nodes (13): fetchLoyalty(), formatPrice(), LoyaltyCard(), LoyaltyResult, EASE, item, Props, Toast (+5 more)

### Community 11 - "referral.ts"
Cohesion: 0.16
Nodes (26): GET(), POST(), GET(), POST(), GET(), POST(), GET(), getProductsWithStats() (+18 more)

### Community 12 - "loyalty.ts"
Cohesion: 0.13
Nodes (22): GET(), IN_PROGRESS, GET(), POST(), GET(), findCoupon(), generateCouponCode(), getLoyaltyState() (+14 more)

### Community 13 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, @auth/prisma-adapter@^2.11.2, bcryptjs@^3.0.3, lucide-react@^1.3.0, motion@^12.37.0, next@16.2.6, nodemailer@^7.0.13, pg@^8.20.0 (+14 more)

### Community 14 - "prisma.ts"
Cohesion: 0.14
Nodes (14): GET(), POST(), POST(), paymentBridge, globalForPrisma, creditWallet(), debitWallet(), PAYOUT_METHODS (+6 more)

### Community 15 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 16 - "app/layout.tsx"
Cohesion: 0.11
Nodes (17): inter, interTight, metadata, RootLayout(), authConfig, RefCapture(), NextAuthSessionProvider(), clientSnapshot() (+9 more)

### Community 17 - "api/transactions/route.ts"
Cohesion: 0.47
Nodes (4): GET(), displayStatus(), StatusColor, statusColor

### Community 18 - "fulfillOrder.ts"
Cohesion: 0.20
Nodes (11): CouponUnavailableError, POST(), POST(), warungApi, FulfillOrderResult, LOYALTY_REWARD_VARIANT_ID, creditCommission(), applySupplierStatus() (+3 more)

### Community 19 - "forgot-password/route.ts"
Cohesion: 0.21
Nodes (7): POST(), POST(), POST(), sendResetCodeEmail(), transporter, PasswordResetToken (Prisma model), bcryptjs

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
Cohesion: 0.12
Nodes (22): CredentialVisual(), EditorialLanding(), minPrice(), PayVisual(), PickVisual(), rupiah, steps, Bubble() (+14 more)

### Community 26 - "admin/page.tsx"
Cohesion: 0.11
Nodes (24): AdminOrder, AdminPage(), formatDate(), formatPrice(), OrderActions(), OrderCard, OrderCardProps, OrderDetails() (+16 more)

### Community 27 - "Caption sounding update: November 2026"
Cohesion: 0.40
Nodes (4): Caption sounding update: November 2026, Teaser promo (kirim 1–2 hari kemudian), Versi lengkap, Versi singkat

### Community 30 - "recent-purchases/route.ts"
Cohesion: 0.83
Nodes (3): formatRelativeTime(), GET(), getDisplayName()

### Community 31 - "prisma"
Cohesion: 0.16
Nodes (14): GET(), POST(), bayarGg, QRIS_GATEWAY_MAX_AMOUNT, TOPUP_MIN_AMOUNT, verifyBayarGgWebhookSignature(), creditTopUp(), CreditTopUpResult (+6 more)

### Community 32 - "react"
Cohesion: 0.16
Nodes (14): formatPrice(), TopUp, TopUpPaymentPage(), TransactionsPage(), useDashboardUser(), baseTabs, DashboardHeader(), Tab (+6 more)

### Community 33 - "[id]/page.tsx"
Cohesion: 0.25
Nodes (11): ProductDetailContent(), ProductDetailPage(), Terms(), rupiah, typeIcon(), VariantSelector(), Reveal(), RevealItem() (+3 more)

### Community 34 - "reviews/route.ts"
Cohesion: 0.80
Nodes (4): GET(), getSessionUserId(), mapReview(), POST()

### Community 35 - "order/[orderId]/page.tsx"
Cohesion: 0.21
Nodes (12): CopyButton(), formatDate(), formatPrice(), Order, OrderDetailPage(), OrderSummary(), PaymentInstructions(), statusInfo (+4 more)

### Community 36 - "Skeleton"
Cohesion: 0.23
Nodes (11): Stat(), AdminLoyalty(), filters, formatDate(), formatPrice(), Row, stateInfo, ProductDetailSkeleton() (+3 more)

### Community 37 - "Order (Prisma model)"
Cohesion: 0.24
Nodes (12): Two Admin Mechanisms (isAdmin vs ADMIN_EMAILS), POST(), BalanceTopUp (Prisma model), BalanceTransaction (Prisma model), BalanceTxnType (Prisma enum), Coupon (Prisma model), CouponStatus (Prisma enum), Order (Prisma model) (+4 more)

### Community 38 - "Caption WhatsApp — KampusRebahan"
Cohesion: 0.33
Nodes (5): Caption 1 (lengkap), Caption 2 (singkat, untuk status), Caption 3 (ajakan santai di grup), Caption WhatsApp — KampusRebahan, Jargon pilihan

### Community 39 - "@radix-ui/react-dropdown-menu"
Cohesion: 0.33
Nodes (4): @radix-ui/react-dropdown-menu@^2.1.24, react-dom@19.2.4, @radix-ui/react-dropdown-menu, react-dom

### Community 40 - "balance/page.tsx"
Cohesion: 0.48
Nodes (6): BalancePage(), handleTopup(), formatPrice(), PRESET_AMOUNTS, CountUp(), ButtonPrimary()

## Ambiguous Edges - Review These
- `getProductsWithStats()` → `Missing Error State on Products Page`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md · relation: conceptually_related_to

## Knowledge Gaps
- **14 isolated node(s):** `{ GET, POST }`, `Setting (Prisma model)`, `BalanceTxnType (Prisma enum)`, `CouponStatus (Prisma enum)`, `TopUpStatus (Prisma enum)` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 229 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `Balance & History Tables`, `AdminPopupSettings.tsx`, `Password Reset UI Kit`, `types.ts`, `buttonClass`, `Dev Dependencies`, `balance/page.tsx`, `referral.ts`, `loyalty.ts`, `dependencies`, `prisma.ts`, `app/layout.tsx`, `api/transactions/route.ts`, `fulfillOrder.ts`, `forgot-password/route.ts`, `transactions/[orderId]/page.tsx`, `Route Protection Middleware`, `EditorialLanding.tsx`, `admin/page.tsx`, `recent-purchases/route.ts`, `prisma`, `react`, `[id]/page.tsx`, `reviews/route.ts`, `order/[orderId]/page.tsx`, `balance/page.tsx`?**
  _High betweenness centrality (0.341) - this node is a cross-community bridge._
- **What connects `{ GET, POST }`, `Setting (Prisma model)`, `BalanceTxnType (Prisma enum)` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.146218487394958 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `Balance & History Tables`, `[id]/page.tsx`, `order/[orderId]/page.tsx`, `affiliate/page.tsx`, `Skeleton`, `Password Reset UI Kit`, `AdminPopupSettings.tsx`, `buttonClass`, `balance/page.tsx`, `balance/page.tsx`, `GradientBorder.tsx`, `Dev Dependencies`, `dependencies`, `app/layout.tsx`, `transactions/[orderId]/page.tsx`, `EditorialLanding.tsx`, `admin/page.tsx`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Should `Balance & History Tables` be split into smaller, more focused modules?**
  _Cohesion score 0.09023569023569024 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `react` to `Balance & History Tables`, `[id]/page.tsx`, `order/[orderId]/page.tsx`, `affiliate/page.tsx`, `AdminPopupSettings.tsx`, `Password Reset UI Kit`, `buttonClass`, `balance/page.tsx`, `balance/page.tsx`, `Dev Dependencies`, `dependencies`, `app/layout.tsx`, `transactions/[orderId]/page.tsx`, `EditorialLanding.tsx`, `admin/page.tsx`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `getProductsWithStats()` and `Missing Error State on Products Page`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._