# Graph Report - KampusRebahanV2  (2026-11-07)

## Corpus Check
- 179 files · ~67,191 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 2, .ico 2, .css 1)

## Summary
- 852 nodes · 2285 edges · 46 communities (41 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 43 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d4a270cd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- OrdersView.tsx
- Balance & History Tables
- 2. Komponen
- AdminPopupSettings.tsx
- ToastContext.tsx
- Docs, Audit & Design Notes
- Password Reset UI Kit
- types.ts
- Navbar
- Dev Dependencies
- next
- referral.ts
- loyalty.ts
- dependencies
- requireAdmin
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
- HeroGallery.tsx
- Caption sounding update: November 2026
- PostCSS Config
- NextAuth Handlers
- Caption promo: Beli Claude Pro, gratis Gemini AI Pro
- auth
- react
- buttonClass
- prisma.ts
- mailer.ts
- ButtonPrimary.tsx
- eslint.config.mjs
- Caption WhatsApp — KampusRebahan
- redeem/route.ts
- lucide-react
- paymentBridge.ts
- products.ts
- next-themes
- @prisma/client@^7.8.0
- qrcode

## God Nodes (most connected - your core abstractions)
1. `next` - 72 edges
2. `react` - 53 edges
3. `lucide-react` - 46 edges
4. `prisma` - 39 edges
5. `Skeleton()` - 37 edges
6. `buttonClass()` - 37 edges
7. `auth` - 34 edges
8. `requireAdmin()` - 32 edges
9. `useToast()` - 25 edges
10. `Navbar()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `Missing Error State on Products Page` --conceptually_related_to--> `getProductsWithStats()`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md → lib/products.ts
- `3.5 Pembayaran QRIS → `/order/[orderId]` (status pending)` --references--> `GatewayQr()`  [INFERRED]
  design/SPEC.md → components/payment/GatewayQr.tsx
- `User (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/auth/register/route.ts
- `BalanceTopUp (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/balance/topup/route.ts
- `ProductReview (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/reviews/route.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **User Balance Wallet Ledger (top-up, purchase, refund)** — prisma_schema_user, prisma_schema_balancetopup, prisma_schema_balancetransaction, prisma_schema_balancetxntype, lib_credittopup_credittopup, app_api_balance_topup_route_post [INFERRED 0.85]
- **Order Payment & Fulfillment Lifecycle** — prisma_schema_order, prisma_schema_orderstatus, app_api_order_route_post, app_api_admin_confirm_route_post, app_api_admin_reject_route_post, lib_fulfillorder_fulfillorder, lib_orderstatus_statuslabel [INFERRED 0.85]
- **Password Reset Flow** — prisma_schema_passwordresettoken, prisma_schema_user, app_api_auth_forgot_password_route_post, app_api_auth_reset_password_route_post [INFERRED 0.85]

## Communities (46 total, 5 thin omitted)

### Community 0 - "OrdersView.tsx"
Cohesion: 0.06
Nodes (69): AdminLoyaltyPage(), AdminOrdersPage(), ActionRow(), AdminHomePage(), Tile(), today(), AdminPayoutsPage(), AdminSettingsPage() (+61 more)

### Community 1 - "Balance & History Tables"
Cohesion: 0.09
Nodes (44): DashboardHomePage(), formatDate(), formatPrice(), StatCard(), BalanceHistoryTable(), BalanceTransaction, formatDate(), formatPrice() (+36 more)

### Community 2 - "2. Komponen"
Cohesion: 0.06
Nodes (37): copy(), 1.1 Warna (hanya light; dark mode BELUM didesain), 1.2 Tipografi, 1.3 Radius, 1.4 Bayangan, 1.5 Spacing dan layout, 1.6 Navbar, 1. Design tokens (+29 more)

### Community 3 - "AdminPopupSettings.tsx"
Cohesion: 0.10
Nodes (26): GET(), POST(), GET(), AdminPopupSettings(), formatSaved(), CardProps, InfoPopup(), PopupCard() (+18 more)

### Community 4 - "ToastContext.tsx"
Cohesion: 0.13
Nodes (21): AffiliateData, AffiliatePage(), formatDate(), formatPrice(), METHODS, BalancePage(), handleTopup(), formatPrice() (+13 more)

### Community 5 - "Docs, Audit & Design Notes"
Cohesion: 0.10
Nodes (22): antislop Audit 001 (2026-09-20), WCAG Contrast Failures (text/placeholder/badge), Design Direction Is Web3 Template, Not KampusRebahan Brand, Two Admin Mechanisms (isAdmin vs ADMIN_EMAILS), Decorative Emoji Icons, Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast), Glass/Glow Overuse Beyond Dose Limit, middleware.ts Deprecated in Next 16 (use proxy.ts) (+14 more)

### Community 6 - "Password Reset UI Kit"
Cohesion: 0.12
Nodes (19): ForgotPasswordPage(), authConfig, AuthCard(), AuthField(), AuthFieldProps, AuthNotice(), AuthPasswordField(), AuthPasswordFieldProps (+11 more)

### Community 7 - "types.ts"
Cohesion: 0.10
Nodes (21): HIDDEN_PRODUCT_IDS, TOPUP_MIN_AMOUNT, AccountDetail, ApiResponse, BalanceResponse, BalanceResult, BayarGgCheckPaymentData, BayarGgCreatePaymentData (+13 more)

### Community 8 - "Navbar"
Cohesion: 0.15
Nodes (20): NotFound(), PaymentCancelContent(), PaymentCancelPage(), StatusIcon(), CheckState, PaymentSuccessContent(), PaymentSuccessPage(), metadata (+12 more)

### Community 9 - "Dev Dependencies"
Cohesion: 0.12
Nodes (22): devDependencies, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20, @types/nodemailer@^8.0.1, @types/qrcode@^1.5.6, @types/react@^19, @types/react-dom@^19 (+14 more)

### Community 10 - "next"
Cohesion: 0.18
Nodes (22): POST(), POST(), POST(), POST(), POST(), POST(), POST(), bayarGg (+14 more)

### Community 11 - "referral.ts"
Cohesion: 0.24
Nodes (19): GET(), POST(), GET(), GET(), getMarkupPercent(), getNumberSetting(), getReferralCommissionPercent(), getReferralMinPayout() (+11 more)

### Community 12 - "loyalty.ts"
Cohesion: 0.15
Nodes (18): GET(), IN_PROGRESS, GET(), findCoupon(), generateCouponCode(), getLoyaltyState(), isUniqueViolation(), LOYALTY_REWARD (+10 more)

### Community 13 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, @auth/prisma-adapter@^2.11.2, bcryptjs@^3.0.3, lucide-react@^1.3.0, motion@^12.37.0, next@16.2.6, pg@^8.20.0, @prisma/adapter-pg@^7.8.0 (+14 more)

### Community 14 - "requireAdmin"
Cohesion: 0.22
Nodes (12): POST(), GET(), POST(), GET(), GET(), AdminLayout(), DashboardLayout(), metadata (+4 more)

### Community 15 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 16 - "app/layout.tsx"
Cohesion: 0.22
Nodes (8): inter, interTight, metadata, RootLayout(), RefCapture(), NextAuthSessionProvider(), ToastProvider(), WhatsAppButton()

### Community 17 - "prisma.ts"
Cohesion: 0.17
Nodes (14): GET(), GET(), PAID_STATUSES, startOfJakartaDay(), GET(), POST(), warungApi, processClaimedOrder() (+6 more)

### Community 18 - "reject/route.ts"
Cohesion: 0.31
Nodes (10): BalanceTopUp (Prisma model), BalanceTransaction (Prisma model), BalanceTxnType (Prisma enum), Coupon (Prisma model), CouponStatus (Prisma enum), Order (Prisma model), ProductReview (Prisma model), TopUpStatus (Prisma enum) (+2 more)

### Community 19 - "referral.ts"
Cohesion: 0.19
Nodes (15): GET(), POST(), POST(), settleLoyaltyOnReject(), creditWallet(), generateReferralCode(), getSessionUserId(), isUniqueViolation() (+7 more)

### Community 20 - "Skeleton"
Cohesion: 0.22
Nodes (10): CheckoutContent(), CheckoutPage(), formatPrice(), PaymentMethod, formatPrice(), RefundDialog(), CheckoutSkeleton(), Skeleton() (+2 more)

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
Cohesion: 0.20
Nodes (11): CredentialVisual(), EditorialLanding(), minPrice(), PayVisual(), PickVisual(), rupiah, steps, PaymentCarousel() (+3 more)

### Community 26 - "HeroGallery.tsx"
Cohesion: 0.27
Nodes (10): Bubble(), Card(), HeroGallery(), ProductCard(), rupiah, ProductImage(), tiles, 4. Aset (+2 more)

### Community 27 - "Caption sounding update: November 2026"
Cohesion: 0.40
Nodes (4): Caption sounding update: November 2026, Teaser promo (kirim 1–2 hari kemudian), Versi lengkap, Versi singkat

### Community 30 - "Caption promo: Beli Claude Pro, gratis Gemini AI Pro"
Cohesion: 0.40
Nodes (4): Caption promo: Beli Claude Pro, gratis Gemini AI Pro, Versi feed (lengkap), Versi santai, Versi story (singkat)

### Community 31 - "auth"
Cohesion: 0.17
Nodes (14): GET(), GET(), GET(), GET(), PATCH(), GET(), getSessionUserId(), mapReview() (+6 more)

### Community 32 - "react"
Cohesion: 0.16
Nodes (14): formatPrice(), TopUp, TopUpPaymentPage(), TransactionsPage(), DashboardUserContext, SidebarUser, useDashboardUser(), baseTabs (+6 more)

### Community 33 - "buttonClass"
Cohesion: 0.14
Nodes (22): CopyButton(), formatDate(), formatPrice(), Order, OrderDetailPage(), OrderSummary(), PaymentInstructions(), statusInfo (+14 more)

### Community 34 - "prisma.ts"
Cohesion: 0.16
Nodes (12): GET(), formatRelativeTime(), GET(), getDisplayName(), POST(), verifyBayarGgWebhookSignature(), creditTopUp(), CreditTopUpResult (+4 more)

### Community 35 - "mailer.ts"
Cohesion: 0.32
Nodes (7): adminNotifyEmail(), escapeHtml(), PaidOrderInfo, sendPaidOrderEmail(), transporter, nodemailer@^7.0.13, nodemailer

### Community 36 - "ButtonPrimary.tsx"
Cohesion: 0.18
Nodes (8): fetchLoyalty(), formatPrice(), LoyaltyCard(), LoyaltyResult, ButtonPrimaryProps, Size, Variant, variants

### Community 37 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.2.6, eslint, eslint-config-next

### Community 38 - "Caption WhatsApp — KampusRebahan"
Cohesion: 0.33
Nodes (5): Caption 1 (lengkap), Caption 2 (singkat, untuk status), Caption 3 (ajakan santai di grup), Caption WhatsApp — KampusRebahan, Jargon pilihan

### Community 39 - "redeem/route.ts"
Cohesion: 0.67
Nodes (3): CouponUnavailableError, POST(), LOYALTY_REWARD_VARIANT_ID

### Community 40 - "lucide-react"
Cohesion: 0.21
Nodes (7): logos, clientSnapshot(), serverSnapshot(), subscribe(), ThemeToggle(), iconMap, lucide-react

### Community 41 - "paymentBridge.ts"
Cohesion: 0.29
Nodes (8): POST(), call(), sign(), verifyBridgeWebhookSignature(), BridgeCreatePaymentPayload, BridgePaymentData, BridgeResponse, BridgeWebhookPayload

### Community 42 - "products.ts"
Cohesion: 0.43
Nodes (5): GET(), HomePage(), revalidate, getProductsWithStats(), Product

## Ambiguous Edges - Review These
- `getProductsWithStats()` → `Missing Error State on Products Page`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md · relation: conceptually_related_to

## Knowledge Gaps
- **14 isolated node(s):** `{ GET, POST }`, `Setting (Prisma model)`, `BalanceTxnType (Prisma enum)`, `CouponStatus (Prisma enum)`, `TopUpStatus (Prisma enum)` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 238 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `OrdersView.tsx`, `Balance & History Tables`, `AdminPopupSettings.tsx`, `ToastContext.tsx`, `Password Reset UI Kit`, `Navbar`, `Dev Dependencies`, `referral.ts`, `loyalty.ts`, `dependencies`, `requireAdmin`, `app/layout.tsx`, `prisma.ts`, `referral.ts`, `Skeleton`, `transactions/[orderId]/page.tsx`, `Route Protection Middleware`, `EditorialLanding.tsx`, `HeroGallery.tsx`, `auth`, `react`, `buttonClass`, `prisma.ts`, `ButtonPrimary.tsx`, `redeem/route.ts`, `paymentBridge.ts`, `products.ts`?**
  _High betweenness centrality (0.343) - this node is a cross-community bridge._
- **What connects `{ GET, POST }`, `Setting (Prisma model)`, `BalanceTxnType (Prisma enum)` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `OrdersView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05546218487394958 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `OrdersView.tsx`, `Balance & History Tables`, `buttonClass`, `AdminPopupSettings.tsx`, `ToastContext.tsx`, `ButtonPrimary.tsx`, `Password Reset UI Kit`, `Navbar`, `lucide-react`, `Dev Dependencies`, `dependencies`, `app/layout.tsx`, `Skeleton`, `transactions/[orderId]/page.tsx`, `EditorialLanding.tsx`, `HeroGallery.tsx`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Should `Balance & History Tables` be split into smaller, more focused modules?**
  _Cohesion score 0.08650937689050212 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `OrdersView.tsx`, `react`, `Balance & History Tables`, `buttonClass`, `ToastContext.tsx`, `AdminPopupSettings.tsx`, `Password Reset UI Kit`, `ButtonPrimary.tsx`, `Navbar`, `Dev Dependencies`, `dependencies`, `app/layout.tsx`, `Skeleton`, `transactions/[orderId]/page.tsx`, `EditorialLanding.tsx`, `HeroGallery.tsx`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `getProductsWithStats()` and `Missing Error State on Products Page`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._