# Graph Report - KampusRebahanV2  (2026-11-11)

## Corpus Check
- 212 files · ~102,040 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 2, .ico 2, .pen 2)

## Summary
- 1164 nodes · 3112 edges · 53 communities (51 shown, 2 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 72 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e75397de`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- OrdersView.tsx
- dashboard/page.tsx
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
- requireAdmin
- PayoutsView.tsx
- inpage.js
- refundCalc.ts
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
- auth
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
- selftest.mjs
- ButtonPrimary.tsx
- capture.mjs
- app/layout.tsx
- scripts/package.json
- eslint.config.mjs
- dotenv

## God Nodes (most connected - your core abstractions)
1. `next` - 80 edges
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
- `Order (Prisma model)` --shares_data_with--> `fulfillOrder()`  [INFERRED]
  prisma/schema.prisma → lib/fulfillOrder.ts
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
Cohesion: 0.16
Nodes (26): AdminOrdersPage(), ActionButton(), ActionKind, filters, isRefundable(), isRejectable(), MethodIcon(), OrderCard (+18 more)

### Community 1 - "dashboard/page.tsx"
Cohesion: 0.07
Nodes (59): BalancePage(), handleTopup(), formatPrice(), METHOD_LABEL, PRESET_AMOUNTS, TopupMethod, DashboardHomePage(), formatDate() (+51 more)

### Community 2 - "2. Komponen"
Cohesion: 0.05
Nodes (38): copy(), 1.1 Warna (hanya light; dark mode BELUM didesain), 1.2 Tipografi, 1.3 Radius, 1.4 Bayangan, 1.5 Spacing dan layout, 1.6 Navbar, 1. Design tokens (+30 more)

### Community 3 - "AdminPopupSettings.tsx"
Cohesion: 0.11
Nodes (27): GET(), POST(), GET(), HomePage(), revalidate, AdminPopupSettings(), formatSaved(), CardProps (+19 more)

### Community 4 - "loyalty.ts"
Cohesion: 0.13
Nodes (25): GET(), IN_PROGRESS, GET(), parseOptions(), POST(), GET(), findCoupon(), generateCouponCode() (+17 more)

### Community 5 - "Docs, Audit & Design Notes"
Cohesion: 0.10
Nodes (22): antislop Audit 001 (2026-09-20), WCAG Contrast Failures (text/placeholder/badge), Design Direction Is Web3 Template, Not KampusRebahan Brand, Two Admin Mechanisms (isAdmin vs ADMIN_EMAILS), Decorative Emoji Icons, Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast), Glass/Glow Overuse Beyond Dose Limit, middleware.ts Deprecated in Next 16 (use proxy.ts) (+14 more)

### Community 6 - "modern-login-signup.tsx"
Cohesion: 0.15
Nodes (16): ForgotPasswordPage(), AuthCard(), AuthField(), AuthFieldProps, AuthNotice(), AuthPasswordField(), AuthPasswordFieldProps, AuthShell() (+8 more)

### Community 7 - "types.ts"
Cohesion: 0.08
Nodes (31): POST(), HIDDEN_PRODUCT_IDS, bayarGg, QRIS_GATEWAY_MAX_AMOUNT, TOPUP_MIN_AMOUNT, call(), paymentBridge, sign() (+23 more)

### Community 8 - "EditorialLanding.tsx"
Cohesion: 0.06
Nodes (54): CheckoutContent(), CheckoutPage(), formatPrice(), PaymentMethod, ProductDetailContent(), ProductDetailPage(), Terms(), CredentialVisual() (+46 more)

### Community 9 - "Dev Dependencies"
Cohesion: 0.12
Nodes (22): devDependencies, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20, @types/nodemailer@^8.0.1, @types/qrcode@^1.5.6, @types/react@^19, @types/react-dom@^19 (+14 more)

### Community 10 - "auth.ts"
Cohesion: 0.18
Nodes (22): POST(), POST(), POST(), POST(), POST(), GET(), GET(), getSessionUserId() (+14 more)

### Community 11 - "settings.ts"
Cohesion: 0.08
Nodes (48): GET(), POST(), POST(), OUT_OF_STOCK(), POST(), GET(), GET(), GET() (+40 more)

### Community 12 - "react"
Cohesion: 0.18
Nodes (8): formatPrice(), TopUp, TopUpPaymentPage(), Countdown(), GatewayQr(), GradientBorderProps, iconMap, react

### Community 13 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, @auth/prisma-adapter@^2.11.2, bcryptjs@^3.0.3, lucide-react@^1.3.0, next@16.2.6, pg@^8.20.0, @prisma/adapter-pg@^7.8.0, @prisma/client@^7.8.0 (+17 more)

### Community 14 - "ToastContext.tsx"
Cohesion: 0.16
Nodes (10): fetchLoyalty(), formatPrice(), LoyaltyCard(), LoyaltyResult, EASE, Toast, ToastContext, ToastContextValue (+2 more)

### Community 15 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 16 - "prisma.ts"
Cohesion: 0.17
Nodes (14): GET(), formatRelativeTime(), GET(), getDisplayName(), POST(), POST(), verifyBayarGgWebhookSignature(), creditTopUp() (+6 more)

### Community 17 - "requireAdmin"
Cohesion: 0.15
Nodes (22): POST(), GET(), GET(), POST(), GET(), PAID_STATUSES, startOfJakartaDay(), GET() (+14 more)

### Community 18 - "PayoutsView.tsx"
Cohesion: 0.17
Nodes (13): AdminPayoutsPage(), AffiliateData, AffiliatePage(), formatDate(), formatPrice(), METHODS, CopyButton(), Destination() (+5 more)

### Community 19 - "inpage.js"
Cohesion: 0.07
Nodes (39): blueprint.json fields, Motion timeline, Outline syntax, Reading a blueprint, Responsive section, Tokens, What counts as a node, Building from a blueprint (+31 more)

### Community 20 - "refundCalc.ts"
Cohesion: 0.10
Nodes (25): NumberField(), RefundCalculator(), rupiah(), SIM_METHODS, calcCommission(), LOYALTY_HOLD_MS, base, estimateOrderRefund() (+17 more)

### Community 21 - "referral.ts"
Cohesion: 0.22
Nodes (11): POST(), debitWallet(), generateReferralCode(), isUniqueViolation(), PAYOUT_METHODS, REF_COOKIE, REF_COOKIE_MAX_AGE, resolveReferrer() (+3 more)

### Community 22 - "Route Protection Middleware"
Cohesion: 0.40
Nodes (3): config, PROTECTED, SESSION_COOKIES

### Community 23 - "buttonClass"
Cohesion: 0.20
Nodes (17): NotFound(), PaymentCancelContent(), PaymentCancelPage(), StatusIcon(), CheckState, PaymentSuccessContent(), PaymentSuccessPage(), metadata (+9 more)

### Community 24 - "NPM Scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 25 - "match.mjs"
Cohesion: 0.12
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

### Community 31 - "auth"
Cohesion: 0.17
Nodes (14): GET(), GET(), GET(), expireStaleBankTransfer(), GET(), PATCH(), DashboardLayout(), metadata (+6 more)

### Community 32 - "lucide-react"
Cohesion: 0.14
Nodes (21): CopyButton(), formatDate(), formatPrice(), Order, OrderDetailPage(), OrderSummary(), PaymentInstructions(), statusInfo (+13 more)

### Community 33 - "replica.mjs"
Cohesion: 0.14
Nodes (23): captureImage(), captureVideo(), vpName(), CH_NAME, onsetSettle(), pairSegments(), openLab(), capture() (+15 more)

### Community 34 - "report.mjs"
Cohesion: 0.23
Nodes (22): describeEase(), also(), at(), base(), blueprintMd(), change(), declared(), diffText() (+14 more)

### Community 35 - "transactions/[orderId]/page.tsx"
Cohesion: 0.15
Nodes (19): AccountDetailsPanel(), AccountGroup, COMPLAINT_STATUSES, complaintMessage(), Credential, CredentialRow(), formatDate(), formatPrice() (+11 more)

### Community 36 - "Badge"
Cohesion: 0.23
Nodes (10): AdminLoyaltyPage(), AdminLoyalty(), filters, formatDate(), formatPrice(), Row, stateInfo, Badge() (+2 more)

### Community 37 - "AdminShell.tsx"
Cohesion: 0.19
Nodes (16): AdminLayout(), ActionRow(), AdminHomePage(), Tile(), today(), AdminPopupPage(), AdminHeader(), AdminShell() (+8 more)

### Community 38 - "Caption WhatsApp — KampusRebahan"
Cohesion: 0.33
Nodes (5): Caption 1 (lengkap), Caption 2 (singkat, untuk status), Caption 3 (ajakan santai di grup), Caption WhatsApp — KampusRebahan, Jargon pilihan

### Community 39 - "motion.mjs"
Cohesion: 0.20
Nodes (18): bezier(), bracket(), CHANNELS, colorDist(), EASINGS, EPS, fitEasing(), hexRgb() (+10 more)

### Community 40 - "ButtonPrimary.tsx"
Cohesion: 0.25
Nodes (8): ProductsCatalog(), ProductsContent(), ProductsPage(), ButtonPrimary(), ButtonPrimaryProps, Size, Variant, variants

### Community 41 - "redeem/route.ts"
Cohesion: 0.22
Nodes (11): CouponUnavailableError, POST(), LOYALTY_REWARD_VARIANT_ID, Db, openUnpaidOrder(), reservedByVariant(), withStockLock(), HoldCandidate (+3 more)

### Community 42 - "SettingsView.tsx"
Cohesion: 0.20
Nodes (13): AdminSettingsPage(), Field(), Group(), MethodKey, MethodList, methods, post(), Settings (+5 more)

### Community 43 - "mailer.ts"
Cohesion: 0.32
Nodes (7): adminNotifyEmail(), escapeHtml(), PaidOrderInfo, sendPaidOrderEmail(), transporter, nodemailer@^7.0.13, nodemailer

### Community 44 - "compare"
Cohesion: 0.18
Nodes (17): Capturing each kind of reference, Iframes, canvas, WebGL, Lottie, video backgrounds, Interactions and motion, Live site or local page, Pages behind a login, Screen recordings and GIFs, Screenshots and design exports, launch() (+9 more)

### Community 45 - "Skeleton"
Cohesion: 0.31
Nodes (7): formatPrice(), RefundDialog(), todayWib(), Skeleton(), SkeletonProps, TransactionSkeleton(), RefundPreview

### Community 46 - "selftest.mjs"
Cohesion: 0.15
Nodes (5): lab(), diffPanel(), label(), sheet(), MIME

### Community 48 - "ButtonPrimary.tsx"
Cohesion: 0.31
Nodes (7): dateTime(), Estimate, InvoiceCheck(), rupiah(), todayWib(), metadata, RefundCalculatorPage()

### Community 49 - "capture.mjs"
Cohesion: 0.35
Nodes (11): act(), captureUrl(), EPOCH, pad(), parseAction(), recordMotion(), scrollThrough(), settleNetwork() (+3 more)

### Community 50 - "app/layout.tsx"
Cohesion: 0.15
Nodes (12): inter, interTight, metadata, RootLayout(), authConfig, RefCapture(), NextAuthSessionProvider(), ToastProvider() (+4 more)

### Community 51 - "scripts/package.json"
Cohesion: 0.20
Nodes (10): dependencies, playwright@^1.64.1, engines, node, name, private, scripts, test (+2 more)

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
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 309 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `auth.ts` to `OrdersView.tsx`, `dashboard/page.tsx`, `AdminPopupSettings.tsx`, `loyalty.ts`, `modern-login-signup.tsx`, `types.ts`, `EditorialLanding.tsx`, `Dev Dependencies`, `settings.ts`, `react`, `dependencies`, `ToastContext.tsx`, `prisma.ts`, `requireAdmin`, `referral.ts`, `Route Protection Middleware`, `buttonClass`, `DashboardFrame.tsx`, `auth`, `lucide-react`, `transactions/[orderId]/page.tsx`, `AdminShell.tsx`, `ButtonPrimary.tsx`, `redeem/route.ts`, `SettingsView.tsx`, `ButtonPrimary.tsx`, `app/layout.tsx`?**
  _High betweenness centrality (0.239) - this node is a cross-community bridge._
- **What connects `{ GET, POST }`, `Setting (Prisma model)`, `Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast)` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dashboard/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06593406593406594 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `OrdersView.tsx`, `dashboard/page.tsx`, `AdminPopupSettings.tsx`, `modern-login-signup.tsx`, `EditorialLanding.tsx`, `Dev Dependencies`, `dependencies`, `ToastContext.tsx`, `PayoutsView.tsx`, `refundCalc.ts`, `buttonClass`, `DashboardFrame.tsx`, `lucide-react`, `transactions/[orderId]/page.tsx`, `Badge`, `AdminShell.tsx`, `ButtonPrimary.tsx`, `SettingsView.tsx`, `Skeleton`, `ButtonPrimary.tsx`, `app/layout.tsx`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Should `2. Komponen` be split into smaller, more focused modules?**
  _Cohesion score 0.05398110661268556 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `OrdersView.tsx`, `dashboard/page.tsx`, `transactions/[orderId]/page.tsx`, `AdminPopupSettings.tsx`, `AdminShell.tsx`, `modern-login-signup.tsx`, `EditorialLanding.tsx`, `ButtonPrimary.tsx`, `SettingsView.tsx`, `Dev Dependencies`, `react`, `Skeleton`, `ToastContext.tsx`, `dependencies`, `ButtonPrimary.tsx`, `PayoutsView.tsx`, `buttonClass`, `DashboardFrame.tsx`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `getProductsWithStats()` and `Missing Error State on Products Page`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._