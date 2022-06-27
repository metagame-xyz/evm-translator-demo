import block_14769609 from '../../../block_14769609.json'
import Translator, { chains, filterABIMap, getValues, promiseAll, timer } from 'evm-translator'
import { NextApiRequest, NextApiResponse } from 'next'

import { ALCHEMY_PROJECT_ID, ETHERSCAN_API_KEY, MONGOOSE_CONNECTION_STRING } from 'utils/constants'

function getRawDataFromBlockNumber(blockNumber: string): any {
    return block_14769609
}

async function getData(txHash: string, translator: Translator): Promise<any> {
    // timer.startTimer(`getRawTxData ${txHash}`)
    const tx = await translator.getRawTxData(txHash)
    // timer.endTimer(`getRawTxData ${txHash}`)

    const contractAddresses = translator.getContractAddressesFromRawTxData(tx)

    // const proxyAddressMap = await translator.getProxyContractMap(contractAddresses)
    // console.log('proxyAddressMap', proxyAddressMap)

    const proxyAddressMap: Record<string, string> = {}

    const contractAndProxyAddresses = [...contractAddresses, ...getValues(proxyAddressMap)]

    timer.startTimer(`${txHash}`)
    // timer.startTimer(`getABIsAndNamesForContracts ${txHash}`)
    const [unfilteredABIs, officialContractNamesMap] = await translator.getABIsAndNamesForContracts(
        contractAndProxyAddresses,
    )
    // timer.endTimer(`getABIsAndNamesForContracts ${txHash}`)

    // timer.startTimer(`getContracts ${txHash}`)
    const contractDataMap = await translator.getContractsData(unfilteredABIs, officialContractNamesMap, proxyAddressMap)
    // timer.endTimer(`getContracts ${txHash}`)
    // TODO before we decode, we need to find which events we dont have an abi for, retrieve the specific ABI_item for it, and add it to the contractData's db row
    const filteredABIs = filterABIMap(unfilteredABIs)

    // timer.startTimer(`decodeTxData ${txHash}`)
    const { decodedLogs, decodedCallData } = await translator.decodeTxData(tx, filteredABIs, contractDataMap)
    // timer.endTimer(`decodeTxData ${txHash}`)
    timer.stopTimer(`${txHash}`)

    // timer.startTimer(`getENSNames ${txHash}`)
    // const allAddresses = translator.getAllAddresses(decodedLogs, decodedCallData, contractAddresses)
    // const ensMap = await translator.getENSNames(allAddresses)
    // timer.endTimer(`getENSNames ${txHash}`)

    // add in trace logs
    // const decoded = translator.augmentDecodedData(decodedLogs, decodedCallData, ensMap, contractDataMap, tx)

    // const interpretedArr = []
    // allAddresses.forEach((address) => {
    //     const interpreted = translator.interpretDecodedTx(decoded, address)
    //     interpretedArr.push(interpreted)
    // })

    return {
        txHash,
        // contractAddresses,
        // allAddresses,
        // decoded,
        // tx,
    }

    // allData.push({
    //     contractAddresses,
    //     allAddresses,
    //     decoded,
    //     tx,
    // })
}

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    try {
        const blockNumber = _req.query.blockNumber as string
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

        // const blockData = getRawDataFromBlockNumber(blockNumber)
        // console.log(blockData)
        // console.log('blockNumber', blockNumber)
        // const txData = blockData.transactions[blockNumber]
        // console.log('txData', txData)

        // const tx = await translator.getRawTxDataWithoutTrace(txHash)
        // const tx = translator.getRawDataFromS3Data(txData, blockData.timestamp)

        const startBlock = 10000067 + 5 + 1
        const numBlocks = 1

        const endBlock = startBlock + numBlocks

        for (let i = startBlock; i < endBlock; i++) {
            const txHashes = await translator.getTxHashesByBlockNumber(i.toString())
            // const allData = []
            // for (const txHash of txHashes) {
            //     const data = await getData(txHash, translator)
            //     allData.push(data)
            //     // console.log('data', data)
            // }

            timer.startTimer(`get Blocks ${i}`)
            const promises = txHashes.map((txHash) => {
                return getData(txHash, translator)
            })
            const errors = []
            const allData = await promiseAll(promises, errors)
            const timeElapsed = timer.stopTimer(`get Blocks ${i}`)

            // logInfo({}, `block ${i}: ${timeElapsed} seconds`)

            console.log('errors', errors)
        }
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
