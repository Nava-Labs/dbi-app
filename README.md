The Decentralized Bureau of Investigation (**DBI**) is a community-based platform aimed at enhancing communication during the crucial initial hours after a security breach or rug pull. It connects affected protocols, hackers, and the community for effective collaboration.

### Key Features:
* Verified Organizations: Utilizes Polygon ID and Log in with X Authentication for authenticity. 
* Secure Data Storage: Lighthouse Storage for encrypted data keeping. 
* Live Communication: Offers real-time chats via Push Protocol. 
* Supports Multiple Chains: Compatible with Polygon, Arbitrum, Scroll, Base, and Mantle.

### For Projects/Protocols:
* Organization Creation: Authenticate using Wallet, Polygon ID, and Log in with X.
* Community-Driven Cases: permissionless case creation by token holders.
* Automated Bounty System: Rewards hackers through smart contracts.
* Private Communication with Hackers: Facilitates discreet p2p chat with the hacker.
* Decentralized Report Submission: Secure and decentralized reporting process.

### For the Community:
* Case and Bounty Initiation: Allows starting cases and setting up bounties independently (for rug pull cases).
* Open Group Chats: Dedicated chat for each case.
* Open Space: Dedicate Space (audio) for each case.
* Report and Earn: Rewards for contributing valuable insights.
* Education and POAP: Complete DBI quiz and mint a POAP.

### For Hackers:
* Privacy-Focused: Requires only a wallet for anonymous communication.
* Automated Rewards: Bounties distributed via smart contracts.

## Polygon id
#### Issuer node
We use polygon id to verify the identity of the creator of the organization or protocol. This verification process ensures that the creator has the authority to establish essential parameters, including:
- Treasury address
- Token address
- Minimum token amount for DAO member to create a `Case`

To optimize outcomes, the DBI Foundation has deployed a dedicated Issuer Node for issuing Verifiable Credentials (VC). The Issuer Node instances are as follows:
- Polygon ID - Issuer 1: http://3.133.87.6:3001/
- Polygon ID - Issuer API: http://3.133.87.6:3002/
- Polygon ID - Issuer API(UI): http://3.133.87.6:8088/

#### Verifier node
In order to authenticate and verify the legitimacy of an organization or protocol, we have deployed a dedicated Verifier Verifiable Credential (VC) system. This verification process ensures the credibility and authenticity of the entities in question. The verifier VC is hosted at the following address:

dbi-organization-verifier: https://dbi-organization-verifier.onrender.com

By leveraging this verifier VC, we uphold a secure and reliable means of confirming the identity and validity of organizations and protocols associated with our system.


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.