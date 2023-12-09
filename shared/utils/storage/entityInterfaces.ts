export interface WebsiteContent {
    organisations: Organisation[]
}
  
export interface Organisation {
    name: string,
    logoUrl: string,
    treasuryAddress: string,
    tokenAddress: string,
    minRequired: number,
    creator: string,
    posts: Post[]
}

export interface Post {
    title: string,
    description: string,
    stolenTokenAddress: string[],
    stolenAmount: string[],
    caseDeadline: number,
    bountyOffered: number,
    bountyContract: string,
    caseCreator: string,
    hackerAddr: string,
    breadcrumbsUrl: string,
    pushPublicGroupId: string,
    pushPrivateGroupId: string
}
