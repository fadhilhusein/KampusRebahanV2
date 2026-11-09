# Graph Report - KampusRebahanV2  (2026-11-08)

## Corpus Check
- 189 files · ~72,875 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 2, .ico 2, .pen 2)

## Summary
- 910 nodes · 2514 edges · 42 communities (37 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 43 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9c9dc1ac`
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
- [id]/page.tsx
- dependencies
- paymentBridge.ts
- TypeScript Config
- react-dom@19.2.4
- supplierSync.ts
- next-auth
- reviews/route.ts
- Skeleton
- Route Protection Middleware
- NPM Scripts
- categoryIcons.ts
- Caption sounding update: November 2026
- PostCSS Config
- NextAuth Handlers
- Caption promo: Beli Claude Pro, gratis Gemini AI Pro
- next
- order/[orderId]/page.tsx
- prisma.ts
- SettingsView.tsx
- @prisma/adapter-pg
- Caption WhatsApp — KampusRebahan
- lucide-react
- DashboardFrame.tsx
- app/layout.tsx
- fulfillOrder.ts
- ButtonPrimary.tsx
- eslint.config.mjs
- ButtonPrimary.tsx
- dotenv

## God Nodes (most connected - your core abstractions)
1. `next` - 77 edges
2. `react` - 56 edges
3. `lucide-react` - 48 edges
4. `buttonClass()` - 42 edges
5. `prisma` - 40 edges
6. `Skeleton()` - 37 edges
7. `requireAdmin()` - 34 edges
8. `auth` - 34 edges
9. `Navbar()` - 30 edges
10. `useToast()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `3.5 Pembayaran QRIS → `/order/[orderId]` (status pending)` --references--> `GatewayQr()`  [INFERRED]
  design/SPEC.md → components/payment/GatewayQr.tsx
- `Missing Error State on Products Page` --conceptually_related_to--> `getProductsWithStats()`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md → lib/products.ts
- `3.11 Legal` --references--> `LegalArticle()`  [INFERRED]
  design/SPEC.md → components/layout/LegalArticle.tsx
- `User (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/auth/register/route.ts
- `BalanceTransaction (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/order/route.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **User Balance Wallet Ledger (top-up, purchase, refund)** — prisma_schema_user, prisma_schema_balancetopup, prisma_schema_balancetransaction, prisma_schema_balancetxntype, lib_credittopup_credittopup, app_api_balance_topup_route_post [INFERRED 0.85]
- **Order Payment & Fulfillment Lifecycle** — prisma_schema_order, prisma_schema_orderstatus, app_api_order_route_post, app_api_admin_confirm_route_post, app_api_admin_reject_route_post, lib_fulfillorder_fulfillorder, lib_orderstatus_statuslabel [INFERRED 0.85]
- **Password Reset Flow** — prisma_schema_passwordresettoken, prisma_schema_user, app_api_auth_forgot_password_route_post, app_api_auth_reset_password_route_post [INFERRED 0.85]

## Communities (42 total, 5 thin omitted)

### Community 0 - "OrdersView.tsx"
Cohesion: 0.07
Nodes (58): AdminLayout(), AdminLoyaltyPage(), AdminOrdersPage(), ActionRow(), AdminHomePage(), Tile(), today(), AdminPayoutsPage() (+50 more)

### Community 1 - "dashboard/page.tsx"
Cohesion: 0.09
Nodes (43): DashboardHomePage(), formatDate(), formatPrice(), StatCard(), BalanceHistoryTable(), BalanceTransaction, formatDate(), formatPrice() (+35 more)

### Community 2 - "2. Komponen"
Cohesion: 0.05
Nodes (38): copy(), 1.1 Warna (hanya light; dark mode BELUM didesain), 1.2 Tipografi, 1.3 Radius, 1.4 Bayangan, 1.5 Spacing dan layout, 1.6 Navbar, 1. Design tokens (+30 more)

### Community 3 - "AdminPopupSettings.tsx"
Cohesion: 0.11
Nodes (26): GET(), POST(), GET(), AdminPopupPage(), AdminPopupSettings(), formatSaved(), CardProps, InfoPopup() (+18 more)

### Community 4 - "loyalty.ts"
Cohesion: 0.07
Nodes (47): GET(), IN_PROGRESS, GET(), parseOptions(), POST(), GET(), NumberField(), RefundCalculator() (+39 more)

### Community 5 - "Docs, Audit & Design Notes"
Cohesion: 0.07
Nodes (34): antislop Audit 001 (2026-09-20), WCAG Contrast Failures (text/placeholder/badge), Design Direction Is Web3 Template, Not KampusRebahan Brand, Two Admin Mechanisms (isAdmin vs ADMIN_EMAILS), Decorative Emoji Icons, Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast), Glass/Glow Overuse Beyond Dose Limit, middleware.ts Deprecated in Next 16 (use proxy.ts) (+26 more)

### Community 6 - "Password Reset UI Kit"
Cohesion: 0.15
Nodes (16): ForgotPasswordPage(), AuthCard(), AuthField(), AuthFieldProps, AuthNotice(), AuthPasswordField(), AuthPasswordFieldProps, AuthShell() (+8 more)

### Community 7 - "types.ts"
Cohesion: 0.09
Nodes (25): HIDDEN_PRODUCT_IDS, warungApi, QRIS_GATEWAY_MAX_AMOUNT, TOPUP_MIN_AMOUNT, getMarkupPercent(), AccountDetail, ApiResponse, BalanceResponse (+17 more)

### Community 8 - "[id]/page.tsx"
Cohesion: 0.19
Nodes (18): NotFound(), PaymentCancelContent(), PaymentCancelPage(), StatusIcon(), CheckState, PaymentSuccessContent(), PaymentSuccessPage(), metadata (+10 more)

### Community 9 - "Dev Dependencies"
Cohesion: 0.12
Nodes (22): devDependencies, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20, @types/nodemailer@^8.0.1, @types/qrcode@^1.5.6, @types/react@^19, @types/react-dom@^19 (+14 more)

### Community 10 - "auth.ts"
Cohesion: 0.25
Nodes (14): POST(), POST(), POST(), CouponUnavailableError, POST(), POST(), sendResetCodeEmail(), clientIp() (+6 more)

### Community 11 - "referral.ts"
Cohesion: 0.11
Nodes (41): GET(), POST(), POST(), POST(), POST(), GET(), POST(), GET() (+33 more)

### Community 12 - "[id]/page.tsx"
Cohesion: 0.27
Nodes (9): ProductDetailContent(), ProductDetailPage(), Terms(), rupiah, typeIcon(), VariantSelector(), RatingStars(), Kartu varian (`VariantSelector`, komponen .pen "VariantCard") (+1 more)

### Community 13 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, @auth/prisma-adapter@^2.11.2, bcryptjs@^3.0.3, lucide-react@^1.3.0, motion@^12.37.0, next@16.2.6, nodemailer@^7.0.13, pg@^8.20.0 (+17 more)

### Community 14 - "paymentBridge.ts"
Cohesion: 0.29
Nodes (8): POST(), call(), sign(), verifyBridgeWebhookSignature(), BridgeCreatePaymentPayload, BridgePaymentData, BridgeResponse, BridgeWebhookPayload

### Community 15 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 17 - "supplierSync.ts"
Cohesion: 0.43
Nodes (5): POST(), applySupplierStatus(), FAILED_STATUSES, markOrderCompleted(), WebhookPayload

### Community 18 - "next-auth"
Cohesion: 0.50
Nodes (3): authConfig, next-auth@^5.0.0-beta.31, next-auth

### Community 19 - "reviews/route.ts"
Cohesion: 0.80
Nodes (4): GET(), getSessionUserId(), mapReview(), POST()

### Community 20 - "Skeleton"
Cohesion: 0.05
Nodes (64): AffiliateData, AffiliatePage(), formatDate(), formatPrice(), METHODS, BalancePage(), handleTopup(), formatPrice() (+56 more)

### Community 22 - "Route Protection Middleware"
Cohesion: 0.40
Nodes (3): config, PROTECTED, SESSION_COOKIES

### Community 24 - "NPM Scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 27 - "Caption sounding update: November 2026"
Cohesion: 0.40
Nodes (4): Caption sounding update: November 2026, Teaser promo (kirim 1–2 hari kemudian), Versi lengkap, Versi singkat

### Community 30 - "Caption promo: Beli Claude Pro, gratis Gemini AI Pro"
Cohesion: 0.40
Nodes (4): Caption promo: Beli Claude Pro, gratis Gemini AI Pro, Versi feed (lengkap), Versi santai, Versi story (singkat)

### Community 31 - "next"
Cohesion: 0.12
Nodes (24): GET(), GET(), POST(), GET(), PAID_STATUSES, startOfJakartaDay(), GET(), GET() (+16 more)

### Community 32 - "order/[orderId]/page.tsx"
Cohesion: 0.17
Nodes (14): CopyButton(), formatDate(), formatPrice(), Order, OrderDetailPage(), OrderSummary(), PaymentInstructions(), statusInfo (+6 more)

### Community 34 - "prisma.ts"
Cohesion: 0.20
Nodes (11): GET(), formatRelativeTime(), GET(), getDisplayName(), POST(), verifyBayarGgWebhookSignature(), creditTopUp(), CreditTopUpResult (+3 more)

### Community 35 - "SettingsView.tsx"
Cohesion: 0.20
Nodes (13): AdminSettingsPage(), Field(), Group(), MethodKey, MethodList, methods, post(), Settings (+5 more)

### Community 38 - "Caption WhatsApp — KampusRebahan"
Cohesion: 0.33
Nodes (5): Caption 1 (lengkap), Caption 2 (singkat, untuk status), Caption 3 (ajakan santai di grup), Caption WhatsApp — KampusRebahan, Jargon pilihan

### Community 40 - "lucide-react"
Cohesion: 0.12
Nodes (25): HomePage(), revalidate, CredentialVisual(), EditorialLanding(), minPrice(), PayVisual(), PickVisual(), rupiah (+17 more)

### Community 41 - "DashboardFrame.tsx"
Cohesion: 0.16
Nodes (15): DashboardLayout(), metadata, DashboardFrame(), DashboardUserContext, SidebarUser, accountItems, adminItem, DashboardBottomBar() (+7 more)

### Community 47 - "app/layout.tsx"
Cohesion: 0.20
Nodes (10): inter, interTight, metadata, RootLayout(), RefCapture(), NextAuthSessionProvider(), ToastProvider(), WhatsAppButton() (+2 more)

### Community 50 - "fulfillOrder.ts"
Cohesion: 0.22
Nodes (11): POST(), GET(), bayarGg, fulfillOrder(), FulfillOrderResult, processClaimedOrder(), adminNotifyEmail(), escapeHtml() (+3 more)

### Community 53 - "ButtonPrimary.tsx"
Cohesion: 0.31
Nodes (7): dateTime(), Estimate, InvoiceCheck(), rupiah(), todayWib(), metadata, RefundCalculatorPage()

### Community 55 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.2.6, eslint, eslint-config-next

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
- **14 isolated node(s):** `{ GET, POST }`, `Setting (Prisma model)`, `BalanceTxnType (Prisma enum)`, `CouponStatus (Prisma enum)`, `TopUpStatus (Prisma enum)` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 252 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `OrdersView.tsx`, `dashboard/page.tsx`, `AdminPopupSettings.tsx`, `loyalty.ts`, `Docs, Audit & Design Notes`, `Password Reset UI Kit`, `types.ts`, `[id]/page.tsx`, `Dev Dependencies`, `auth.ts`, `referral.ts`, `[id]/page.tsx`, `dependencies`, `paymentBridge.ts`, `supplierSync.ts`, `reviews/route.ts`, `Skeleton`, `Route Protection Middleware`, `order/[orderId]/page.tsx`, `prisma.ts`, `SettingsView.tsx`, `lucide-react`, `DashboardFrame.tsx`, `app/layout.tsx`, `fulfillOrder.ts`, `ButtonPrimary.tsx`, `ButtonPrimary.tsx`?**
  _High betweenness centrality (0.348) - this node is a cross-community bridge._
- **What connects `{ GET, POST }`, `Setting (Prisma model)`, `BalanceTxnType (Prisma enum)` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `OrdersView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06651017214397496 - nodes in this community are weakly interconnected._
- **Why does `react` connect `order/[orderId]/page.tsx` to `OrdersView.tsx`, `dashboard/page.tsx`, `SettingsView.tsx`, `loyalty.ts`, `AdminPopupSettings.tsx`, `Password Reset UI Kit`, `[id]/page.tsx`, `DashboardFrame.tsx`, `lucide-react`, `Dev Dependencies`, `[id]/page.tsx`, `dependencies`, `app/layout.tsx`, `Skeleton`, `ButtonPrimary.tsx`, `categoryIcons.ts`, `ButtonPrimary.tsx`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Should `dashboard/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08959899749373433 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `[id]/page.tsx` to `OrdersView.tsx`, `dashboard/page.tsx`, `order/[orderId]/page.tsx`, `AdminPopupSettings.tsx`, `SettingsView.tsx`, `loyalty.ts`, `Password Reset UI Kit`, `lucide-react`, `DashboardFrame.tsx`, `Dev Dependencies`, `[id]/page.tsx`, `dependencies`, `app/layout.tsx`, `Skeleton`, `ButtonPrimary.tsx`, `categoryIcons.ts`, `ButtonPrimary.tsx`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `getProductsWithStats()` and `Missing Error State on Products Page`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._