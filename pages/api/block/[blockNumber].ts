import block_700000 from '../../../block_700000.json'
import block_14769609 from '../../../block_14769609.json'
import Translator, { chains, Translator2 } from 'evm-translator'
import { filterABIs } from 'evm-translator/lib/utils'
import { NextApiRequest, NextApiResponse } from 'next'

import { ALCHEMY_PROJECT_ID, ETHERSCAN_API_KEY } from 'utils/constants'

function getRawDataFromBlockNumber(blockNumber: string): any {
    return block_14769609
}
const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    try {
        const blockNumber = _req.query.blockNumber as string
        const networkId = parseInt(_req.query.networkId as string) || 1
        const chain = Object.values(chains).find((chain) => chain.id === networkId)

        const translator = new Translator2({
            chain,
            alchemyProjectId: ALCHEMY_PROJECT_ID,
            etherscanAPIKey: ETHERSCAN_API_KEY,
        })

        const blockData = getRawDataFromBlockNumber(blockNumber)
        // console.log(blockData)
        // console.log('blockNumber', blockNumber)
        const txData = blockData.transactions[blockNumber]
        // console.log('txData', txData)

        // const tx = await translator.getRawTxDataWithoutTrace(txHash)

        /*
        input: s3 link
        get block data from s3 link
        loop through block transactions
            
        format txData from block transaction
            if error: log txHash, skip
        get contract addresses from txData
            loop through contract addresses
                get ABIs+info for a contract address
                    try to get from contract table in DB
                    try to get from Etherscan

                        get ABI + Source Code
                        get contractOfficialName from Source Code
                        get contractType from node
                        get token name from node
                        get token symbol from node
                        get ENS from node (only for v1)
                        get contractName a 3rd party Database

                        add all data to contract table
                        add all abis to method table (events, functions)

                    if Error (no abi): log contract address, skip
                filterABIs
                decodeData
                    decode logs
                        if log doesnt have the abi it needs: 
                            try to get methods from method table
                            if method is found: append to contract table (v2)
                        if log isn't decoded:
                            log txHash, contract address, log index
                            mark decodedLog as decoded:false
                    decode data (call data)
                        if data doesnt have the abi it needs: 
                            try to get methods from method table
                            if method is found: append to contract table (v2)
                        if data isn't decoded:
                            log txHash, contract address,
                            mark decodedData as decoded:false
                    write decoded data to db
                
                InterpretData
                    loop through every contract address:
                        interpret txn with respect to contract address
                        if logs are not fully decoded, add a note: "logs not fully decoded"
                        write to DB

        */
        const tx = translator.getRawDataFromS3Data(txData, blockData.timestamp)

        // console.log('tx', tx)

        const contractAddresses = translator.getContractAddressesFromRawTxData(tx)
        const [unfilteredABIs, officialContractNamesMap] = await translator.getABIsAndNamesForContracts(
            contractAddresses,
        )

        const contractDataMap = await translator.getContractsData(unfilteredABIs, officialContractNamesMap)
        const filteredABIs = filterABIs(unfilteredABIs)
        const { decodedLogs, decodedCallData } = await translator.decodeTxData(tx, filteredABIs, contractDataMap)

        const allAddresses = translator.getAllAddresses(decodedLogs, decodedCallData, contractAddresses)
        const ensMap = await translator.getENSNames(allAddresses)

        // add in trace logs
        const decoded = translator.augmentDecodedData(decodedLogs, decodedCallData, ensMap, contractDataMap, tx)

        const interpretedArr = []
        allAddresses.forEach((address) => {
            const interpreted = translator.interpretDecodedTx(decoded, address)
            interpretedArr.push(interpreted)
        })

        res.status(200).json({
            contractAddresses,
            allAddresses,
            interpretedArr,
            decoded,
            tx,
        })
    } catch (err: any) {
        console.log('err', err)
        res.status(500).json({ statusCode: 500, message: err.message })
    }
}

export default handler
