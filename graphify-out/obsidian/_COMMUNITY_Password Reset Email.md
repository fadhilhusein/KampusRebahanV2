---
type: community
members: 9
---

# Password Reset Email

**Members:** 9 nodes

## Members
- [[POST()_3]] - code - app/api/auth/forgot-password/route.ts
- [[POST()_4]] - code - app/api/auth/reset-password/route.ts
- [[PasswordResetToken (Prisma model)]] - concept - prisma/schema.prisma
- [[forgot-passwordroute.ts]] - code - app/api/auth/forgot-password/route.ts
- [[mailer.ts]] - code - lib/mailer.ts
- [[nodemailer]] - concept - package.json
- [[nodemailer@7.0.13]] - code - package.json
- [[sendResetCodeEmail()]] - code - lib/mailer.ts
- [[transporter]] - code - lib/mailer.ts

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Password_Reset_Email
SORT file.name ASC
```

## Connections to other communities
- 4 edges to [[_COMMUNITY_Webhooks & Top-up Crediting]]
- 1 edge to [[_COMMUNITY_Admin Order API]]
- 1 edge to [[_COMMUNITY_Runtime Dependencies]]
- 1 edge to [[_COMMUNITY_Dev Dependencies]]
- 1 edge to [[_COMMUNITY_Products, Settings & Markup]]

## Top bridge nodes
- [[forgot-passwordroute.ts]] - degree 7, connects to 2 communities
- [[nodemailer]] - degree 3, connects to 1 community
- [[PasswordResetToken (Prisma model)]] - degree 3, connects to 1 community
- [[POST()_4]] - degree 2, connects to 1 community
- [[nodemailer@7.0.13]] - degree 2, connects to 1 community