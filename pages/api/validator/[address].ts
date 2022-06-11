import { ActivityData } from 'evm-translator'
import { NextApiRequest, NextApiResponse } from 'next'
import { Requirement } from 'requirements'

import steward from 'utils/steward'
import getTranslator from 'utils/translator'

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    if (_req.method !== 'POST') {
        /**
         * During development, it's useful to un-comment this block
         * so you can test some of your code by just hitting this page locally
         *
         * return res.status(200).send({});
         */

        return res.status(404).send({ error: '404' })
    }

    try {
        const {
            address,
            networkId,
            requirements,
        }: { address: string; networkId: number; requirements: Requirement[] } = _req.body

        const translator = await getTranslator(networkId, address)

        const txHashArr = await translator.getTxHashArrayForAddress(address, 1000)

        const txArr = await translator.allDataFromTxHashArr(txHashArr, address)

        const interpretedTxArr = txArr.map((tx: ActivityData) => tx.interpretedData)

        const { meetsRequirements, txsForProof } = steward.check(interpretedTxArr, requirements)

        res.status(200).json({ meetsRequirements, txsForProof })
    } catch (err: any) {
        console.error(err)
        res.status(500).json({ statusCode: 500, message: err.message })
    }
}

export default handler
