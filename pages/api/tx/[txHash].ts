import Translator, { chains, InterpreterMap } from 'evm-translator'
import { NextApiRequest, NextApiResponse } from 'next'

import { ALCHEMY_PROJECT_ID, ETHERSCAN_API_KEY, MONGOOSE_CONNECTION_STRING } from 'utils/constants'
import getTranslator from 'utils/translator'

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    try {
        const txHash = _req.query.txHash as string
        const userAddress = _req.query.userAddress as string
        const networkId = parseInt(_req.query.networkId as string) || 1
        const interpreterMapStr = _req.query.interpreterMap as string

        const interpreterMap = JSON.parse(interpreterMapStr) as InterpreterMap

        const chain = Object.values(chains).find((chain) => chain.id === networkId)

        const translator = await getTranslator(networkId, userAddress, interpreterMap)

        const tx = await translator.allDataFromTxHash(txHash, userAddress)

        console.log(tx)

        res.status(200).json({ tx })
    } catch (err: any) {
        console.log('err', err)
        res.status(500).json({ statusCode: 500, message: err.message })
    }
}

export default handler
