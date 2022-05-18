import { ExternalLinkIcon } from '@chakra-ui/icons'
import {
    Box,
    Button,
    Center,
    Flex,
    FormControl,
    Heading,
    Input,
    Link,
    SimpleGrid,
    Stack,
    Text,
    VStack,
} from '@chakra-ui/react'
import { ActivityData } from 'evm-translator/lib/interfaces'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { CSVLink } from 'react-csv'

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false })

const IndexPage = () => {
    // const [txHash, setTxHash] = useState('0x11dcc41c833868064028af07fae001acdd4a46f10555be7bde959e57fd5c8e3b')
    const [txHash, setTxHash] = useState('0x5a9f106874fd5c72a046e9e966c5ddc3527777eb22b736ed559c8817637911e3')
    // const [txHash, setTxHash] = useState('')
    const [userAddress, setUserAddress] = useState('0x17A059B6B0C8af433032d554B0392995155452E6')
    // const [userAddress, setUserAddress] = useState('')
    const [txData, setTxData] = useState<any>([])
    const [interpreted, setInterpreted] = useState<any>({})
    const [decoded, setDecoded] = useState<any>({})
    const [isLoading, setIsLoading] = useState(false)
    const [networkId, setNetworkId] = useState(1)

    const validTxhash = new RegExp(/^0x[a-fA-F0-9]{64}$/)
    const validAddress = new RegExp(/^0x[a-fA-F0-9]{40}$/)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (validTxhash.test(txHash)) {
            let apiUrl = `/api/tx/${txHash}?`
            if (validAddress.test(userAddress)) {
                apiUrl += userAddress ? `userAddress=${userAddress}&` : ''
            }

            const networkString = `networkId=${networkId}&`

            apiUrl += networkString

            setIsLoading(true)
            const data = await fetch(apiUrl, { headers: { 'Content-Type': 'application/json' } }).then((res) =>
                res.json(),
            )

            setTxData([data.tx])
            setDecoded({})
            setInterpreted({})
            setIsLoading(false)
        } else if (validAddress.test(userAddress)) {
            const apiUrl = `/api/address/${userAddress}`

            setIsLoading(true)
            const data = await fetch(apiUrl, { headers: { 'Content-Type': 'application/json' } }).then((res) =>
                res.json(),
            )

            setTxData(data.txArr)

            // setTxData(data.txArr)
            setIsLoading(false)
        }
    }

    const dataToShow = Object.keys(txData).length > 0 ? txData : { decoded, interpreted }
    let etherscanLink = ''
    if (txHash) {
        etherscanLink = `https://www.etherscan.io/tx/${txHash}`
    } else if (userAddress) {
        etherscanLink = `https://www.etherscan.io/address/${userAddress}`
    } else {
        etherscanLink = ''
    }

    const SingleTxComponent = (tx: ActivityData) => {
        return (
            <>
                <Text>{tx.interpretedData.exampleDescription || 'No example description yet'}</Text>
                <Text mx="auto" mb="2">
                    <Link isExternal href={`https://www.etherscan.io/tx/${tx.rawTxData.txReceipt.transactionHash}`}>
                        etherscan link <ExternalLinkIcon mx="2px" />
                    </Link>
                </Text>
                <ReactJson
                    src={tx.interpretedData}
                    name={false}
                    theme={'paraiso'}
                    iconStyle={'triangle'}
                    displayDataTypes={false}
                    enableClipboard={false}
                    displayObjectSize={false}
                    collapsed={!txHash}
                />
                <ReactJson
                    src={tx.decodedData}
                    name={false}
                    theme={'paraiso'}
                    iconStyle={'triangle'}
                    displayDataTypes={false}
                    enableClipboard={false}
                    displayObjectSize={false}
                    collapsed={!txHash}
                />
                <ReactJson
                    src={tx.rawTxData}
                    name={false}
                    theme={'paraiso'}
                    iconStyle={'triangle'}
                    displayDataTypes={false}
                    enableClipboard={false}
                    displayObjectSize={false}
                    collapsed={!txHash}
                />
            </>
        )
    }

    return (
        <Box m="4">
            <Box mx="auto" maxW="1280px">
                <VStack alignItems="center" justify="center" m="4">
                    <Heading>Query Options</Heading>
                    <Box>
                        <Text mx="auto" mb="2">
                            1. Just a tx hash <br />
                            2. A tx hash + the user address for context (defaults to the from address) <br />
                            3. An EOA address, which will return all txns initiated by that address
                        </Text>
                    </Box>
                </VStack>
                <form>
                    <SimpleGrid columns={[1, 1, 1, 1]} spacing="2" alignItems="center">
                        <Input
                            placeholder="tx Hash"
                            borderColor="brand.400"
                            type="text"
                            maxW="80%"
                            mx="auto"
                            my="2"
                            value={txHash}
                            onChange={(e) => setTxHash(e.currentTarget.value)}
                        />
                        <Input
                            placeholder="user Address (optional)"
                            type="text"
                            my="2"
                            maxW="80%"
                            mx="auto"
                            borderColor="brand.400"
                            value={userAddress}
                            onChange={(e) => setUserAddress(e.currentTarget.value.toLowerCase())}
                        />
                        <Button
                            isLoading={isLoading}
                            isDisabled={isLoading}
                            loadingText="loading..."
                            fontWeight="normal"
                            colorScheme="brand"
                            bgColor="brand.600"
                            maxW="80%"
                            mx="auto"
                            mb="4"
                            // color="brand.900"
                            _hover={{ bg: 'brand.500' }}
                            // size="md"
                            // height="60px"
                            minW="xs"
                            // boxShadow="lg"
                            fontSize="lg"
                            type="submit"
                            onClick={handleSubmit}
                        >
                            Get Interpretation
                        </Button>
                        {etherscanLink ? (
                            <Text mx="auto" mb="2">
                                <Link isExternal href={etherscanLink}>
                                    etherscan link <ExternalLinkIcon mx="2px" />
                                </Link>
                            </Text>
                        ) : null}
                    </SimpleGrid>
                </form>
                {txData.length > 0 ? (
                    <CSVLink
                        data={txData.map((tx) => tx.interpretedData)}
                        filename={`txs-${networkId == 137 ? 'Polygon' : 'Ethereum'}.csv`}
                    >
                        Download me
                    </CSVLink>
                ) : null}
                {txData.map((tx) => SingleTxComponent(tx))}
            </Box>
        </Box>
    )
}

export default IndexPage
