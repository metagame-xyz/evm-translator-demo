import Translator, {
    ActivityData,
    chains,
    DecodedTx,
    Interpretation,
    ZenLedgerData,
    ZenLedgerRow,
} from 'evm-translator'
import { NextApiRequest, NextApiResponse } from 'next'

import {
    ALCHEMY_PROJECT_ID,
    COVALENT_API_KEY,
    ETHERSCAN_API_KEY,
    EVM_TRANSLATOR_CONNECTION_STRING,
} from 'utils/constants'
import getTranslator from 'utils/translator'

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
        const addressUnclean = _req.query.address as string
        const userInitiated = _req.query.userInitiated === 'true'
        const notUserInitiated = _req.query.notUserInitiated === 'true'
        const limit = parseInt(_req.query.limit as string) || 100
        const networkId = parseInt(_req.query.networkId as string) || 1

        const address = addressUnclean.toLowerCase()
        const translator = await getTranslator(networkId, address)

        const txHashArr = await translator.getTxHashArrayForAddress(address, 99999)

        // console.log('txHashArr:', txHashArr)

        let decodedTx = await translator.getManyDecodedTxFromDB(txHashArr)
        if (txHashArr.length !== decodedTx.length) {
            decodedTx = await translator.decodeFromTxHashArr(txHashArr, true)
        }

        // console.log('decodedTx:', decodedTx.length)
        const interpretedData = await translator.interpretDecodedTxArr(decodedTx, address)

        const zipArraysToArrayOfObjects = (arr1: DecodedTx[], arr2: Interpretation[]): ZenLedgerData[] => {
            const result = []
            for (let i = 0; i < arr1.length; i++) {
                result.push({
                    decodedTx: arr1[i],
                    interpretedData: arr2[i],
                })
            }
            return result
        }

        const zenLedgerData = zipArraysToArrayOfObjects(decodedTx, interpretedData)

        const rows = await translator.translateWithTaxData(zenLedgerData, address)

        // const contractNameDB = new TinTin()

        // const rowsWithContractNames = await getContractNames(rows, contractNameDB)

        replaceUsdcWithUSD(rows)

        // console.log('rowsWithContractNames', rowsWithContractNames[0])

        res.status(200).json({ data: rows })
        // res.status(200).json({})
    } catch (err: any) {
        console.error(err)
        res.status(500).json({ statusCode: 500, message: err.message })
    }
}

export default handler
