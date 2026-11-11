# Graph Report - KampusRebahanV2  (2026-11-09)

## Corpus Check
- 210 files · ~101,157 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 2, .ico 2, .pen 2)

## Summary
- 1147 nodes · 3059 edges · 53 communities (48 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 71 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9c077f13`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- OrdersView.tsx
- dashboard/page.tsx
- 2. Komponen
- AdminPopupSettings.tsx
- loyalty.ts
- Docs, Audit & Design Notes
- ButtonPrimary.tsx
- types.ts
- products.ts
- Dev Dependencies
- auth.ts
- settings.ts
- react
- dependencies
- mailer.ts
- TypeScript Config
- prisma.ts
- supplierSync.ts
- PayoutsView.tsx
- inpage.js
- transactions/[orderId]/page.tsx
- referral.ts
- Route Protection Middleware
- Skeleton
- NPM Scripts
- match.mjs
- AdminShell.tsx
- Caption sounding update: November 2026
- PostCSS Config
- NextAuth Handlers
- Caption promo: Beli Claude Pro, gratis Gemini AI Pro
- auth
- order/[orderId]/page.tsx
- replica.mjs
- report.mjs
- SettingsView.tsx
- Badge
- balance/page.tsx
- Caption WhatsApp — KampusRebahan
- motion.mjs
- lucide-react
- @prisma/adapter-pg
- GradientBorder.tsx
- nodemailer
- compare
- three@^0.186.0
- lab
- app/layout.tsx
- capture.mjs
- scripts/package.json
- Order (Prisma model)
- eslint.config.mjs
- dotenv

## God Nodes (most connected - your core abstractions)
1. `next` - 79 edges
2. `react` - 58 edges
3. `lucide-react` - 50 edges
4. `buttonClass()` - 44 edges
5. `prisma` - 42 edges
6. `Skeleton()` - 37 edges
7. `requireAdmin()` - 34 edges
8. `auth` - 34 edges
9. `compare()` - 28 edges
10. `Navbar()` - 27 edges

## Surprising Connections (you probably didn't know these)
- `Missing Error State on Products Page` --conceptually_related_to--> `getProductsWithStats()`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md → lib/products.ts
- `3.5 Pembayaran QRIS → `/order/[orderId]` (status pending)` --references--> `GatewayQr()`  [INFERRED]
  design/SPEC.md → components/payment/GatewayQr.tsx
- `3.11 Legal` --references--> `LegalArticle()`  [INFERRED]
  design/SPEC.md → components/layout/LegalArticle.tsx
- `User (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/auth/register/route.ts
- `BalanceTopUp (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/balance/topup/route.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **User Balance Wallet Ledger (top-up, purchase, refund)** — prisma_schema_user, prisma_schema_balancetopup, prisma_schema_balancetransaction, prisma_schema_balancetxntype, lib_credittopup_credittopup, app_api_balance_topup_route_post [INFERRED 0.85]
- **Order Payment & Fulfillment Lifecycle** — prisma_schema_order, prisma_schema_orderstatus, app_api_order_route_post, app_api_admin_confirm_route_post, app_api_admin_reject_route_post, lib_fulfillorder_fulfillorder, lib_orderstatus_statuslabel [INFERRED 0.85]
- **Password Reset Flow** — prisma_schema_passwordresettoken, prisma_schema_user, app_api_auth_forgot_password_route_post, app_api_auth_reset_password_route_post [INFERRED 0.85]

## Communities (53 total, 5 thin omitted)

### Community 0 - "OrdersView.tsx"
Cohesion: 0.18
Nodes (24): ActionButton(), ActionKind, filters, isRefundable(), isRejectable(), MethodIcon(), OrderCard, OrderRow (+16 more)

### Community 1 - "dashboard/page.tsx"
Cohesion: 0.06
Nodes (53): DashboardHomePage(), formatDate(), formatPrice(), StatCard(), BalanceHistoryTable(), formatDate(), formatPrice(), typeInfo (+45 more)

### Community 2 - "2. Komponen"
Cohesion: 0.05
Nodes (38): copy(), 1.1 Warna (hanya light; dark mode BELUM didesain), 1.2 Tipografi, 1.3 Radius, 1.4 Bayangan, 1.5 Spacing dan layout, 1.6 Navbar, 1. Design tokens (+30 more)

### Community 3 - "AdminPopupSettings.tsx"
Cohesion: 0.11
Nodes (26): GET(), POST(), GET(), AdminPopupPage(), AdminPopupSettings(), formatSaved(), CardProps, InfoPopup() (+18 more)

### Community 4 - "loyalty.ts"
Cohesion: 0.06
Nodes (50): GET(), IN_PROGRESS, GET(), parseOptions(), POST(), dateTime(), Estimate, InvoiceCheck() (+42 more)

### Community 5 - "Docs, Audit & Design Notes"
Cohesion: 0.10
Nodes (22): antislop Audit 001 (2026-09-20), WCAG Contrast Failures (text/placeholder/badge), Design Direction Is Web3 Template, Not KampusRebahan Brand, Two Admin Mechanisms (isAdmin vs ADMIN_EMAILS), Decorative Emoji Icons, Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast), Glass/Glow Overuse Beyond Dose Limit, middleware.ts Deprecated in Next 16 (use proxy.ts) (+14 more)

### Community 6 - "ButtonPrimary.tsx"
Cohesion: 0.05
Nodes (53): ForgotPasswordPage(), NotFound(), PaymentCancelContent(), PaymentCancelPage(), StatusIcon(), CheckState, PaymentSuccessContent(), PaymentSuccessPage() (+45 more)

### Community 7 - "types.ts"
Cohesion: 0.07
Nodes (33): POST(), HIDDEN_PRODUCT_IDS, bayarGg, QRIS_GATEWAY_MAX_AMOUNT, TOPUP_MIN_AMOUNT, call(), paymentBridge, sign() (+25 more)

### Community 8 - "products.ts"
Cohesion: 0.16
Nodes (15): GET(), HomePage(), revalidate, getProductsWithStats(), supplierProducts(), Db, openUnpaidOrder(), reservedByVariant() (+7 more)

### Community 9 - "Dev Dependencies"
Cohesion: 0.12
Nodes (22): devDependencies, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20, @types/nodemailer@^8.0.1, @types/qrcode@^1.5.6, @types/react@^19, @types/react-dom@^19 (+14 more)

### Community 10 - "auth.ts"
Cohesion: 0.18
Nodes (22): POST(), POST(), POST(), POST(), POST(), POST(), GET(), GET() (+14 more)

### Community 11 - "settings.ts"
Cohesion: 0.22
Nodes (24): GET(), POST(), GET(), GET(), getBoolSetting(), getMarkupPercent(), getNumberSetting(), getReferralCommissionPercent() (+16 more)

### Community 12 - "react"
Cohesion: 0.18
Nodes (16): formatPrice(), TopUp, TopUpPaymentPage(), Countdown(), GatewayQr(), EASE, item, Props (+8 more)

### Community 13 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, @auth/prisma-adapter@^2.11.2, bcryptjs@^3.0.3, lucide-react@^1.3.0, next@16.2.6, next-themes@^0.4.6, pg@^8.20.0, @prisma/client@^7.8.0 (+13 more)

### Community 14 - "mailer.ts"
Cohesion: 0.31
Nodes (7): FulfillOrderResult, processClaimedOrder(), adminNotifyEmail(), escapeHtml(), PaidOrderInfo, sendPaidOrderEmail(), transporter

### Community 15 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 16 - "prisma.ts"
Cohesion: 0.11
Nodes (18): GET(), GET(), GET(), GET(), formatRelativeTime(), GET(), getDisplayName(), POST() (+10 more)

### Community 17 - "supplierSync.ts"
Cohesion: 0.17
Nodes (14): GET(), GET(), PAID_STATUSES, startOfJakartaDay(), GET(), GET(), POST(), warungApi (+6 more)

### Community 18 - "PayoutsView.tsx"
Cohesion: 0.16
Nodes (14): AdminPayoutsPage(), AffiliateData, AffiliatePage(), formatDate(), formatPrice(), METHODS, CopyButton(), Destination() (+6 more)

### Community 19 - "inpage.js"
Cohesion: 0.07
Nodes (39): blueprint.json fields, Motion timeline, Outline syntax, Reading a blueprint, Responsive section, Tokens, What counts as a node, Building from a blueprint (+31 more)

### Community 20 - "transactions/[orderId]/page.tsx"
Cohesion: 0.16
Nodes (18): AccountDetailsPanel(), AccountGroup, COMPLAINT_STATUSES, complaintMessage(), Credential, CredentialRow(), formatDate(), formatPrice() (+10 more)

### Community 21 - "referral.ts"
Cohesion: 0.17
Nodes (17): GET(), POST(), OUT_OF_STOCK(), POST(), POST(), creditWallet(), debitWallet(), generateReferralCode() (+9 more)

### Community 22 - "Route Protection Middleware"
Cohesion: 0.40
Nodes (3): config, PROTECTED, SESSION_COOKIES

### Community 23 - "Skeleton"
Cohesion: 0.23
Nodes (10): AdminOrdersPage(), OrdersView(), formatPrice(), RefundDialog(), todayWib(), buttonClass(), Skeleton(), SkeletonProps (+2 more)

### Community 24 - "NPM Scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 25 - "match.mjs"
Cohesion: 0.13
Nodes (25): area(), base(), center(), contains(), DEFAULTS, dist(), GROUP, hugs() (+17 more)

### Community 26 - "AdminShell.tsx"
Cohesion: 0.23
Nodes (14): ActionRow(), AdminHomePage(), Tile(), today(), AdminHeader(), AdminShell(), AdminSummary, CountBadge() (+6 more)

### Community 27 - "Caption sounding update: November 2026"
Cohesion: 0.40
Nodes (4): Caption sounding update: November 2026, Teaser promo (kirim 1–2 hari kemudian), Versi lengkap, Versi singkat

### Community 30 - "Caption promo: Beli Claude Pro, gratis Gemini AI Pro"
Cohesion: 0.40
Nodes (4): Caption promo: Beli Claude Pro, gratis Gemini AI Pro, Versi feed (lengkap), Versi santai, Versi story (singkat)

### Community 31 - "auth"
Cohesion: 0.26
Nodes (13): POST(), GET(), GET(), expireStaleBankTransfer(), GET(), PATCH(), AdminLayout(), DashboardLayout() (+5 more)

### Community 32 - "order/[orderId]/page.tsx"
Cohesion: 0.16
Nodes (17): CopyButton(), formatDate(), formatPrice(), Order, OrderDetailPage(), OrderSummary(), PaymentInstructions(), statusInfo (+9 more)

### Community 33 - "replica.mjs"
Cohesion: 0.16
Nodes (21): captureImage(), captureVideo(), vpName(), onsetSettle(), pairSegments(), openLab(), capture(), compareMotion() (+13 more)

### Community 34 - "report.mjs"
Cohesion: 0.20
Nodes (24): PROP_NAME, CH_NAME, describeEase(), also(), at(), base(), blueprintMd(), change() (+16 more)

### Community 35 - "SettingsView.tsx"
Cohesion: 0.20
Nodes (13): AdminSettingsPage(), Field(), Group(), MethodKey, MethodList, methods, post(), Settings (+5 more)

### Community 36 - "Badge"
Cohesion: 0.23
Nodes (10): AdminLoyaltyPage(), AdminLoyalty(), filters, formatDate(), formatPrice(), Row, stateInfo, Badge() (+2 more)

### Community 37 - "balance/page.tsx"
Cohesion: 0.23
Nodes (10): BalancePage(), handleTopup(), formatPrice(), METHOD_LABEL, PRESET_AMOUNTS, TopupMethod, TransactionsPage(), BalanceTransaction (+2 more)

### Community 38 - "Caption WhatsApp — KampusRebahan"
Cohesion: 0.33
Nodes (5): Caption 1 (lengkap), Caption 2 (singkat, untuk status), Caption 3 (ajakan santai di grup), Caption WhatsApp — KampusRebahan, Jargon pilihan

### Community 39 - "motion.mjs"
Cohesion: 0.20
Nodes (18): bezier(), bracket(), CHANNELS, colorDist(), EASINGS, EPS, fitEasing(), hexRgb() (+10 more)

### Community 40 - "lucide-react"
Cohesion: 0.06
Nodes (55): CheckoutContent(), CheckoutPage(), formatPrice(), PaymentMethod, ProductDetailContent(), ProductDetailPage(), Terms(), CredentialVisual() (+47 more)

### Community 41 - "@prisma/adapter-pg"
Cohesion: 0.33
Nodes (4): @prisma/adapter-pg@^7.8.0, @radix-ui/react-dropdown-menu@^2.1.24, @prisma/adapter-pg, @radix-ui/react-dropdown-menu

### Community 44 - "compare"
Cohesion: 0.17
Nodes (18): Capturing each kind of reference, Iframes, canvas, WebGL, Lottie, video backgrounds, Interactions and motion, Live site or local page, Pages behind a login, Screen recordings and GIFs, Screenshots and design exports, launch() (+10 more)

### Community 46 - "lab"
Cohesion: 0.47
Nodes (4): lab(), diffPanel(), label(), sheet()

### Community 47 - "app/layout.tsx"
Cohesion: 0.24
Nodes (8): inter, interTight, metadata, RootLayout(), RefCapture(), NextAuthSessionProvider(), ToastProvider(), WhatsAppButton()

### Community 49 - "capture.mjs"
Cohesion: 0.16
Nodes (12): act(), captureUrl(), EPOCH, pad(), parseAction(), recordMotion(), scrollThrough(), settleNetwork() (+4 more)

### Community 51 - "scripts/package.json"
Cohesion: 0.20
Nodes (10): dependencies, playwright@^1.64.1, engines, node, name, private, scripts, test (+2 more)

### Community 52 - "Order (Prisma model)"
Cohesion: 0.22
Nodes (13): CouponUnavailableError, POST(), withStockLock(), BalanceTopUp (Prisma model), BalanceTransaction (Prisma model), BalanceTxnType (Prisma enum), Coupon (Prisma model), CouponStatus (Prisma enum) (+5 more)

### Community 55 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.2.6, eslint, eslint-config-next

### Community 60 - "dotenv"
Cohesion: 0.40
Nodes (4): dotenv@^17.4.2, prisma@^7.8.0, dotenv, prisma

## Ambiguous Edges - Review These
- `getProductsWithStats()` → `Missing Error State on Products Page`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md · relation: conceptually_related_to

## Knowledge Gaps
- **14 isolated node(s):** `{ GET, POST }`, `Setting (Prisma model)`, `Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast)`, `Promised Voucher Feature Missing in Checkout`, `Tap Targets Under 44px` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 306 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `auth.ts` to `OrdersView.tsx`, `dashboard/page.tsx`, `AdminPopupSettings.tsx`, `loyalty.ts`, `ButtonPrimary.tsx`, `types.ts`, `products.ts`, `Dev Dependencies`, `settings.ts`, `react`, `dependencies`, `prisma.ts`, `supplierSync.ts`, `transactions/[orderId]/page.tsx`, `referral.ts`, `Route Protection Middleware`, `AdminShell.tsx`, `auth`, `order/[orderId]/page.tsx`, `SettingsView.tsx`, `balance/page.tsx`, `lucide-react`, `app/layout.tsx`, `Order (Prisma model)`?**
  _High betweenness centrality (0.255) - this node is a cross-community bridge._
- **What connects `{ GET, POST }`, `Setting (Prisma model)`, `Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast)` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dashboard/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0649452269170579 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `order/[orderId]/page.tsx`, `dashboard/page.tsx`, `OrdersView.tsx`, `SettingsView.tsx`, `loyalty.ts`, `balance/page.tsx`, `ButtonPrimary.tsx`, `Badge`, `lucide-react`, `AdminPopupSettings.tsx`, `GradientBorder.tsx`, `Dev Dependencies`, `dependencies`, `app/layout.tsx`, `PayoutsView.tsx`, `transactions/[orderId]/page.tsx`, `Skeleton`, `AdminShell.tsx`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Should `2. Komponen` be split into smaller, more focused modules?**
  _Cohesion score 0.05398110661268556 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `order/[orderId]/page.tsx`, `dashboard/page.tsx`, `OrdersView.tsx`, `AdminPopupSettings.tsx`, `loyalty.ts`, `balance/page.tsx`, `ButtonPrimary.tsx`, `SettingsView.tsx`, `Dev Dependencies`, `react`, `dependencies`, `app/layout.tsx`, `PayoutsView.tsx`, `transactions/[orderId]/page.tsx`, `Skeleton`, `AdminShell.tsx`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `getProductsWithStats()` and `Missing Error State on Products Page`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._