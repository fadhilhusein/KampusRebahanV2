---
source_file: "app/api/auth/forgot-password/route.ts"
type: "code"
community: "Password Reset Email"
location: "L12"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Password_Reset_Email
---

# POST()

## Connections
- [[PasswordResetToken (Prisma model)]] - `shares_data_with` [INFERRED]
- [[forgot-passwordroute.ts]] - `contains` [EXTRACTED]
- [[sendResetCodeEmail()]] - `calls` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/Password_Reset_Email