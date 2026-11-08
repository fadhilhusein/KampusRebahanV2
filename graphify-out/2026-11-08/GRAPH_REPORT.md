# Graph Report - KampusRebahanV2  (2026-11-08)

## Corpus Check
- 200 files · ~94,694 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 2, .ico 2, .css 1)

## Summary
- 1087 nodes · 2813 edges · 52 communities (50 shown, 2 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 71 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `adc683b1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- OrdersView.tsx
- dashboard/page.tsx
- 2. Komponen
- AdminPopupSettings.tsx
- InvoiceCheck.tsx
- Docs, Audit & Design Notes
- Password Reset UI Kit
- types.ts
- Navbar
- Dev Dependencies
- next
- referral.ts
- loyalty.ts
- dependencies
- next
- TypeScript Config
- useToast
- supplierSync.ts
- inpage.js
- referral.ts
- Skeleton
- transactions/[orderId]/page.tsx
- Route Protection Middleware
- Prisma Config
- NPM Scripts
- EditorialLanding.tsx
- match.mjs
- Caption sounding update: November 2026
- PostCSS Config
- NextAuth Handlers
- Caption promo: Beli Claude Pro, gratis Gemini AI Pro
- auth
- order/[orderId]/page.tsx
- report.mjs
- prisma.ts
- SettingsView.tsx
- compare
- order/route.ts
- Caption WhatsApp — KampusRebahan
- [id]/page.tsx
- ButtonPrimary.tsx
- Reveal.tsx
- next-auth
- replica.mjs
- motion.mjs
- selftest.mjs
- app/layout.tsx
- capture.mjs
- scripts/package.json
- mailer.ts
- eslint.config.mjs
- react

## God Nodes (most connected - your core abstractions)
1. `next` - 75 edges
2. `react` - 55 edges
3. `lucide-react` - 47 edges
4. `buttonClass()` - 40 edges
5. `prisma` - 40 edges
6. `Skeleton()` - 37 edges
7. `requireAdmin()` - 34 edges
8. `auth` - 34 edges
9. `compare()` - 28 edges
10. `Navbar()` - 26 edges

## Surprising Connections (you probably didn't know these)
- `Missing Error State on Products Page` --conceptually_related_to--> `getProductsWithStats()`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md → lib/products.ts
- `3.11 Legal` --references--> `LegalArticle()`  [INFERRED]
  design/SPEC.md → components/layout/LegalArticle.tsx
- `User (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/auth/register/route.ts
- `Coupon (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/loyalty/redeem/route.ts
- `ProductReview (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/reviews/route.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **User Balance Wallet Ledger (top-up, purchase, refund)** — prisma_schema_user, prisma_schema_balancetopup, prisma_schema_balancetransaction, prisma_schema_balancetxntype, lib_credittopup_credittopup, app_api_balance_topup_route_post [INFERRED 0.85]
- **Order Payment & Fulfillment Lifecycle** — prisma_schema_order, prisma_schema_orderstatus, app_api_order_route_post, app_api_admin_confirm_route_post, app_api_admin_reject_route_post, lib_fulfillorder_fulfillorder, lib_orderstatus_statuslabel [INFERRED 0.85]
- **Password Reset Flow** — prisma_schema_passwordresettoken, prisma_schema_user, app_api_auth_forgot_password_route_post, app_api_auth_reset_password_route_post [INFERRED 0.85]

## Communities (52 total, 2 thin omitted)

### Community 0 - "OrdersView.tsx"
Cohesion: 0.07
Nodes (56): AdminLoyaltyPage(), AdminOrdersPage(), ActionRow(), AdminHomePage(), Tile(), today(), AdminPayoutsPage(), AdminPopupPage() (+48 more)

### Community 1 - "dashboard/page.tsx"
Cohesion: 0.09
Nodes (44): DashboardHomePage(), formatDate(), formatPrice(), StatCard(), BalanceHistoryTable(), formatDate(), formatPrice(), typeInfo (+36 more)

### Community 2 - "2. Komponen"
Cohesion: 0.05
Nodes (38): CopyButton(), copy(), 1.1 Warna (hanya light; dark mode BELUM didesain), 1.2 Tipografi, 1.3 Radius, 1.4 Bayangan, 1.5 Spacing dan layout, 1.6 Navbar (+30 more)

### Community 3 - "AdminPopupSettings.tsx"
Cohesion: 0.11
Nodes (27): GET(), POST(), GET(), HomePage(), revalidate, AdminPopupSettings(), formatSaved(), CardProps (+19 more)

### Community 4 - "InvoiceCheck.tsx"
Cohesion: 0.11
Nodes (20): dateTime(), Estimate, InvoiceCheck(), rupiah(), todayWib(), metadata, RefundCalculatorPage(), NumberField() (+12 more)

### Community 5 - "Docs, Audit & Design Notes"
Cohesion: 0.10
Nodes (22): antislop Audit 001 (2026-09-20), WCAG Contrast Failures (text/placeholder/badge), Design Direction Is Web3 Template, Not KampusRebahan Brand, Two Admin Mechanisms (isAdmin vs ADMIN_EMAILS), Decorative Emoji Icons, Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast), Glass/Glow Overuse Beyond Dose Limit, middleware.ts Deprecated in Next 16 (use proxy.ts) (+14 more)

### Community 6 - "Password Reset UI Kit"
Cohesion: 0.15
Nodes (16): ForgotPasswordPage(), AuthCard(), AuthField(), AuthFieldProps, AuthNotice(), AuthPasswordField(), AuthPasswordFieldProps, AuthShell() (+8 more)

### Community 7 - "types.ts"
Cohesion: 0.07
Nodes (31): GET(), HIDDEN_PRODUCT_IDS, TOPUP_MIN_AMOUNT, call(), sign(), verifyBridgeWebhookSignature(), getProductsWithStats(), AccountDetail (+23 more)

### Community 8 - "Navbar"
Cohesion: 0.19
Nodes (18): NotFound(), PaymentCancelContent(), PaymentCancelPage(), StatusIcon(), CheckState, PaymentSuccessContent(), PaymentSuccessPage(), metadata (+10 more)

### Community 9 - "Dev Dependencies"
Cohesion: 0.12
Nodes (22): devDependencies, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20, @types/nodemailer@^8.0.1, @types/qrcode@^1.5.6, @types/react@^19, @types/react-dom@^19 (+14 more)

### Community 10 - "next"
Cohesion: 0.18
Nodes (21): POST(), POST(), POST(), POST(), POST(), POST(), POST(), bayarGg (+13 more)

### Community 11 - "referral.ts"
Cohesion: 0.26
Nodes (20): GET(), POST(), GET(), getBoolSetting(), getMarkupPercent(), isBankTransferEnabled(), isQrisBridgeEnabled(), isQrisGatewayEnabled() (+12 more)

### Community 12 - "loyalty.ts"
Cohesion: 0.14
Nodes (19): GET(), IN_PROGRESS, GET(), findCoupon(), generateCouponCode(), getLoyaltyState(), isUniqueViolation(), LOYALTY_REWARD (+11 more)

### Community 13 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, @auth/prisma-adapter@^2.11.2, bcryptjs@^3.0.3, lucide-react@^1.3.0, next@16.2.6, pg@^8.20.0, @prisma/adapter-pg@^7.8.0, @prisma/client@^7.8.0 (+17 more)

### Community 14 - "next"
Cohesion: 0.19
Nodes (14): POST(), GET(), GET(), POST(), GET(), GET(), AdminLayout(), DashboardLayout() (+6 more)

### Community 15 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 16 - "useToast"
Cohesion: 0.13
Nodes (15): CheckoutContent(), CheckoutPage(), formatPrice(), PaymentMethod, fetchLoyalty(), formatPrice(), LoyaltyCard(), LoyaltyResult (+7 more)

### Community 17 - "supplierSync.ts"
Cohesion: 0.19
Nodes (13): GET(), PAID_STATUSES, startOfJakartaDay(), GET(), PATCH(), GET(), POST(), warungApi (+5 more)

### Community 18 - "inpage.js"
Cohesion: 0.07
Nodes (39): blueprint.json fields, Motion timeline, Outline syntax, Reading a blueprint, Responsive section, Tokens, What counts as a node, Building from a blueprint (+31 more)

### Community 19 - "referral.ts"
Cohesion: 0.13
Nodes (23): GET(), POST(), GET(), POST(), GET(), FulfillOrderResult, processClaimedOrder(), creditCommission() (+15 more)

### Community 20 - "Skeleton"
Cohesion: 0.12
Nodes (18): AffiliateData, AffiliatePage(), formatDate(), formatPrice(), METHODS, TransactionsPage(), DashboardUserContext, SidebarUser (+10 more)

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
Cohesion: 0.14
Nodes (20): CredentialVisual(), EditorialLanding(), minPrice(), PayVisual(), PickVisual(), rupiah, steps, Bubble() (+12 more)

### Community 26 - "match.mjs"
Cohesion: 0.12
Nodes (26): area(), base(), center(), contains(), DEFAULTS, dist(), GROUP, hugs() (+18 more)

### Community 27 - "Caption sounding update: November 2026"
Cohesion: 0.40
Nodes (4): Caption sounding update: November 2026, Teaser promo (kirim 1–2 hari kemudian), Versi lengkap, Versi singkat

### Community 30 - "Caption promo: Beli Claude Pro, gratis Gemini AI Pro"
Cohesion: 0.40
Nodes (4): Caption promo: Beli Claude Pro, gratis Gemini AI Pro, Versi feed (lengkap), Versi santai, Versi story (singkat)

### Community 31 - "auth"
Cohesion: 0.16
Nodes (15): GET(), GET(), GET(), CouponUnavailableError, POST(), GET(), getSessionUserId(), mapReview() (+7 more)

### Community 32 - "order/[orderId]/page.tsx"
Cohesion: 0.18
Nodes (13): formatDate(), formatPrice(), Order, OrderDetailPage(), OrderSummary(), PaymentInstructions(), statusInfo, toneClass (+5 more)

### Community 33 - "report.mjs"
Cohesion: 0.23
Nodes (22): describeEase(), also(), at(), base(), blueprintMd(), change(), declared(), diffText() (+14 more)

### Community 34 - "prisma.ts"
Cohesion: 0.20
Nodes (11): GET(), formatRelativeTime(), GET(), getDisplayName(), POST(), POST(), verifyBayarGgWebhookSignature(), creditTopUp() (+3 more)

### Community 35 - "SettingsView.tsx"
Cohesion: 0.20
Nodes (13): AdminSettingsPage(), Field(), Group(), MethodKey, MethodList, methods, post(), Settings (+5 more)

### Community 36 - "compare"
Cohesion: 0.18
Nodes (17): Capturing each kind of reference, Iframes, canvas, WebGL, Lottie, video backgrounds, Interactions and motion, Live site or local page, Pages behind a login, Screen recordings and GIFs, Screenshots and design exports, launch() (+9 more)

### Community 37 - "order/route.ts"
Cohesion: 0.31
Nodes (10): BalanceTopUp (Prisma model), BalanceTransaction (Prisma model), BalanceTxnType (Prisma enum), Coupon (Prisma model), CouponStatus (Prisma enum), Order (Prisma model), ProductReview (Prisma model), TopUpStatus (Prisma enum) (+2 more)

### Community 38 - "Caption WhatsApp — KampusRebahan"
Cohesion: 0.33
Nodes (5): Caption 1 (lengkap), Caption 2 (singkat, untuk status), Caption 3 (ajakan santai di grup), Caption WhatsApp — KampusRebahan, Jargon pilihan

### Community 39 - "[id]/page.tsx"
Cohesion: 0.27
Nodes (9): ProductDetailContent(), ProductDetailPage(), Terms(), rupiah, typeIcon(), VariantSelector(), RatingStars(), Kartu varian (`VariantSelector`, komponen .pen "VariantCard") (+1 more)

### Community 40 - "ButtonPrimary.tsx"
Cohesion: 0.25
Nodes (8): ProductsCatalog(), ProductsContent(), ProductsPage(), ButtonPrimary(), ButtonPrimaryProps, Size, Variant, variants

### Community 41 - "Reveal.tsx"
Cohesion: 0.16
Nodes (16): BalancePage(), handleTopup(), formatPrice(), METHOD_LABEL, PRESET_AMOUNTS, TopupMethod, formatPrice(), TopUp (+8 more)

### Community 42 - "next-auth"
Cohesion: 0.50
Nodes (3): authConfig, next-auth@^5.0.0-beta.31, next-auth

### Community 43 - "replica.mjs"
Cohesion: 0.14
Nodes (23): captureImage(), captureVideo(), vpName(), CH_NAME, onsetSettle(), pairSegments(), openLab(), capture() (+15 more)

### Community 45 - "motion.mjs"
Cohesion: 0.20
Nodes (18): bezier(), bracket(), CHANNELS, colorDist(), EASINGS, EPS, fitEasing(), hexRgb() (+10 more)

### Community 46 - "selftest.mjs"
Cohesion: 0.15
Nodes (5): lab(), diffPanel(), label(), sheet(), MIME

### Community 47 - "app/layout.tsx"
Cohesion: 0.18
Nodes (10): inter, interTight, metadata, RootLayout(), RefCapture(), NextAuthSessionProvider(), ToastProvider(), WhatsAppButton() (+2 more)

### Community 48 - "capture.mjs"
Cohesion: 0.35
Nodes (11): act(), captureUrl(), EPOCH, pad(), parseAction(), recordMotion(), scrollThrough(), settleNetwork() (+3 more)

### Community 49 - "scripts/package.json"
Cohesion: 0.20
Nodes (10): dependencies, playwright@^1.64.1, engines, node, name, private, scripts, test (+2 more)

### Community 50 - "mailer.ts"
Cohesion: 0.32
Nodes (7): adminNotifyEmail(), escapeHtml(), PaidOrderInfo, sendPaidOrderEmail(), transporter, nodemailer@^7.0.13, nodemailer

### Community 55 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.2.6, eslint, eslint-config-next

### Community 56 - "react"
Cohesion: 0.13
Nodes (12): formatRelativeTime(), RecentPurchase, RecentPurchaseBanner(), GradientBorderProps, clientSnapshot(), serverSnapshot(), subscribe(), ThemeToggle() (+4 more)

## Ambiguous Edges - Review These
- `getProductsWithStats()` → `Missing Error State on Products Page`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md · relation: conceptually_related_to

## Knowledge Gaps
- **14 isolated node(s):** `{ GET, POST }`, `BalanceTxnType (Prisma enum)`, `CouponStatus (Prisma enum)`, `TopUpStatus (Prisma enum)`, `Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast)` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 293 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `OrdersView.tsx`, `dashboard/page.tsx`, `AdminPopupSettings.tsx`, `InvoiceCheck.tsx`, `Password Reset UI Kit`, `types.ts`, `Navbar`, `Dev Dependencies`, `next`, `referral.ts`, `loyalty.ts`, `dependencies`, `useToast`, `supplierSync.ts`, `referral.ts`, `Skeleton`, `transactions/[orderId]/page.tsx`, `Route Protection Middleware`, `EditorialLanding.tsx`, `auth`, `order/[orderId]/page.tsx`, `prisma.ts`, `SettingsView.tsx`, `[id]/page.tsx`, `ButtonPrimary.tsx`, `Reveal.tsx`, `app/layout.tsx`?**
  _High betweenness centrality (0.273) - this node is a cross-community bridge._
- **What connects `{ GET, POST }`, `BalanceTxnType (Prisma enum)`, `CouponStatus (Prisma enum)` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `OrdersView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06990622335890878 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `order/[orderId]/page.tsx`, `dashboard/page.tsx`, `OrdersView.tsx`, `SettingsView.tsx`, `InvoiceCheck.tsx`, `AdminPopupSettings.tsx`, `Password Reset UI Kit`, `[id]/page.tsx`, `Navbar`, `Reveal.tsx`, `ButtonPrimary.tsx`, `Dev Dependencies`, `dependencies`, `app/layout.tsx`, `useToast`, `Skeleton`, `transactions/[orderId]/page.tsx`, `EditorialLanding.tsx`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Should `dashboard/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0853302162478083 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Navbar` to `OrdersView.tsx`, `dashboard/page.tsx`, `order/[orderId]/page.tsx`, `SettingsView.tsx`, `InvoiceCheck.tsx`, `AdminPopupSettings.tsx`, `Password Reset UI Kit`, `[id]/page.tsx`, `ButtonPrimary.tsx`, `Reveal.tsx`, `Dev Dependencies`, `dependencies`, `app/layout.tsx`, `useToast`, `Skeleton`, `transactions/[orderId]/page.tsx`, `react`, `EditorialLanding.tsx`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `getProductsWithStats()` and `Missing Error State on Products Page`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._