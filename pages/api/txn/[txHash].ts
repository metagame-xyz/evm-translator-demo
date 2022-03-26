import Translator from 'evm-translator'
import { Chain } from 'evm-translator/lib/interfaces'
import { NextApiRequest, NextApiResponse } from 'next'
import { COVALENT_API_KEY } from 'utils/constants'

const ethereum: Chain = {
    EVM: true,
    id: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    testnet: false,
    blockExplorerUrl: 'https://etherscan.io/',
}

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    try {
        const txHash = _req.query.txHash as string

        const translator = new Translator({
            chain: ethereum,
            covalentApiKey: COVALENT_API_KEY,
        })

        const txn = await translator.translateFromHash(txHash)
        res.status(200).json({ txn })
    } catch (err: any) {
        res.status(500).json({ statusCode: 500, message: err.message })
    }
}

export default handler
