import { Interpretation } from 'evm-translator'
import { CriteriaType, Requirement } from 'requirements'

class Steward {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    check(
        data: Interpretation[],
        requirements: Requirement[],
    ): { meetsRequirements: boolean; txsForProof: Interpretation[] } {
        // TODO lowercase all addresses
        // TODO parse all key:timestamp keys to Date objects

        data.forEach((tx: Interpretation) => {
            console.log(tx.timestamp)
        })

        let meetsRequirements = true

        const txsForProof = []

        for (const requirement of requirements) {
            const criteriaArr = requirement.criteria

            const passingTxs = data.filter((tx: Interpretation) => {
                let meetsCriteria = true

                for (const c of criteriaArr) {
                    switch (c.type) {
                        case CriteriaType.EQUALS:
                            if (tx[c.key] !== c.value) meetsCriteria = false
                            break
                        case CriteriaType.GREATER_THAN_OR_EQUAL:
                            if (!(tx[c.key] >= c.value)) meetsCriteria = false
                            break
                        case CriteriaType.LESS_THAN_OR_EQUAL:
                            if (!(tx[c.key] <= c.value)) meetsCriteria = false
                            break
                        case CriteriaType.ONE_OF:
                            if (Array.isArray(c.value)) {
                                if (!c.value.includes(tx[c.key] as never)) meetsCriteria = false // see note at end of file
                            } else {
                                if (tx[c.key] !== c.value) meetsCriteria = false
                            }
                            break
                        default:
                            meetsCriteria = false
                            break
                    }
                }

                return meetsCriteria
            })

            console.log(passingTxs)
            txsForProof.push(passingTxs)

            if (passingTxs.length < requirement.count) {
                meetsRequirements = false
            }
        }

        return {
            meetsRequirements,
            txsForProof: txsForProof.flat(),
        }
    }
}

export default new Steward()

// other fix if we want to split out number[] and string[] into two different if statements https://stackoverflow.com/questions/53033854/why-does-the-argument-for-array-prototype-includessearchelement-need-the-same
