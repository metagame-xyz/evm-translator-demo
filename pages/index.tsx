import Translator, { Address, chains, createEthersAPIKeyObj } from 'evm-translator'
import dynamic from 'next/dynamic'

// import ReactJson from 'react-json-view'
import {
    ALCHEMY_PROJECT_ID,
    COVALENT_API_KEY,
    ETHERSCAN_API_KEY,
    INFURA_PROJECT_ID,
    POCKET_NETWORK_API_KEY,
    POCKET_NETWORK_ID,
} from 'utils/constants'

import Layout from 'components/Layout'

export const getServerSideProps = async () => {
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

    const txHash = '0xa79c049cce9450116f1599b70599f7ccde2c441ab0c06f507ab75130633d214b'
    const userAddress = '0x17a059b6b0c8af433032d554b0392995155452e6'

    const tx = await translator.translateFromHash(txHash, userAddress)

    return {
        props: { tx },
    }
}

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false })

const IndexPage = ({ tx }) => (
    <Layout title="EVM Translator Demo">
        <h1>single tx</h1>
        {console.log(tx)}
        <ReactJson src={tx} name={false} theme={'paraiso'} iconStyle={'triangle'} displayDataTypes={false} />
    </Layout>
)

export default IndexPage
