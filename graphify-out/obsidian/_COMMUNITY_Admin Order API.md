---
type: community
members: 22
---

# Admin Order API

**Members:** 22 nodes

## Members
- [[AdminLayout()]] - code - app/dashboard/admin/layout.tsx
- [[DashboardFrame()]] - code - components/dashboard/DashboardFrame.tsx
- [[DashboardLayout()]] - code - app/dashboard/layout.tsx
- [[GET()]] - code - app/api/admin/orders/route.ts
- [[GET()_1]] - code - app/api/order/[orderId]/bridge-status/route.ts
- [[GET()_2]] - code - app/api/order/[orderId]/gateway-status/route.ts
- [[POST()]] - code - app/api/admin/confirm/route.ts
- [[REFUND_ELIGIBLE_STATUSES]] - code - app/api/admin/reject/route.ts
- [[adminlayout.tsx]] - code - app/dashboard/admin/layout.tsx
- [[adminAuth.ts]] - code - lib/adminAuth.ts
- [[bridge-statusroute.ts]] - code - app/api/order/[orderId]/bridge-status/route.ts
- [[confirmroute.ts]] - code - app/api/admin/confirm/route.ts
- [[dashboardlayout.tsx]] - code - app/dashboard/layout.tsx
- [[fulfillOrder()]] - code - lib/fulfillOrder.ts
- [[gateway-statusroute.ts]] - code - app/api/order/[orderId]/gateway-status/route.ts
- [[metadata_2]] - code - app/dashboard/layout.tsx
- [[next]] - concept - package.json
- [[next.config.ts]] - code - next.config.ts
- [[nextConfig]] - code - next.config.ts
- [[ordersroute.ts]] - code - app/api/admin/orders/route.ts
- [[rejectroute.ts]] - code - app/api/admin/reject/route.ts
- [[requireAdmin()]] - code - lib/adminAuth.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Admin_Order_API
SORT file.name ASC
```

## Connections to other communities
- 20 edges to [[_COMMUNITY_Session & Account API]]
- 17 edges to [[_COMMUNITY_Auth & Checkout Pages]]
- 15 edges to [[_COMMUNITY_Webhooks & Top-up Crediting]]
- 12 edges to [[_COMMUNITY_Products, Settings & Markup]]
- 10 edges to [[_COMMUNITY_Order Creation & Gateways]]
- 5 edges to [[_COMMUNITY_Dashboard Shell & Navigation]]
- 5 edges to [[_COMMUNITY_Payment Bridge QRIS]]
- 4 edges to [[_COMMUNITY_Loyalty Coupon Rewards]]
- 3 edges to [[_COMMUNITY_Password Reset UI Kit]]
- 3 edges to [[_COMMUNITY_Admin Panel UI]]
- 2 edges to [[_COMMUNITY_Balance & History Tables]]
- 1 edge to [[_COMMUNITY_Order Detail & Credentials]]
- 1 edge to [[_COMMUNITY_Root Layout & Providers]]
- 1 edge to [[_COMMUNITY_Dev Dependencies]]
- 1 edge to [[_COMMUNITY_Password Reset Email]]
- 1 edge to [[_COMMUNITY_Product Reviews API]]
- 1 edge to [[_COMMUNITY_Landing Hero & Banners]]
- 1 edge to [[_COMMUNITY_Route Protection Middleware]]
- 1 edge to [[_COMMUNITY_Runtime Dependencies]]

## Top bridge nodes
- [[next]] - degree 62, connects to 19 communities
- [[fulfillOrder()]] - degree 16, connects to 5 communities
- [[bridge-statusroute.ts]] - degree 12, connects to 4 communities
- [[gateway-statusroute.ts]] - degree 12, connects to 3 communities
- [[requireAdmin()]] - degree 21, connects to 2 communities