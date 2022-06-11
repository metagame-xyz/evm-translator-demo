import Translator, { chains, timer } from 'evm-translator'
import { NextApiRequest, NextApiResponse } from 'next'

import { ALCHEMY_PROJECT_ID, ETHERSCAN_API_KEY, MONGOOSE_CONNECTION_STRING } from 'utils/constants'

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    try {
        const networkId = parseInt(_req.query.networkId as string) || 1
        const chain = Object.values(chains).find((chain) => chain.id === networkId)

        const translator = new Translator({
            chain,
            alchemyProjectId: ALCHEMY_PROJECT_ID,
            etherscanAPIKey: ETHERSCAN_API_KEY,
            connectionString: MONGOOSE_CONNECTION_STRING,
            etherscanServiceLevel: 30,
        })

        await translator.initializeMongoose()

        timer.startTimer('tintin')
        await translator.downloadContractsFromTinTin()
        timer.stopTimer('tintin')

        res.status(200).json({ success: true })
        // res.status(200).json({
        //     contractAddresses,
        //     allAddresses,
        //     decoded,
        //     tx,
        // })
    } catch (err: any) {
        console.log('err', err)
        res.status(500).json({ statusCode: 500, message: err.message })
    }
}

export default handler
