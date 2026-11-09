# Graph Report - KampusRebahanV2  (2026-11-09)

## Corpus Check
- 206 files · ~98,663 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 2, .ico 2, .pen 2)

## Summary
- 1127 nodes · 2989 edges · 53 communities (51 shown, 2 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 71 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `df3280cb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- OrdersView.tsx
- dashboard/page.tsx
- 2. Komponen
- AdminPopupSettings.tsx
- loyalty.ts
- Docs, Audit & Design Notes
- Password Reset UI Kit
- types.ts
- [id]/page.tsx
- Dev Dependencies
- auth.ts
- settings.ts
- [id]/page.tsx
- dependencies
- mailer.ts
- TypeScript Config
- prisma.ts
- auth
- affiliate/page.tsx
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
- prisma
- order/[orderId]/page.tsx
- replica.mjs
- report.mjs
- SettingsView.tsx
- PayoutsView.tsx
- ThemeToggle.tsx
- Caption WhatsApp — KampusRebahan
- motion.mjs
- lucide-react
- DashboardFrame.tsx
- react
- recent-purchases/route.ts
- compare
- lab
- app/layout.tsx
- capture.mjs
- ButtonPrimary.tsx
- scripts/package.json
- Order (Prisma model)
- eslint.config.mjs
- dotenv

## God Nodes (most connected - your core abstractions)
1. `next` - 77 edges
2. `react` - 56 edges
3. `lucide-react` - 48 edges
4. `buttonClass()` - 42 edges
5. `prisma` - 42 edges
6. `Skeleton()` - 37 edges
7. `requireAdmin()` - 34 edges
8. `auth` - 34 edges
9. `Navbar()` - 29 edges
10. `compare()` - 28 edges

## Surprising Connections (you probably didn't know these)
- `Missing Error State on Products Page` --conceptually_related_to--> `getProductsWithStats()`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md → lib/products.ts
- `3.5 Pembayaran QRIS → `/order/[orderId]` (status pending)` --references--> `GatewayQr()`  [INFERRED]
  design/SPEC.md → components/payment/GatewayQr.tsx
- `3.11 Legal` --references--> `LegalArticle()`  [INFERRED]
  design/SPEC.md → components/layout/LegalArticle.tsx
- `ProductReview (Prisma model)` --shares_data_with--> `getProductsWithStats()`  [INFERRED]
  prisma/schema.prisma → lib/products.ts
- `User (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/auth/register/route.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **User Balance Wallet Ledger (top-up, purchase, refund)** — prisma_schema_user, prisma_schema_balancetopup, prisma_schema_balancetransaction, prisma_schema_balancetxntype, lib_credittopup_credittopup, app_api_balance_topup_route_post [INFERRED 0.85]
- **Order Payment & Fulfillment Lifecycle** — prisma_schema_order, prisma_schema_orderstatus, app_api_order_route_post, app_api_admin_confirm_route_post, app_api_admin_reject_route_post, lib_fulfillorder_fulfillorder, lib_orderstatus_statuslabel [INFERRED 0.85]
- **Password Reset Flow** — prisma_schema_passwordresettoken, prisma_schema_user, app_api_auth_forgot_password_route_post, app_api_auth_reset_password_route_post [INFERRED 0.85]

## Communities (53 total, 2 thin omitted)

### Community 0 - "OrdersView.tsx"
Cohesion: 0.17
Nodes (25): ActionButton(), ActionKind, filters, isRefundable(), isRejectable(), MethodIcon(), OrderCard, OrderRow (+17 more)

### Community 1 - "dashboard/page.tsx"
Cohesion: 0.08
Nodes (47): DashboardHomePage(), formatDate(), formatPrice(), StatCard(), TransactionsPage(), BalanceHistoryTable(), formatDate(), formatPrice() (+39 more)

### Community 2 - "2. Komponen"
Cohesion: 0.05
Nodes (38): copy(), 1.1 Warna (hanya light; dark mode BELUM didesain), 1.2 Tipografi, 1.3 Radius, 1.4 Bayangan, 1.5 Spacing dan layout, 1.6 Navbar, 1. Design tokens (+30 more)

### Community 3 - "AdminPopupSettings.tsx"
Cohesion: 0.09
Nodes (29): GET(), POST(), GET(), AdminPopupPage(), HomePage(), revalidate, AdminPopupSettings(), formatSaved() (+21 more)

### Community 4 - "loyalty.ts"
Cohesion: 0.06
Nodes (49): GET(), IN_PROGRESS, GET(), parseOptions(), POST(), dateTime(), Estimate, InvoiceCheck() (+41 more)

### Community 5 - "Docs, Audit & Design Notes"
Cohesion: 0.10
Nodes (22): antislop Audit 001 (2026-09-20), WCAG Contrast Failures (text/placeholder/badge), Design Direction Is Web3 Template, Not KampusRebahan Brand, Two Admin Mechanisms (isAdmin vs ADMIN_EMAILS), Decorative Emoji Icons, Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast), Glass/Glow Overuse Beyond Dose Limit, middleware.ts Deprecated in Next 16 (use proxy.ts) (+14 more)

### Community 6 - "Password Reset UI Kit"
Cohesion: 0.15
Nodes (16): ForgotPasswordPage(), AuthCard(), AuthField(), AuthFieldProps, AuthNotice(), AuthPasswordField(), AuthPasswordFieldProps, AuthShell() (+8 more)

### Community 7 - "types.ts"
Cohesion: 0.08
Nodes (27): HIDDEN_PRODUCT_IDS, call(), sign(), AccountDetail, ApiResponse, BalanceResponse, BalanceResult, BayarGgCheckPaymentData (+19 more)

### Community 8 - "[id]/page.tsx"
Cohesion: 0.15
Nodes (21): CheckoutContent(), CheckoutPage(), formatPrice(), PaymentMethod, NotFound(), PaymentCancelContent(), PaymentCancelPage(), StatusIcon() (+13 more)

### Community 9 - "Dev Dependencies"
Cohesion: 0.12
Nodes (22): devDependencies, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20, @types/nodemailer@^8.0.1, @types/qrcode@^1.5.6, @types/react@^19, @types/react-dom@^19 (+14 more)

### Community 10 - "auth.ts"
Cohesion: 0.17
Nodes (23): POST(), POST(), POST(), POST(), POST(), POST(), GET(), GET() (+15 more)

### Community 11 - "settings.ts"
Cohesion: 0.11
Nodes (33): GET(), POST(), GET(), GET(), getProductsWithStats(), supplierProducts(), getBoolSetting(), getMarkupPercent() (+25 more)

### Community 12 - "[id]/page.tsx"
Cohesion: 0.26
Nodes (10): ProductDetailContent(), ProductDetailPage(), Terms(), rupiah, typeIcon(), VariantSelector(), ProductDetailSkeleton(), Kartu varian (`VariantSelector`, komponen .pen "VariantCard") (+2 more)

### Community 13 - "dependencies"
Cohesion: 0.07
Nodes (28): dependencies, @auth/prisma-adapter@^2.11.2, bcryptjs@^3.0.3, lucide-react@^1.3.0, motion@^12.37.0, next@16.2.6, nodemailer@^7.0.13, pg@^8.20.0 (+20 more)

### Community 14 - "mailer.ts"
Cohesion: 0.47
Nodes (5): adminNotifyEmail(), escapeHtml(), PaidOrderInfo, sendPaidOrderEmail(), transporter

### Community 15 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 16 - "prisma.ts"
Cohesion: 0.14
Nodes (9): GET(), GET(), GET(), authConfig, handlers, RateLimited, signIn, signOut (+1 more)

### Community 17 - "auth"
Cohesion: 0.12
Nodes (26): POST(), GET(), GET(), POST(), GET(), PAID_STATUSES, startOfJakartaDay(), GET() (+18 more)

### Community 18 - "affiliate/page.tsx"
Cohesion: 0.10
Nodes (25): AffiliateData, AffiliatePage(), formatDate(), formatPrice(), METHODS, BalancePage(), handleTopup(), formatPrice() (+17 more)

### Community 19 - "inpage.js"
Cohesion: 0.07
Nodes (39): blueprint.json fields, Motion timeline, Outline syntax, Reading a blueprint, Responsive section, Tokens, What counts as a node, Building from a blueprint (+31 more)

### Community 20 - "transactions/[orderId]/page.tsx"
Cohesion: 0.12
Nodes (24): AccountDetailsPanel(), AccountGroup, COMPLAINT_STATUSES, complaintMessage(), Credential, CredentialRow(), formatDate(), formatPrice() (+16 more)

### Community 21 - "referral.ts"
Cohesion: 0.15
Nodes (21): OUT_OF_STOCK(), POST(), GET(), POST(), FulfillOrderResult, processClaimedOrder(), creditCommission(), debitWallet() (+13 more)

### Community 22 - "Route Protection Middleware"
Cohesion: 0.40
Nodes (3): config, PROTECTED, SESSION_COOKIES

### Community 23 - "Skeleton"
Cohesion: 0.16
Nodes (15): AdminOrdersPage(), OrdersView(), AdminLoyalty(), filters, formatDate(), formatPrice(), Row, stateInfo (+7 more)

### Community 24 - "NPM Scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 25 - "match.mjs"
Cohesion: 0.13
Nodes (25): area(), base(), center(), contains(), DEFAULTS, dist(), GROUP, hugs() (+17 more)

### Community 26 - "AdminShell.tsx"
Cohesion: 0.21
Nodes (15): AdminLoyaltyPage(), ActionRow(), AdminHomePage(), Tile(), today(), AdminHeader(), AdminShell(), AdminSummary (+7 more)

### Community 27 - "Caption sounding update: November 2026"
Cohesion: 0.40
Nodes (4): Caption sounding update: November 2026, Teaser promo (kirim 1–2 hari kemudian), Versi lengkap, Versi singkat

### Community 30 - "Caption promo: Beli Claude Pro, gratis Gemini AI Pro"
Cohesion: 0.40
Nodes (4): Caption promo: Beli Claude Pro, gratis Gemini AI Pro, Versi feed (lengkap), Versi santai, Versi story (singkat)

### Community 31 - "prisma"
Cohesion: 0.18
Nodes (15): GET(), GET(), GET(), POST(), POST(), bayarGg, QRIS_GATEWAY_MAX_AMOUNT, TOPUP_MIN_AMOUNT (+7 more)

### Community 32 - "order/[orderId]/page.tsx"
Cohesion: 0.19
Nodes (15): formatPrice(), TopUp, TopUpPaymentPage(), CopyButton(), formatDate(), formatPrice(), Order, OrderDetailPage() (+7 more)

### Community 33 - "replica.mjs"
Cohesion: 0.16
Nodes (21): captureImage(), captureVideo(), vpName(), onsetSettle(), pairSegments(), openLab(), capture(), compareMotion() (+13 more)

### Community 34 - "report.mjs"
Cohesion: 0.20
Nodes (24): PROP_NAME, CH_NAME, describeEase(), also(), at(), base(), blueprintMd(), change() (+16 more)

### Community 35 - "SettingsView.tsx"
Cohesion: 0.20
Nodes (13): AdminSettingsPage(), Field(), Group(), MethodKey, MethodList, methods, post(), Settings (+5 more)

### Community 36 - "PayoutsView.tsx"
Cohesion: 0.27
Nodes (9): AdminPayoutsPage(), CopyButton(), Destination(), Payout, PayoutsView(), Badge(), BadgeProps, colors (+1 more)

### Community 37 - "ThemeToggle.tsx"
Cohesion: 0.70
Nodes (4): clientSnapshot(), serverSnapshot(), subscribe(), ThemeToggle()

### Community 38 - "Caption WhatsApp — KampusRebahan"
Cohesion: 0.33
Nodes (5): Caption 1 (lengkap), Caption 2 (singkat, untuk status), Caption 3 (ajakan santai di grup), Caption WhatsApp — KampusRebahan, Jargon pilihan

### Community 39 - "motion.mjs"
Cohesion: 0.20
Nodes (18): bezier(), bracket(), CHANNELS, colorDist(), EASINGS, EPS, fitEasing(), hexRgb() (+10 more)

### Community 40 - "lucide-react"
Cohesion: 0.14
Nodes (22): CredentialVisual(), EditorialLanding(), minPrice(), PayVisual(), PickVisual(), rupiah, steps, Bubble() (+14 more)

### Community 41 - "DashboardFrame.tsx"
Cohesion: 0.20
Nodes (10): DashboardUserContext, SidebarUser, accountItems, adminItem, DashboardBottomBar(), DashboardSidebar(), Item, useNav() (+2 more)

### Community 42 - "react"
Cohesion: 0.18
Nodes (6): formatRelativeTime(), RecentPurchase, RecentPurchaseBanner(), GradientBorderProps, iconMap, react

### Community 43 - "recent-purchases/route.ts"
Cohesion: 0.83
Nodes (3): formatRelativeTime(), GET(), getDisplayName()

### Community 44 - "compare"
Cohesion: 0.17
Nodes (18): Capturing each kind of reference, Iframes, canvas, WebGL, Lottie, video backgrounds, Interactions and motion, Live site or local page, Pages behind a login, Screen recordings and GIFs, Screenshots and design exports, launch() (+10 more)

### Community 46 - "lab"
Cohesion: 0.47
Nodes (4): lab(), diffPanel(), label(), sheet()

### Community 47 - "app/layout.tsx"
Cohesion: 0.20
Nodes (10): inter, interTight, metadata, RootLayout(), RefCapture(), NextAuthSessionProvider(), ToastProvider(), WhatsAppButton() (+2 more)

### Community 49 - "capture.mjs"
Cohesion: 0.16
Nodes (12): act(), captureUrl(), EPOCH, pad(), parseAction(), recordMotion(), scrollThrough(), settleNetwork() (+4 more)

### Community 50 - "ButtonPrimary.tsx"
Cohesion: 0.14
Nodes (13): ProductsCatalog(), ProductsContent(), ProductsPage(), fetchLoyalty(), formatPrice(), LoyaltyCard(), LoyaltyResult, ButtonPrimary() (+5 more)

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
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 300 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `auth.ts` to `OrdersView.tsx`, `dashboard/page.tsx`, `AdminPopupSettings.tsx`, `loyalty.ts`, `Password Reset UI Kit`, `[id]/page.tsx`, `Dev Dependencies`, `settings.ts`, `[id]/page.tsx`, `dependencies`, `prisma.ts`, `auth`, `affiliate/page.tsx`, `transactions/[orderId]/page.tsx`, `referral.ts`, `Route Protection Middleware`, `AdminShell.tsx`, `prisma`, `order/[orderId]/page.tsx`, `SettingsView.tsx`, `lucide-react`, `DashboardFrame.tsx`, `recent-purchases/route.ts`, `app/layout.tsx`, `ButtonPrimary.tsx`, `Order (Prisma model)`?**
  _High betweenness centrality (0.294) - this node is a cross-community bridge._
- **What connects `{ GET, POST }`, `Setting (Prisma model)`, `Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast)` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dashboard/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08141321044546851 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `OrdersView.tsx`, `dashboard/page.tsx`, `AdminPopupSettings.tsx`, `loyalty.ts`, `Password Reset UI Kit`, `[id]/page.tsx`, `Dev Dependencies`, `[id]/page.tsx`, `dependencies`, `affiliate/page.tsx`, `transactions/[orderId]/page.tsx`, `Skeleton`, `AdminShell.tsx`, `order/[orderId]/page.tsx`, `SettingsView.tsx`, `PayoutsView.tsx`, `ThemeToggle.tsx`, `lucide-react`, `DashboardFrame.tsx`, `app/layout.tsx`, `ButtonPrimary.tsx`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Should `2. Komponen` be split into smaller, more focused modules?**
  _Cohesion score 0.05398110661268556 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `OrdersView.tsx`, `dashboard/page.tsx`, `AdminPopupSettings.tsx`, `loyalty.ts`, `Password Reset UI Kit`, `[id]/page.tsx`, `Dev Dependencies`, `[id]/page.tsx`, `dependencies`, `affiliate/page.tsx`, `transactions/[orderId]/page.tsx`, `Skeleton`, `AdminShell.tsx`, `order/[orderId]/page.tsx`, `SettingsView.tsx`, `PayoutsView.tsx`, `ThemeToggle.tsx`, `DashboardFrame.tsx`, `react`, `app/layout.tsx`, `ButtonPrimary.tsx`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `getProductsWithStats()` and `Missing Error State on Products Page`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._