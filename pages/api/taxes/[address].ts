import Translator, { chains, createEthersAPIKeyObj } from 'evm-translator'
import { ActivityData } from 'evm-translator/lib/interfaces'
import { ZenLedgerRow } from 'evm-translator/lib/interfaces/zenLedger'
import { NextApiRequest, NextApiResponse } from 'next'

import {
    ALCHEMY_PROJECT_ID,
    COVALENT_API_KEY,
    ETHERSCAN_API_KEY,
    INFURA_PROJECT_ID,
    POCKET_NETWORK_API_KEY,
    POCKET_NETWORK_ID,
} from 'utils/constants'

// import TinTin from 'utils/TinTin'

// async function getContractNames(rows: ZenLedgerRow[], contractNamesDB: TinTin): Promise<ZenLedgerRow[]> {
//     if (rows.length < 1) return rows

//     await Promise.all(
//         rows.map(async (row, index) => {
//             let officialContractName = row.contract

//             if (!officialContractName || officialContractName === 'UNKNOWN') {
//                 officialContractName = await contractNamesDB.getNameForContractAddress(row.toAddress)
//                 console.log('officialContractName:', officialContractName)
//                 row.contract = officialContractName || ''
//             }
//         }),
//     )
//     return rows
// }

function replaceUsdcWithUSD(rows: ZenLedgerRow[]) {
    rows.forEach((row) => {
        if (row['In Currency'] === 'USDC') {
            row['In Currency'] = 'USD'
        }
        if (row['Out Currency'] === 'USDC') {
            row['Out Currency'] = 'USD'
        }
        if (row['In Currency'] === 'WETH') {
            row['In Currency'] = 'ETH'
        }
        if (row['Out Currency'] === 'WETH') {
            row['Out Currency'] = 'ETH'
        }
    })
}

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    try {
        const address = _req.query.address as string
        const userInitiated = _req.query.userInitiated === 'true'
        const notUserInitiated = _req.query.notUserInitiated === 'true'
        const limit = parseInt(_req.query.limit as string) || 100
        const networkId = parseInt(_req.query.networkId as string) || 1

        const etherskeys = createEthersAPIKeyObj(
            ALCHEMY_PROJECT_ID,
            ETHERSCAN_API_KEY,
            INFURA_PROJECT_ID,
            POCKET_NETWORK_ID,
            POCKET_NETWORK_API_KEY,
        )

        const translator = new Translator({
            chain: networkId == 137 ? chains.polygon : chains.ethereum,
            covalentApiKey: COVALENT_API_KEY,
            ethersApiKeys: etherskeys,
        })

        const rows = await translator.translateWithTaxData(address, userInitiated, notUserInitiated, limit)

        // const contractNameDB = new TinTin()

        // const rowsWithContractNames = await getContractNames(rows, contractNameDB)

        replaceUsdcWithUSD(rows)

        // console.log('rowsWithContractNames', rowsWithContractNames[0])

        res.status(200).json({ data: rows })
    } catch (err: any) {
        console.error(err)
        res.status(500).json({ statusCode: 500, message: err.message })
    }
}

export default handler
