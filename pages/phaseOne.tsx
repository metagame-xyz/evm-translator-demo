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
import { Interpretation } from 'evm-translator'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { CSVLink } from 'react-csv'
import { phaseOneEarlyMintRequirements } from 'requirements'

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false })

const IndexPage = () => {
    const [userAddress, setUserAddress] = useState('0x1668c9725e27Bf5943bBD43886E1Fb5AFe75c46C')
    // const [userAddress, setUserAddress] = useState('')
    const [txData, setTxData] = useState<Interpretation[]>([])

    const [isLoading, setIsLoading] = useState(false)
    const [networkId, setNetworkId] = useState(1)
    const [meetsRequirements, setMeetsRequirements] = useState<boolean | null>(null)

    const validAddress = new RegExp(/^0x[a-fA-F0-9]{40}$/)

    const requirements = phaseOneEarlyMintRequirements

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (validAddress.test(userAddress)) {
            const apiUrl = `/api/validator/${userAddress}`

            setIsLoading(true)
            const { meetsRequirements, txsForProof } = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    networkId,
                    address: userAddress,
                    requirements,
                }),
            }).then((res) => res.json())

            console.log('txsForProof', txsForProof)
            console.log('meetsRequirements', meetsRequirements)

            setTxData(txsForProof)
            setMeetsRequirements(meetsRequirements)

            // setTxData(data.txArr)
            setIsLoading(false)
        }
    }

    let etherscanLink = ''
    if (userAddress) {
        etherscanLink = `https://www.etherscan.io/address/${userAddress}`
    } else {
        etherscanLink = ''
    }

    const SingleTxComponent = (tx: Interpretation) => {
        return (
            <>
                <Text>{tx.exampleDescription || 'No example description yet'}</Text>
                <Text mx="auto" mb="2">
                    <Link isExternal href={`https://www.etherscan.io/tx/${tx.txHash}`}>
                        etherscan link <ExternalLinkIcon mx="2px" />
                    </Link>
                </Text>
                <ReactJson
                    src={tx}
                    name={false}
                    theme={'paraiso'}
                    iconStyle={'triangle'}
                    displayDataTypes={false}
                    enableClipboard={false}
                    displayObjectSize={false}
                />
            </>
        )
    }

    return (
        <Box m="4">
            <Box mx="auto" maxW="1280px">
                <VStack alignItems="center" justify="center" m="4">
                    <Heading>Phase One</Heading>
                    <Box>
                        <Text mx="auto" mb="2">
                            1. Just an address
                            <br />
                        </Text>
                    </Box>
                </VStack>
                <form>
                    <SimpleGrid columns={[1, 1, 1, 1]} spacing="2" alignItems="center">
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
                <Box alignSelf="center">
                    <Center fontSize="4xl">{`Meets Criteria: ${meetsRequirements}`}</Center>
                </Box>
                {txData.map((tx) => SingleTxComponent(tx))}
            </Box>
        </Box>
    )
}

export default IndexPage
