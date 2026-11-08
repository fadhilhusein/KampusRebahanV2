# Graph Report - KampusRebahanV2  (2026-11-08)

## Corpus Check
- 201 files · ~96,405 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 2, .ico 2, .css 1)

## Summary
- 1101 nodes · 2868 edges · 62 communities (58 shown, 4 thin omitted)
- Extraction: 97% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 71 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f3fda984`
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
- auth.ts
- referral.ts
- loyalty.ts
- dependencies
- AdminShell.tsx
- TypeScript Config
- LoyaltyCard.tsx
- supplierSync.ts
- inpage.js
- refundPreview.ts
- PayoutsView.tsx
- transactions/[orderId]/page.tsx
- Route Protection Middleware
- Skeleton
- NPM Scripts
- EditorialLanding.tsx
- match.mjs
- Caption sounding update: November 2026
- PostCSS Config
- NextAuth Handlers
- Caption promo: Beli Claude Pro, gratis Gemini AI Pro
- prisma.ts
- order/[orderId]/page.tsx
- report.mjs
- prisma.ts
- SettingsView.tsx
- compare
- order/route.ts
- Caption WhatsApp — KampusRebahan
- admin/page.tsx
- products/page.tsx
- Reveal.tsx
- order/route.ts
- replica.mjs
- referral.ts
- motion.mjs
- lab
- app/layout.tsx
- capture.mjs
- scripts/package.json
- fulfillOrder.ts
- [id]/page.tsx
- recent-purchases/route.ts
- ButtonPrimary.tsx
- POST
- eslint.config.mjs
- categoryIcons.ts
- Badge.tsx
- products.ts
- checkout/page.tsx
- dotenv
- react-dom@19.2.4

## God Nodes (most connected - your core abstractions)
1. `next` - 76 edges
2. `react` - 56 edges
3. `lucide-react` - 48 edges
4. `buttonClass()` - 42 edges
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
- `BalanceTransaction (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/admin/reject/route.ts
- `Order (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/admin/reject/route.ts
- `User (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/auth/register/route.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **User Balance Wallet Ledger (top-up, purchase, refund)** — prisma_schema_user, prisma_schema_balancetopup, prisma_schema_balancetransaction, prisma_schema_balancetxntype, lib_credittopup_credittopup, app_api_balance_topup_route_post [INFERRED 0.85]
- **Order Payment & Fulfillment Lifecycle** — prisma_schema_order, prisma_schema_orderstatus, app_api_order_route_post, app_api_admin_confirm_route_post, app_api_admin_reject_route_post, lib_fulfillorder_fulfillorder, lib_orderstatus_statuslabel [INFERRED 0.85]
- **Password Reset Flow** — prisma_schema_passwordresettoken, prisma_schema_user, app_api_auth_forgot_password_route_post, app_api_auth_reset_password_route_post [INFERRED 0.85]

## Communities (62 total, 4 thin omitted)

### Community 0 - "OrdersView.tsx"
Cohesion: 0.19
Nodes (18): ActionButton(), ActionKind, filters, isRefundable(), isRejectable(), OrderSheet(), primaryAction(), RowProps (+10 more)

### Community 1 - "dashboard/page.tsx"
Cohesion: 0.06
Nodes (59): BalancePage(), handleTopup(), formatPrice(), METHOD_LABEL, PRESET_AMOUNTS, TopupMethod, DashboardHomePage(), formatDate() (+51 more)

### Community 2 - "2. Komponen"
Cohesion: 0.05
Nodes (38): copy(), 1.1 Warna (hanya light; dark mode BELUM didesain), 1.2 Tipografi, 1.3 Radius, 1.4 Bayangan, 1.5 Spacing dan layout, 1.6 Navbar, 1. Design tokens (+30 more)

### Community 3 - "AdminPopupSettings.tsx"
Cohesion: 0.12
Nodes (25): GET(), POST(), GET(), AdminPopupSettings(), formatSaved(), CardProps, InfoPopup(), PopupCard() (+17 more)

### Community 4 - "InvoiceCheck.tsx"
Cohesion: 0.12
Nodes (16): NumberField(), RefundCalculator(), rupiah(), SIM_METHODS, calcCommission(), LOYALTY_HOLD_MS, base, estimateRefund() (+8 more)

### Community 5 - "Docs, Audit & Design Notes"
Cohesion: 0.10
Nodes (22): antislop Audit 001 (2026-09-20), WCAG Contrast Failures (text/placeholder/badge), Design Direction Is Web3 Template, Not KampusRebahan Brand, Two Admin Mechanisms (isAdmin vs ADMIN_EMAILS), Decorative Emoji Icons, Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast), Glass/Glow Overuse Beyond Dose Limit, middleware.ts Deprecated in Next 16 (use proxy.ts) (+14 more)

### Community 6 - "Password Reset UI Kit"
Cohesion: 0.15
Nodes (16): ForgotPasswordPage(), AuthCard(), AuthField(), AuthFieldProps, AuthNotice(), AuthPasswordField(), AuthPasswordFieldProps, AuthShell() (+8 more)

### Community 7 - "types.ts"
Cohesion: 0.13
Nodes (16): HIDDEN_PRODUCT_IDS, AccountDetail, ApiResponse, BalanceResponse, BalanceResult, BayarGgError, BayarGgPaymentStatus, BayarGgSuccess (+8 more)

### Community 8 - "[id]/page.tsx"
Cohesion: 0.15
Nodes (21): NotFound(), PaymentCancelContent(), PaymentCancelPage(), StatusIcon(), CheckState, PaymentSuccessContent(), PaymentSuccessPage(), metadata (+13 more)

### Community 9 - "Dev Dependencies"
Cohesion: 0.12
Nodes (22): devDependencies, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20, @types/nodemailer@^8.0.1, @types/qrcode@^1.5.6, @types/react@^19, @types/react-dom@^19 (+14 more)

### Community 10 - "auth.ts"
Cohesion: 0.15
Nodes (22): POST(), POST(), POST(), POST(), GET(), getSessionUserId(), mapReview(), POST() (+14 more)

### Community 11 - "referral.ts"
Cohesion: 0.36
Nodes (13): POST(), getNumberSetting(), getReferralCommissionPercent(), getReferralMinPayout(), setBankTransferEnabled(), setMarkupPercent(), setQrisBridgeEnabled(), setQrisGatewayEnabled() (+5 more)

### Community 12 - "loyalty.ts"
Cohesion: 0.21
Nodes (13): GET(), IN_PROGRESS, GET(), findCoupon(), generateCouponCode(), getLoyaltyState(), isUniqueViolation(), LOYALTY_REWARD (+5 more)

### Community 13 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, @auth/prisma-adapter@^2.11.2, bcryptjs@^3.0.3, lucide-react@^1.3.0, next@16.2.6, nodemailer@^7.0.13, pg@^8.20.0, @prisma/adapter-pg@^7.8.0 (+17 more)

### Community 14 - "AdminShell.tsx"
Cohesion: 0.23
Nodes (11): AdminLayout(), AdminLoyaltyPage(), AdminPopupPage(), AdminHeader(), AdminShell(), AdminSummary, CountBadge(), isActive() (+3 more)

### Community 15 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 16 - "LoyaltyCard.tsx"
Cohesion: 0.28
Nodes (5): fetchLoyalty(), formatPrice(), LoyaltyCard(), LoyaltyResult, LoyaltyState

### Community 17 - "supplierSync.ts"
Cohesion: 0.18
Nodes (13): GET(), GET(), PAID_STATUSES, startOfJakartaDay(), GET(), POST(), warungApi, creditCommission() (+5 more)

### Community 18 - "inpage.js"
Cohesion: 0.07
Nodes (39): blueprint.json fields, Motion timeline, Outline syntax, Reading a blueprint, Responsive section, Tokens, What counts as a node, Building from a blueprint (+31 more)

### Community 19 - "refundPreview.ts"
Cohesion: 0.22
Nodes (16): GET(), parseOptions(), POST(), GET(), settleLoyaltyOnReject(), creditWallet(), reverseCommission(), estimateOrderRefund() (+8 more)

### Community 20 - "PayoutsView.tsx"
Cohesion: 0.17
Nodes (13): AdminPayoutsPage(), AffiliateData, AffiliatePage(), formatDate(), formatPrice(), METHODS, CopyButton(), Destination() (+5 more)

### Community 21 - "transactions/[orderId]/page.tsx"
Cohesion: 0.12
Nodes (25): AccountDetailsPanel(), AccountGroup, COMPLAINT_STATUSES, complaintMessage(), Credential, CredentialRow(), formatDate(), formatPrice() (+17 more)

### Community 22 - "Route Protection Middleware"
Cohesion: 0.40
Nodes (3): config, PROTECTED, SESSION_COOKIES

### Community 23 - "Skeleton"
Cohesion: 0.27
Nodes (9): formatPrice(), RefundDialog(), todayWib(), CheckoutSkeleton(), ProductDetailSkeleton(), Skeleton(), SkeletonProps, TransactionSkeleton() (+1 more)

### Community 24 - "NPM Scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 25 - "EditorialLanding.tsx"
Cohesion: 0.18
Nodes (12): CredentialVisual(), EditorialLanding(), minPrice(), PayVisual(), PickVisual(), rupiah, steps, logos (+4 more)

### Community 26 - "match.mjs"
Cohesion: 0.13
Nodes (25): area(), base(), center(), contains(), DEFAULTS, dist(), GROUP, hugs() (+17 more)

### Community 27 - "Caption sounding update: November 2026"
Cohesion: 0.40
Nodes (4): Caption sounding update: November 2026, Teaser promo (kirim 1–2 hari kemudian), Versi lengkap, Versi singkat

### Community 30 - "Caption promo: Beli Claude Pro, gratis Gemini AI Pro"
Cohesion: 0.40
Nodes (4): Caption promo: Beli Claude Pro, gratis Gemini AI Pro, Versi feed (lengkap), Versi santai, Versi story (singkat)

### Community 31 - "prisma.ts"
Cohesion: 0.17
Nodes (16): GET(), POST(), GET(), GET(), GET(), GET(), GET(), GET() (+8 more)

### Community 32 - "order/[orderId]/page.tsx"
Cohesion: 0.29
Nodes (10): CopyButton(), formatDate(), formatPrice(), Order, OrderDetailPage(), OrderSummary(), PaymentInstructions(), statusInfo (+2 more)

### Community 33 - "report.mjs"
Cohesion: 0.20
Nodes (24): PROP_NAME, CH_NAME, describeEase(), also(), at(), base(), blueprintMd(), change() (+16 more)

### Community 34 - "prisma.ts"
Cohesion: 0.18
Nodes (14): GET(), POST(), POST(), verifyBayarGgWebhookSignature(), creditTopUp(), CreditTopUpResult, call(), sign() (+6 more)

### Community 35 - "SettingsView.tsx"
Cohesion: 0.20
Nodes (13): AdminSettingsPage(), Field(), Group(), MethodKey, MethodList, methods, post(), Settings (+5 more)

### Community 36 - "compare"
Cohesion: 0.17
Nodes (18): Capturing each kind of reference, Iframes, canvas, WebGL, Lottie, video backgrounds, Interactions and motion, Live site or local page, Pages behind a login, Screen recordings and GIFs, Screenshots and design exports, launch() (+10 more)

### Community 37 - "order/route.ts"
Cohesion: 0.31
Nodes (10): BalanceTopUp (Prisma model), BalanceTransaction (Prisma model), BalanceTxnType (Prisma enum), Coupon (Prisma model), CouponStatus (Prisma enum), Order (Prisma model), ProductReview (Prisma model), TopUpStatus (Prisma enum) (+2 more)

### Community 38 - "Caption WhatsApp — KampusRebahan"
Cohesion: 0.33
Nodes (5): Caption 1 (lengkap), Caption 2 (singkat, untuk status), Caption 3 (ajakan santai di grup), Caption WhatsApp — KampusRebahan, Jargon pilihan

### Community 39 - "admin/page.tsx"
Cohesion: 0.25
Nodes (15): AdminOrdersPage(), ActionRow(), AdminHomePage(), Tile(), today(), useAdminSummary(), MethodIcon(), OrderCard (+7 more)

### Community 40 - "products/page.tsx"
Cohesion: 0.19
Nodes (15): ProductsCatalog(), ProductsContent(), ProductsPage(), Bubble(), Card(), HeroGallery(), ProductCard(), rupiah (+7 more)

### Community 41 - "Reveal.tsx"
Cohesion: 0.11
Nodes (23): formatPrice(), TopUp, TopUpPaymentPage(), Countdown(), GatewayQr(), GradientBorderProps, EASE, item (+15 more)

### Community 42 - "order/route.ts"
Cohesion: 0.19
Nodes (10): bayarGg, QRIS_GATEWAY_MAX_AMOUNT, TOPUP_MIN_AMOUNT, paymentBridge, REF_COOKIE, resolveReferrer(), BayarGgCheckPaymentData, BayarGgCreatePaymentData (+2 more)

### Community 43 - "replica.mjs"
Cohesion: 0.16
Nodes (21): captureImage(), captureVideo(), vpName(), onsetSettle(), pairSegments(), openLab(), capture(), compareMotion() (+13 more)

### Community 44 - "referral.ts"
Cohesion: 0.29
Nodes (11): POST(), GET(), POST(), debitWallet(), generateReferralCode(), getSessionUserId(), isUniqueViolation(), PAYOUT_METHODS (+3 more)

### Community 45 - "motion.mjs"
Cohesion: 0.20
Nodes (18): bezier(), bracket(), CHANNELS, colorDist(), EASINGS, EPS, fitEasing(), hexRgb() (+10 more)

### Community 46 - "lab"
Cohesion: 0.47
Nodes (4): lab(), diffPanel(), label(), sheet()

### Community 47 - "app/layout.tsx"
Cohesion: 0.16
Nodes (12): inter, interTight, metadata, RootLayout(), RefCapture(), NextAuthSessionProvider(), ToastProvider(), WhatsAppButton() (+4 more)

### Community 48 - "capture.mjs"
Cohesion: 0.16
Nodes (12): act(), captureUrl(), EPOCH, pad(), parseAction(), recordMotion(), scrollThrough(), settleNetwork() (+4 more)

### Community 49 - "scripts/package.json"
Cohesion: 0.20
Nodes (10): dependencies, playwright@^1.64.1, engines, node, name, private, scripts, test (+2 more)

### Community 50 - "fulfillOrder.ts"
Cohesion: 0.18
Nodes (12): POST(), CouponUnavailableError, POST(), fulfillOrder(), FulfillOrderResult, processClaimedOrder(), LOYALTY_REWARD_VARIANT_ID, adminNotifyEmail() (+4 more)

### Community 51 - "[id]/page.tsx"
Cohesion: 0.25
Nodes (10): ProductDetailContent(), ProductDetailPage(), Terms(), rupiah, typeIcon(), VariantSelector(), Badge(), RatingStars() (+2 more)

### Community 52 - "recent-purchases/route.ts"
Cohesion: 0.83
Nodes (3): formatRelativeTime(), GET(), getDisplayName()

### Community 53 - "ButtonPrimary.tsx"
Cohesion: 0.21
Nodes (9): dateTime(), Estimate, InvoiceCheck(), rupiah(), todayWib(), ButtonPrimaryProps, Size, Variant (+1 more)

### Community 54 - "POST"
Cohesion: 0.42
Nodes (10): GET(), POST(), POST(), GET(), getBoolSetting(), isBankTransferEnabled(), isQrisBridgeEnabled(), isQrisGatewayEnabled() (+2 more)

### Community 55 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.2.6, eslint, eslint-config-next

### Community 57 - "Badge.tsx"
Cohesion: 0.24
Nodes (8): AdminLoyalty(), filters, formatDate(), formatPrice(), Row, stateInfo, BadgeProps, colors

### Community 58 - "products.ts"
Cohesion: 0.36
Nodes (6): GET(), HomePage(), revalidate, getProductsWithStats(), getMarkupPercent(), Setting (Prisma model)

### Community 59 - "checkout/page.tsx"
Cohesion: 0.47
Nodes (4): CheckoutContent(), CheckoutPage(), formatPrice(), PaymentMethod

### Community 60 - "dotenv"
Cohesion: 0.40
Nodes (4): dotenv@^17.4.2, prisma@^7.8.0, dotenv, prisma

## Ambiguous Edges - Review These
- `getProductsWithStats()` → `Missing Error State on Products Page`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md · relation: conceptually_related_to

## Knowledge Gaps
- **14 isolated node(s):** `{ GET, POST }`, `Setting (Prisma model)`, `BalanceTxnType (Prisma enum)`, `CouponStatus (Prisma enum)`, `TopUpStatus (Prisma enum)` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 293 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `[id]/page.tsx` to `OrdersView.tsx`, `dashboard/page.tsx`, `AdminPopupSettings.tsx`, `Password Reset UI Kit`, `Dev Dependencies`, `auth.ts`, `referral.ts`, `loyalty.ts`, `dependencies`, `AdminShell.tsx`, `LoyaltyCard.tsx`, `supplierSync.ts`, `refundPreview.ts`, `transactions/[orderId]/page.tsx`, `Route Protection Middleware`, `EditorialLanding.tsx`, `prisma.ts`, `order/[orderId]/page.tsx`, `prisma.ts`, `SettingsView.tsx`, `admin/page.tsx`, `products/page.tsx`, `Reveal.tsx`, `order/route.ts`, `referral.ts`, `app/layout.tsx`, `fulfillOrder.ts`, `[id]/page.tsx`, `recent-purchases/route.ts`, `ButtonPrimary.tsx`, `POST`, `products.ts`, `checkout/page.tsx`?**
  _High betweenness centrality (0.251) - this node is a cross-community bridge._
- **What connects `{ GET, POST }`, `Setting (Prisma model)`, `BalanceTxnType (Prisma enum)` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dashboard/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06127206127206127 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Reveal.tsx` to `OrdersView.tsx`, `dashboard/page.tsx`, `AdminPopupSettings.tsx`, `InvoiceCheck.tsx`, `Password Reset UI Kit`, `[id]/page.tsx`, `Dev Dependencies`, `dependencies`, `AdminShell.tsx`, `LoyaltyCard.tsx`, `PayoutsView.tsx`, `transactions/[orderId]/page.tsx`, `Skeleton`, `EditorialLanding.tsx`, `order/[orderId]/page.tsx`, `SettingsView.tsx`, `products/page.tsx`, `app/layout.tsx`, `[id]/page.tsx`, `ButtonPrimary.tsx`, `categoryIcons.ts`, `Badge.tsx`, `checkout/page.tsx`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **Should `2. Komponen` be split into smaller, more focused modules?**
  _Cohesion score 0.05398110661268556 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `[id]/page.tsx` to `OrdersView.tsx`, `dashboard/page.tsx`, `AdminPopupSettings.tsx`, `Password Reset UI Kit`, `Dev Dependencies`, `dependencies`, `AdminShell.tsx`, `LoyaltyCard.tsx`, `PayoutsView.tsx`, `transactions/[orderId]/page.tsx`, `Skeleton`, `EditorialLanding.tsx`, `order/[orderId]/page.tsx`, `SettingsView.tsx`, `admin/page.tsx`, `products/page.tsx`, `Reveal.tsx`, `[id]/page.tsx`, `ButtonPrimary.tsx`, `categoryIcons.ts`, `checkout/page.tsx`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `getProductsWithStats()` and `Missing Error State on Products Page`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._