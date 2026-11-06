# Graph Report - KampusRebahanV2  (2026-11-06)

## Corpus Check
- 134 files · ~47,729 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 2, .ico 2, .css 1)

## Summary
- 639 nodes · 1571 edges · 27 communities (20 shown, 7 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 41 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `02a04549`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- admin/page.tsx
- Balance & History Tables
- 2. Komponen
- types.ts
- Docs, Audit & Design Notes
- Password Reset UI Kit
- react
- Dev Dependencies
- next-themes
- settings/route.ts
- [id]/page.tsx
- Runtime Dependencies
- TypeScript Config
- Root Layout & Providers
- next
- pg
- ESLint Config
- react-dom@19.2.4
- Route Protection Middleware
- Prisma Config
- NPM Scripts
- lucide-react
- @types/bcryptjs@^2.4.6
- PostCSS Config
- NextAuth Handlers
- @types/pg@^8.20.0
- forgot-password/route.ts

## God Nodes (most connected - your core abstractions)
1. `next` - 57 edges
2. `react` - 41 edges
3. `lucide-react` - 34 edges
4. `auth` - 32 edges
5. `buttonClass()` - 28 edges
6. `prisma` - 28 edges
7. `Skeleton()` - 24 edges
8. `requireAdmin()` - 21 edges
9. `cn()` - 19 edges
10. `Navbar()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `Missing Error State on Products Page` --conceptually_related_to--> `getProductsWithStats()`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md → lib/products.ts
- `3.5 Pembayaran QRIS → `/order/[orderId]` (status pending)` --references--> `GatewayQr()`  [INFERRED]
  design/SPEC.md → components/payment/GatewayQr.tsx
- `ProductReview (Prisma model)` --shares_data_with--> `getProductsWithStats()`  [INFERRED]
  prisma/schema.prisma → lib/products.ts
- `Setting (Prisma model)` --shares_data_with--> `getMarkupPercent()`  [INFERRED]
  prisma/schema.prisma → lib/settings.ts
- `User (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/auth/register/route.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **User Balance Wallet Ledger (top-up, purchase, refund)** — prisma_schema_user, prisma_schema_balancetopup, prisma_schema_balancetransaction, prisma_schema_balancetxntype, lib_credittopup_credittopup, app_api_balance_topup_route_post [INFERRED 0.85]
- **Order Payment & Fulfillment Lifecycle** — prisma_schema_order, prisma_schema_orderstatus, app_api_order_route_post, app_api_admin_confirm_route_post, app_api_admin_reject_route_post, lib_fulfillorder_fulfillorder, lib_orderstatus_statuslabel [INFERRED 0.85]
- **Password Reset Flow** — prisma_schema_passwordresettoken, prisma_schema_user, app_api_auth_forgot_password_route_post, app_api_auth_reset_password_route_post [INFERRED 0.85]

## Communities (27 total, 7 thin omitted)

### Community 0 - "admin/page.tsx"
Cohesion: 0.14
Nodes (21): AdminOrder, AdminPage(), formatDate(), formatPrice(), OrderActions(), OrderCard, OrderCardProps, OrderDetails() (+13 more)

### Community 1 - "Balance & History Tables"
Cohesion: 0.09
Nodes (43): DashboardHomePage(), formatDate(), formatPrice(), StatCard(), BalanceHistoryTable(), formatDate(), formatPrice(), typeInfo (+35 more)

### Community 2 - "2. Komponen"
Cohesion: 0.06
Nodes (36): copy(), 1.1 Warna (hanya light; dark mode BELUM didesain), 1.2 Tipografi, 1.3 Radius, 1.4 Bayangan, 1.5 Spacing dan layout, 1.6 Navbar, 1. Design tokens (+28 more)

### Community 3 - "types.ts"
Cohesion: 0.07
Nodes (28): TOPUP_MIN_AMOUNT, call(), sign(), AccountDetail, ApiResponse, BalanceResponse, BalanceResult, BayarGgCheckPaymentData (+20 more)

### Community 5 - "Docs, Audit & Design Notes"
Cohesion: 0.11
Nodes (21): antislop Audit 001 (2026-09-20), WCAG Contrast Failures (text/placeholder/badge), Design Direction Is Web3 Template, Not KampusRebahan Brand, Decorative Emoji Icons, Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast), Glass/Glow Overuse Beyond Dose Limit, middleware.ts Deprecated in Next 16 (use proxy.ts), Missing Error State on Products Page (+13 more)

### Community 6 - "Password Reset UI Kit"
Cohesion: 0.15
Nodes (16): ForgotPasswordPage(), AuthCard(), AuthField(), AuthFieldProps, AuthNotice(), AuthPasswordField(), AuthPasswordFieldProps, AuthShell() (+8 more)

### Community 8 - "react"
Cohesion: 0.06
Nodes (50): CheckoutContent(), CheckoutPage(), formatPrice(), PaymentMethod, BalancePage(), handleTopup(), formatPrice(), PRESET_AMOUNTS (+42 more)

### Community 9 - "Dev Dependencies"
Cohesion: 0.12
Nodes (22): devDependencies, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20, @types/nodemailer@^8.0.1, @types/qrcode@^1.5.6, @types/react@^19, @types/react-dom@^19 (+14 more)

### Community 11 - "settings/route.ts"
Cohesion: 0.26
Nodes (14): GET(), POST(), GET(), GET(), getProductsWithStats(), getMarkupPercent(), isBankTransferEnabled(), isQrisBridgeEnabled() (+6 more)

### Community 12 - "[id]/page.tsx"
Cohesion: 0.08
Nodes (40): HomePage(), revalidate, ProductDetailContent(), ProductDetailPage(), Terms(), ProductsCatalog(), ProductsContent(), ProductsPage() (+32 more)

### Community 13 - "Runtime Dependencies"
Cohesion: 0.10
Nodes (21): dependencies, @auth/prisma-adapter@^2.11.2, bcryptjs@^3.0.3, lucide-react@^1.3.0, next@16.2.6, next-auth@^5.0.0-beta.31, nodemailer@^7.0.13, @prisma/adapter-pg@^7.8.0 (+13 more)

### Community 15 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 16 - "Root Layout & Providers"
Cohesion: 0.25
Nodes (7): inter, interTight, metadata, RootLayout(), NextAuthSessionProvider(), ToastProvider(), WhatsAppButton()

### Community 17 - "next"
Cohesion: 0.05
Nodes (74): Two Admin Mechanisms (isAdmin vs ADMIN_EMAILS), POST(), GET(), POST(), REFUND_ELIGIBLE_STATUSES, POST(), GET(), POST() (+66 more)

### Community 20 - "ESLint Config"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.2.6, eslint, eslint-config-next

### Community 22 - "Route Protection Middleware"
Cohesion: 0.40
Nodes (3): config, PROTECTED, SESSION_COOKIES

### Community 23 - "Prisma Config"
Cohesion: 0.40
Nodes (4): dotenv@^17.4.2, prisma@^7.8.0, dotenv, prisma

### Community 24 - "NPM Scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 25 - "lucide-react"
Cohesion: 0.06
Nodes (45): formatPrice(), TopUp, TopUpPaymentPage(), NotFound(), CopyButton(), formatDate(), formatPrice(), Order (+37 more)

### Community 31 - "forgot-password/route.ts"
Cohesion: 0.38
Nodes (5): POST(), POST(), sendResetCodeEmail(), transporter, PasswordResetToken (Prisma model)

## Ambiguous Edges - Review These
- `getProductsWithStats()` → `Missing Error State on Products Page`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md · relation: conceptually_related_to

## Knowledge Gaps
- **14 isolated node(s):** `{ GET, POST }`, `Setting (Prisma model)`, `BalanceTxnType (Prisma enum)`, `CouponStatus (Prisma enum)`, `TopUpStatus (Prisma enum)` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 195 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `admin/page.tsx`, `Balance & History Tables`, `types.ts`, `Password Reset UI Kit`, `react`, `Dev Dependencies`, `settings/route.ts`, `[id]/page.tsx`, `Runtime Dependencies`, `Root Layout & Providers`, `Route Protection Middleware`, `lucide-react`, `forgot-password/route.ts`?**
  _High betweenness centrality (0.336) - this node is a cross-community bridge._
- **What connects `{ GET, POST }`, `Setting (Prisma model)`, `BalanceTxnType (Prisma enum)` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `admin/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14333333333333334 - nodes in this community are weakly interconnected._
- **Why does `react` connect `lucide-react` to `admin/page.tsx`, `Balance & History Tables`, `Password Reset UI Kit`, `react`, `Dev Dependencies`, `[id]/page.tsx`, `Runtime Dependencies`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._
- **Should `Balance & History Tables` be split into smaller, more focused modules?**
  _Cohesion score 0.08897243107769423 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `admin/page.tsx`, `Balance & History Tables`, `Password Reset UI Kit`, `react`, `Dev Dependencies`, `[id]/page.tsx`, `Runtime Dependencies`, `Root Layout & Providers`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `getProductsWithStats()` and `Missing Error State on Products Page`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._