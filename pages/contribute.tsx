import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Box, Button, Grid, Heading, Input, Link, ListItem, SimpleGrid, Text, useToast, VStack } from '@chakra-ui/react'
import { ActivityData, InterpreterMap } from 'evm-translator'
import { InterpreterMapZ } from 'evm-translator/lib/interfaces/contractInterpreter'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useState } from 'react'

import { JSONEditor } from 'components/json-editor/json-editor'

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

    const [contractAddress, setContractAddress] = useState('0x7a250d5630b4cf539739df2c5dacb4c659f2488d')
    const [templateJsonStr, setTemplateJSON] = useState<string>()
    const [isLoadingGetTemplate, setIsLoadingGetTemplate] = useState(false)

    const toast = useToast()

    const validTxhash = new RegExp(/^0x[a-fA-F0-9]{64}$/)
    const validAddress = new RegExp(/^0x[a-fA-F0-9]{40}$/)

    const handleTemplateChange = useCallback((value) => {
        setTemplateJSON(value)
        if (window !== undefined) {
            window.localStorage.setItem('templateJSON', value)
        }
    }, [])

    useEffect(() => {
        if (window !== undefined) {
            const templateJSON = window.localStorage.getItem('templateJSON')
            console.log('templateJSON', templateJSON)
            if (templateJSON) {
                setTemplateJSON(templateJSON)
            }
        }
    }, [])

    const handleTxSubmit = async (e) => {
        e.preventDefault()

        validTxhash.test(txHash)

        let apiUrl = `/api/tx/${txHash}?`
        if (validAddress.test(userAddress)) {
            apiUrl += userAddress ? `userAddress=${userAddress}&` : ''
        }

        const networkString = `networkId=${networkId}&`

        let interpreterMapString = ''
        let passedValue = null
        if (templateJsonStr) {
            let parsed = null
            try {
                parsed = InterpreterMapZ.safeParse(JSON.parse(templateJsonStr))
            } catch (e) {
                toast({
                    title: 'probable Invalid JSON',
                    description: e.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                })
                return
            }
            passedValue = parsed.success ? templateJsonStr : null
            interpreterMapString = `interpreterMap=${passedValue}&`
        }

        if (!templateJsonStr || passedValue) {
            apiUrl = apiUrl + networkString + interpreterMapString

            setIsLoading(true)
            const data = (await fetch(apiUrl, { headers: { 'Content-Type': 'application/json' } }).then((res) =>
                res.json(),
            )) as { tx: ActivityData }

            console.log('data', data)

            setTxData([data.tx])
            setIsLoading(false)
        } else {
            toast({
                title: 'Invalid template JSON',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            })
        }
    }

    const handleTemplateSubmit = async (e) => {
        e.preventDefault()

        if (validAddress.test(contractAddress)) {
            const apiUrl = `/api/generator/${contractAddress}`

            setIsLoadingGetTemplate(true)
            const data = (await fetch(apiUrl, { headers: { 'Content-Type': 'application/json' } }).then((res) =>
                res.json(),
            )) as { template: InterpreterMap }
            setTemplateJSON(JSON.stringify(data.template))

            console.log(data)
            // setTxData(data.txArr)
            setIsLoadingGetTemplate(false)
        }
    }

    const SingleTxComponent = (tx: ActivityData) => {
        return (
            <div key={tx.decodedTx.txHash}>
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
            </div>
        )
    }

    return (
        <Box my="4">
            <Box mx="auto" maxW="1800px">
                <Grid templateColumns="1fr 1fr">
                    <Box display="flex" flexDirection="column">
                        <Box>
                            <VStack alignItems="center" m="4">
                                <Heading>Query Options</Heading>
                                <Box>
                                    <Text mx="auto" mb="2">
                                        1. Just a tx hash <br />
                                        2. A tx hash + the user address for context (defaults to the from address){' '}
                                        <br />
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
                                        onClick={handleTxSubmit}
                                    >
                                        Get Interpretation
                                    </Button>
                                </SimpleGrid>
                            </form>
                        </Box>
                        {txData.map((tx) => SingleTxComponent(tx))}
                    </Box>
                    <Box m="4">
                        <VStack m="4">
                            <Heading size="xl">Interpreter Map</Heading>
                            <Input
                                placeholder="Contract Address"
                                type="text"
                                m="2"
                                my="2"
                                maxW="80%"
                                mx="auto"
                                borderColor="brand.400"
                                value={contractAddress}
                                onChange={(e) => setContractAddress(e.currentTarget.value)}
                            />
                            <Button
                                isLoading={isLoadingGetTemplate}
                                isDisabled={isLoadingGetTemplate}
                                loadingText="loading..."
                                fontWeight="normal"
                                colorScheme="brand"
                                bgColor="brand.600"
                                maxW="80%"
                                mx="auto"
                                my="2"
                                // color="brand.900"
                                _hover={{ bg: 'brand.500' }}
                                size="md"
                                // height="60px"
                                minW="xs"
                                // boxShadow="lg"
                                fontSize="lg"
                                onClick={handleTemplateSubmit}
                            >
                                Get Template
                            </Button>
                            <Link isExternal href={`https://bloxy.info/address/${contractAddress}`}>
                                bloxy for contract address
                                <ExternalLinkIcon mx="2px" />
                            </Link>
                        </VStack>
                        <Box height="85vh">
                            <JSONEditor
                                title={''}
                                path="input_json.json"
                                value={templateJsonStr}
                                onChange={handleTemplateChange}
                            />
                        </Box>
                    </Box>
                </Grid>
            </Box>
        </Box>
    )
}

export default IndexPage
