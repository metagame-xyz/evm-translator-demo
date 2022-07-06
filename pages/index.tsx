import { ExternalLinkIcon } from '@chakra-ui/icons'
import {
    Box,
    Button,
    Grid,
    Heading,
    Input,
    Link,
    ListItem,
    SimpleGrid,
    Text,
    UnorderedList,
    VStack,
} from '@chakra-ui/react'
import { ActivityData } from 'evm-translator'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false })

const IndexPage = () => {
    // const [txHash, setTxHash] = useState('0x11dcc41c833868064028af07fae001acdd4a46f10555be7bde959e57fd5c8e3b')
    const [txHash, setTxHash] = useState('0x5a9f106874fd5c72a046e9e966c5ddc3527777eb22b736ed559c8817637911e3')
    // const [txHash, setTxHash] = useState('')
    const [userAddress, setUserAddress] = useState('')
    // const [userAddress, setUserAddress] = useState('')
    const [txData, setTxData] = useState<ActivityData[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [networkId, setNetworkId] = useState(1)

    const validTxhash = new RegExp(/^0x[a-fA-F0-9]{64}$/)
    const validAddress = new RegExp(/^0x[a-fA-F0-9]{40}$/)

    const testTxHashes = {
        UniswapV2: {
            addLiquidity: '0xf3c3c3eec322057de9fc2fedeb6438bcd337fb9304dfb3aa0c2ae8968bd439dd',
            addLiquidityETH: '0x9a9fa37bc41d81076b1b6a5fab94555384d22f03d8331751a08afb47b41cd929',
            removeLiquidity: '0xb226b8aed54b9015faa9b61ed9376acfc12f0881c370a3a0898acd3b255387a7',
            removeLiquidityETH: '0xb578b16b4c494e023f77faf76983d72b33c25c67d5c4651b00b847b373f77a51',
            swapExactETHForTokens: '0x4671e8f0c7429602e507aa0026620582959f8182999d5f4edf2057c696d7d1d0',
            swapExactTokensForETH: '0x896407e3cd1fc4736761621bc4f2d6511eeb63d1c354f40812e44adf7b8ae2b1',
            swapExactTokensForTokens: '0xb2d6867a78abec598ab35875cf7fedd406198079bc2a7087ee8aad6fd391cad4',
        },

        UniswapV3_swaps: {
            exactInputSingle: '0xe4737f2b6174dfcc9482a50aacdc0a919f12c14ede767d6dbfc2cd502747e4f5',
            exactInput: '0xf41a45f5347db0d95bfac48325f8272dce56782574e91083e5025324928bc40c',
            exactOutputSingle: '0xce57de79e8898075e6512492b47661abd8e74eeffe4760cd43c054b53480b583',
            exactOutput: '0x26854093b17b25f74bcdb8728a6c8d113e68aa69f2ae2463f9c14788df53aa45',
            multicall: '0x5efd5c0a1d3b1a0b42456aae4fc552e0924d8153f68196b011ef933b94614246',
        },

        UniswapV3_liquidity: {
            burn: '0x1d2e706317c9457e43d4b0dfe6395c55b518f4f05386d1f455dd6ea984e04ae1',
            collect: '0x8d696e7ac40e22c25207a6eb3060d840fe4b1b4663fb988500f3bfc311da2a39',
            increaseLiquidity: '0xba7e346f46b1f5fa3bbff9868f1b6bf170b8fc8d212d2ad8e6f9fc84acdf30a1',
            mint: '0x8f97a7c09cb73c4da2de03f21bbf17c01f512a615da51a8bf721c4748b5f8475',
            multicall: '0xb38f55471c5a8539a605287b4116a4bf83a58261b3cfe00bc53337298003b9ae',
            multicall_2: '0x8dbab0967c491942e748c7fc305a3f9a3b2eb6c54c0dc48e1ba7f43babfc636a',
        },

        Aave: {
            repay: '0xdf2f782ab0296121318cca140ef069f9f074c51ff4b11f0c677bcb01126f81de',
            deposit: '0x24ee705da17a6061091880f47335d92950c72398980e271cdb9c69e8502827f4',
            withdraw: '0x8df7e436048d687edfaf351e913783729eeaa9ece741391b2a8428d6b7762fe1',
            borrow: '0x564544c9aef01836615254504677b91a9ef96d5ae15eac50d98e08774ed1096c'
        },
        Compound_eth: {
            mint: '0xbbb448dcb3b7e7216c609a97346d9f0553a29cdc8917a286c2aa00a1ba3fccde',
            borrow: '0x5ced82f63bdbe55eaee49392afca90bf23473ba93d43eb5159e586fa8d343986',
            redeem: '0xdaf683d90248db147b1fb22b3979c1902e7ad57ae1c46bc1f8293601cfa5e154',
        },
        Compound_erc20: {
            mint: '0x37182c6beeed11222cd8a4f81fb897ae6fefb31c64c634fea3a277afdba9dd11',
            borrow: '0x669b67fa88c60b07d892f09a87c24dd7bd691bdcbd7b1eb0efd969096067f1a6',
            redeem: '0x63a27f1f7e10fd37477e3e4c35986adb58daaa4b8ab541909a54cb43b0aed5aa',
            repayBorrow: '0xc5380c861d5817a30b42442f32f93cdc91e1ca395b607ec4ecd9e9cf5fc3c2b9',
        }
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
        setIsLoading(false)
    }

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
                    <Box display='flex' flexDirection="column">
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
                                </SimpleGrid>
                            </form>
                        </Box>
                        {txData.map((tx) => SingleTxComponent(tx))}
                    </Box>
                    <Box m="4">
                        {/* <VStack m="4"> */}
                        <Box>
                            <Heading size="xl">Examples</Heading>
                            { Object.entries(testTxHashes).map(([key, methodMap]) => (
                                <>
                                <Heading size="lg" my="2">
                                {key}
                            </Heading>
                            <UnorderedList>
                                {Object.keys(methodMap).map((functionName) =>
                                    exampleListItem(methodMap, functionName),
                                )}
                            </UnorderedList>
                                </>
                            ))}
                        </Box>
                        {/* </VStack> */}
                    </Box>
                </Grid>
            </Box>
        </Box>
    )
}

export default IndexPage
