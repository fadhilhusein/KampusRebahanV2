# Graph Report - KampusRebahanV2  (2026-11-07)

## Corpus Check
- 154 files · ~58,099 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 2, .ico 2, .css 1)

## Summary
- 742 nodes · 1912 edges · 38 communities (33 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 42 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fade569d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- prisma.ts
- Balance & History Tables
- 2. Komponen
- AdminPopupSettings.tsx
- order/[orderId]/page.tsx
- Docs, Audit & Design Notes
- Password Reset UI Kit
- types.ts
- lucide-react
- Dev Dependencies
- Reveal.tsx
- referral.ts
- loyalty.ts
- Runtime Dependencies
- next
- TypeScript Config
- app/layout.tsx
- balance/page.tsx
- dashboard/page.tsx
- forgot-password/route.ts
- ESLint Config
- transactions/[orderId]/page.tsx
- Route Protection Middleware
- Prisma Config
- NPM Scripts
- fulfillOrder
- admin/page.tsx
- [topupId]/page.tsx
- PostCSS Config
- NextAuth Handlers
- prisma
- DashboardFrame.tsx
- @types/bcryptjs@^2.4.6
- affiliate/page.tsx
- reviews/route.ts
- @prisma/adapter-pg
- next
- qrcode

## God Nodes (most connected - your core abstractions)
1. `next` - 64 edges
2. `react` - 48 edges
3. `lucide-react` - 39 edges
4. `buttonClass()` - 35 edges
5. `auth` - 34 edges
6. `prisma` - 34 edges
7. `Skeleton()` - 30 edges
8. `requireAdmin()` - 27 edges
9. `Navbar()` - 26 edges
10. `cn()` - 19 edges

## Surprising Connections (you probably didn't know these)
- `Missing Error State on Products Page` --conceptually_related_to--> `getProductsWithStats()`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md → lib/products.ts
- `3.5 Pembayaran QRIS → `/order/[orderId]` (status pending)` --references--> `GatewayQr()`  [INFERRED]
  design/SPEC.md → components/payment/GatewayQr.tsx
- `3.11 Legal` --references--> `LegalArticle()`  [INFERRED]
  design/SPEC.md → components/layout/LegalArticle.tsx
- `User (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/auth/register/route.ts
- `Setting (Prisma model)` --shares_data_with--> `getMarkupPercent()`  [INFERRED]
  prisma/schema.prisma → lib/settings.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **User Balance Wallet Ledger (top-up, purchase, refund)** — prisma_schema_user, prisma_schema_balancetopup, prisma_schema_balancetransaction, prisma_schema_balancetxntype, lib_credittopup_credittopup, app_api_balance_topup_route_post [INFERRED 0.85]
- **Order Payment & Fulfillment Lifecycle** — prisma_schema_order, prisma_schema_orderstatus, app_api_order_route_post, app_api_admin_confirm_route_post, app_api_admin_reject_route_post, lib_fulfillorder_fulfillorder, lib_orderstatus_statuslabel [INFERRED 0.85]
- **Password Reset Flow** — prisma_schema_passwordresettoken, prisma_schema_user, app_api_auth_forgot_password_route_post, app_api_auth_reset_password_route_post [INFERRED 0.85]

## Communities (38 total, 5 thin omitted)

### Community 0 - "prisma.ts"
Cohesion: 0.16
Nodes (12): GET(), GET(), GET(), GET(), PATCH(), GET(), auth, authConfig (+4 more)

### Community 1 - "Balance & History Tables"
Cohesion: 0.08
Nodes (42): TransactionsPage(), BalanceHistoryTable(), BalanceTransaction, formatDate(), formatPrice(), typeInfo, DataTable(), DataTableProps (+34 more)

### Community 2 - "2. Komponen"
Cohesion: 0.05
Nodes (38): copy(), 1.1 Warna (hanya light; dark mode BELUM didesain), 1.2 Tipografi, 1.3 Radius, 1.4 Bayangan, 1.5 Spacing dan layout, 1.6 Navbar, 1. Design tokens (+30 more)

### Community 3 - "AdminPopupSettings.tsx"
Cohesion: 0.10
Nodes (27): GET(), POST(), GET(), HomePage(), revalidate, AdminPopupSettings(), formatSaved(), CardProps (+19 more)

### Community 4 - "order/[orderId]/page.tsx"
Cohesion: 0.29
Nodes (9): CopyButton(), formatDate(), formatPrice(), Order, OrderDetailPage(), OrderSummary(), PaymentInstructions(), statusInfo (+1 more)

### Community 5 - "Docs, Audit & Design Notes"
Cohesion: 0.10
Nodes (22): antislop Audit 001 (2026-09-20), WCAG Contrast Failures (text/placeholder/badge), Design Direction Is Web3 Template, Not KampusRebahan Brand, Two Admin Mechanisms (isAdmin vs ADMIN_EMAILS), Decorative Emoji Icons, Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast), Glass/Glow Overuse Beyond Dose Limit, middleware.ts Deprecated in Next 16 (use proxy.ts) (+14 more)

### Community 6 - "Password Reset UI Kit"
Cohesion: 0.15
Nodes (16): ForgotPasswordPage(), AuthCard(), AuthField(), AuthFieldProps, AuthNotice(), AuthPasswordField(), AuthPasswordFieldProps, AuthShell() (+8 more)

### Community 7 - "types.ts"
Cohesion: 0.09
Nodes (25): POST(), warungApi, bayarGg, QRIS_GATEWAY_MAX_AMOUNT, TOPUP_MIN_AMOUNT, FulfillOrderResult, AccountDetail, ApiResponse (+17 more)

### Community 8 - "lucide-react"
Cohesion: 0.05
Nodes (65): CheckoutContent(), CheckoutPage(), formatPrice(), PaymentMethod, NotFound(), PaymentCancelContent(), PaymentCancelPage(), StatusIcon() (+57 more)

### Community 9 - "Dev Dependencies"
Cohesion: 0.12
Nodes (22): devDependencies, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20, @types/nodemailer@^8.0.1, @types/qrcode@^1.5.6, @types/react@^19, @types/react-dom@^19 (+14 more)

### Community 10 - "Reveal.tsx"
Cohesion: 0.16
Nodes (12): fetchLoyalty(), formatPrice(), LoyaltyCard(), LoyaltyResult, EASE, item, Props, Toast (+4 more)

### Community 11 - "referral.ts"
Cohesion: 0.07
Nodes (52): POST(), REFUND_ELIGIBLE_STATUSES, GET(), POST(), POST(), POST(), GET(), POST() (+44 more)

### Community 12 - "loyalty.ts"
Cohesion: 0.19
Nodes (13): CouponUnavailableError, POST(), GET(), findCoupon(), generateCouponCode(), getLoyaltyState(), isUniqueViolation(), LOYALTY_REWARD (+5 more)

### Community 13 - "Runtime Dependencies"
Cohesion: 0.10
Nodes (20): dependencies, @auth/prisma-adapter@^2.11.2, bcryptjs@^3.0.3, lucide-react@^1.3.0, motion@^12.37.0, next@16.2.6, pg@^8.20.0, @prisma/client@^7.8.0 (+12 more)

### Community 14 - "next"
Cohesion: 0.28
Nodes (9): POST(), GET(), GET(), POST(), GET(), GET(), AdminLayout(), requireAdmin() (+1 more)

### Community 15 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 16 - "app/layout.tsx"
Cohesion: 0.13
Nodes (16): inter, interTight, metadata, RootLayout(), RefCapture(), NextAuthSessionProvider(), clientSnapshot(), serverSnapshot() (+8 more)

### Community 17 - "balance/page.tsx"
Cohesion: 0.33
Nodes (9): Stat(), BalancePage(), handleTopup(), formatPrice(), PRESET_AMOUNTS, CountUp(), Reveal(), RevealItem() (+1 more)

### Community 18 - "dashboard/page.tsx"
Cohesion: 0.21
Nodes (11): DashboardHomePage(), formatDate(), formatPrice(), StatCard(), useDashboardUser(), baseTabs, DashboardHeader(), Tab (+3 more)

### Community 19 - "forgot-password/route.ts"
Cohesion: 0.28
Nodes (7): POST(), POST(), sendResetCodeEmail(), transporter, nodemailer@^7.0.13, PasswordResetToken (Prisma model), nodemailer

### Community 20 - "ESLint Config"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.2.6, eslint, eslint-config-next

### Community 21 - "transactions/[orderId]/page.tsx"
Cohesion: 0.16
Nodes (17): AccountDetailsPanel(), AccountGroup, Credential, CredentialRow(), formatDate(), formatPrice(), isPasswordField(), parseAccountDetails() (+9 more)

### Community 22 - "Route Protection Middleware"
Cohesion: 0.40
Nodes (3): config, PROTECTED, SESSION_COOKIES

### Community 23 - "Prisma Config"
Cohesion: 0.40
Nodes (4): dotenv@^17.4.2, prisma@^7.8.0, dotenv, prisma

### Community 24 - "NPM Scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 25 - "fulfillOrder"
Cohesion: 0.24
Nodes (9): POST(), call(), paymentBridge, sign(), verifyBridgeWebhookSignature(), BridgeCreatePaymentPayload, BridgePaymentData, BridgeResponse (+1 more)

### Community 26 - "admin/page.tsx"
Cohesion: 0.14
Nodes (20): AdminOrder, AdminPage(), formatDate(), formatPrice(), OrderActions(), OrderCard, OrderCardProps, OrderDetails() (+12 more)

### Community 27 - "[topupId]/page.tsx"
Cohesion: 0.27
Nodes (7): formatPrice(), TopUp, TopUpPaymentPage(), Countdown(), GatewayQr(), GradientBorderProps, react

### Community 30 - "prisma"
Cohesion: 0.36
Nodes (7): GET(), POST(), verifyBayarGgWebhookSignature(), creditTopUp(), CreditTopUpResult, prisma, BayarGgWebhookPayload

### Community 31 - "DashboardFrame.tsx"
Cohesion: 0.38
Nodes (5): DashboardLayout(), metadata, DashboardFrame(), DashboardUserContext, SidebarUser

### Community 33 - "affiliate/page.tsx"
Cohesion: 0.16
Nodes (16): AffiliateData, AffiliatePage(), formatDate(), formatPrice(), METHODS, AdminPayouts(), process(), formatDate() (+8 more)

### Community 34 - "reviews/route.ts"
Cohesion: 0.80
Nodes (4): GET(), getSessionUserId(), mapReview(), POST()

### Community 36 - "next"
Cohesion: 0.19
Nodes (7): formatRelativeTime(), GET(), getDisplayName(), WebhookPayload, nextConfig, bcryptjs, next

## Ambiguous Edges - Review These
- `getProductsWithStats()` → `Missing Error State on Products Page`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md · relation: conceptually_related_to

## Knowledge Gaps
- **14 isolated node(s):** `{ GET, POST }`, `BalanceTxnType (Prisma enum)`, `CouponStatus (Prisma enum)`, `Setting (Prisma model)`, `TopUpStatus (Prisma enum)` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 214 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `prisma.ts`, `Balance & History Tables`, `AdminPopupSettings.tsx`, `order/[orderId]/page.tsx`, `Password Reset UI Kit`, `types.ts`, `lucide-react`, `Dev Dependencies`, `Reveal.tsx`, `referral.ts`, `loyalty.ts`, `Runtime Dependencies`, `next`, `app/layout.tsx`, `balance/page.tsx`, `dashboard/page.tsx`, `forgot-password/route.ts`, `transactions/[orderId]/page.tsx`, `Route Protection Middleware`, `fulfillOrder`, `admin/page.tsx`, `[topupId]/page.tsx`, `prisma`, `DashboardFrame.tsx`, `reviews/route.ts`?**
  _High betweenness centrality (0.353) - this node is a cross-community bridge._
- **What connects `{ GET, POST }`, `BalanceTxnType (Prisma enum)`, `CouponStatus (Prisma enum)` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Balance & History Tables` be split into smaller, more focused modules?**
  _Cohesion score 0.08350168350168351 - nodes in this community are weakly interconnected._
- **Why does `react` connect `[topupId]/page.tsx` to `affiliate/page.tsx`, `Balance & History Tables`, `AdminPopupSettings.tsx`, `order/[orderId]/page.tsx`, `Password Reset UI Kit`, `lucide-react`, `Dev Dependencies`, `Reveal.tsx`, `Runtime Dependencies`, `app/layout.tsx`, `balance/page.tsx`, `dashboard/page.tsx`, `transactions/[orderId]/page.tsx`, `admin/page.tsx`, `DashboardFrame.tsx`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Should `2. Komponen` be split into smaller, more focused modules?**
  _Cohesion score 0.05398110661268556 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `affiliate/page.tsx`, `Balance & History Tables`, `AdminPopupSettings.tsx`, `order/[orderId]/page.tsx`, `Password Reset UI Kit`, `Dev Dependencies`, `Reveal.tsx`, `Runtime Dependencies`, `app/layout.tsx`, `balance/page.tsx`, `dashboard/page.tsx`, `transactions/[orderId]/page.tsx`, `admin/page.tsx`, `[topupId]/page.tsx`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `getProductsWithStats()` and `Missing Error State on Products Page`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._