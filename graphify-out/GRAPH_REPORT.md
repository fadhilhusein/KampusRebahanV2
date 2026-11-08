# Graph Report - KampusRebahanV2  (2026-11-08)

## Corpus Check
- 200 files · ~95,123 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 2, .ico 2, .css 1)

## Summary
- 1090 nodes · 2819 edges · 57 communities (53 shown, 4 thin omitted)
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
- [id]/page.tsx
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
- api.ts
- Skeleton
- transactions/[orderId]/page.tsx
- Route Protection Middleware
- useToast
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
- lucide-react
- [topupId]/page.tsx
- next-auth
- replica.mjs
- bayarGg.ts
- motion.mjs
- lab
- app/layout.tsx
- capture.mjs
- scripts/package.json
- mailer.ts
- redeem/route.ts
- recent-purchases/route.ts
- @radix-ui/react-dropdown-menu
- GradientBorder.tsx
- eslint.config.mjs
- categoryIcons.ts

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
- `BalanceTopUp (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/balance/topup/route.ts
- `BalanceTransaction (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/order/route.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **User Balance Wallet Ledger (top-up, purchase, refund)** — prisma_schema_user, prisma_schema_balancetopup, prisma_schema_balancetransaction, prisma_schema_balancetxntype, lib_credittopup_credittopup, app_api_balance_topup_route_post [INFERRED 0.85]
- **Order Payment & Fulfillment Lifecycle** — prisma_schema_order, prisma_schema_orderstatus, app_api_order_route_post, app_api_admin_confirm_route_post, app_api_admin_reject_route_post, lib_fulfillorder_fulfillorder, lib_orderstatus_statuslabel [INFERRED 0.85]
- **Password Reset Flow** — prisma_schema_passwordresettoken, prisma_schema_user, app_api_auth_forgot_password_route_post, app_api_auth_reset_password_route_post [INFERRED 0.85]

## Communities (57 total, 4 thin omitted)

### Community 0 - "OrdersView.tsx"
Cohesion: 0.08
Nodes (50): AdminLoyaltyPage(), AdminOrdersPage(), ActionRow(), AdminHomePage(), Tile(), today(), AdminPayoutsPage(), AdminPopupPage() (+42 more)

### Community 1 - "dashboard/page.tsx"
Cohesion: 0.09
Nodes (43): DashboardHomePage(), formatDate(), formatPrice(), StatCard(), BalanceHistoryTable(), BalanceTransaction, formatDate(), formatPrice() (+35 more)

### Community 2 - "2. Komponen"
Cohesion: 0.14
Nodes (14): 2. Komponen, Badge status, Bubble `@nama`, Chip filter / tab, Footer, Input / field, Item list mobile, Kartu dashboard (+6 more)

### Community 3 - "AdminPopupSettings.tsx"
Cohesion: 0.09
Nodes (28): GET(), POST(), GET(), HomePage(), revalidate, AdminPopupSettings(), formatSaved(), CardProps (+20 more)

### Community 4 - "InvoiceCheck.tsx"
Cohesion: 0.13
Nodes (22): dateTime(), Estimate, InvoiceCheck(), rupiah(), todayWib(), metadata, RefundCalculatorPage(), NumberField() (+14 more)

### Community 5 - "Docs, Audit & Design Notes"
Cohesion: 0.10
Nodes (22): antislop Audit 001 (2026-09-20), WCAG Contrast Failures (text/placeholder/badge), Design Direction Is Web3 Template, Not KampusRebahan Brand, Two Admin Mechanisms (isAdmin vs ADMIN_EMAILS), Decorative Emoji Icons, Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast), Glass/Glow Overuse Beyond Dose Limit, middleware.ts Deprecated in Next 16 (use proxy.ts) (+14 more)

### Community 6 - "Password Reset UI Kit"
Cohesion: 0.15
Nodes (16): ForgotPasswordPage(), AuthCard(), AuthField(), AuthFieldProps, AuthNotice(), AuthPasswordField(), AuthPasswordFieldProps, AuthShell() (+8 more)

### Community 7 - "types.ts"
Cohesion: 0.11
Nodes (17): AccountDetail, ApiResponse, BalanceResult, BayarGgError, BayarGgPaymentStatus, BayarGgSuccess, BayarGgWebhookPayload, BridgeCreatePaymentPayload (+9 more)

### Community 8 - "[id]/page.tsx"
Cohesion: 0.13
Nodes (23): NotFound(), metadata, PrivacyPage(), ProductDetailContent(), ProductDetailPage(), Terms(), ProductsCatalog(), ProductsContent() (+15 more)

### Community 9 - "Dev Dependencies"
Cohesion: 0.12
Nodes (22): devDependencies, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20, @types/nodemailer@^8.0.1, @types/qrcode@^1.5.6, @types/react@^19, @types/react-dom@^19 (+14 more)

### Community 10 - "next"
Cohesion: 0.14
Nodes (29): POST(), POST(), POST(), POST(), POST(), POST(), POST(), POST() (+21 more)

### Community 11 - "referral.ts"
Cohesion: 0.22
Nodes (24): GET(), POST(), GET(), GET(), getBoolSetting(), getMarkupPercent(), getNumberSetting(), getReferralCommissionPercent() (+16 more)

### Community 12 - "loyalty.ts"
Cohesion: 0.13
Nodes (22): GET(), IN_PROGRESS, GET(), POST(), GET(), findCoupon(), generateCouponCode(), getLoyaltyState() (+14 more)

### Community 13 - "dependencies"
Cohesion: 0.08
Nodes (26): dependencies, @auth/prisma-adapter@^2.11.2, bcryptjs@^3.0.3, dotenv@^17.4.2, lucide-react@^1.3.0, motion@^12.37.0, next@16.2.6, pg@^8.20.0 (+18 more)

### Community 14 - "next"
Cohesion: 0.20
Nodes (13): POST(), GET(), GET(), POST(), GET(), GET(), AdminLayout(), DashboardLayout() (+5 more)

### Community 15 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 16 - "useToast"
Cohesion: 0.13
Nodes (18): fetchLoyalty(), formatPrice(), LoyaltyCard(), LoyaltyResult, EASE, item, Props, clientSnapshot() (+10 more)

### Community 17 - "supplierSync.ts"
Cohesion: 0.18
Nodes (13): GET(), PAID_STATUSES, startOfJakartaDay(), GET(), POST(), warungApi, FulfillOrderResult, processClaimedOrder() (+5 more)

### Community 18 - "inpage.js"
Cohesion: 0.07
Nodes (39): blueprint.json fields, Motion timeline, Outline syntax, Reading a blueprint, Responsive section, Tokens, What counts as a node, Building from a blueprint (+31 more)

### Community 19 - "api.ts"
Cohesion: 0.24
Nodes (7): GET(), HIDDEN_PRODUCT_IDS, getProductsWithStats(), BalanceResponse, OrderPayload, OrderResponse, ProductsResponse

### Community 20 - "Skeleton"
Cohesion: 0.12
Nodes (21): AffiliateData, AffiliatePage(), formatDate(), formatPrice(), METHODS, BalancePage(), handleTopup(), formatPrice() (+13 more)

### Community 21 - "transactions/[orderId]/page.tsx"
Cohesion: 0.13
Nodes (21): AccountDetailsPanel(), AccountGroup, COMPLAINT_STATUSES, complaintMessage(), Credential, CredentialRow(), formatDate(), formatPrice() (+13 more)

### Community 22 - "Route Protection Middleware"
Cohesion: 0.40
Nodes (3): config, PROTECTED, SESSION_COOKIES

### Community 23 - "useToast"
Cohesion: 0.39
Nodes (6): CheckoutContent(), CheckoutPage(), formatPrice(), PaymentMethod, CheckoutSkeleton(), useToast()

### Community 24 - "NPM Scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 25 - "EditorialLanding.tsx"
Cohesion: 0.05
Nodes (47): copy(), CredentialVisual(), EditorialLanding(), minPrice(), PayVisual(), PickVisual(), rupiah, steps (+39 more)

### Community 26 - "match.mjs"
Cohesion: 0.13
Nodes (25): area(), base(), center(), contains(), DEFAULTS, dist(), GROUP, hugs() (+17 more)

### Community 27 - "Caption sounding update: November 2026"
Cohesion: 0.40
Nodes (4): Caption sounding update: November 2026, Teaser promo (kirim 1–2 hari kemudian), Versi lengkap, Versi singkat

### Community 30 - "Caption promo: Beli Claude Pro, gratis Gemini AI Pro"
Cohesion: 0.40
Nodes (4): Caption promo: Beli Claude Pro, gratis Gemini AI Pro, Versi feed (lengkap), Versi santai, Versi story (singkat)

### Community 31 - "auth"
Cohesion: 0.15
Nodes (15): GET(), GET(), GET(), GET(), PATCH(), GET(), getSessionUserId(), mapReview() (+7 more)

### Community 32 - "order/[orderId]/page.tsx"
Cohesion: 0.14
Nodes (18): CopyButton(), formatDate(), formatPrice(), Order, OrderDetailPage(), OrderSummary(), PaymentInstructions(), statusInfo (+10 more)

### Community 33 - "report.mjs"
Cohesion: 0.20
Nodes (24): PROP_NAME, CH_NAME, describeEase(), also(), at(), base(), blueprintMd(), change() (+16 more)

### Community 34 - "prisma.ts"
Cohesion: 0.22
Nodes (13): GET(), POST(), POST(), bayarGg, QRIS_GATEWAY_MAX_AMOUNT, verifyBayarGgWebhookSignature(), creditTopUp(), CreditTopUpResult (+5 more)

### Community 35 - "SettingsView.tsx"
Cohesion: 0.20
Nodes (13): AdminSettingsPage(), Field(), Group(), MethodKey, MethodList, methods, post(), Settings (+5 more)

### Community 36 - "compare"
Cohesion: 0.17
Nodes (18): Capturing each kind of reference, Iframes, canvas, WebGL, Lottie, video backgrounds, Interactions and motion, Live site or local page, Pages behind a login, Screen recordings and GIFs, Screenshots and design exports, launch() (+10 more)

### Community 37 - "order/route.ts"
Cohesion: 0.27
Nodes (11): BalanceTopUp (Prisma model), BalanceTransaction (Prisma model), BalanceTxnType (Prisma enum), Coupon (Prisma model), CouponStatus (Prisma enum), Order (Prisma model), OrderStatus (Prisma enum), ProductReview (Prisma model) (+3 more)

### Community 38 - "Caption WhatsApp — KampusRebahan"
Cohesion: 0.33
Nodes (5): Caption 1 (lengkap), Caption 2 (singkat, untuk status), Caption 3 (ajakan santai di grup), Caption WhatsApp — KampusRebahan, Jargon pilihan

### Community 39 - "[id]/page.tsx"
Cohesion: 0.38
Nodes (5): rupiah, typeIcon(), VariantSelector(), Kartu varian (`VariantSelector`, komponen .pen "VariantCard"), ProductVariant

### Community 40 - "lucide-react"
Cohesion: 0.18
Nodes (15): PaymentCancelContent(), PaymentCancelPage(), StatusIcon(), CheckState, PaymentSuccessContent(), PaymentSuccessPage(), formatPrice(), RefundDialog() (+7 more)

### Community 41 - "[topupId]/page.tsx"
Cohesion: 0.29
Nodes (7): formatPrice(), TopUp, TopUpPaymentPage(), Countdown(), GatewayQr(), RevealItem(), Tag

### Community 42 - "next-auth"
Cohesion: 0.50
Nodes (3): authConfig, next-auth@^5.0.0-beta.31, next-auth

### Community 43 - "replica.mjs"
Cohesion: 0.16
Nodes (21): captureImage(), captureVideo(), vpName(), onsetSettle(), pairSegments(), openLab(), capture(), compareMotion() (+13 more)

### Community 44 - "bayarGg.ts"
Cohesion: 0.25
Nodes (5): TOPUP_MIN_AMOUNT, BayarGgCheckPaymentData, BayarGgCreatePaymentData, BayarGgCreatePaymentPayload, BayarGgResponse

### Community 45 - "motion.mjs"
Cohesion: 0.20
Nodes (18): bezier(), bracket(), CHANNELS, colorDist(), EASINGS, EPS, fitEasing(), hexRgb() (+10 more)

### Community 46 - "lab"
Cohesion: 0.47
Nodes (4): lab(), diffPanel(), label(), sheet()

### Community 47 - "app/layout.tsx"
Cohesion: 0.18
Nodes (10): inter, interTight, metadata, RootLayout(), RefCapture(), NextAuthSessionProvider(), ToastProvider(), WhatsAppButton() (+2 more)

### Community 48 - "capture.mjs"
Cohesion: 0.16
Nodes (12): act(), captureUrl(), EPOCH, pad(), parseAction(), recordMotion(), scrollThrough(), settleNetwork() (+4 more)

### Community 49 - "scripts/package.json"
Cohesion: 0.20
Nodes (10): dependencies, playwright@^1.64.1, engines, node, name, private, scripts, test (+2 more)

### Community 50 - "mailer.ts"
Cohesion: 0.32
Nodes (7): adminNotifyEmail(), escapeHtml(), PaidOrderInfo, sendPaidOrderEmail(), transporter, nodemailer@^7.0.13, nodemailer

### Community 51 - "redeem/route.ts"
Cohesion: 0.67
Nodes (3): CouponUnavailableError, POST(), LOYALTY_REWARD_VARIANT_ID

### Community 52 - "recent-purchases/route.ts"
Cohesion: 0.83
Nodes (3): formatRelativeTime(), GET(), getDisplayName()

### Community 53 - "@radix-ui/react-dropdown-menu"
Cohesion: 0.33
Nodes (4): @prisma/client@^7.8.0, @radix-ui/react-dropdown-menu@^2.1.24, @prisma/client, @radix-ui/react-dropdown-menu

### Community 55 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.2.6, eslint, eslint-config-next

## Ambiguous Edges - Review These
- `getProductsWithStats()` → `Missing Error State on Products Page`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md · relation: conceptually_related_to

## Knowledge Gaps
- **14 isolated node(s):** `{ GET, POST }`, `Setting (Prisma model)`, `BalanceTxnType (Prisma enum)`, `CouponStatus (Prisma enum)`, `TopUpStatus (Prisma enum)` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 294 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `OrdersView.tsx`, `dashboard/page.tsx`, `AdminPopupSettings.tsx`, `InvoiceCheck.tsx`, `Password Reset UI Kit`, `[id]/page.tsx`, `Dev Dependencies`, `next`, `referral.ts`, `loyalty.ts`, `dependencies`, `useToast`, `supplierSync.ts`, `api.ts`, `Skeleton`, `transactions/[orderId]/page.tsx`, `Route Protection Middleware`, `useToast`, `EditorialLanding.tsx`, `auth`, `order/[orderId]/page.tsx`, `prisma.ts`, `SettingsView.tsx`, `lucide-react`, `[topupId]/page.tsx`, `app/layout.tsx`, `redeem/route.ts`, `recent-purchases/route.ts`?**
  _High betweenness centrality (0.269) - this node is a cross-community bridge._
- **What connects `{ GET, POST }`, `Setting (Prisma model)`, `BalanceTxnType (Prisma enum)` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `OrdersView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08143839238498149 - nodes in this community are weakly interconnected._
- **Why does `react` connect `useToast` to `OrdersView.tsx`, `dashboard/page.tsx`, `AdminPopupSettings.tsx`, `InvoiceCheck.tsx`, `Password Reset UI Kit`, `[id]/page.tsx`, `Dev Dependencies`, `dependencies`, `Skeleton`, `transactions/[orderId]/page.tsx`, `useToast`, `EditorialLanding.tsx`, `order/[orderId]/page.tsx`, `SettingsView.tsx`, `[id]/page.tsx`, `lucide-react`, `[topupId]/page.tsx`, `app/layout.tsx`, `GradientBorder.tsx`, `categoryIcons.ts`?**
  _High betweenness centrality (0.140) - this node is a cross-community bridge._
- **Should `dashboard/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08897243107769423 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `OrdersView.tsx`, `dashboard/page.tsx`, `AdminPopupSettings.tsx`, `InvoiceCheck.tsx`, `Password Reset UI Kit`, `[id]/page.tsx`, `Dev Dependencies`, `dependencies`, `useToast`, `Skeleton`, `transactions/[orderId]/page.tsx`, `useToast`, `EditorialLanding.tsx`, `order/[orderId]/page.tsx`, `SettingsView.tsx`, `[id]/page.tsx`, `[topupId]/page.tsx`, `app/layout.tsx`, `categoryIcons.ts`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `getProductsWithStats()` and `Missing Error State on Products Page`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._