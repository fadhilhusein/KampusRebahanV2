# Graph Report - KampusRebahanV2  (2026-11-07)

## Corpus Check
- 135 files · ~50,192 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 2, .ico 2, .css 1)

## Summary
- 648 nodes · 1644 edges · 39 communities (34 shown, 5 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 42 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cafc121e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- prisma.ts
- Balance & History Tables
- 2. Komponen
- types.ts
- order/[orderId]/page.tsx
- Docs, Audit & Design Notes
- Password Reset UI Kit
- prisma
- react
- Dev Dependencies
- [topupId]/page.tsx
- settings/route.ts
- loyalty.ts
- Runtime Dependencies
- next
- TypeScript Config
- app/layout.tsx
- Skeleton
- lucide-react
- Order (Prisma model)
- ESLint Config
- transactions/[orderId]/page.tsx
- Route Protection Middleware
- Prisma Config
- NPM Scripts
- fulfillOrder
- admin/page.tsx
- balance/page.tsx
- PostCSS Config
- NextAuth Handlers
- pg
- auth.ts
- @types/bcryptjs@^2.4.6
- react
- reviews/route.ts
- ThemeToggle.tsx
- recent-purchases/route.ts
- next-themes
- nodemailer

## God Nodes (most connected - your core abstractions)
1. `next` - 57 edges
2. `react` - 43 edges
3. `lucide-react` - 36 edges
4. `auth` - 32 edges
5. `Navbar()` - 29 edges
6. `buttonClass()` - 28 edges
7. `prisma` - 28 edges
8. `Skeleton()` - 24 edges
9. `Footer()` - 22 edges
10. `requireAdmin()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Missing Error State on Products Page` --conceptually_related_to--> `getProductsWithStats()`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md → lib/products.ts
- `3.11 Legal` --references--> `LegalArticle()`  [INFERRED]
  design/SPEC.md → components/layout/LegalArticle.tsx
- `User (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/auth/register/route.ts
- `3.1 Landing → `/` (`app/page.tsx`)` --references--> `copy()`  [INFERRED]
  design/SPEC.md → app/order/[orderId]/page.tsx
- `3.5 Pembayaran QRIS → `/order/[orderId]` (status pending)` --references--> `GatewayQr()`  [INFERRED]
  design/SPEC.md → components/payment/GatewayQr.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **User Balance Wallet Ledger (top-up, purchase, refund)** — prisma_schema_user, prisma_schema_balancetopup, prisma_schema_balancetransaction, prisma_schema_balancetxntype, lib_credittopup_credittopup, app_api_balance_topup_route_post [INFERRED 0.85]
- **Order Payment & Fulfillment Lifecycle** — prisma_schema_order, prisma_schema_orderstatus, app_api_order_route_post, app_api_admin_confirm_route_post, app_api_admin_reject_route_post, lib_fulfillorder_fulfillorder, lib_orderstatus_statuslabel [INFERRED 0.85]
- **Password Reset Flow** — prisma_schema_passwordresettoken, prisma_schema_user, app_api_auth_forgot_password_route_post, app_api_auth_reset_password_route_post [INFERRED 0.85]

## Communities (39 total, 5 thin omitted)

### Community 0 - "prisma.ts"
Cohesion: 0.15
Nodes (8): POST(), POST(), POST(), sendResetCodeEmail(), transporter, globalForPrisma, PasswordResetToken (Prisma model), bcryptjs

### Community 1 - "Balance & History Tables"
Cohesion: 0.09
Nodes (44): DashboardHomePage(), formatDate(), formatPrice(), TransactionsPage(), BalanceHistoryTable(), BalanceTransaction, formatDate(), formatPrice() (+36 more)

### Community 2 - "2. Komponen"
Cohesion: 0.08
Nodes (23): 1.1 Warna (hanya light; dark mode BELUM didesain), 1.2 Tipografi, 1.3 Radius, 1.4 Bayangan, 1.5 Spacing dan layout, 1.6 Navbar, 1. Design tokens, 2. Komponen (+15 more)

### Community 3 - "types.ts"
Cohesion: 0.06
Nodes (47): GET(), HomePage(), revalidate, CredentialVisual(), EditorialLanding(), minPrice(), PayVisual(), PickVisual() (+39 more)

### Community 4 - "order/[orderId]/page.tsx"
Cohesion: 0.09
Nodes (27): CopyButton(), copy(), formatDate(), formatPrice(), Order, OrderDetailPage(), OrderSummary(), PaymentInstructions() (+19 more)

### Community 5 - "Docs, Audit & Design Notes"
Cohesion: 0.10
Nodes (22): antislop Audit 001 (2026-09-20), WCAG Contrast Failures (text/placeholder/badge), Design Direction Is Web3 Template, Not KampusRebahan Brand, Two Admin Mechanisms (isAdmin vs ADMIN_EMAILS), Decorative Emoji Icons, Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast), Glass/Glow Overuse Beyond Dose Limit, middleware.ts Deprecated in Next 16 (use proxy.ts) (+14 more)

### Community 6 - "Password Reset UI Kit"
Cohesion: 0.15
Nodes (16): ForgotPasswordPage(), AuthCard(), AuthField(), AuthFieldProps, AuthNotice(), AuthPasswordField(), AuthPasswordFieldProps, AuthShell() (+8 more)

### Community 7 - "prisma"
Cohesion: 0.18
Nodes (13): GET(), POST(), bayarGg, QRIS_GATEWAY_MAX_AMOUNT, TOPUP_MIN_AMOUNT, verifyBayarGgWebhookSignature(), creditTopUp(), CreditTopUpResult (+5 more)

### Community 8 - "react"
Cohesion: 0.10
Nodes (31): CheckoutContent(), CheckoutPage(), formatPrice(), PaymentMethod, NotFound(), PaymentCancelContent(), PaymentCancelPage(), StatusIcon() (+23 more)

### Community 9 - "Dev Dependencies"
Cohesion: 0.12
Nodes (22): devDependencies, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20, @types/nodemailer@^8.0.1, @types/qrcode@^1.5.6, @types/react@^19, @types/react-dom@^19 (+14 more)

### Community 10 - "[topupId]/page.tsx"
Cohesion: 0.17
Nodes (15): formatPrice(), TopUp, TopUpPaymentPage(), Countdown(), EASE, item, Props, Reveal() (+7 more)

### Community 11 - "settings/route.ts"
Cohesion: 0.33
Nodes (13): GET(), POST(), POST(), GET(), getMarkupPercent(), isBankTransferEnabled(), isQrisBridgeEnabled(), isQrisGatewayEnabled() (+5 more)

### Community 12 - "loyalty.ts"
Cohesion: 0.19
Nodes (13): CouponUnavailableError, POST(), GET(), findCoupon(), generateCouponCode(), getLoyaltyState(), isUniqueViolation(), LOYALTY_REWARD (+5 more)

### Community 13 - "Runtime Dependencies"
Cohesion: 0.09
Nodes (22): dependencies, @auth/prisma-adapter@^2.11.2, bcryptjs@^3.0.3, lucide-react@^1.3.0, motion@^12.37.0, next@16.2.6, next-auth@^5.0.0-beta.31, @prisma/client@^7.8.0 (+14 more)

### Community 14 - "next"
Cohesion: 0.16
Nodes (17): GET(), REFUND_ELIGIBLE_STATUSES, GET(), GET(), GET(), GET(), GET(), GET() (+9 more)

### Community 15 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 16 - "app/layout.tsx"
Cohesion: 0.25
Nodes (7): inter, interTight, metadata, RootLayout(), NextAuthSessionProvider(), ToastProvider(), WhatsAppButton()

### Community 17 - "Skeleton"
Cohesion: 0.20
Nodes (10): StatCard(), fetchLoyalty(), formatPrice(), LoyaltyCard(), LoyaltyResult, ButtonPrimary(), ProductDetailSkeleton(), Skeleton() (+2 more)

### Community 18 - "lucide-react"
Cohesion: 0.24
Nodes (11): ProductDetailContent(), ProductDetailPage(), Terms(), rupiah, typeIcon(), VariantSelector(), RatingStars(), Kartu varian (`VariantSelector`, komponen .pen "VariantCard") (+3 more)

### Community 19 - "Order (Prisma model)"
Cohesion: 0.23
Nodes (13): POST(), POST(), BalanceTopUp (Prisma model), BalanceTransaction (Prisma model), BalanceTxnType (Prisma enum), Coupon (Prisma model), CouponStatus (Prisma enum), Order (Prisma model) (+5 more)

### Community 20 - "ESLint Config"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.2.6, eslint, eslint-config-next

### Community 21 - "transactions/[orderId]/page.tsx"
Cohesion: 0.18
Nodes (16): AccountDetailsPanel(), AccountGroup, Credential, CredentialRow(), formatDate(), formatPrice(), isPasswordField(), parseAccountDetails() (+8 more)

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
Cohesion: 0.29
Nodes (8): POST(), POST(), fulfillOrder(), FulfillOrderResult, call(), paymentBridge, sign(), verifyBridgeWebhookSignature()

### Community 26 - "admin/page.tsx"
Cohesion: 0.14
Nodes (20): AdminOrder, AdminPage(), formatDate(), formatPrice(), OrderActions(), OrderCard, OrderCardProps, OrderDetails() (+12 more)

### Community 27 - "balance/page.tsx"
Cohesion: 0.27
Nodes (10): BalancePage(), handleTopup(), formatPrice(), PRESET_AMOUNTS, CountUp(), useDashboardUser(), baseTabs, DashboardHeader() (+2 more)

### Community 30 - "pg"
Cohesion: 0.33
Nodes (4): pg@^8.20.0, @prisma/adapter-pg@^7.8.0, pg, @prisma/adapter-pg

### Community 31 - "auth.ts"
Cohesion: 0.24
Nodes (6): GET(), authConfig, handlers, signIn, signOut, warungApi

### Community 33 - "react"
Cohesion: 0.20
Nodes (4): logos, GradientBorderProps, iconMap, react

### Community 34 - "reviews/route.ts"
Cohesion: 0.80
Nodes (4): GET(), getSessionUserId(), mapReview(), POST()

### Community 35 - "ThemeToggle.tsx"
Cohesion: 0.70
Nodes (4): clientSnapshot(), serverSnapshot(), subscribe(), ThemeToggle()

### Community 36 - "recent-purchases/route.ts"
Cohesion: 0.83
Nodes (3): formatRelativeTime(), GET(), getDisplayName()

## Ambiguous Edges - Review These
- `getProductsWithStats()` → `Missing Error State on Products Page`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md · relation: conceptually_related_to

## Knowledge Gaps
- **14 isolated node(s):** `{ GET, POST }`, `BalanceTxnType (Prisma enum)`, `CouponStatus (Prisma enum)`, `TopUpStatus (Prisma enum)`, `Setting (Prisma model)` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 197 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `prisma.ts`, `Balance & History Tables`, `types.ts`, `order/[orderId]/page.tsx`, `Password Reset UI Kit`, `prisma`, `react`, `Dev Dependencies`, `[topupId]/page.tsx`, `settings/route.ts`, `loyalty.ts`, `Runtime Dependencies`, `app/layout.tsx`, `Skeleton`, `lucide-react`, `transactions/[orderId]/page.tsx`, `Route Protection Middleware`, `fulfillOrder`, `admin/page.tsx`, `balance/page.tsx`, `auth.ts`, `reviews/route.ts`, `recent-purchases/route.ts`?**
  _High betweenness centrality (0.329) - this node is a cross-community bridge._
- **What connects `{ GET, POST }`, `BalanceTxnType (Prisma enum)`, `CouponStatus (Prisma enum)` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Balance & History Tables` be split into smaller, more focused modules?**
  _Cohesion score 0.08649912331969609 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `Balance & History Tables`, `types.ts`, `order/[orderId]/page.tsx`, `ThemeToggle.tsx`, `Password Reset UI Kit`, `react`, `Dev Dependencies`, `[topupId]/page.tsx`, `Runtime Dependencies`, `Skeleton`, `lucide-react`, `transactions/[orderId]/page.tsx`, `admin/page.tsx`, `balance/page.tsx`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Should `2. Komponen` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `Balance & History Tables`, `react`, `types.ts`, `order/[orderId]/page.tsx`, `ThemeToggle.tsx`, `Password Reset UI Kit`, `react`, `Dev Dependencies`, `[topupId]/page.tsx`, `Runtime Dependencies`, `app/layout.tsx`, `Skeleton`, `transactions/[orderId]/page.tsx`, `admin/page.tsx`, `balance/page.tsx`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `getProductsWithStats()` and `Missing Error State on Products Page`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._