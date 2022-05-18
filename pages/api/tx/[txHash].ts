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
        const txHash = _req.query.txHash as string
        const userAddress = _req.query.userAddress as Address
        const networkId = parseInt(_req.query.networkId as string) || 1

        const chain = Object.values(chains).find((chain) => chain.id === networkId)

        const etherskeys = createEthersAPIKeyObj(
            ALCHEMY_PROJECT_ID,
            ETHERSCAN_API_KEY,
            INFURA_PROJECT_ID,
            POCKET_NETWORK_ID,
            POCKET_NETWORK_API_KEY,
        )

        const translator = new Translator({
            chain,
            covalentApiKey: COVALENT_API_KEY,
            ethersApiKeys: etherskeys,
        })

        const tx = await translator.translateFromHash(txHash, userAddress)

        console.log(tx)

        res.status(200).json({ tx })
    } catch (err: any) {
        console.log('err', err)
        res.status(500).json({ statusCode: 500, message: err.message })
    }
}

export default handler
