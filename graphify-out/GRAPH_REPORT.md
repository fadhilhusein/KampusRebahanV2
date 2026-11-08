# Graph Report - KampusRebahanV2  (2026-11-08)

## Corpus Check
- 187 files · ~72,046 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 2, .ico 2, .css 1)

## Summary
- 904 nodes · 2510 edges · 47 communities (44 shown, 3 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 43 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7c701d43`
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
- referral.ts
- TransactionsTable.tsx
- dependencies
- balance/page.tsx
- TypeScript Config
- buttonClass
- supplierSync.ts
- auth.ts
- reviews/route.ts
- affiliate/page.tsx
- transactions/[orderId]/page.tsx
- Route Protection Middleware
- Skeleton
- NPM Scripts
- react
- @types/pg@^8.20.0
- Caption sounding update: November 2026
- PostCSS Config
- NextAuth Handlers
- Caption promo: Beli Claude Pro, gratis Gemini AI Pro
- prisma.ts
- order/[orderId]/page.tsx
- prisma
- SettingsView.tsx
- Caption WhatsApp — KampusRebahan
- lucide-react
- ThemeToggle.tsx
- app/layout.tsx
- fulfillOrder.ts
- [id]/page.tsx
- recent-purchases/route.ts
- ButtonPrimary.tsx
- eslint.config.mjs
- Badge.tsx
- ButtonPrimary.tsx
- dotenv

## God Nodes (most connected - your core abstractions)
1. `next` - 76 edges
2. `react` - 56 edges
3. `lucide-react` - 48 edges
4. `buttonClass()` - 42 edges
5. `prisma` - 40 edges
6. `Skeleton()` - 37 edges
7. `auth` - 34 edges
8. `requireAdmin()` - 34 edges
9. `Navbar()` - 31 edges
10. `Footer()` - 26 edges

## Surprising Connections (you probably didn't know these)
- `Missing Error State on Products Page` --conceptually_related_to--> `getProductsWithStats()`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md → lib/products.ts
- `3.11 Legal` --references--> `LegalArticle()`  [INFERRED]
  design/SPEC.md → components/layout/LegalArticle.tsx
- `3.5 Pembayaran QRIS → `/order/[orderId]` (status pending)` --references--> `GatewayQr()`  [INFERRED]
  design/SPEC.md → components/payment/GatewayQr.tsx
- `Order (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/admin/confirm/route.ts
- `User (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/auth/register/route.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **User Balance Wallet Ledger (top-up, purchase, refund)** — prisma_schema_user, prisma_schema_balancetopup, prisma_schema_balancetransaction, prisma_schema_balancetxntype, lib_credittopup_credittopup, app_api_balance_topup_route_post [INFERRED 0.85]
- **Order Payment & Fulfillment Lifecycle** — prisma_schema_order, prisma_schema_orderstatus, app_api_order_route_post, app_api_admin_confirm_route_post, app_api_admin_reject_route_post, lib_fulfillorder_fulfillorder, lib_orderstatus_statuslabel [INFERRED 0.85]
- **Password Reset Flow** — prisma_schema_passwordresettoken, prisma_schema_user, app_api_auth_forgot_password_route_post, app_api_auth_reset_password_route_post [INFERRED 0.85]

## Communities (47 total, 3 thin omitted)

### Community 0 - "OrdersView.tsx"
Cohesion: 0.08
Nodes (50): AdminLayout(), AdminOrdersPage(), ActionRow(), AdminHomePage(), Tile(), today(), AdminPayoutsPage(), AdminPopupPage() (+42 more)

### Community 1 - "dashboard/page.tsx"
Cohesion: 0.17
Nodes (22): DashboardHomePage(), formatDate(), formatPrice(), StatCard(), DataTable(), DataTableProps, rowDelay(), SortHeaderProps (+14 more)

### Community 2 - "2. Komponen"
Cohesion: 0.05
Nodes (38): copy(), 1.1 Warna (hanya light; dark mode BELUM didesain), 1.2 Tipografi, 1.3 Radius, 1.4 Bayangan, 1.5 Spacing dan layout, 1.6 Navbar, 1. Design tokens (+30 more)

### Community 3 - "AdminPopupSettings.tsx"
Cohesion: 0.12
Nodes (25): GET(), POST(), GET(), AdminPopupSettings(), formatSaved(), CardProps, InfoPopup(), PopupCard() (+17 more)

### Community 4 - "loyalty.ts"
Cohesion: 0.06
Nodes (58): GET(), IN_PROGRESS, GET(), parseOptions(), POST(), NumberField(), RefundCalculator(), rupiah() (+50 more)

### Community 5 - "Docs, Audit & Design Notes"
Cohesion: 0.10
Nodes (22): antislop Audit 001 (2026-09-20), WCAG Contrast Failures (text/placeholder/badge), Design Direction Is Web3 Template, Not KampusRebahan Brand, Two Admin Mechanisms (isAdmin vs ADMIN_EMAILS), Decorative Emoji Icons, Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast), Glass/Glow Overuse Beyond Dose Limit, middleware.ts Deprecated in Next 16 (use proxy.ts) (+14 more)

### Community 6 - "Password Reset UI Kit"
Cohesion: 0.15
Nodes (16): ForgotPasswordPage(), AuthCard(), AuthField(), AuthFieldProps, AuthNotice(), AuthPasswordField(), AuthPasswordFieldProps, AuthShell() (+8 more)

### Community 7 - "types.ts"
Cohesion: 0.09
Nodes (25): GET(), HomePage(), revalidate, HIDDEN_PRODUCT_IDS, getProductsWithStats(), AccountDetail, ApiResponse, BalanceResponse (+17 more)

### Community 8 - "[id]/page.tsx"
Cohesion: 0.20
Nodes (15): NotFound(), metadata, PrivacyPage(), metadata, RefundCalculatorPage(), metadata, TermsPage(), DashboardFrame() (+7 more)

### Community 9 - "Dev Dependencies"
Cohesion: 0.12
Nodes (22): devDependencies, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20, @types/nodemailer@^8.0.1, @types/qrcode@^1.5.6, @types/react@^19, @types/react-dom@^19 (+14 more)

### Community 10 - "auth.ts"
Cohesion: 0.27
Nodes (13): POST(), POST(), POST(), POST(), GET(), sendResetCodeEmail(), clientIp(), rateLimit() (+5 more)

### Community 11 - "referral.ts"
Cohesion: 0.11
Nodes (39): GET(), POST(), POST(), POST(), GET(), POST(), GET(), calcCommission() (+31 more)

### Community 12 - "TransactionsTable.tsx"
Cohesion: 0.16
Nodes (15): columnLabels, formatDate(), formatPrice(), paymentLabels, RowActions(), StatusFilter(), TransactionsTable(), DropdownMenuContent (+7 more)

### Community 13 - "dependencies"
Cohesion: 0.08
Nodes (26): dependencies, @auth/prisma-adapter@^2.11.2, bcryptjs@^3.0.3, lucide-react@^1.3.0, motion@^12.37.0, next@16.2.6, nodemailer@^7.0.13, pg@^8.20.0 (+18 more)

### Community 14 - "balance/page.tsx"
Cohesion: 0.19
Nodes (14): BalancePage(), handleTopup(), formatPrice(), METHOD_LABEL, PRESET_AMOUNTS, TopupMethod, BalanceHistoryTable(), BalanceTransaction (+6 more)

### Community 15 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 16 - "buttonClass"
Cohesion: 0.40
Nodes (7): PaymentCancelContent(), PaymentCancelPage(), StatusIcon(), CheckState, PaymentSuccessContent(), PaymentSuccessPage(), buttonClass()

### Community 17 - "supplierSync.ts"
Cohesion: 0.16
Nodes (14): GET(), GET(), PAID_STATUSES, startOfJakartaDay(), GET(), GET(), POST(), warungApi (+6 more)

### Community 18 - "auth.ts"
Cohesion: 0.32
Nodes (5): authConfig, handlers, RateLimited, signIn, signOut

### Community 19 - "reviews/route.ts"
Cohesion: 0.80
Nodes (4): GET(), getSessionUserId(), mapReview(), POST()

### Community 20 - "affiliate/page.tsx"
Cohesion: 0.11
Nodes (19): AffiliateData, AffiliatePage(), formatDate(), formatPrice(), METHODS, CountUp(), fetchLoyalty(), formatPrice() (+11 more)

### Community 21 - "transactions/[orderId]/page.tsx"
Cohesion: 0.12
Nodes (25): AccountDetailsPanel(), AccountGroup, COMPLAINT_STATUSES, complaintMessage(), Credential, CredentialRow(), formatDate(), formatPrice() (+17 more)

### Community 22 - "Route Protection Middleware"
Cohesion: 0.40
Nodes (3): config, PROTECTED, SESSION_COOKIES

### Community 23 - "Skeleton"
Cohesion: 0.26
Nodes (10): TransactionsPage(), useDashboardUser(), baseTabs, DashboardHeader(), Tab, CheckoutSkeleton(), ProductDetailSkeleton(), Skeleton() (+2 more)

### Community 24 - "NPM Scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 25 - "react"
Cohesion: 0.18
Nodes (6): formatRelativeTime(), RecentPurchase, RecentPurchaseBanner(), GradientBorderProps, iconMap, react

### Community 27 - "Caption sounding update: November 2026"
Cohesion: 0.40
Nodes (4): Caption sounding update: November 2026, Teaser promo (kirim 1–2 hari kemudian), Versi lengkap, Versi singkat

### Community 30 - "Caption promo: Beli Claude Pro, gratis Gemini AI Pro"
Cohesion: 0.40
Nodes (4): Caption promo: Beli Claude Pro, gratis Gemini AI Pro, Versi feed (lengkap), Versi santai, Versi story (singkat)

### Community 31 - "prisma.ts"
Cohesion: 0.18
Nodes (15): GET(), POST(), GET(), GET(), GET(), GET(), GET(), PATCH() (+7 more)

### Community 32 - "order/[orderId]/page.tsx"
Cohesion: 0.17
Nodes (17): formatPrice(), TopUp, TopUpPaymentPage(), CopyButton(), formatDate(), formatPrice(), Order, OrderDetailPage() (+9 more)

### Community 34 - "prisma"
Cohesion: 0.13
Nodes (19): POST(), GET(), POST(), POST(), QRIS_GATEWAY_MAX_AMOUNT, TOPUP_MIN_AMOUNT, verifyBayarGgWebhookSignature(), creditTopUp() (+11 more)

### Community 35 - "SettingsView.tsx"
Cohesion: 0.20
Nodes (13): AdminSettingsPage(), Field(), Group(), MethodKey, MethodList, methods, post(), Settings (+5 more)

### Community 38 - "Caption WhatsApp — KampusRebahan"
Cohesion: 0.33
Nodes (5): Caption 1 (lengkap), Caption 2 (singkat, untuk status), Caption 3 (ajakan santai di grup), Caption WhatsApp — KampusRebahan, Jargon pilihan

### Community 40 - "lucide-react"
Cohesion: 0.14
Nodes (22): CredentialVisual(), EditorialLanding(), minPrice(), PayVisual(), PickVisual(), rupiah, steps, Bubble() (+14 more)

### Community 41 - "ThemeToggle.tsx"
Cohesion: 0.43
Nodes (6): clientSnapshot(), serverSnapshot(), subscribe(), ThemeToggle(), next-themes@^0.4.6, next-themes

### Community 47 - "app/layout.tsx"
Cohesion: 0.20
Nodes (10): inter, interTight, metadata, RootLayout(), RefCapture(), NextAuthSessionProvider(), ToastProvider(), WhatsAppButton() (+2 more)

### Community 50 - "fulfillOrder.ts"
Cohesion: 0.21
Nodes (12): POST(), CouponUnavailableError, POST(), GET(), fulfillOrder(), FulfillOrderResult, processClaimedOrder(), adminNotifyEmail() (+4 more)

### Community 51 - "[id]/page.tsx"
Cohesion: 0.31
Nodes (8): ProductDetailContent(), ProductDetailPage(), Terms(), rupiah, typeIcon(), VariantSelector(), Kartu varian (`VariantSelector`, komponen .pen "VariantCard"), ProductVariant

### Community 52 - "recent-purchases/route.ts"
Cohesion: 0.83
Nodes (3): formatRelativeTime(), GET(), getDisplayName()

### Community 53 - "ButtonPrimary.tsx"
Cohesion: 0.43
Nodes (5): dateTime(), Estimate, InvoiceCheck(), rupiah(), todayWib()

### Community 55 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.2.6, eslint, eslint-config-next

### Community 57 - "Badge.tsx"
Cohesion: 0.23
Nodes (10): AdminLoyaltyPage(), AdminLoyalty(), filters, formatDate(), formatPrice(), Row, stateInfo, Badge() (+2 more)

### Community 59 - "ButtonPrimary.tsx"
Cohesion: 0.18
Nodes (12): CheckoutContent(), CheckoutPage(), formatPrice(), PaymentMethod, ProductsCatalog(), ProductsContent(), ProductsPage(), ButtonPrimary() (+4 more)

### Community 60 - "dotenv"
Cohesion: 0.40
Nodes (4): dotenv@^17.4.2, prisma@^7.8.0, dotenv, prisma

## Ambiguous Edges - Review These
- `getProductsWithStats()` → `Missing Error State on Products Page`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md · relation: conceptually_related_to

## Knowledge Gaps
- **14 isolated node(s):** `{ GET, POST }`, `BalanceTxnType (Prisma enum)`, `CouponStatus (Prisma enum)`, `TopUpStatus (Prisma enum)`, `Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast)` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 250 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `prisma.ts` to `OrdersView.tsx`, `dashboard/page.tsx`, `AdminPopupSettings.tsx`, `loyalty.ts`, `Password Reset UI Kit`, `types.ts`, `[id]/page.tsx`, `Dev Dependencies`, `auth.ts`, `referral.ts`, `TransactionsTable.tsx`, `dependencies`, `balance/page.tsx`, `buttonClass`, `supplierSync.ts`, `reviews/route.ts`, `affiliate/page.tsx`, `transactions/[orderId]/page.tsx`, `Route Protection Middleware`, `Skeleton`, `order/[orderId]/page.tsx`, `prisma`, `SettingsView.tsx`, `lucide-react`, `app/layout.tsx`, `fulfillOrder.ts`, `[id]/page.tsx`, `recent-purchases/route.ts`, `ButtonPrimary.tsx`, `ButtonPrimary.tsx`?**
  _High betweenness centrality (0.344) - this node is a cross-community bridge._
- **What connects `{ GET, POST }`, `BalanceTxnType (Prisma enum)`, `CouponStatus (Prisma enum)` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `OrdersView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08143839238498149 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `OrdersView.tsx`, `dashboard/page.tsx`, `AdminPopupSettings.tsx`, `loyalty.ts`, `Password Reset UI Kit`, `[id]/page.tsx`, `Dev Dependencies`, `TransactionsTable.tsx`, `dependencies`, `balance/page.tsx`, `buttonClass`, `affiliate/page.tsx`, `transactions/[orderId]/page.tsx`, `Skeleton`, `order/[orderId]/page.tsx`, `SettingsView.tsx`, `lucide-react`, `ThemeToggle.tsx`, `app/layout.tsx`, `[id]/page.tsx`, `ButtonPrimary.tsx`, `Badge.tsx`, `ButtonPrimary.tsx`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Should `2. Komponen` be split into smaller, more focused modules?**
  _Cohesion score 0.05398110661268556 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `OrdersView.tsx`, `dashboard/page.tsx`, `AdminPopupSettings.tsx`, `loyalty.ts`, `Password Reset UI Kit`, `[id]/page.tsx`, `Dev Dependencies`, `TransactionsTable.tsx`, `dependencies`, `balance/page.tsx`, `buttonClass`, `affiliate/page.tsx`, `transactions/[orderId]/page.tsx`, `Skeleton`, `react`, `order/[orderId]/page.tsx`, `SettingsView.tsx`, `ThemeToggle.tsx`, `app/layout.tsx`, `[id]/page.tsx`, `ButtonPrimary.tsx`, `ButtonPrimary.tsx`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `getProductsWithStats()` and `Missing Error State on Products Page`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._