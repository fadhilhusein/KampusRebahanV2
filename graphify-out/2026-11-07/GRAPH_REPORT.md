# Graph Report - KampusRebahanV2  (2026-11-07)

## Corpus Check
- 168 files · ~64,263 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 2, .ico 2, .css 1)

## Summary
- 810 nodes · 2137 edges · 42 communities (40 shown, 2 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 42 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `257b7872`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [id]/page.tsx
- Balance & History Tables
- 2. Komponen
- AdminPopupSettings.tsx
- affiliate/page.tsx
- Docs, Audit & Design Notes
- Password Reset UI Kit
- types.ts
- Navbar
- Dev Dependencies
- next
- referral.ts
- loyalty.ts
- dependencies
- ButtonPrimary.tsx
- TypeScript Config
- app/layout.tsx
- prisma.ts
- reject/route.ts
- referral.ts
- Skeleton
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
- auth
- react
- order/[orderId]/page.tsx
- prisma
- mailer.ts
- Skeleton
- eslint.config.mjs
- Caption WhatsApp — KampusRebahan
- redeem/route.ts
- recent-purchases/route.ts
- next-auth

## God Nodes (most connected - your core abstractions)
1. `next` - 66 edges
2. `react` - 50 edges
3. `lucide-react` - 40 edges
4. `prisma` - 38 edges
5. `buttonClass()` - 37 edges
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
- `Order (Prisma model)` --shares_data_with--> `fulfillOrder()`  [INFERRED]
  prisma/schema.prisma → lib/fulfillOrder.ts
- `BalanceTransaction (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/order/route.ts
- `Order (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/order/route.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **User Balance Wallet Ledger (top-up, purchase, refund)** — prisma_schema_user, prisma_schema_balancetopup, prisma_schema_balancetransaction, prisma_schema_balancetxntype, lib_credittopup_credittopup, app_api_balance_topup_route_post [INFERRED 0.85]
- **Order Payment & Fulfillment Lifecycle** — prisma_schema_order, prisma_schema_orderstatus, app_api_order_route_post, app_api_admin_confirm_route_post, app_api_admin_reject_route_post, lib_fulfillorder_fulfillorder, lib_orderstatus_statuslabel [INFERRED 0.85]
- **Password Reset Flow** — prisma_schema_passwordresettoken, prisma_schema_user, app_api_auth_forgot_password_route_post, app_api_auth_reset_password_route_post [INFERRED 0.85]

## Communities (42 total, 2 thin omitted)

### Community 0 - "[id]/page.tsx"
Cohesion: 0.36
Nodes (7): ProductDetailContent(), ProductDetailPage(), Terms(), Badge(), BadgeProps, colors, ProductDetailSkeleton()

### Community 1 - "Balance & History Tables"
Cohesion: 0.07
Nodes (55): BalancePage(), handleTopup(), formatPrice(), PRESET_AMOUNTS, DashboardHomePage(), formatDate(), formatPrice(), StatCard() (+47 more)

### Community 2 - "2. Komponen"
Cohesion: 0.05
Nodes (43): copy(), rupiah, typeIcon(), VariantSelector(), 1.1 Warna (hanya light; dark mode BELUM didesain), 1.2 Tipografi, 1.3 Radius, 1.4 Bayangan (+35 more)

### Community 3 - "AdminPopupSettings.tsx"
Cohesion: 0.09
Nodes (29): GET(), POST(), GET(), HomePage(), revalidate, AdminPopupSettings(), formatSaved(), CardProps (+21 more)

### Community 4 - "affiliate/page.tsx"
Cohesion: 0.17
Nodes (12): AffiliateData, AffiliatePage(), formatDate(), formatPrice(), METHODS, AdminPayouts(), process(), formatDate() (+4 more)

### Community 5 - "Docs, Audit & Design Notes"
Cohesion: 0.10
Nodes (22): antislop Audit 001 (2026-09-20), WCAG Contrast Failures (text/placeholder/badge), Design Direction Is Web3 Template, Not KampusRebahan Brand, Two Admin Mechanisms (isAdmin vs ADMIN_EMAILS), Decorative Emoji Icons, Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast), Glass/Glow Overuse Beyond Dose Limit, middleware.ts Deprecated in Next 16 (use proxy.ts) (+14 more)

### Community 6 - "Password Reset UI Kit"
Cohesion: 0.15
Nodes (16): ForgotPasswordPage(), AuthCard(), AuthField(), AuthFieldProps, AuthNotice(), AuthPasswordField(), AuthPasswordFieldProps, AuthShell() (+8 more)

### Community 7 - "types.ts"
Cohesion: 0.07
Nodes (31): POST(), POST(), HIDDEN_PRODUCT_IDS, TOPUP_MIN_AMOUNT, call(), sign(), verifyBridgeWebhookSignature(), AccountDetail (+23 more)

### Community 8 - "Navbar"
Cohesion: 0.13
Nodes (22): DashboardLayout(), metadata, NotFound(), PaymentCancelContent(), PaymentCancelPage(), StatusIcon(), CheckState, PaymentSuccessContent() (+14 more)

### Community 9 - "Dev Dependencies"
Cohesion: 0.12
Nodes (22): devDependencies, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20, @types/nodemailer@^8.0.1, @types/qrcode@^1.5.6, @types/react@^19, @types/react-dom@^19 (+14 more)

### Community 10 - "next"
Cohesion: 0.19
Nodes (20): POST(), POST(), POST(), POST(), POST(), POST(), GET(), getSessionUserId() (+12 more)

### Community 11 - "referral.ts"
Cohesion: 0.18
Nodes (23): GET(), POST(), POST(), GET(), GET(), GET(), getProductsWithStats(), resolveReferrer() (+15 more)

### Community 12 - "loyalty.ts"
Cohesion: 0.16
Nodes (17): GET(), IN_PROGRESS, GET(), findCoupon(), generateCouponCode(), getLoyaltyState(), isUniqueViolation(), LOYALTY_REWARD (+9 more)

### Community 13 - "dependencies"
Cohesion: 0.08
Nodes (26): dependencies, @auth/prisma-adapter@^2.11.2, bcryptjs@^3.0.3, lucide-react@^1.3.0, next@16.2.6, pg@^8.20.0, @prisma/adapter-pg@^7.8.0, @prisma/client@^7.8.0 (+18 more)

### Community 14 - "ButtonPrimary.tsx"
Cohesion: 0.25
Nodes (8): ProductsCatalog(), ProductsContent(), ProductsPage(), ButtonPrimary(), ButtonPrimaryProps, Size, Variant, variants

### Community 15 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 16 - "app/layout.tsx"
Cohesion: 0.18
Nodes (10): inter, interTight, metadata, RootLayout(), RefCapture(), NextAuthSessionProvider(), ToastProvider(), WhatsAppButton() (+2 more)

### Community 17 - "prisma.ts"
Cohesion: 0.17
Nodes (11): GET(), GET(), warungApi, FulfillOrderResult, processClaimedOrder(), globalForPrisma, creditCommission(), applySupplierStatus() (+3 more)

### Community 18 - "reject/route.ts"
Cohesion: 0.18
Nodes (16): GET(), POST(), settleLoyaltyOnReject(), creditWallet(), reverseCommission(), previewRefund(), BalanceTopUp (Prisma model), BalanceTransaction (Prisma model) (+8 more)

### Community 19 - "referral.ts"
Cohesion: 0.20
Nodes (13): POST(), QRIS_GATEWAY_MAX_AMOUNT, paymentBridge, debitWallet(), generateReferralCode(), getSessionUserId(), isUniqueViolation(), PAYOUT_METHODS (+5 more)

### Community 20 - "Skeleton"
Cohesion: 0.21
Nodes (11): AdminLoyalty(), filters, formatDate(), formatPrice(), Row, stateInfo, formatPrice(), RefundDialog() (+3 more)

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
Cohesion: 0.09
Nodes (30): CredentialVisual(), EditorialLanding(), minPrice(), PayVisual(), PickVisual(), rupiah, steps, Bubble() (+22 more)

### Community 26 - "admin/page.tsx"
Cohesion: 0.13
Nodes (22): AdminOrder, AdminPage(), formatDate(), formatPrice(), OrderActions(), OrderCard, OrderCardProps, OrderDetails() (+14 more)

### Community 27 - "Caption sounding update: November 2026"
Cohesion: 0.40
Nodes (4): Caption sounding update: November 2026, Teaser promo (kirim 1–2 hari kemudian), Versi lengkap, Versi singkat

### Community 30 - "Caption promo: Beli Claude Pro, gratis Gemini AI Pro"
Cohesion: 0.40
Nodes (4): Caption promo: Beli Claude Pro, gratis Gemini AI Pro, Versi feed (lengkap), Versi santai, Versi story (singkat)

### Community 31 - "auth"
Cohesion: 0.15
Nodes (18): POST(), GET(), POST(), GET(), GET(), GET(), GET(), GET() (+10 more)

### Community 32 - "react"
Cohesion: 0.20
Nodes (12): formatPrice(), TopUp, TopUpPaymentPage(), Countdown(), GatewayQr(), GradientBorderProps, item, Props (+4 more)

### Community 33 - "order/[orderId]/page.tsx"
Cohesion: 0.27
Nodes (10): CopyButton(), formatDate(), formatPrice(), Order, OrderDetailPage(), OrderSummary(), PaymentInstructions(), statusInfo (+2 more)

### Community 34 - "prisma"
Cohesion: 0.31
Nodes (8): GET(), POST(), bayarGg, verifyBayarGgWebhookSignature(), creditTopUp(), CreditTopUpResult, prisma, BayarGgWebhookPayload

### Community 35 - "mailer.ts"
Cohesion: 0.32
Nodes (7): adminNotifyEmail(), escapeHtml(), PaidOrderInfo, sendPaidOrderEmail(), transporter, nodemailer@^7.0.13, nodemailer

### Community 36 - "Skeleton"
Cohesion: 0.13
Nodes (15): CheckoutContent(), CheckoutPage(), formatPrice(), PaymentMethod, fetchLoyalty(), formatPrice(), LoyaltyCard(), LoyaltyResult (+7 more)

### Community 37 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.2.6, eslint, eslint-config-next

### Community 38 - "Caption WhatsApp — KampusRebahan"
Cohesion: 0.33
Nodes (5): Caption 1 (lengkap), Caption 2 (singkat, untuk status), Caption 3 (ajakan santai di grup), Caption WhatsApp — KampusRebahan, Jargon pilihan

### Community 39 - "redeem/route.ts"
Cohesion: 0.67
Nodes (3): CouponUnavailableError, POST(), LOYALTY_REWARD_VARIANT_ID

### Community 40 - "recent-purchases/route.ts"
Cohesion: 0.83
Nodes (3): formatRelativeTime(), GET(), getDisplayName()

### Community 41 - "next-auth"
Cohesion: 0.50
Nodes (3): authConfig, next-auth@^5.0.0-beta.31, next-auth

## Ambiguous Edges - Review These
- `getProductsWithStats()` → `Missing Error State on Products Page`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md · relation: conceptually_related_to

## Knowledge Gaps
- **14 isolated node(s):** `{ GET, POST }`, `Setting (Prisma model)`, `BalanceTxnType (Prisma enum)`, `CouponStatus (Prisma enum)`, `TopUpStatus (Prisma enum)` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 237 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `[id]/page.tsx`, `Balance & History Tables`, `AdminPopupSettings.tsx`, `Password Reset UI Kit`, `types.ts`, `Navbar`, `Dev Dependencies`, `referral.ts`, `loyalty.ts`, `dependencies`, `ButtonPrimary.tsx`, `app/layout.tsx`, `prisma.ts`, `reject/route.ts`, `referral.ts`, `transactions/[orderId]/page.tsx`, `Route Protection Middleware`, `EditorialLanding.tsx`, `admin/page.tsx`, `auth`, `react`, `order/[orderId]/page.tsx`, `prisma`, `Skeleton`, `redeem/route.ts`, `recent-purchases/route.ts`?**
  _High betweenness centrality (0.336) - this node is a cross-community bridge._
- **What connects `{ GET, POST }`, `Setting (Prisma model)`, `BalanceTxnType (Prisma enum)` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Balance & History Tables` be split into smaller, more focused modules?**
  _Cohesion score 0.06631578947368422 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `[id]/page.tsx`, `Balance & History Tables`, `order/[orderId]/page.tsx`, `AdminPopupSettings.tsx`, `Skeleton`, `affiliate/page.tsx`, `Password Reset UI Kit`, `2. Komponen`, `Navbar`, `Dev Dependencies`, `dependencies`, `ButtonPrimary.tsx`, `app/layout.tsx`, `Skeleton`, `transactions/[orderId]/page.tsx`, `EditorialLanding.tsx`, `admin/page.tsx`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Should `2. Komponen` be split into smaller, more focused modules?**
  _Cohesion score 0.04830917874396135 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Balance & History Tables` to `react`, `order/[orderId]/page.tsx`, `[id]/page.tsx`, `AdminPopupSettings.tsx`, `Skeleton`, `affiliate/page.tsx`, `Password Reset UI Kit`, `2. Komponen`, `Navbar`, `Dev Dependencies`, `dependencies`, `ButtonPrimary.tsx`, `app/layout.tsx`, `Skeleton`, `transactions/[orderId]/page.tsx`, `EditorialLanding.tsx`, `admin/page.tsx`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `getProductsWithStats()` and `Missing Error State on Products Page`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._