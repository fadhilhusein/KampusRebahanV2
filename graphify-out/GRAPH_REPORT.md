# Graph Report - KampusRebahanV2  (2026-11-09)

## Corpus Check
- 192 files · ~74,191 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 2, .ico 2, .pen 2)

## Summary
- 929 nodes · 2570 edges · 48 communities (44 shown, 4 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 43 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9fa0f0c3`
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
- redeem/route.ts
- TypeScript Config
- auth
- supplierSync.ts
- react
- reviews/route.ts
- transactions/[orderId]/page.tsx
- referral.ts
- Route Protection Middleware
- Skeleton
- NPM Scripts
- lucide-react
- AdminShell.tsx
- Caption sounding update: November 2026
- PostCSS Config
- NextAuth Handlers
- Caption promo: Beli Claude Pro, gratis Gemini AI Pro
- prisma.ts
- order/[orderId]/page.tsx
- PayoutsView.tsx
- topup/route.ts
- SettingsView.tsx
- affiliate/page.tsx
- Badge
- Caption WhatsApp — KampusRebahan
- qrcode
- lucide-react
- app/layout.tsx
- GradientBorder.tsx
- @radix-ui/react-dropdown-menu
- mailer.ts
- eslint.config.mjs
- ButtonPrimary.tsx
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
10. `useToast()` - 25 edges

## Surprising Connections (you probably didn't know these)
- `Missing Error State on Products Page` --conceptually_related_to--> `getProductsWithStats()`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md → lib/products.ts
- `3.5 Pembayaran QRIS → `/order/[orderId]` (status pending)` --references--> `GatewayQr()`  [INFERRED]
  design/SPEC.md → components/payment/GatewayQr.tsx
- `Order (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/admin/confirm/route.ts
- `BalanceTopUp (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/balance/topup/route.ts
- `Coupon (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/loyalty/redeem/route.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **User Balance Wallet Ledger (top-up, purchase, refund)** — prisma_schema_user, prisma_schema_balancetopup, prisma_schema_balancetransaction, prisma_schema_balancetxntype, lib_credittopup_credittopup, app_api_balance_topup_route_post [INFERRED 0.85]
- **Order Payment & Fulfillment Lifecycle** — prisma_schema_order, prisma_schema_orderstatus, app_api_order_route_post, app_api_admin_confirm_route_post, app_api_admin_reject_route_post, lib_fulfillorder_fulfillorder, lib_orderstatus_statuslabel [INFERRED 0.85]
- **Password Reset Flow** — prisma_schema_passwordresettoken, prisma_schema_user, app_api_auth_forgot_password_route_post, app_api_auth_reset_password_route_post [INFERRED 0.85]

## Communities (48 total, 4 thin omitted)

### Community 0 - "OrdersView.tsx"
Cohesion: 0.16
Nodes (27): ActionRow(), AdminHomePage(), Tile(), today(), ActionButton(), ActionKind, filters, isRefundable() (+19 more)

### Community 1 - "dashboard/page.tsx"
Cohesion: 0.07
Nodes (52): BalancePage(), handleTopup(), formatPrice(), METHOD_LABEL, PRESET_AMOUNTS, TopupMethod, DashboardHomePage(), formatDate() (+44 more)

### Community 2 - "2. Komponen"
Cohesion: 0.06
Nodes (37): copy(), 1.1 Warna (hanya light; dark mode BELUM didesain), 1.2 Tipografi, 1.3 Radius, 1.4 Bayangan, 1.5 Spacing dan layout, 1.6 Navbar, 1. Design tokens (+29 more)

### Community 3 - "AdminPopupSettings.tsx"
Cohesion: 0.09
Nodes (29): GET(), POST(), GET(), AdminPopupPage(), HomePage(), revalidate, AdminPopupSettings(), formatSaved() (+21 more)

### Community 4 - "loyalty.ts"
Cohesion: 0.05
Nodes (61): GET(), IN_PROGRESS, GET(), parseOptions(), POST(), dateTime(), Estimate, InvoiceCheck() (+53 more)

### Community 5 - "Docs, Audit & Design Notes"
Cohesion: 0.10
Nodes (22): antislop Audit 001 (2026-09-20), WCAG Contrast Failures (text/placeholder/badge), Design Direction Is Web3 Template, Not KampusRebahan Brand, Two Admin Mechanisms (isAdmin vs ADMIN_EMAILS), Decorative Emoji Icons, Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast), Glass/Glow Overuse Beyond Dose Limit, middleware.ts Deprecated in Next 16 (use proxy.ts) (+14 more)

### Community 6 - "Password Reset UI Kit"
Cohesion: 0.15
Nodes (16): ForgotPasswordPage(), AuthCard(), AuthField(), AuthFieldProps, AuthNotice(), AuthPasswordField(), AuthPasswordFieldProps, AuthShell() (+8 more)

### Community 7 - "types.ts"
Cohesion: 0.07
Nodes (36): POST(), POST(), HIDDEN_PRODUCT_IDS, QRIS_GATEWAY_MAX_AMOUNT, TOPUP_MIN_AMOUNT, verifyBayarGgWebhookSignature(), creditTopUp(), CreditTopUpResult (+28 more)

### Community 8 - "[id]/page.tsx"
Cohesion: 0.20
Nodes (14): NotFound(), metadata, PrivacyPage(), ProductsCatalog(), ProductsContent(), ProductsPage(), metadata, TermsPage() (+6 more)

### Community 9 - "Dev Dependencies"
Cohesion: 0.12
Nodes (22): devDependencies, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20, @types/nodemailer@^8.0.1, @types/qrcode@^1.5.6, @types/react@^19, @types/react-dom@^19 (+14 more)

### Community 10 - "auth.ts"
Cohesion: 0.22
Nodes (17): POST(), POST(), POST(), POST(), POST(), GET(), sendResetCodeEmail(), clientIp() (+9 more)

### Community 11 - "referral.ts"
Cohesion: 0.20
Nodes (25): GET(), POST(), GET(), POST(), GET(), generateReferralCode(), isUniqueViolation(), getBoolSetting() (+17 more)

### Community 12 - "[id]/page.tsx"
Cohesion: 0.27
Nodes (9): ProductDetailContent(), ProductDetailPage(), Terms(), rupiah, typeIcon(), VariantSelector(), RatingStars(), Kartu varian (`VariantSelector`, komponen .pen "VariantCard") (+1 more)

### Community 13 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, @auth/prisma-adapter@^2.11.2, bcryptjs@^3.0.3, lucide-react@^1.3.0, motion@^12.37.0, next@16.2.6, next-themes@^0.4.6, pg@^8.20.0 (+15 more)

### Community 14 - "redeem/route.ts"
Cohesion: 0.15
Nodes (17): CouponUnavailableError, POST(), GET(), getProductsWithStats(), getMarkupPercent(), Db, openUnpaidOrder(), reservedByVariant() (+9 more)

### Community 15 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 16 - "auth"
Cohesion: 0.24
Nodes (14): POST(), GET(), POST(), GET(), GET(), expireStaleBankTransfer(), GET(), PATCH() (+6 more)

### Community 17 - "supplierSync.ts"
Cohesion: 0.19
Nodes (13): GET(), GET(), PAID_STATUSES, startOfJakartaDay(), GET(), GET(), POST(), warungApi (+5 more)

### Community 18 - "react"
Cohesion: 0.18
Nodes (15): Bubble(), Card(), EASE, item, Props, clientSnapshot(), serverSnapshot(), subscribe() (+7 more)

### Community 19 - "reviews/route.ts"
Cohesion: 0.80
Nodes (4): GET(), getSessionUserId(), mapReview(), POST()

### Community 20 - "transactions/[orderId]/page.tsx"
Cohesion: 0.12
Nodes (24): AccountDetailsPanel(), AccountGroup, COMPLAINT_STATUSES, complaintMessage(), Credential, CredentialRow(), formatDate(), formatPrice() (+16 more)

### Community 21 - "referral.ts"
Cohesion: 0.18
Nodes (13): OUT_OF_STOCK(), POST(), FulfillOrderResult, processClaimedOrder(), creditCommission(), debitWallet(), PAYOUT_METHODS, REF_COOKIE (+5 more)

### Community 22 - "Route Protection Middleware"
Cohesion: 0.40
Nodes (3): config, PROTECTED, SESSION_COOKIES

### Community 23 - "Skeleton"
Cohesion: 0.23
Nodes (10): AdminOrdersPage(), OrdersView(), formatPrice(), RefundDialog(), todayWib(), ProductDetailSkeleton(), Skeleton(), SkeletonProps (+2 more)

### Community 24 - "NPM Scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 25 - "lucide-react"
Cohesion: 0.23
Nodes (8): PaymentCancelContent(), PaymentCancelPage(), StatusIcon(), CheckState, PaymentSuccessContent(), PaymentSuccessPage(), iconMap, lucide-react

### Community 26 - "AdminShell.tsx"
Cohesion: 0.26
Nodes (10): AdminLayout(), AdminLoyaltyPage(), AdminHeader(), AdminShell(), AdminSummary, CountBadge(), isActive(), SummaryContext (+2 more)

### Community 27 - "Caption sounding update: November 2026"
Cohesion: 0.40
Nodes (4): Caption sounding update: November 2026, Teaser promo (kirim 1–2 hari kemudian), Versi lengkap, Versi singkat

### Community 30 - "Caption promo: Beli Claude Pro, gratis Gemini AI Pro"
Cohesion: 0.40
Nodes (4): Caption promo: Beli Claude Pro, gratis Gemini AI Pro, Versi feed (lengkap), Versi santai, Versi story (singkat)

### Community 31 - "prisma.ts"
Cohesion: 0.15
Nodes (12): GET(), GET(), GET(), formatRelativeTime(), GET(), getDisplayName(), handlers, RateLimited (+4 more)

### Community 32 - "order/[orderId]/page.tsx"
Cohesion: 0.17
Nodes (18): formatPrice(), TopUp, TopUpPaymentPage(), CopyButton(), formatDate(), formatPrice(), Order, OrderDetailPage() (+10 more)

### Community 33 - "PayoutsView.tsx"
Cohesion: 0.30
Nodes (9): AdminPayoutsPage(), useAdminSummary(), CopyButton(), Destination(), Payout, PayoutsView(), copyText(), formatDateTime() (+1 more)

### Community 34 - "topup/route.ts"
Cohesion: 0.38
Nodes (5): POST(), GET(), bayarGg, paymentBridge, parseGatewayTime()

### Community 35 - "SettingsView.tsx"
Cohesion: 0.20
Nodes (13): AdminSettingsPage(), Field(), Group(), MethodKey, MethodList, methods, post(), Settings (+5 more)

### Community 36 - "affiliate/page.tsx"
Cohesion: 0.23
Nodes (7): AffiliateData, AffiliatePage(), formatDate(), formatPrice(), METHODS, payoutMethodLabel, payoutStatus

### Community 37 - "Badge"
Cohesion: 0.25
Nodes (9): AdminLoyalty(), filters, formatDate(), formatPrice(), Row, stateInfo, Badge(), BadgeProps (+1 more)

### Community 38 - "Caption WhatsApp — KampusRebahan"
Cohesion: 0.33
Nodes (5): Caption 1 (lengkap), Caption 2 (singkat, untuk status), Caption 3 (ajakan santai di grup), Caption WhatsApp — KampusRebahan, Jargon pilihan

### Community 39 - "qrcode"
Cohesion: 0.33
Nodes (4): qrcode@^1.5.4, three@^0.186.0, qrcode, three

### Community 40 - "lucide-react"
Cohesion: 0.13
Nodes (21): CredentialVisual(), EditorialLanding(), minPrice(), PayVisual(), PickVisual(), rupiah, steps, HeroGallery() (+13 more)

### Community 41 - "app/layout.tsx"
Cohesion: 0.10
Nodes (20): inter, interTight, metadata, RootLayout(), authConfig, DashboardFrame(), DashboardUserContext, SidebarUser (+12 more)

### Community 50 - "mailer.ts"
Cohesion: 0.32
Nodes (7): adminNotifyEmail(), escapeHtml(), PaidOrderInfo, sendPaidOrderEmail(), transporter, nodemailer@^7.0.13, nodemailer

### Community 55 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.2.6, eslint, eslint-config-next

### Community 59 - "ButtonPrimary.tsx"
Cohesion: 0.13
Nodes (16): CheckoutContent(), CheckoutPage(), formatPrice(), PaymentMethod, fetchLoyalty(), formatPrice(), LoyaltyCard(), LoyaltyResult (+8 more)

### Community 60 - "dotenv"
Cohesion: 0.40
Nodes (4): dotenv@^17.4.2, prisma@^7.8.0, dotenv, prisma

## Ambiguous Edges - Review These
- `getProductsWithStats()` → `Missing Error State on Products Page`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md · relation: conceptually_related_to

## Knowledge Gaps
- **14 isolated node(s):** `{ GET, POST }`, `Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast)`, `Promised Voucher Feature Missing in Checkout`, `Tap Targets Under 44px`, `Hard-coded Unsourced Claims (50+ Produk, 99.9% Uptime)` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 257 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `auth.ts` to `OrdersView.tsx`, `dashboard/page.tsx`, `AdminPopupSettings.tsx`, `loyalty.ts`, `Password Reset UI Kit`, `types.ts`, `[id]/page.tsx`, `Dev Dependencies`, `referral.ts`, `[id]/page.tsx`, `dependencies`, `redeem/route.ts`, `auth`, `supplierSync.ts`, `reviews/route.ts`, `transactions/[orderId]/page.tsx`, `referral.ts`, `Route Protection Middleware`, `lucide-react`, `AdminShell.tsx`, `prisma.ts`, `order/[orderId]/page.tsx`, `topup/route.ts`, `SettingsView.tsx`, `lucide-react`, `app/layout.tsx`, `ButtonPrimary.tsx`?**
  _High betweenness centrality (0.346) - this node is a cross-community bridge._
- **What connects `{ GET, POST }`, `Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast)`, `Promised Voucher Feature Missing in Checkout` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dashboard/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07459505541346974 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `OrdersView.tsx`, `dashboard/page.tsx`, `AdminPopupSettings.tsx`, `loyalty.ts`, `Password Reset UI Kit`, `[id]/page.tsx`, `Dev Dependencies`, `[id]/page.tsx`, `dependencies`, `transactions/[orderId]/page.tsx`, `Skeleton`, `lucide-react`, `AdminShell.tsx`, `order/[orderId]/page.tsx`, `PayoutsView.tsx`, `SettingsView.tsx`, `affiliate/page.tsx`, `Badge`, `lucide-react`, `app/layout.tsx`, `GradientBorder.tsx`, `ButtonPrimary.tsx`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Should `2. Komponen` be split into smaller, more focused modules?**
  _Cohesion score 0.05547652916073969 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `OrdersView.tsx`, `dashboard/page.tsx`, `AdminPopupSettings.tsx`, `loyalty.ts`, `Password Reset UI Kit`, `[id]/page.tsx`, `Dev Dependencies`, `[id]/page.tsx`, `dependencies`, `react`, `transactions/[orderId]/page.tsx`, `Skeleton`, `AdminShell.tsx`, `order/[orderId]/page.tsx`, `PayoutsView.tsx`, `SettingsView.tsx`, `affiliate/page.tsx`, `lucide-react`, `app/layout.tsx`, `ButtonPrimary.tsx`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `getProductsWithStats()` and `Missing Error State on Products Page`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._