---
type: community
members: 32
---

# Products, Settings & Markup

**Members:** 32 nodes

## Members
- [[BalanceTopUp (Prisma model)]] - concept - prisma/schema.prisma
- [[BalanceTransaction (Prisma model)]] - concept - prisma/schema.prisma
- [[BalanceTxnType (Prisma enum)]] - concept - prisma/schema.prisma
- [[Coupon (Prisma model)]] - concept - prisma/schema.prisma
- [[CouponStatus (Prisma enum)]] - concept - prisma/schema.prisma
- [[GET()_10]] - code - app/api/admin/settings/route.ts
- [[GET()_11]] - code - app/api/products/route.ts
- [[GET()_12]] - code - app/api/settings/public/route.ts
- [[Order (Prisma model)]] - concept - prisma/schema.prisma
- [[POST()_9]] - code - app/api/admin/reject/route.ts
- [[POST()_10]] - code - app/api/admin/settings/route.ts
- [[POST()_11]] - code - app/api/auth/register/route.ts
- [[POST()_12]] - code - app/api/order/route.ts
- [[ProductReview (Prisma model)]] - concept - prisma/schema.prisma
- [[Setting (Prisma model)]] - concept - prisma/schema.prisma
- [[TopUpStatus (Prisma enum)]] - concept - prisma/schema.prisma
- [[User (Prisma model)]] - concept - prisma/schema.prisma
- [[UserOrder (Prisma model)]] - concept - prisma/schema.prisma
- [[getMarkupPercent()]] - code - lib/settings.ts
- [[getProductsWithStats()]] - code - lib/products.ts
- [[isBankTransferEnabled()]] - code - lib/settings.ts
- [[isQrisBridgeEnabled()]] - code - lib/settings.ts
- [[isQrisGatewayEnabled()]] - code - lib/settings.ts
- [[products.ts]] - code - lib/products.ts
- [[productsroute.ts]] - code - app/api/products/route.ts
- [[publicroute.ts]] - code - app/api/settings/public/route.ts
- [[setBankTransferEnabled()]] - code - lib/settings.ts
- [[setMarkupPercent()]] - code - lib/settings.ts
- [[setQrisBridgeEnabled()]] - code - lib/settings.ts
- [[setQrisGatewayEnabled()]] - code - lib/settings.ts
- [[settings.ts]] - code - lib/settings.ts
- [[settingsroute.ts]] - code - app/api/admin/settings/route.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Products_Settings__Markup
SORT file.name ASC
```

## Connections to other communities
- 12 edges to [[_COMMUNITY_Admin Order API]]
- 11 edges to [[_COMMUNITY_Order Creation & Gateways]]
- 7 edges to [[_COMMUNITY_Webhooks & Top-up Crediting]]
- 4 edges to [[_COMMUNITY_Auth & Checkout Pages]]
- 2 edges to [[_COMMUNITY_Loyalty Coupon Rewards]]
- 2 edges to [[_COMMUNITY_Docs, Audit & Design Notes]]
- 1 edge to [[_COMMUNITY_Product Reviews API]]
- 1 edge to [[_COMMUNITY_Session & Account API]]
- 1 edge to [[_COMMUNITY_Password Reset Email]]
- 1 edge to [[_COMMUNITY_Admin Panel UI]]

## Top bridge nodes
- [[products.ts]] - degree 12, connects to 3 communities
- [[POST()_12]] - degree 9, connects to 3 communities
- [[settings.ts]] - degree 14, connects to 2 communities
- [[Order (Prisma model)]] - degree 10, connects to 2 communities
- [[User (Prisma model)]] - degree 9, connects to 2 communities