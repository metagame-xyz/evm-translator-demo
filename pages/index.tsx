import { ExternalLinkIcon } from '@chakra-ui/icons'
import {
    Box,
    Button,
    Center,
    Flex,
    FormControl,
    Grid,
    Heading,
    Input,
    Link,
    ListItem,
    SimpleGrid,
    Stack,
    Text,
    UnorderedList,
    VStack,
} from '@chakra-ui/react'
import { ActivityData } from 'evm-translator'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { CSVLink } from 'react-csv'

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false })

const IndexPage = () => {
    // const [txHash, setTxHash] = useState('0x11dcc41c833868064028af07fae001acdd4a46f10555be7bde959e57fd5c8e3b')
    const [txHash, setTxHash] = useState('0x5a9f106874fd5c72a046e9e966c5ddc3527777eb22b736ed559c8817637911e3')
    // const [txHash, setTxHash] = useState('')
    const [userAddress, setUserAddress] = useState('')
    // const [userAddress, setUserAddress] = useState('')
    const [txData, setTxData] = useState<ActivityData[]>([])
    const [interpreted, setInterpreted] = useState<any>({})
    const [decoded, setDecoded] = useState<any>({})
    const [isLoading, setIsLoading] = useState(false)
    const [networkId, setNetworkId] = useState(1)

    const validTxhash = new RegExp(/^0x[a-fA-F0-9]{64}$/)
    const validAddress = new RegExp(/^0x[a-fA-F0-9]{40}$/)

    const uniswapExampleTxs = {
        addLiquidity: '0xf3c3c3eec322057de9fc2fedeb6438bcd337fb9304dfb3aa0c2ae8968bd439dd',
        addLiquidityETH: '0x9a9fa37bc41d81076b1b6a5fab94555384d22f03d8331751a08afb47b41cd929',
        removeLiquidity: '0xb226b8aed54b9015faa9b61ed9376acfc12f0881c370a3a0898acd3b255387a7',
        removeLiquidityETH: '0xb578b16b4c494e023f77faf76983d72b33c25c67d5c4651b00b847b373f77a51',
        swapExactETHForTokens: '0x4671e8f0c7429602e507aa0026620582959f8182999d5f4edf2057c696d7d1d0',
        swapExactTokensForETH: '0x896407e3cd1fc4736761621bc4f2d6511eeb63d1c354f40812e44adf7b8ae2b1',
        swapExactTokensForTokens: '0xb2d6867a78abec598ab35875cf7fedd406198079bc2a7087ee8aad6fd391cad4',
    }

    const aaveExampleTxs = {
        deposit: '',
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        validTxhash.test(txHash)

        let apiUrl = `/api/tx/${txHash}?`
        if (validAddress.test(userAddress)) {
            apiUrl += userAddress ? `userAddress=${userAddress}&` : ''
        }

        const networkString = `networkId=${networkId}&`

        apiUrl += networkString

        setIsLoading(true)
        const data = (await fetch(apiUrl, { headers: { 'Content-Type': 'application/json' } }).then((res) =>
            res.json(),
        )) as { tx: ActivityData }

        console.log('data', data)

        setTxData([data.tx])
        setDecoded({})
        setInterpreted({})
        setIsLoading(false)
    }

    const dataToShow = Object.keys(txData).length > 0 ? txData : { decoded, interpreted }
    const etherscanLink = `https://www.etherscan.io/tx/${txHash}`

    const exampleListItem = (entityObj: Record<string, string>, functionName: string) => {
        return (
            <ListItem>
                <Link onClick={() => setTxHash(entityObj[functionName])}>{functionName}</Link>
            </ListItem>
        )
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
                />
                <ReactJson
                    src={tx.decodedTx}
                    name={false}
                    theme={'paraiso'}
                    iconStyle={'triangle'}
                    displayDataTypes={false}
                    enableClipboard={false}
                    displayObjectSize={false}
                    collapsed={true}
                />
                <ReactJson
                    src={tx.rawTxData}
                    name={false}
                    theme={'paraiso'}
                    iconStyle={'triangle'}
                    displayDataTypes={false}
                    enableClipboard={false}
                    displayObjectSize={false}
                    collapsed={true}
                />
            </>
        )
    }

    return (
        <Box m="4">
            <Box mx="auto" maxW="1280px">
                <Grid templateColumns="2fr 1fr">
                    <Box>
                        <VStack alignItems="center" justify="center" m="4">
                            <Heading>Query Options</Heading>
                            <Box>
                                <Text mx="auto" mb="2">
                                    1. Just a tx hash <br />
                                    2. A tx hash + the user address for context (defaults to the from address) <br />
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
                                    isInvalid={!validTxhash.test(txHash)}
                                />
                                <Input
                                    placeholder="user Address as context (optional)"
                                    type="text"
                                    my="2"
                                    maxW="80%"
                                    mx="auto"
                                    borderColor="brand.400"
                                    value={userAddress}
                                    onChange={(e) => setUserAddress(e.currentTarget.value.toLowerCase())}
                                    isInvalid={!validAddress.test(userAddress) && userAddress !== ''}
                                />
                                <Button
                                    isLoading={isLoading}
                                    isDisabled={
                                        isLoading ||
                                        !validTxhash.test(txHash) ||
                                        (!validAddress.test(userAddress) && userAddress !== '')
                                    }
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
                    </Box>
                    <Box m="4">
                        {/* <VStack m="4"> */}
                        <Box>
                            <Heading size="xl">Examples</Heading>
                            <Heading size="lg" my="2">
                                Aave
                            </Heading>
                            <UnorderedList>
                                {Object.keys(aaveExampleTxs).map((functionName) =>
                                    exampleListItem(aaveExampleTxs, functionName),
                                )}
                            </UnorderedList>
                            <Heading size="lg" my="2">
                                Uniswap
                            </Heading>
                            <UnorderedList>
                                {Object.keys(uniswapExampleTxs).map((functionName) =>
                                    exampleListItem(uniswapExampleTxs, functionName),
                                )}
                            </UnorderedList>
                        </Box>
                        {/* </VStack> */}
                    </Box>
                </Grid>
                {txData.map((tx) => SingleTxComponent(tx))}
            </Box>
        </Box>
    )
}

export default IndexPage
