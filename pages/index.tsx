import { Box, Button, Center, Flex, FormControl, Heading, Input, SimpleGrid, Stack } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false })

const IndexPage = () => {
    const [txHash, setTxHash] = useState('')
    const [userAddress, setUserAddress] = useState('')
    const [txData, setTxData] = useState<any>({})
    const [isLoading, setIsLoading] = useState(false)

    const validTxhash = new RegExp(/^0x[a-fA-F0-9]{64}$/)
    const validAddress = new RegExp(/^0x[a-fA-F0-9]{40}$/)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (validTxhash.test(txHash)) {
            let apiUrl = `/api/tx/${txHash}`

            if (validAddress.test(userAddress)) {
                apiUrl += userAddress ? `?userAddress=${userAddress}` : ''
            }

            setIsLoading(true)
            const data = await fetch(apiUrl, { headers: { 'Content-Type': 'application/json' } }).then((res) =>
                res.json(),
            )

            console.log(data)
            setTxData(data)
            setIsLoading(false)
        }
    }

    return (
        <Box m="4">
            <Box mx="auto" maxW="1280px">
                <Flex alignItems="center" justify="center" m="4">
                    <Heading>Single Transaction</Heading>
                </Flex>
                <SimpleGrid columns={[1, 1, 1, 3]} spacing="2" alignItems="center">
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
                        m="2"
                        my="2"
                        maxW="80%"
                        mx="auto"
                        borderColor="brand.400"
                        value={userAddress}
                        onChange={(e) => setUserAddress(e.currentTarget.value)}
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
                        my="2"
                        // color="brand.900"
                        _hover={{ bg: 'brand.500' }}
                        size="md"
                        // height="60px"
                        minW="xs"
                        // boxShadow="lg"
                        fontSize="lg"
                        onClick={handleSubmit}
                    >
                        Get Interpretation
                    </Button>
                </SimpleGrid>
                <ReactJson
                    src={txData}
                    name={false}
                    theme={'paraiso'}
                    iconStyle={'triangle'}
                    displayDataTypes={false}
                    enableClipboard={false}
                />
            </Box>
        </Box>
    )
}

export default IndexPage
