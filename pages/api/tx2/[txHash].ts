import Translator, { Address, chains, Translator2 } from 'evm-translator'
import { NextApiRequest, NextApiResponse } from 'next'

import { ALCHEMY_PROJECT_ID, ETHERSCAN_API_KEY } from 'utils/constants'

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    try {
        const txHash = _req.query.txHash as string
        const userAddress = (_req.query.userAddress as Address) || '0x17a059b6b0c8af433032d554b0392995155452e6'
        const networkId = parseInt(_req.query.networkId as string) || 1

        const chain = Object.values(chains).find((chain) => chain.id === networkId)

        const translator = new Translator2({
            chain,
            userAddress,
            alchemyProjectId: ALCHEMY_PROJECT_ID,
            etherscanAPIKey: ETHERSCAN_API_KEY,
        })

        const tx = await translator.getRawTxDataWithoutTrace(txHash)
        const contractAddresses = translator.getContractAddressesFromRawTxData(tx)
        const unfilteredABIs = await translator.getABIsForContracts(contractAddresses)
        const filteredABIs = translator.filterABIs(unfilteredABIs)
        const { decodedLogs, decodedData, transformedDecodedLogs } = translator.decodeTxData(tx, filteredABIs)

        res.status(200).json({ contractAddresses, transformedDecodedLogs, decodedData, decodedLogs, tx })
    } catch (err: any) {
        console.log('err', err)
        res.status(500).json({ statusCode: 500, message: err.message })
    }
}

export default handler
