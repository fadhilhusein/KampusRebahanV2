# Graph Report - KampusRebahanV2  (2026-11-08)

## Corpus Check
- 180 files · ~67,993 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 2, .ico 2, .css 1)

## Summary
- 862 nodes · 2316 edges · 45 communities (42 shown, 3 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 43 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5f4cf051`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- OrdersView.tsx
- Balance & History Tables
- 2. Komponen
- AdminPopupSettings.tsx
- PayoutsView.tsx
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
- ToastContext.tsx
- next
- AdminShell.tsx
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
- auth.ts
- react
- [id]/page.tsx
- order/route.ts
- SettingsView.tsx
- ButtonPrimary.tsx
- eslint.config.mjs
- Caption WhatsApp — KampusRebahan
- order/[orderId]/page.tsx
- lucide-react
- checkout/page.tsx
- recent-purchases/route.ts
- @radix-ui/react-dropdown-menu
- @types/pg@^8.20.0

## God Nodes (most connected - your core abstractions)
1. `next` - 72 edges
2. `react` - 53 edges
3. `lucide-react` - 46 edges
4. `prisma` - 39 edges
5. `buttonClass()` - 38 edges
6. `Skeleton()` - 37 edges
7. `auth` - 34 edges
8. `requireAdmin()` - 32 edges
9. `useToast()` - 25 edges
10. `Navbar()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `Missing Error State on Products Page` --conceptually_related_to--> `getProductsWithStats()`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md → lib/products.ts
- `3.11 Legal` --references--> `LegalArticle()`  [INFERRED]
  design/SPEC.md → components/layout/LegalArticle.tsx
- `BalanceTopUp (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/balance/topup/route.ts
- `Setting (Prisma model)` --shares_data_with--> `getMarkupPercent()`  [INFERRED]
  prisma/schema.prisma → lib/settings.ts
- `User (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/auth/register/route.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **User Balance Wallet Ledger (top-up, purchase, refund)** — prisma_schema_user, prisma_schema_balancetopup, prisma_schema_balancetransaction, prisma_schema_balancetxntype, lib_credittopup_credittopup, app_api_balance_topup_route_post [INFERRED 0.85]
- **Order Payment & Fulfillment Lifecycle** — prisma_schema_order, prisma_schema_orderstatus, app_api_order_route_post, app_api_admin_confirm_route_post, app_api_admin_reject_route_post, lib_fulfillorder_fulfillorder, lib_orderstatus_statuslabel [INFERRED 0.85]
- **Password Reset Flow** — prisma_schema_passwordresettoken, prisma_schema_user, app_api_auth_forgot_password_route_post, app_api_auth_reset_password_route_post [INFERRED 0.85]

## Communities (45 total, 3 thin omitted)

### Community 0 - "OrdersView.tsx"
Cohesion: 0.17
Nodes (25): AdminOrdersPage(), ActionButton(), ActionKind, filters, isRefundable(), isRejectable(), MethodIcon(), OrderCard (+17 more)

### Community 1 - "Balance & History Tables"
Cohesion: 0.06
Nodes (59): BalancePage(), handleTopup(), formatPrice(), METHOD_LABEL, PRESET_AMOUNTS, TopupMethod, DashboardHomePage(), formatDate() (+51 more)

### Community 2 - "2. Komponen"
Cohesion: 0.05
Nodes (38): copy(), 1.1 Warna (hanya light; dark mode BELUM didesain), 1.2 Tipografi, 1.3 Radius, 1.4 Bayangan, 1.5 Spacing dan layout, 1.6 Navbar, 1. Design tokens (+30 more)

### Community 3 - "AdminPopupSettings.tsx"
Cohesion: 0.11
Nodes (22): GET(), AdminPopupSettings(), formatSaved(), CardProps, InfoPopup(), PopupCard(), PopupDialog(), popupTypes (+14 more)

### Community 4 - "PayoutsView.tsx"
Cohesion: 0.15
Nodes (15): AdminPayoutsPage(), AffiliateData, AffiliatePage(), formatDate(), formatPrice(), METHODS, CopyButton(), Destination() (+7 more)

### Community 5 - "Docs, Audit & Design Notes"
Cohesion: 0.10
Nodes (22): antislop Audit 001 (2026-09-20), WCAG Contrast Failures (text/placeholder/badge), Design Direction Is Web3 Template, Not KampusRebahan Brand, Two Admin Mechanisms (isAdmin vs ADMIN_EMAILS), Decorative Emoji Icons, Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast), Glass/Glow Overuse Beyond Dose Limit, middleware.ts Deprecated in Next 16 (use proxy.ts) (+14 more)

### Community 6 - "Password Reset UI Kit"
Cohesion: 0.15
Nodes (16): ForgotPasswordPage(), AuthCard(), AuthField(), AuthFieldProps, AuthNotice(), AuthPasswordField(), AuthPasswordFieldProps, AuthShell() (+8 more)

### Community 7 - "types.ts"
Cohesion: 0.10
Nodes (22): POST(), HIDDEN_PRODUCT_IDS, warungApi, applySupplierStatus(), markOrderCompleted(), AccountDetail, ApiResponse, BalanceResponse (+14 more)

### Community 8 - "Navbar"
Cohesion: 0.24
Nodes (9): NotFound(), metadata, PrivacyPage(), metadata, TermsPage(), LegalArticle(), avatarFor(), Logo() (+1 more)

### Community 9 - "Dev Dependencies"
Cohesion: 0.12
Nodes (22): devDependencies, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20, @types/nodemailer@^8.0.1, @types/qrcode@^1.5.6, @types/react@^19, @types/react-dom@^19 (+14 more)

### Community 10 - "next"
Cohesion: 0.21
Nodes (18): POST(), POST(), POST(), CouponUnavailableError, POST(), POST(), GET(), getSessionUserId() (+10 more)

### Community 11 - "referral.ts"
Cohesion: 0.17
Nodes (30): GET(), POST(), POST(), POST(), GET(), POST(), GET(), generateReferralCode() (+22 more)

### Community 12 - "loyalty.ts"
Cohesion: 0.10
Nodes (32): GET(), IN_PROGRESS, GET(), POST(), findCoupon(), generateCouponCode(), getLoyaltyState(), isUniqueViolation() (+24 more)

### Community 13 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, @auth/prisma-adapter@^2.11.2, bcryptjs@^3.0.3, lucide-react@^1.3.0, motion@^12.37.0, next@16.2.6, nodemailer@^7.0.13, pg@^8.20.0 (+14 more)

### Community 14 - "requireAdmin"
Cohesion: 0.18
Nodes (15): POST(), GET(), POST(), GET(), POST(), GET(), GET(), AdminLayout() (+7 more)

### Community 15 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 16 - "ToastContext.tsx"
Cohesion: 0.07
Nodes (29): inter, interTight, metadata, RootLayout(), fetchLoyalty(), formatPrice(), LoyaltyCard(), LoyaltyResult (+21 more)

### Community 17 - "next"
Cohesion: 0.16
Nodes (18): GET(), GET(), PAID_STATUSES, startOfJakartaDay(), GET(), GET(), GET(), GET() (+10 more)

### Community 18 - "AdminShell.tsx"
Cohesion: 0.19
Nodes (16): AdminLoyaltyPage(), ActionRow(), AdminHomePage(), Tile(), today(), AdminPopupPage(), AdminHeader(), AdminShell() (+8 more)

### Community 19 - "referral.ts"
Cohesion: 0.13
Nodes (16): POST(), FulfillOrderResult, processClaimedOrder(), adminNotifyEmail(), escapeHtml(), PaidOrderInfo, sendPaidOrderEmail(), transporter (+8 more)

### Community 20 - "Skeleton"
Cohesion: 0.18
Nodes (13): AdminLoyalty(), filters, formatDate(), formatPrice(), Row, stateInfo, formatPrice(), RefundDialog() (+5 more)

### Community 21 - "transactions/[orderId]/page.tsx"
Cohesion: 0.13
Nodes (21): AccountDetailsPanel(), AccountGroup, COMPLAINT_STATUSES, complaintMessage(), Credential, CredentialRow(), formatDate(), formatPrice() (+13 more)

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
Cohesion: 0.13
Nodes (17): GET(), HomePage(), revalidate, CredentialVisual(), EditorialLanding(), minPrice(), PayVisual(), PickVisual() (+9 more)

### Community 26 - "HeroGallery.tsx"
Cohesion: 0.27
Nodes (10): Bubble(), Card(), HeroGallery(), ProductCard(), rupiah, ProductImage(), tiles, 4. Aset (+2 more)

### Community 27 - "Caption sounding update: November 2026"
Cohesion: 0.40
Nodes (4): Caption sounding update: November 2026, Teaser promo (kirim 1–2 hari kemudian), Versi lengkap, Versi singkat

### Community 30 - "Caption promo: Beli Claude Pro, gratis Gemini AI Pro"
Cohesion: 0.40
Nodes (4): Caption promo: Beli Claude Pro, gratis Gemini AI Pro, Versi feed (lengkap), Versi santai, Versi story (singkat)

### Community 31 - "auth.ts"
Cohesion: 0.32
Nodes (5): authConfig, handlers, RateLimited, signIn, signOut

### Community 32 - "react"
Cohesion: 0.15
Nodes (10): formatPrice(), TopUp, TopUpPaymentPage(), Countdown(), GatewayQr(), GradientBorderProps, RevealItem(), Tag (+2 more)

### Community 33 - "[id]/page.tsx"
Cohesion: 0.23
Nodes (12): ProductDetailContent(), ProductDetailPage(), Terms(), Footer(), rupiah, typeIcon(), VariantSelector(), Badge() (+4 more)

### Community 34 - "order/route.ts"
Cohesion: 0.11
Nodes (22): GET(), POST(), POST(), bayarGg, QRIS_GATEWAY_MAX_AMOUNT, TOPUP_MIN_AMOUNT, verifyBayarGgWebhookSignature(), creditTopUp() (+14 more)

### Community 35 - "SettingsView.tsx"
Cohesion: 0.16
Nodes (15): AdminSettingsPage(), Field(), Group(), MethodKey, MethodList, methods, post(), Settings (+7 more)

### Community 36 - "ButtonPrimary.tsx"
Cohesion: 0.25
Nodes (8): ProductsCatalog(), ProductsContent(), ProductsPage(), ButtonPrimary(), ButtonPrimaryProps, Size, Variant, variants

### Community 37 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.2.6, eslint, eslint-config-next

### Community 38 - "Caption WhatsApp — KampusRebahan"
Cohesion: 0.33
Nodes (5): Caption 1 (lengkap), Caption 2 (singkat, untuk status), Caption 3 (ajakan santai di grup), Caption WhatsApp — KampusRebahan, Jargon pilihan

### Community 39 - "order/[orderId]/page.tsx"
Cohesion: 0.29
Nodes (9): CopyButton(), formatDate(), formatPrice(), Order, OrderDetailPage(), OrderSummary(), PaymentInstructions(), statusInfo (+1 more)

### Community 40 - "lucide-react"
Cohesion: 0.38
Nodes (8): PaymentCancelContent(), PaymentCancelPage(), StatusIcon(), CheckState, PaymentSuccessContent(), PaymentSuccessPage(), buttonClass(), lucide-react

### Community 41 - "checkout/page.tsx"
Cohesion: 0.43
Nodes (5): CheckoutContent(), CheckoutPage(), formatPrice(), PaymentMethod, CheckoutSkeleton()

### Community 42 - "recent-purchases/route.ts"
Cohesion: 0.83
Nodes (3): formatRelativeTime(), GET(), getDisplayName()

### Community 43 - "@radix-ui/react-dropdown-menu"
Cohesion: 0.33
Nodes (4): @radix-ui/react-dropdown-menu@^2.1.24, react-dom@19.2.4, @radix-ui/react-dropdown-menu, react-dom

## Ambiguous Edges - Review These
- `getProductsWithStats()` → `Missing Error State on Products Page`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md · relation: conceptually_related_to

## Knowledge Gaps
- **14 isolated node(s):** `{ GET, POST }`, `Setting (Prisma model)`, `BalanceTxnType (Prisma enum)`, `CouponStatus (Prisma enum)`, `TopUpStatus (Prisma enum)` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 242 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `OrdersView.tsx`, `Balance & History Tables`, `AdminPopupSettings.tsx`, `Password Reset UI Kit`, `types.ts`, `Navbar`, `Dev Dependencies`, `next`, `referral.ts`, `loyalty.ts`, `dependencies`, `requireAdmin`, `ToastContext.tsx`, `AdminShell.tsx`, `referral.ts`, `transactions/[orderId]/page.tsx`, `Route Protection Middleware`, `EditorialLanding.tsx`, `HeroGallery.tsx`, `react`, `[id]/page.tsx`, `order/route.ts`, `SettingsView.tsx`, `ButtonPrimary.tsx`, `order/[orderId]/page.tsx`, `lucide-react`, `checkout/page.tsx`, `recent-purchases/route.ts`?**
  _High betweenness centrality (0.345) - this node is a cross-community bridge._
- **What connects `{ GET, POST }`, `Setting (Prisma model)`, `BalanceTxnType (Prisma enum)` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Balance & History Tables` be split into smaller, more focused modules?**
  _Cohesion score 0.06185919343814081 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `OrdersView.tsx`, `Balance & History Tables`, `AdminPopupSettings.tsx`, `PayoutsView.tsx`, `Password Reset UI Kit`, `Navbar`, `Dev Dependencies`, `dependencies`, `ToastContext.tsx`, `AdminShell.tsx`, `Skeleton`, `transactions/[orderId]/page.tsx`, `EditorialLanding.tsx`, `HeroGallery.tsx`, `[id]/page.tsx`, `SettingsView.tsx`, `ButtonPrimary.tsx`, `order/[orderId]/page.tsx`, `lucide-react`, `checkout/page.tsx`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Should `2. Komponen` be split into smaller, more focused modules?**
  _Cohesion score 0.05398110661268556 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `OrdersView.tsx`, `Balance & History Tables`, `AdminPopupSettings.tsx`, `PayoutsView.tsx`, `Password Reset UI Kit`, `Navbar`, `Dev Dependencies`, `dependencies`, `ToastContext.tsx`, `AdminShell.tsx`, `Skeleton`, `transactions/[orderId]/page.tsx`, `EditorialLanding.tsx`, `HeroGallery.tsx`, `react`, `[id]/page.tsx`, `SettingsView.tsx`, `ButtonPrimary.tsx`, `order/[orderId]/page.tsx`, `checkout/page.tsx`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `getProductsWithStats()` and `Missing Error State on Products Page`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._