export const enum CriteriaType {
    EQUALS = 'equals',
    GREATER_THAN_OR_EQUAL = 'greaterThanOrEqual',
    LESS_THAN_OR_EQUAL = 'lessThanOrEqual',
    ONE_OF = 'oneOf',
}

export type Criteria = {
    key: string //keyof Interpretation
    type: CriteriaType
    value: string | string[] | number | number[]
}

export type Requirement = {
    criteria: Criteria[]
    count: number
    //aggregate: number // aggregate value i.e. added 10 eth of liquidity in total
}

const birthblockEarlyMintCriteria: Criteria[] = [
    {
        key: 'action',
        type: CriteriaType.EQUALS,
        value: 'minted',
    },
    {
        key: 'contractAddress',
        type: CriteriaType.EQUALS,
        value: '0x2ba797c234c8fe25847225b11b616bce729b0b53',
    },
    // {
    //     key: 'timestamp',
    //     type: CriteriaType.LESS_THAN_OR_EQUAL,
    //     value: 'June 1 2022', // number
    // },
]

export const birthblockEarlyMintRequirement: Requirement = {
    criteria: birthblockEarlyMintCriteria,
    count: 1,
}

const tokenGardenEarlyMintCriteria: Criteria[] = [
    {
        key: 'action',
        type: CriteriaType.EQUALS,
        value: 'minted',
    },
    {
        key: 'contractAddress',
        type: CriteriaType.EQUALS,
        value: '0x7d414bc0482432d2d74021095256aab2e6d3f6b8',
    },
    // {
    //     key: 'timestamp',
    //     type: CriteriaType.LESS_THAN_OR_EQUAL,
    //     value: 'June 1 2022', // number
    // },
]

export const tokenGardenEarlyMintRequirement: Requirement = {
    criteria: tokenGardenEarlyMintCriteria,
    count: 1,
}

const heartbeatEarlyMintCriteria: Criteria[] = [
    {
        key: 'action',
        type: CriteriaType.EQUALS,
        value: 'minted',
    },
    {
        key: 'contractAddress',
        type: CriteriaType.EQUALS,
        value: '0xabbbdf5226f9b993e5e15a01fcb1b9c9a25987be',
    },
    // {
    //     key: 'timestamp',
    //     type: CriteriaType.LESS_THAN_OR_EQUAL,
    //     value: 'June 1 2022', // number
    // },
]

export const heartbeatEarlyMintRequirement: Requirement = {
    criteria: heartbeatEarlyMintCriteria,
    count: 1,
}

export const phaseOneEarlyMintRequirements: Requirement[] = [
    birthblockEarlyMintRequirement,
    tokenGardenEarlyMintRequirement,
    heartbeatEarlyMintRequirement,
]
