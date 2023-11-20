import Translator, { chains, InterpreterMap } from 'evm-translator'

import {
    ALCHEMY_PROJECT_ID,
    COVALENT_API_KEY,
    ETHERSCAN_API_KEY,
    EVM_TRANSLATOR_CONNECTION_STRING,
    RPC_NODE_URL,
} from 'utils/constants'

export default async function getTranslator(
    networkId: number,
    userAddress: string,
    interpreterMap: InterpreterMap = null,
): Promise<Translator> {
    const chain = Object.values(chains).find((chain) => chain.id === networkId)

    const additionalInterpreters: Record<string, InterpreterMap> = interpreterMap
        ? {
              [interpreterMap.contractAddress]: interpreterMap,
          }
        : null

    const translator = new Translator({
        chain,
        userAddress,
        additionalInterpreters,
        // nodeUrl: RPC_NODE_URL,
        alchemyProjectId: ALCHEMY_PROJECT_ID,
        etherscanAPIKey: ETHERSCAN_API_KEY,
        connectionString: EVM_TRANSLATOR_CONNECTION_STRING,
        covalentAPIKey: COVALENT_API_KEY,
        etherscanServiceLevel: 5,
    })

    await translator.initializeMongoose()

    return translator
}
