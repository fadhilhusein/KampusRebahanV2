---
type: community
members: 11
---

# Payment Bridge QRIS

**Members:** 11 nodes

## Members
- [[BridgeCreatePaymentPayload]] - code - lib/types.ts
- [[BridgePaymentData]] - code - lib/types.ts
- [[BridgeResponse]] - code - lib/types.ts
- [[BridgeWebhookPayload]] - code - lib/types.ts
- [[POST()_2]] - code - app/api/webhook/bridge/route.ts
- [[bridgeroute.ts]] - code - app/api/webhook/bridge/route.ts
- [[call()]] - code - lib/paymentBridge.ts
- [[paymentBridge]] - code - lib/paymentBridge.ts
- [[paymentBridge.ts]] - code - lib/paymentBridge.ts
- [[sign()]] - code - lib/paymentBridge.ts
- [[verifyBridgeWebhookSignature()]] - code - lib/paymentBridge.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Payment_Bridge_QRIS
SORT file.name ASC
```

## Connections to other communities
- 9 edges to [[_COMMUNITY_Order Creation & Gateways]]
- 5 edges to [[_COMMUNITY_Admin Order API]]
- 3 edges to [[_COMMUNITY_Webhooks & Top-up Crediting]]

## Top bridge nodes
- [[paymentBridge.ts]] - degree 12, connects to 3 communities
- [[bridgeroute.ts]] - degree 10, connects to 3 communities
- [[paymentBridge]] - degree 3, connects to 2 communities
- [[POST()_2]] - degree 3, connects to 1 community
- [[BridgeCreatePaymentPayload]] - degree 2, connects to 1 community