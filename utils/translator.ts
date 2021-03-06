import Translator, { chains } from 'evm-translator'

import {
    ALCHEMY_PROJECT_ID,
    COVALENT_API_KEY,
    ETHERSCAN_API_KEY,
    EVM_TRANSLATOR_CONNECTION_STRING,
} from 'utils/constants'

export default async function getTranslator(networkId: number, address: string): Promise<Translator> {
    const chain = Object.values(chains).find((chain) => chain.id === networkId)

    const translator = new Translator({
        chain,
        alchemyProjectId: ALCHEMY_PROJECT_ID,
        etherscanAPIKey: ETHERSCAN_API_KEY,
        connectionString: EVM_TRANSLATOR_CONNECTION_STRING,
        covalentAPIKey: COVALENT_API_KEY,
        etherscanServiceLevel: 30,
    })

    await translator.initializeMongoose()

    return translator
}
