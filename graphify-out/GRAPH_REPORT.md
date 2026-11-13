# Graph Report - KampusRebahanV2  (2026-11-13)

## Corpus Check
- 214 files · ~103,540 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 2, .ico 2, .pen 2)

## Summary
- 1174 nodes · 3145 edges · 61 communities (58 shown, 3 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 72 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `34e6e70d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- OrdersView.tsx
- DataTable.tsx
- 2. Komponen
- AdminPopupSettings.tsx
- loyalty.ts
- Docs, Audit & Design Notes
- modern-login-signup.tsx
- types.ts
- EditorialLanding.tsx
- Dev Dependencies
- auth.ts
- settings.ts
- react
- dependencies
- ToastContext.tsx
- TypeScript Config
- prisma.ts
- fulfillOrder.ts
- PayoutsView.tsx
- inpage.js
- TransactionsTable.tsx
- referral.ts
- Route Protection Middleware
- buttonClass
- NPM Scripts
- match.mjs
- DashboardFrame.tsx
- Caption sounding update: November 2026
- PostCSS Config
- NextAuth Handlers
- Caption promo: Beli Claude Pro, gratis Gemini AI Pro
- next
- lucide-react
- replica.mjs
- report.mjs
- transactions/[orderId]/page.tsx
- Badge
- AdminShell.tsx
- Caption WhatsApp — KampusRebahan
- motion.mjs
- ButtonPrimary.tsx
- redeem/route.ts
- SettingsView.tsx
- mailer.ts
- compare
- Skeleton
- lab
- balance/page.tsx
- ButtonPrimary.tsx
- capture.mjs
- app/layout.tsx
- scripts/package.json
- PayoutsView.tsx
- order/[orderId]/page.tsx
- admin/page.tsx
- eslint.config.mjs
- dashboard/page.tsx
- buttonClass
- Building from a blueprint
- GradientBorder.tsx
- dotenv

## God Nodes (most connected - your core abstractions)
1. `next` - 81 edges
2. `react` - 58 edges
3. `lucide-react` - 50 edges
4. `buttonClass()` - 45 edges
5. `prisma` - 43 edges
6. `Skeleton()` - 37 edges
7. `requireAdmin()` - 36 edges
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
- `3.10 Dashboard (pola umum)` --references--> `copy()`  [INFERRED]
  design/SPEC.md → app/order/[orderId]/page.tsx
- `3.1 Landing → `/` (`app/page.tsx`)` --references--> `copy()`  [INFERRED]
  design/SPEC.md → app/order/[orderId]/page.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **User Balance Wallet Ledger (top-up, purchase, refund)** — prisma_schema_user, prisma_schema_balancetopup, prisma_schema_balancetransaction, prisma_schema_balancetxntype, lib_credittopup_credittopup, app_api_balance_topup_route_post [INFERRED 0.85]
- **Order Payment & Fulfillment Lifecycle** — prisma_schema_order, prisma_schema_orderstatus, app_api_order_route_post, app_api_admin_confirm_route_post, app_api_admin_reject_route_post, lib_fulfillorder_fulfillorder, lib_orderstatus_statuslabel [INFERRED 0.85]
- **Password Reset Flow** — prisma_schema_passwordresettoken, prisma_schema_user, app_api_auth_forgot_password_route_post, app_api_auth_reset_password_route_post [INFERRED 0.85]

## Communities (61 total, 3 thin omitted)

### Community 0 - "OrdersView.tsx"
Cohesion: 0.20
Nodes (18): ActionKind, canProcessManually(), filters, isRefundable(), isRejectable(), OrderSheet(), primaryAction(), RowProps (+10 more)

### Community 1 - "DataTable.tsx"
Cohesion: 0.21
Nodes (21): DashboardHomePage(), DataTable(), DataTableProps, rowDelay(), SortHeaderProps, toolbarButtonClass, Table, TableBody (+13 more)

### Community 2 - "2. Komponen"
Cohesion: 0.05
Nodes (38): copy(), 1.1 Warna (hanya light; dark mode BELUM didesain), 1.2 Tipografi, 1.3 Radius, 1.4 Bayangan, 1.5 Spacing dan layout, 1.6 Navbar, 1. Design tokens (+30 more)

### Community 3 - "AdminPopupSettings.tsx"
Cohesion: 0.10
Nodes (28): GET(), POST(), GET(), AdminPopupPage(), HomePage(), revalidate, AdminPopupSettings(), formatSaved() (+20 more)

### Community 4 - "loyalty.ts"
Cohesion: 0.05
Nodes (54): GET(), IN_PROGRESS, GET(), parseOptions(), POST(), NumberField(), RefundCalculator(), rupiah() (+46 more)

### Community 5 - "Docs, Audit & Design Notes"
Cohesion: 0.10
Nodes (22): antislop Audit 001 (2026-09-20), WCAG Contrast Failures (text/placeholder/badge), Design Direction Is Web3 Template, Not KampusRebahan Brand, Two Admin Mechanisms (isAdmin vs ADMIN_EMAILS), Decorative Emoji Icons, Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast), Glass/Glow Overuse Beyond Dose Limit, middleware.ts Deprecated in Next 16 (use proxy.ts) (+14 more)

### Community 6 - "modern-login-signup.tsx"
Cohesion: 0.15
Nodes (16): ForgotPasswordPage(), AuthCard(), AuthField(), AuthFieldProps, AuthNotice(), AuthPasswordField(), AuthPasswordFieldProps, AuthShell() (+8 more)

### Community 7 - "types.ts"
Cohesion: 0.07
Nodes (31): POST(), HIDDEN_PRODUCT_IDS, bayarGg, QRIS_GATEWAY_MAX_AMOUNT, TOPUP_MIN_AMOUNT, call(), paymentBridge, sign() (+23 more)

### Community 8 - "EditorialLanding.tsx"
Cohesion: 0.06
Nodes (51): CheckoutContent(), CheckoutPage(), formatPrice(), PaymentMethod, ProductDetailContent(), ProductDetailPage(), Terms(), CredentialVisual() (+43 more)

### Community 9 - "Dev Dependencies"
Cohesion: 0.12
Nodes (22): devDependencies, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20, @types/nodemailer@^8.0.1, @types/qrcode@^1.5.6, @types/react@^19, @types/react-dom@^19 (+14 more)

### Community 10 - "auth.ts"
Cohesion: 0.21
Nodes (18): POST(), POST(), POST(), POST(), GET(), GET(), getSessionUserId(), mapReview() (+10 more)

### Community 11 - "settings.ts"
Cohesion: 0.12
Nodes (35): GET(), POST(), GET(), GET(), POST(), GET(), Catalog, fetchCatalog() (+27 more)

### Community 12 - "react"
Cohesion: 0.16
Nodes (18): formatPrice(), TopUp, TopUpPaymentPage(), Countdown(), GatewayQr(), EASE, item, Props (+10 more)

### Community 13 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, @auth/prisma-adapter@^2.11.2, bcryptjs@^3.0.3, lucide-react@^1.3.0, next@16.2.6, pg@^8.20.0, @prisma/adapter-pg@^7.8.0, @prisma/client@^7.8.0 (+17 more)

### Community 14 - "ToastContext.tsx"
Cohesion: 0.28
Nodes (5): fetchLoyalty(), formatPrice(), LoyaltyCard(), LoyaltyResult, LoyaltyState

### Community 15 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 16 - "prisma.ts"
Cohesion: 0.18
Nodes (13): GET(), formatRelativeTime(), GET(), getDisplayName(), POST(), POST(), verifyBayarGgWebhookSignature(), creditTopUp() (+5 more)

### Community 17 - "fulfillOrder.ts"
Cohesion: 0.16
Nodes (24): CHANNELS, POST(), STARTABLE, POST(), warungApi, fulfillOrder(), FulfillOrderResult, processClaimedOrder() (+16 more)

### Community 18 - "PayoutsView.tsx"
Cohesion: 0.23
Nodes (7): AffiliateData, AffiliatePage(), formatDate(), formatPrice(), METHODS, payoutMethodLabel, payoutStatus

### Community 19 - "inpage.js"
Cohesion: 0.14
Nodes (28): blueprint.json fields, Motion timeline, Outline syntax, Reading a blueprint, Responsive section, Tokens, What counts as a node, behind() (+20 more)

### Community 20 - "TransactionsTable.tsx"
Cohesion: 0.18
Nodes (11): TransactionsPage(), DashboardHeader(), columnLabels, formatDate(), formatPrice(), paymentLabels, RowActions(), StatusFilter() (+3 more)

### Community 21 - "referral.ts"
Cohesion: 0.24
Nodes (11): GET(), POST(), POST(), creditWallet(), debitWallet(), getSessionUserId(), PAYOUT_METHODS, REF_COOKIE_MAX_AGE (+3 more)

### Community 22 - "Route Protection Middleware"
Cohesion: 0.40
Nodes (3): config, PROTECTED, SESSION_COOKIES

### Community 23 - "buttonClass"
Cohesion: 0.24
Nodes (12): NotFound(), metadata, PrivacyPage(), metadata, RefundCalculatorPage(), metadata, TermsPage(), Footer() (+4 more)

### Community 24 - "NPM Scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 25 - "match.mjs"
Cohesion: 0.13
Nodes (26): area(), base(), center(), contains(), DEFAULTS, dist(), GROUP, hugs() (+18 more)

### Community 26 - "DashboardFrame.tsx"
Cohesion: 0.18
Nodes (13): DashboardFrame(), DashboardUserContext, SidebarUser, accountItems, adminItem, DashboardBottomBar(), DashboardSidebar(), Item (+5 more)

### Community 27 - "Caption sounding update: November 2026"
Cohesion: 0.40
Nodes (4): Caption sounding update: November 2026, Teaser promo (kirim 1–2 hari kemudian), Versi lengkap, Versi singkat

### Community 30 - "Caption promo: Beli Claude Pro, gratis Gemini AI Pro"
Cohesion: 0.40
Nodes (4): Caption promo: Beli Claude Pro, gratis Gemini AI Pro, Versi feed (lengkap), Versi santai, Versi story (singkat)

### Community 31 - "next"
Cohesion: 0.11
Nodes (29): POST(), GET(), GET(), PAID_STATUSES, startOfJakartaDay(), GET(), GET(), GET() (+21 more)

### Community 32 - "lucide-react"
Cohesion: 0.18
Nodes (11): dateTime(), Estimate, RefundRequestCard(), rupiah(), BeforeChatButton(), FAQ, WhatsAppButton(), iconMap (+3 more)

### Community 33 - "replica.mjs"
Cohesion: 0.14
Nodes (24): captureImage(), captureVideo(), launch(), vpName(), onsetSettle(), pairSegments(), openLab(), capture() (+16 more)

### Community 34 - "report.mjs"
Cohesion: 0.23
Nodes (22): describeEase(), also(), at(), base(), blueprintMd(), change(), declared(), diffText() (+14 more)

### Community 35 - "transactions/[orderId]/page.tsx"
Cohesion: 0.15
Nodes (20): AccountDetailsPanel(), AccountGroup, COMPLAINT_STATUSES, complaintMessage(), Credential, CredentialRow(), formatDate(), formatPrice() (+12 more)

### Community 36 - "Badge"
Cohesion: 0.23
Nodes (9): AdminLoyaltyPage(), AdminLoyalty(), filters, formatDate(), formatPrice(), Row, stateInfo, BadgeProps (+1 more)

### Community 37 - "AdminShell.tsx"
Cohesion: 0.24
Nodes (11): AdminOrdersPage(), AdminHeader(), AdminShell(), AdminSummary, CountBadge(), isActive(), SummaryContext, Tab (+3 more)

### Community 38 - "Caption WhatsApp — KampusRebahan"
Cohesion: 0.33
Nodes (5): Caption 1 (lengkap), Caption 2 (singkat, untuk status), Caption 3 (ajakan santai di grup), Caption WhatsApp — KampusRebahan, Jargon pilihan

### Community 39 - "motion.mjs"
Cohesion: 0.17
Nodes (19): bezier(), bracket(), CH_NAME, CHANNELS, colorDist(), EASINGS, EPS, fitEasing() (+11 more)

### Community 40 - "ButtonPrimary.tsx"
Cohesion: 0.25
Nodes (8): ProductsCatalog(), ProductsContent(), ProductsPage(), ButtonPrimary(), ButtonPrimaryProps, Size, Variant, variants

### Community 41 - "redeem/route.ts"
Cohesion: 0.18
Nodes (14): CouponUnavailableError, POST(), OUT_OF_STOCK(), POST(), REF_COOKIE, resolveReferrer(), Db, openUnpaidOrder() (+6 more)

### Community 42 - "SettingsView.tsx"
Cohesion: 0.20
Nodes (13): AdminSettingsPage(), Field(), Group(), MethodKey, MethodList, methods, post(), Settings (+5 more)

### Community 43 - "mailer.ts"
Cohesion: 0.32
Nodes (7): adminNotifyEmail(), escapeHtml(), PaidOrderInfo, sendPaidOrderEmail(), transporter, nodemailer@^7.0.13, nodemailer

### Community 44 - "compare"
Cohesion: 0.12
Nodes (19): Acting on a report, Findings, How the score works, When the score stalls, Capturing each kind of reference, Iframes, canvas, WebGL, Lottie, video backgrounds, Interactions and motion, Live site or local page (+11 more)

### Community 45 - "Skeleton"
Cohesion: 0.29
Nodes (8): formatPrice(), RefundDialog(), todayWib(), CheckoutSkeleton(), Skeleton(), SkeletonProps, TransactionSkeleton(), RefundPreview

### Community 46 - "lab"
Cohesion: 0.47
Nodes (4): lab(), diffPanel(), label(), sheet()

### Community 47 - "balance/page.tsx"
Cohesion: 0.19
Nodes (14): BalancePage(), handleTopup(), formatPrice(), METHOD_LABEL, PRESET_AMOUNTS, TopupMethod, BalanceHistoryTable(), BalanceTransaction (+6 more)

### Community 48 - "ButtonPrimary.tsx"
Cohesion: 0.43
Nodes (5): dateTime(), Estimate, InvoiceCheck(), rupiah(), todayWib()

### Community 49 - "capture.mjs"
Cohesion: 0.16
Nodes (12): act(), captureUrl(), EPOCH, pad(), parseAction(), recordMotion(), scrollThrough(), settleNetwork() (+4 more)

### Community 50 - "app/layout.tsx"
Cohesion: 0.18
Nodes (11): inter, interTight, metadata, RootLayout(), RefCapture(), NextAuthSessionProvider(), ToastProvider(), next-auth@^5.0.0-beta.31 (+3 more)

### Community 51 - "scripts/package.json"
Cohesion: 0.20
Nodes (10): dependencies, playwright@^1.64.1, engines, node, name, private, scripts, test (+2 more)

### Community 52 - "PayoutsView.tsx"
Cohesion: 0.26
Nodes (10): AdminPayoutsPage(), ManualSheet(), CopyButton(), Destination(), Payout, PayoutsView(), copyText(), formatDateTime() (+2 more)

### Community 53 - "order/[orderId]/page.tsx"
Cohesion: 0.24
Nodes (12): CopyButton(), formatDate(), formatPrice(), Order, OrderDetailPage(), OrderSummary(), PaymentInstructions(), statusInfo (+4 more)

### Community 54 - "admin/page.tsx"
Cohesion: 0.35
Nodes (11): ActionRow(), AdminHomePage(), Tile(), today(), ActionButton(), MethodIcon(), OrderCard, OrderRow (+3 more)

### Community 55 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.2.6, eslint, eslint-config-next

### Community 56 - "dashboard/page.tsx"
Cohesion: 0.29
Nodes (7): formatDate(), formatPrice(), StatCard(), CountUp(), StatusColor, statusColor, statusLabel

### Community 57 - "buttonClass"
Cohesion: 0.40
Nodes (7): PaymentCancelContent(), PaymentCancelPage(), StatusIcon(), CheckState, PaymentSuccessContent(), PaymentSuccessPage(), buttonClass()

### Community 58 - "Building from a blueprint"
Cohesion: 0.29
Nodes (7): Building from a blueprint, Continuous motion (marquees, loops), CSS, Framer Motion / Motion, General, GSAP, Tailwind

### Community 60 - "dotenv"
Cohesion: 0.40
Nodes (4): dotenv@^17.4.2, prisma@^7.8.0, dotenv, prisma

## Ambiguous Edges - Review These
- `getProductsWithStats()` → `Missing Error State on Products Page`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md · relation: conceptually_related_to

## Knowledge Gaps
- **14 isolated node(s):** `{ GET, POST }`, `BalanceTxnType (Prisma enum)`, `CouponStatus (Prisma enum)`, `Setting (Prisma model)`, `TopUpStatus (Prisma enum)` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 312 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `OrdersView.tsx`, `AdminPopupSettings.tsx`, `loyalty.ts`, `modern-login-signup.tsx`, `types.ts`, `EditorialLanding.tsx`, `Dev Dependencies`, `auth.ts`, `settings.ts`, `react`, `dependencies`, `ToastContext.tsx`, `prisma.ts`, `fulfillOrder.ts`, `TransactionsTable.tsx`, `referral.ts`, `Route Protection Middleware`, `buttonClass`, `DashboardFrame.tsx`, `lucide-react`, `transactions/[orderId]/page.tsx`, `AdminShell.tsx`, `ButtonPrimary.tsx`, `redeem/route.ts`, `SettingsView.tsx`, `balance/page.tsx`, `ButtonPrimary.tsx`, `app/layout.tsx`, `order/[orderId]/page.tsx`, `admin/page.tsx`, `dashboard/page.tsx`, `buttonClass`?**
  _High betweenness centrality (0.225) - this node is a cross-community bridge._
- **What connects `{ GET, POST }`, `BalanceTxnType (Prisma enum)`, `CouponStatus (Prisma enum)` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `2. Komponen` be split into smaller, more focused modules?**
  _Cohesion score 0.05398110661268556 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `OrdersView.tsx`, `DataTable.tsx`, `AdminPopupSettings.tsx`, `loyalty.ts`, `modern-login-signup.tsx`, `EditorialLanding.tsx`, `Dev Dependencies`, `dependencies`, `ToastContext.tsx`, `PayoutsView.tsx`, `TransactionsTable.tsx`, `buttonClass`, `DashboardFrame.tsx`, `lucide-react`, `transactions/[orderId]/page.tsx`, `Badge`, `AdminShell.tsx`, `ButtonPrimary.tsx`, `SettingsView.tsx`, `Skeleton`, `balance/page.tsx`, `ButtonPrimary.tsx`, `app/layout.tsx`, `PayoutsView.tsx`, `order/[orderId]/page.tsx`, `dashboard/page.tsx`, `buttonClass`, `GradientBorder.tsx`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Should `AdminPopupSettings.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10256410256410256 - nodes in this community are weakly interconnected._
- **Why does `declared()` connect `report.mjs` to `inpage.js`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `getProductsWithStats()` and `Missing Error State on Products Page`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._