import Translator, { Address, chains, createEthersAPIKeyObj } from 'evm-translator'
import { NextApiRequest, NextApiResponse } from 'next'

import {
    ALCHEMY_PROJECT_ID,
    COVALENT_API_KEY,
    ETHERSCAN_API_KEY,
    INFURA_PROJECT_ID,
    POCKET_NETWORK_API_KEY,
    POCKET_NETWORK_ID,
} from 'utils/constants'

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    try {
        const address = _req.query.address as Address

        const etherskeys = createEthersAPIKeyObj(
            ALCHEMY_PROJECT_ID,
            ETHERSCAN_API_KEY,
            INFURA_PROJECT_ID,
            POCKET_NETWORK_ID,
            POCKET_NETWORK_API_KEY,
        )

        const translator = new Translator({
            chain: chains.ethereum,
            covalentApiKey: COVALENT_API_KEY,
            ethersApiKeys: etherskeys,
        })

        const txArr = await translator.translateFromAddress(address, true, 100)
        const decodedArr = txArr.map((tx) => tx.decodedData)
        const interpretedArr = txArr.map((tx) => tx.interpretedData)

        res.status(200).json({ decodedArr, interpretedArr })
    } catch (err: any) {
        console.error(err)
        res.status(500).json({ statusCode: 500, message: err.message })
    }
}

export default handler
