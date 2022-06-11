import Translator, { chains } from 'evm-translator'
import { NextApiRequest, NextApiResponse } from 'next'

import { ALCHEMY_PROJECT_ID, COVALENT_API_KEY, ETHERSCAN_API_KEY, MONGOOSE_CONNECTION_STRING } from 'utils/constants'

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    try {
        const address = _req.query.address as string
        const networkId = parseInt(_req.query.networkId as string) || 1
        const chain = Object.values(chains).find((chain) => chain.id === networkId)

        const translator = new Translator({
            chain,
            alchemyProjectId: ALCHEMY_PROJECT_ID,
            etherscanAPIKey: ETHERSCAN_API_KEY,
            connectionString: MONGOOSE_CONNECTION_STRING,
            covalentAPIKey: COVALENT_API_KEY,
            etherscanServiceLevel: 30,
        })

        await translator.initializeMongoose()
        const txHashArr = await translator.getTxHashArrayForAddress(address, 1000)

        const txArr = await translator.allDataFromTxHashArr(txHashArr, address)

        res.status(200).json({ txArr })
    } catch (err: any) {
        console.error(err)
        res.status(500).json({ statusCode: 500, message: err.message })
    }
}

export default handler
