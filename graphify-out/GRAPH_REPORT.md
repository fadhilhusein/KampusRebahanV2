# Graph Report - KampusRebahanV2  (2026-11-07)

## Corpus Check
- 154 files · ~58,099 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 2, .ico 2, .css 1)

## Summary
- 748 nodes · 1917 edges · 43 communities (38 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 42 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a0b1eba8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- prisma.ts
- Balance & History Tables
- 2. Komponen
- AdminPopupSettings.tsx
- buttonClass
- Docs, Audit & Design Notes
- Password Reset UI Kit
- types.ts
- Navbar
- Dev Dependencies
- Reveal.tsx
- referral.ts
- loyalty.ts
- dependencies
- next
- TypeScript Config
- app/layout.tsx
- RevealItem
- lucide-react
- forgot-password/route.ts
- ESLint Config
- transactions/[orderId]/page.tsx
- Route Protection Middleware
- Prisma Config
- NPM Scripts
- EditorialLanding.tsx
- admin/page.tsx
- [topupId]/page.tsx
- PostCSS Config
- NextAuth Handlers
- prisma
- bayarGg.ts
- Skeleton
- affiliate/page.tsx
- AdminAffiliate.tsx
- LoyaltyCard.tsx
- recent-purchases/route.ts
- VariantSelector.tsx
- Caption WhatsApp — KampusRebahan
- @auth/prisma-adapter@^2.11.2
- next-themes
- three@^0.186.0
- @types/pg@^8.20.0

## God Nodes (most connected - your core abstractions)
1. `next` - 64 edges
2. `react` - 48 edges
3. `lucide-react` - 39 edges
4. `buttonClass()` - 35 edges
5. `auth` - 34 edges
6. `prisma` - 34 edges
7. `Skeleton()` - 30 edges
8. `requireAdmin()` - 27 edges
9. `Navbar()` - 26 edges
10. `cn()` - 19 edges

## Surprising Connections (you probably didn't know these)
- `Missing Error State on Products Page` --conceptually_related_to--> `getProductsWithStats()`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md → lib/products.ts
- `3.5 Pembayaran QRIS → `/order/[orderId]` (status pending)` --references--> `GatewayQr()`  [INFERRED]
  design/SPEC.md → components/payment/GatewayQr.tsx
- `3.11 Legal` --references--> `LegalArticle()`  [INFERRED]
  design/SPEC.md → components/layout/LegalArticle.tsx
- `User (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/auth/register/route.ts
- `Setting (Prisma model)` --shares_data_with--> `getMarkupPercent()`  [INFERRED]
  prisma/schema.prisma → lib/settings.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **User Balance Wallet Ledger (top-up, purchase, refund)** — prisma_schema_user, prisma_schema_balancetopup, prisma_schema_balancetransaction, prisma_schema_balancetxntype, lib_credittopup_credittopup, app_api_balance_topup_route_post [INFERRED 0.85]
- **Order Payment & Fulfillment Lifecycle** — prisma_schema_order, prisma_schema_orderstatus, app_api_order_route_post, app_api_admin_confirm_route_post, app_api_admin_reject_route_post, lib_fulfillorder_fulfillorder, lib_orderstatus_statuslabel [INFERRED 0.85]
- **Password Reset Flow** — prisma_schema_passwordresettoken, prisma_schema_user, app_api_auth_forgot_password_route_post, app_api_auth_reset_password_route_post [INFERRED 0.85]

## Communities (43 total, 5 thin omitted)

### Community 0 - "prisma.ts"
Cohesion: 0.15
Nodes (15): GET(), GET(), GET(), GET(), PATCH(), GET(), getSessionUserId(), mapReview() (+7 more)

### Community 1 - "Balance & History Tables"
Cohesion: 0.08
Nodes (50): BalancePage(), handleTopup(), formatPrice(), PRESET_AMOUNTS, DashboardHomePage(), formatDate(), formatPrice(), StatCard() (+42 more)

### Community 2 - "2. Komponen"
Cohesion: 0.05
Nodes (39): CopyButton(), copy(), 1.1 Warna (hanya light; dark mode BELUM didesain), 1.2 Tipografi, 1.3 Radius, 1.4 Bayangan, 1.5 Spacing dan layout, 1.6 Navbar (+31 more)

### Community 3 - "AdminPopupSettings.tsx"
Cohesion: 0.10
Nodes (27): GET(), POST(), GET(), HomePage(), revalidate, AdminPopupSettings(), formatSaved(), CardProps (+19 more)

### Community 4 - "buttonClass"
Cohesion: 0.17
Nodes (18): formatDate(), formatPrice(), Order, OrderDetailPage(), OrderSummary(), PaymentInstructions(), statusInfo, toneClass (+10 more)

### Community 5 - "Docs, Audit & Design Notes"
Cohesion: 0.10
Nodes (22): antislop Audit 001 (2026-09-20), WCAG Contrast Failures (text/placeholder/badge), Design Direction Is Web3 Template, Not KampusRebahan Brand, Two Admin Mechanisms (isAdmin vs ADMIN_EMAILS), Decorative Emoji Icons, Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast), Glass/Glow Overuse Beyond Dose Limit, middleware.ts Deprecated in Next 16 (use proxy.ts) (+14 more)

### Community 6 - "Password Reset UI Kit"
Cohesion: 0.15
Nodes (16): ForgotPasswordPage(), AuthCard(), AuthField(), AuthFieldProps, AuthNotice(), AuthPasswordField(), AuthPasswordFieldProps, AuthShell() (+8 more)

### Community 7 - "types.ts"
Cohesion: 0.10
Nodes (25): POST(), warungApi, FulfillOrderResult, call(), sign(), verifyBridgeWebhookSignature(), AccountDetail, ApiResponse (+17 more)

### Community 8 - "Navbar"
Cohesion: 0.16
Nodes (19): NotFound(), PaymentCancelContent(), PaymentCancelPage(), StatusIcon(), CheckState, PaymentSuccessContent(), PaymentSuccessPage(), metadata (+11 more)

### Community 9 - "Dev Dependencies"
Cohesion: 0.12
Nodes (22): devDependencies, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20, @types/nodemailer@^8.0.1, @types/qrcode@^1.5.6, @types/react@^19, @types/react-dom@^19 (+14 more)

### Community 10 - "Reveal.tsx"
Cohesion: 0.18
Nodes (13): EASE, item, Props, clientSnapshot(), serverSnapshot(), subscribe(), ThemeToggle(), Toast (+5 more)

### Community 11 - "referral.ts"
Cohesion: 0.07
Nodes (53): POST(), REFUND_ELIGIBLE_STATUSES, GET(), POST(), POST(), POST(), GET(), POST() (+45 more)

### Community 12 - "loyalty.ts"
Cohesion: 0.19
Nodes (13): CouponUnavailableError, POST(), GET(), findCoupon(), generateCouponCode(), getLoyaltyState(), isUniqueViolation(), LOYALTY_REWARD (+5 more)

### Community 13 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, bcryptjs@^3.0.3, lucide-react@^1.3.0, next@16.2.6, next-auth@^5.0.0-beta.31, nodemailer@^7.0.13, pg@^8.20.0, @prisma/adapter-pg@^7.8.0 (+15 more)

### Community 14 - "next"
Cohesion: 0.18
Nodes (15): POST(), GET(), GET(), POST(), GET(), GET(), AdminLayout(), DashboardLayout() (+7 more)

### Community 15 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 16 - "app/layout.tsx"
Cohesion: 0.22
Nodes (8): inter, interTight, metadata, RootLayout(), RefCapture(), NextAuthSessionProvider(), ToastProvider(), WhatsAppButton()

### Community 17 - "RevealItem"
Cohesion: 0.28
Nodes (6): AdminPage(), Stat(), ToggleRow(), Reveal(), RevealItem(), Tag

### Community 18 - "lucide-react"
Cohesion: 0.18
Nodes (16): ProductsCatalog(), ProductsContent(), ProductsPage(), Bubble(), Card(), HeroGallery(), ProductCard(), rupiah (+8 more)

### Community 19 - "forgot-password/route.ts"
Cohesion: 0.21
Nodes (6): POST(), POST(), sendResetCodeEmail(), transporter, WebhookPayload, PasswordResetToken (Prisma model)

### Community 20 - "ESLint Config"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.2.6, eslint, eslint-config-next

### Community 21 - "transactions/[orderId]/page.tsx"
Cohesion: 0.15
Nodes (18): AccountDetailsPanel(), AccountGroup, Credential, CredentialRow(), formatDate(), formatPrice(), isPasswordField(), parseAccountDetails() (+10 more)

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
Cohesion: 0.18
Nodes (12): CredentialVisual(), EditorialLanding(), minPrice(), PayVisual(), PickVisual(), rupiah, steps, logos (+4 more)

### Community 26 - "admin/page.tsx"
Cohesion: 0.19
Nodes (17): AdminOrder, formatDate(), formatPrice(), OrderActions(), OrderCard, OrderCardProps, OrderDetails(), OrderRow (+9 more)

### Community 27 - "[topupId]/page.tsx"
Cohesion: 0.18
Nodes (8): formatPrice(), TopUp, TopUpPaymentPage(), Countdown(), GatewayQr(), GradientBorderProps, iconMap, react

### Community 30 - "prisma"
Cohesion: 0.22
Nodes (9): GET(), POST(), verifyBayarGgWebhookSignature(), creditTopUp(), CreditTopUpResult, globalForPrisma, prisma, BayarGgWebhookPayload (+1 more)

### Community 31 - "bayarGg.ts"
Cohesion: 0.21
Nodes (8): POST(), bayarGg, QRIS_GATEWAY_MAX_AMOUNT, TOPUP_MIN_AMOUNT, BayarGgCheckPaymentData, BayarGgCreatePaymentData, BayarGgCreatePaymentPayload, BayarGgResponse

### Community 32 - "Skeleton"
Cohesion: 0.27
Nodes (9): CheckoutContent(), CheckoutPage(), formatPrice(), PaymentMethod, CheckoutSkeleton(), ProductDetailSkeleton(), Skeleton(), SkeletonProps (+1 more)

### Community 33 - "affiliate/page.tsx"
Cohesion: 0.20
Nodes (7): AffiliateData, AffiliatePage(), formatDate(), formatPrice(), METHODS, BadgeProps, colors

### Community 34 - "AdminAffiliate.tsx"
Cohesion: 0.27
Nodes (8): AdminPayouts(), process(), AffiliateSettingsForm(), formatDate(), formatPrice(), Payout, payoutMethodLabel, payoutStatus

### Community 35 - "LoyaltyCard.tsx"
Cohesion: 0.31
Nodes (5): fetchLoyalty(), formatPrice(), LoyaltyCard(), LoyaltyResult, useToast()

### Community 36 - "recent-purchases/route.ts"
Cohesion: 0.83
Nodes (3): formatRelativeTime(), GET(), getDisplayName()

### Community 37 - "VariantSelector.tsx"
Cohesion: 0.38
Nodes (5): rupiah, typeIcon(), VariantSelector(), Kartu varian (`VariantSelector`, komponen .pen "VariantCard"), ProductVariant

### Community 38 - "Caption WhatsApp — KampusRebahan"
Cohesion: 0.33
Nodes (5): Caption 1 (lengkap), Caption 2 (singkat, untuk status), Caption 3 (ajakan santai di grup), Caption WhatsApp — KampusRebahan, Jargon pilihan

### Community 39 - "@auth/prisma-adapter@^2.11.2"
Cohesion: 0.33
Nodes (4): @auth/prisma-adapter@^2.11.2, @prisma/client@^7.8.0, @auth/prisma-adapter, @prisma/client

## Ambiguous Edges - Review These
- `getProductsWithStats()` → `Missing Error State on Products Page`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md · relation: conceptually_related_to

## Knowledge Gaps
- **14 isolated node(s):** `{ GET, POST }`, `BalanceTxnType (Prisma enum)`, `CouponStatus (Prisma enum)`, `Setting (Prisma model)`, `TopUpStatus (Prisma enum)` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 219 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `prisma.ts`, `Balance & History Tables`, `AdminPopupSettings.tsx`, `buttonClass`, `Password Reset UI Kit`, `types.ts`, `Navbar`, `Dev Dependencies`, `referral.ts`, `loyalty.ts`, `dependencies`, `app/layout.tsx`, `lucide-react`, `forgot-password/route.ts`, `transactions/[orderId]/page.tsx`, `Route Protection Middleware`, `EditorialLanding.tsx`, `admin/page.tsx`, `[topupId]/page.tsx`, `prisma`, `bayarGg.ts`, `Skeleton`, `LoyaltyCard.tsx`, `recent-purchases/route.ts`?**
  _High betweenness centrality (0.347) - this node is a cross-community bridge._
- **What connects `{ GET, POST }`, `BalanceTxnType (Prisma enum)`, `CouponStatus (Prisma enum)` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Balance & History Tables` be split into smaller, more focused modules?**
  _Cohesion score 0.07598371777476255 - nodes in this community are weakly interconnected._
- **Why does `react` connect `[topupId]/page.tsx` to `Skeleton`, `affiliate/page.tsx`, `Balance & History Tables`, `AdminAffiliate.tsx`, `buttonClass`, `AdminPopupSettings.tsx`, `Password Reset UI Kit`, `LoyaltyCard.tsx`, `Navbar`, `VariantSelector.tsx`, `Reveal.tsx`, `Dev Dependencies`, `dependencies`, `app/layout.tsx`, `lucide-react`, `transactions/[orderId]/page.tsx`, `EditorialLanding.tsx`, `admin/page.tsx`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Should `2. Komponen` be split into smaller, more focused modules?**
  _Cohesion score 0.052564102564102565 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `Skeleton`, `affiliate/page.tsx`, `Balance & History Tables`, `AdminPopupSettings.tsx`, `buttonClass`, `LoyaltyCard.tsx`, `Password Reset UI Kit`, `VariantSelector.tsx`, `Navbar`, `Dev Dependencies`, `Reveal.tsx`, `dependencies`, `app/layout.tsx`, `transactions/[orderId]/page.tsx`, `EditorialLanding.tsx`, `admin/page.tsx`, `[topupId]/page.tsx`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `getProductsWithStats()` and `Missing Error State on Products Page`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._