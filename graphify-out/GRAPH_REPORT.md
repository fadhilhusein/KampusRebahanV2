# Graph Report - KampusRebahanV2  (2026-11-06)

## Corpus Check
- Corpus is ~45,034 words - fits in a single context window. You may not need a graph.

## Summary
- 613 nodes · 1537 edges · 30 communities (25 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 37 edges (avg confidence: 0.83)
- Token cost: 118,918 input · 0 output

## Community Hubs (Navigation)
- Auth & Checkout Pages
- Balance & History Tables
- Admin Panel UI
- Order Creation & Gateways
- Products, Settings & Markup
- Docs, Audit & Design Notes
- Password Reset UI Kit
- Webhooks & Top-up Crediting
- Dashboard Shell & Navigation
- Dev Dependencies
- Admin Order API
- Order Detail & Credentials
- Landing Hero & Banners
- Runtime Dependencies
- Session & Account API
- TypeScript Config
- Root Layout & Providers
- Loyalty Coupon Rewards
- Payment Bridge QRIS
- Password Reset Email
- ESLint Config
- Product Reviews API
- Route Protection Middleware
- Prisma Config
- NPM Scripts
- Prisma PG Adapter
- Prisma Client
- Three.js
- PostCSS Config
- NextAuth Handlers

## God Nodes (most connected - your core abstractions)
1. `next` - 62 edges
2. `react` - 42 edges
3. `lucide-react` - 35 edges
4. `auth` - 32 edges
5. `Navbar()` - 29 edges
6. `ButtonPrimary()` - 29 edges
7. `prisma` - 28 edges
8. `Footer()` - 23 edges
9. `cn()` - 23 edges
10. `requireAdmin()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Missing Error State on Products Page` --conceptually_related_to--> `getProductsWithStats()`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md → lib/products.ts
- `Order (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/admin/confirm/route.ts
- `User (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/auth/register/route.ts
- `BalanceTopUp (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/balance/topup/route.ts
- `Coupon (Prisma model)` --shares_data_with--> `POST()`  [INFERRED]
  prisma/schema.prisma → app/api/loyalty/redeem/route.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Order Payment & Fulfillment Lifecycle** — prisma_schema_order, prisma_schema_orderstatus, app_api_order_route_post, app_api_admin_confirm_route_post, app_api_admin_reject_route_post, lib_fulfillorder_fulfillorder, lib_orderstatus_statuslabel [INFERRED 0.85]
- **User Balance Wallet Ledger (top-up, purchase, refund)** — prisma_schema_user, prisma_schema_balancetopup, prisma_schema_balancetransaction, prisma_schema_balancetxntype, lib_credittopup_credittopup, app_api_balance_topup_route_post [INFERRED 0.85]
- **Password Reset Flow** — prisma_schema_passwordresettoken, prisma_schema_user, app_api_auth_forgot_password_route_post, app_api_auth_reset_password_route_post [INFERRED 0.85]

## Communities (30 total, 5 thin omitted)

### Community 0 - "Auth & Checkout Pages"
Cohesion: 0.06
Nodes (64): SignInPage(), SignUpPage(), CheckoutContent(), CheckoutPage(), formatPrice(), formatPrice(), TopUp, TopUpPaymentPage() (+56 more)

### Community 1 - "Balance & History Tables"
Cohesion: 0.07
Nodes (47): BalancePage(), handleTopup(), formatPrice(), TransactionsPage(), BalanceHistoryTable(), BalanceTransaction, formatDate(), formatPrice() (+39 more)

### Community 2 - "Admin Panel UI"
Cohesion: 0.07
Nodes (37): AdminOrder, AdminPage(), formatDate(), formatPrice(), OrderCard, OrderCardProps, paymentMethodInfo, REFUND_ELIGIBLE_STATUSES (+29 more)

### Community 3 - "Order Creation & Gateways"
Cohesion: 0.08
Nodes (26): POST(), warungApi, bayarGg, QRIS_GATEWAY_MAX_AMOUNT, TOPUP_MIN_AMOUNT, FulfillOrderResult, AccountDetail, ApiResponse (+18 more)

### Community 4 - "Products, Settings & Markup"
Cohesion: 0.14
Nodes (27): POST(), GET(), POST(), POST(), POST(), GET(), GET(), getProductsWithStats() (+19 more)

### Community 5 - "Docs, Audit & Design Notes"
Cohesion: 0.10
Nodes (22): antislop Audit 001 (2026-09-20), WCAG Contrast Failures (text/placeholder/badge), Design Direction Is Web3 Template, Not KampusRebahan Brand, Two Admin Mechanisms (isAdmin vs ADMIN_EMAILS), Decorative Emoji Icons, Keyboard/Focus & ARIA Issues (outline-none, Link wrapping button, dropdown/toast), Glass/Glow Overuse Beyond Dose Limit, middleware.ts Deprecated in Next 16 (use proxy.ts) (+14 more)

### Community 6 - "Password Reset UI Kit"
Cohesion: 0.19
Nodes (16): ForgotPasswordPage(), AuthCard(), AuthField(), AuthFieldProps, AuthNotice(), AuthPasswordField(), AuthPasswordFieldProps, AuthShell() (+8 more)

### Community 7 - "Webhooks & Top-up Crediting"
Cohesion: 0.15
Nodes (12): GET(), formatRelativeTime(), GET(), getDisplayName(), POST(), verifyBayarGgWebhookSignature(), creditTopUp(), CreditTopUpResult (+4 more)

### Community 8 - "Dashboard Shell & Navigation"
Cohesion: 0.17
Nodes (18): CommandSearch(), go(), handleKeyDown(), DashboardShell(), flattenItems(), isItemActive(), matchesPath(), NavGroupData (+10 more)

### Community 9 - "Dev Dependencies"
Cohesion: 0.12
Nodes (22): devDependencies, tailwindcss@^4, @tailwindcss/postcss@^4, @types/node@^20, @types/nodemailer@^8.0.1, @types/qrcode@^1.5.6, @types/react@^19, @types/react-dom@^19 (+14 more)

### Community 10 - "Admin Order API"
Cohesion: 0.20
Nodes (13): POST(), GET(), REFUND_ELIGIBLE_STATUSES, GET(), GET(), AdminLayout(), DashboardLayout(), metadata (+5 more)

### Community 11 - "Order Detail & Credentials"
Cohesion: 0.14
Nodes (18): AccountDetailsPanel(), AccountGroup, Credential, CredentialRow(), formatDate(), formatPrice(), isPasswordField(), parseAccountDetails() (+10 more)

### Community 12 - "Landing Hero & Banners"
Cohesion: 0.15
Nodes (18): Hero(), clientSnapshot(), HeroShader(), serverSnapshot(), subscribe(), formatRelativeTime(), RecentPurchase, RecentPurchaseBanner() (+10 more)

### Community 13 - "Runtime Dependencies"
Cohesion: 0.10
Nodes (21): dependencies, @auth/prisma-adapter@^2.11.2, bcryptjs@^3.0.3, lucide-react@^1.3.0, motion@^12.37.0, next@16.2.6, pg@^8.20.0, qrcode@^1.5.4 (+13 more)

### Community 14 - "Session & Account API"
Cohesion: 0.18
Nodes (11): GET(), GET(), GET(), GET(), PATCH(), GET(), auth, authConfig (+3 more)

### Community 15 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 16 - "Root Layout & Providers"
Cohesion: 0.15
Nodes (12): metadata, poppins, RootLayout(), NextAuthSessionProvider(), Toast, ToastContext, ToastContextValue, ToastProvider() (+4 more)

### Community 17 - "Loyalty Coupon Rewards"
Cohesion: 0.19
Nodes (13): CouponUnavailableError, POST(), GET(), findCoupon(), generateCouponCode(), getLoyaltyState(), isUniqueViolation(), LOYALTY_REWARD (+5 more)

### Community 18 - "Payment Bridge QRIS"
Cohesion: 0.25
Nodes (9): POST(), call(), paymentBridge, sign(), verifyBridgeWebhookSignature(), BridgeCreatePaymentPayload, BridgePaymentData, BridgeResponse (+1 more)

### Community 19 - "Password Reset Email"
Cohesion: 0.28
Nodes (7): POST(), POST(), sendResetCodeEmail(), transporter, nodemailer@^7.0.13, PasswordResetToken (Prisma model), nodemailer

### Community 20 - "ESLint Config"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.2.6, eslint, eslint-config-next

### Community 21 - "Product Reviews API"
Cohesion: 0.80
Nodes (4): GET(), getSessionUserId(), mapReview(), POST()

### Community 22 - "Route Protection Middleware"
Cohesion: 0.40
Nodes (3): config, PROTECTED, SESSION_COOKIES

### Community 23 - "Prisma Config"
Cohesion: 0.40
Nodes (4): dotenv@^17.4.2, prisma@^7.8.0, dotenv, prisma

### Community 24 - "NPM Scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

## Ambiguous Edges - Review These
- `getProductsWithStats()` → `Missing Error State on Products Page`  [AMBIGUOUS]
  anti-slop/audit-001-2026-09-20.md · relation: conceptually_related_to

## Knowledge Gaps
- **14 isolated node(s):** `{ GET, POST }`, `CLAUDE.md includes AGENTS.md`, `create-next-app Bootstrap README`, `6px Base Spacing Rhythm`, `Expressive Motion Level` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 158 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Admin Order API` to `Auth & Checkout Pages`, `Balance & History Tables`, `Admin Panel UI`, `Order Creation & Gateways`, `Products, Settings & Markup`, `Password Reset UI Kit`, `Webhooks & Top-up Crediting`, `Dashboard Shell & Navigation`, `Dev Dependencies`, `Order Detail & Credentials`, `Landing Hero & Banners`, `Runtime Dependencies`, `Session & Account API`, `Root Layout & Providers`, `Loyalty Coupon Rewards`, `Payment Bridge QRIS`, `Password Reset Email`, `Product Reviews API`, `Route Protection Middleware`?**
  _High betweenness centrality (0.365) - this node is a cross-community bridge._
- **What connects `{ GET, POST }`, `CLAUDE.md includes AGENTS.md`, `create-next-app Bootstrap README` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Auth & Checkout Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.059369202226345084 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Auth & Checkout Pages` to `Balance & History Tables`, `Admin Panel UI`, `Password Reset UI Kit`, `Dashboard Shell & Navigation`, `Dev Dependencies`, `Order Detail & Credentials`, `Landing Hero & Banners`, `Runtime Dependencies`, `Root Layout & Providers`?**
  _High betweenness centrality (0.147) - this node is a cross-community bridge._
- **Should `Balance & History Tables` be split into smaller, more focused modules?**
  _Cohesion score 0.07211538461538461 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Auth & Checkout Pages` to `Balance & History Tables`, `Admin Panel UI`, `Password Reset UI Kit`, `Dashboard Shell & Navigation`, `Dev Dependencies`, `Order Detail & Credentials`, `Landing Hero & Banners`, `Runtime Dependencies`, `Root Layout & Providers`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `getProductsWithStats()` and `Missing Error State on Products Page`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._