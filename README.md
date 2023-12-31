The Decentralized Bureau of Investigation (**DBI**) is a community-based platform aimed at enhancing communication during the crucial initial hours after a security breach or rug pull. It connects affected protocols, hackers, and the community for effective collaboration.

We're inspired to build this platform based on our own bitter experience on losing funds due to exploits/hacks. We can't participate much in the post-hack, let alone contributing in a meaningful way. Not all protocols publish a post-mortem on their incident. With DBI, we hope we can solve all of these problems.

Website: http://3.133.87.6:8080/

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

## What we want to achieve
![what we want to achieve](https://drive.google.com/uc?id=1XthoN1LTFMeLNUMZYA1__NfdzXh0CxW5)
![what we want to achieve](https://drive.google.com/uc?id=1n3EthWbHg3fVdRna3Fd8V0yNF-WgIszj)

## Polygon
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

dbi-organization-verifier: https://dbi-organization-credentials.onrender.com

By leveraging this verifier VC, we uphold a secure and reliable means of confirming the identity and validity of organizations and protocols associated with our system. For more details please click [here](https://github.com/Nava-Labs/dbi-organization-verifier)

#### DBI Officer and Deputy POAP
To foster meaningful contributions and safeguard against automated threats such as bots and Sybil attacks, individuals interested in contributing to our cause are required to successfully complete our crypto quizzes focused on cybercrime. This dual-purpose approach not only educates participants but also ensures the integrity of our community engagement. Below are the NFT contracts associated with these roles:

DBI Officer NFT Contract: https://mumbai.polygonscan.com/address/0xfD89ea46B8b403a8cAbA933A19165228B387a27f

DBI Deputy NFT Contract: https://mumbai.polygonscan.com/address/0xf1c69Db8c37B09AA0EAf1247AB1079d3b29Bb575

These NFT contracts serve as tangible proof of achievement and commitment within our community, reinforcing the importance of knowledge and expertise in combating cyber threats.

## Push Protocol
During critical hours post-hacks are very crucial. Communication plays huge role. DBI Foundation implement 3 features of push protocol to connect protocol, hackers and community
#### Public forum(NFT Gated Group Chat)
All officer NFT holders have the privilege to communicate with each other, talking about the case. Potentialy help the protocol/organization to fight the hacker back. This feature allows for efficient tagging of organization owners, promoting clarity and comprehensive collaboration in the collective effort to combat hackers and unveil their identities.
PS: Officer NFT is given to people who pass our simple cyber security quizes. This is to enhance the awareness and educate people.
#### Spaces
Empower every DAO member to host a space and express their thoughts on a case. This enhances transparency within the community, fostering collaboration and collective insights to address security incidents effectively.
#### Private chat with hackers
We provide a secure tunnel for protocols to engage in direct communication with hackers. This feature aims to facilitate clearer understanding and better outcomes in resolving incidents. Only hackers and the organization owner are able to be in the group.
#### Notification(for future development)
Notifications play a critical role in expediting communication. This becomes particularly crucial when community members actively tag individuals from different organizations. Due to strict development timeline, we couldn't be able to implement this.

## Lighthouse
#### Secure Reported Case Handling
Lighthouse also serves a critical role in securing reported hack cases through encryption and decryption measures. This approach guarantees that only authorized entities, namely the file owner and the designated organization, can access and view the sensitive information associated with reported incidents

#### Web Content Storage
DBI Foundation uses Lighthouse to get all the website content, providing a storage solution that is cost-effective, faster, and reliable.

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

### All DBI repository
- DBI App: https://github.com/Nava-Labs/dbi-app
- DBI Contracts: https://github.com/Nava-Labs/dbi-contracts
- DBI Verifier Node: https://github.com/Nava-Labs/dbi-organization-verifier
