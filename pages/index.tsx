import { Box, Button, Center, Flex, FormControl, Heading, Input, SimpleGrid, Stack } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false })

const IndexPage = () => {
    // const [txHash, setTxHash] = useState('0x11dcc41c833868064028af07fae001acdd4a46f10555be7bde959e57fd5c8e3b')
    const [txHash, setTxHash] = useState('0xb78ce1e0f55e78cf005b4b5af9978b3d20292dc8c88c94f7ecade67083e2b97f')
    // const [userAddress, setUserAddress] = useState('0x17A059B6B0C8af433032d554B0392995155452E6')
    const [userAddress, setUserAddress] = useState('')
    const [txData, setTxData] = useState<any>({})
    const [interpreted, setInterpreted] = useState<any>({})
    const [decoded, setDecoded] = useState<any>({})
    const [isLoading, setIsLoading] = useState(false)

    const validTxhash = new RegExp(/^0x[a-fA-F0-9]{64}$/)
    const validAddress = new RegExp(/^0x[a-fA-F0-9]{40}$/)

    // const handleSubmit = async (e) => {
    //     e.preventDefault()

    //     if (validTxhash.test(txHash)) {
    //         let apiUrl = `/api/tx/${txHash}`

    //         if (validAddress.test(userAddress)) {
    //             apiUrl += userAddress ? `?userAddress=${userAddress}` : ''
    //         }

    //         setIsLoading(true)
    //         const data = await fetch(apiUrl, { headers: { 'Content-Type': 'application/json' } }).then((res) =>
    //             res.json(),
    //         )

    //         console.log(data)
    //         setTxData(data.tx)
    //         setIsLoading(false)
    //     }
    // }

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

            setTxData(data.tx)
            setDecoded({})
            setInterpreted({})
            setIsLoading(false)
        } else if (validAddress.test(userAddress)) {
            let apiUrl = `/api/address/${userAddress}`

            setIsLoading(true)
            const data = await fetch(apiUrl, { headers: { 'Content-Type': 'application/json' } }).then((res) =>
                res.json(),
            )

            const decoded = data.decodedArr
            const interpreted = data.interpretedArr

            setDecoded(decoded)
            setInterpreted(interpreted)
            setTxData({})

            console.log(data)
            // setTxData(data.txArr)
            setIsLoading(false)
        }
    }

    const dataToShow = Object.keys(txData).length > 0 ? txData : { decoded, interpreted }

    return (
        <Box m="4">
            <Box mx="auto" maxW="1280px">
                <Flex alignItems="center" justify="center" m="4">
                    <Heading>By User Address (last 100 txs, filtered by outgoing only)</Heading>
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
                    src={dataToShow}
                    name={false}
                    theme={'paraiso'}
                    iconStyle={'triangle'}
                    displayDataTypes={false}
                    enableClipboard={false}
                    displayObjectSize={false}
                />
            </Box>
        </Box>
    )
}

export default IndexPage
