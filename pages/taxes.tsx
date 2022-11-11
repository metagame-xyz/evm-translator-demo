import { ExternalLinkIcon } from '@chakra-ui/icons'
import {
    Box,
    Button,
    Center,
    Checkbox,
    Flex,
    FormControl,
    Heading,
    Input,
    Link,
    SimpleGrid,
    Stack,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Text,
    Tfoot,
    Th,
    Thead,
    Tr,
    VStack,
} from '@chakra-ui/react'
import { ActivityData } from 'evm-translator'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { CSVDownload, CSVLink } from 'react-csv'

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false })

const IndexPage = () => {
    // const [txHash, setTxHash] = useState('0x11dcc41c833868064028af07fae001acdd4a46f10555be7bde959e57fd5c8e3b')
    // const [userAddress, setUserAddress] = useState('0x17A059B6B0C8af433032d554B0392995155452E6')
    const [userAddress, setUserAddress] = useState('')
    const [walletName, setWalletName] = useState('')
    const [rows, setRows] = useState<any>([])
    const [userInitiated, setUserInitiated] = useState(true)
    const [notUserInitiated, setNotUserInitiated] = useState(true)
    const [txLimit, setTxLimit] = useState(500)
    const [networkId, setNetworkId] = useState(1)

    const [isLoading, setIsLoading] = useState(false)

    const validAddress = new RegExp(/^0x[a-fA-F0-9]{40}$/)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (validAddress.test(userAddress)) {
            const initiatedString = userInitiated ? 'userInitiated=true&' : ''
            const notInitiatedString = userInitiated ? 'notUserInitiated=true&' : ''
            const limitString = `limit=${txLimit}&`
            const networkString = `networkId=${networkId}&`
            const apiUrl =
                `/api/taxes/${userAddress}?` + initiatedString + notInitiatedString + limitString + networkString

            setIsLoading(true)

            try {
                const data = await fetch(apiUrl, { headers: { 'Content-Type': 'application/json' } }).then((res) =>
                    res.json(),
                )

                // console.log('We Need this to be data', data)
                const rows = data.data

                rows.reverse()

                rows.map((row) => {
                    row.reviewed = null
                    row.ignore = null
                    // row.walletAddress = userAddress
                    // row.walletName = walletName
                    // row.network = networkId == 137 ? 'MATIC' : 'ETH'
                })

                // const thisYearOnly = rows.filter((row) => {
                //     console.log('row.timestamp', row.Timestamp)
                //     const later = new Date(row.Timestamp) < new Date(new Date().getFullYear(), 0, 1)
                //     console.log('later', later)
                //     return later
                // })

                setRows(rows)
                setIsLoading(false)
            } catch (error) {
                console.log(error)
                setIsLoading(false)
            }
        }
    }
    let etherscanLink = ''
    let polyscanLink = ''

    if (userAddress) {
        etherscanLink = `https://www.etherscan.io/address/${userAddress}`
        polyscanLink = `https://polygonscan.com/address/${userAddress}`
    }

    const link = networkId == 137 ? polyscanLink : etherscanLink

    const SingleTxComponent = (tx: ActivityData) => {
        return (
            <>
                {/* <Text>{tx.interpretedData.exampleDescription || 'No example description yet'}</Text> */}
                <Text mx="auto" mb="2">
                    <Link isExternal href={`https://www.etherscan.io/tx/${tx.rawTxData.txReceipt.transactionHash}`}>
                        etherscan link <ExternalLinkIcon mx="2px" />
                    </Link>
                </Text>
                {/* <ReactJson
                    src={tx.taxData}
                    name={false}
                    theme={'paraiso'}
                    iconStyle={'triangle'}
                    displayDataTypes={false}
                    enableClipboard={false}
                    displayObjectSize={false}
                    // collapsed={true}
                /> */}
                <ReactJson
                    src={tx.interpretedData}
                    name={false}
                    theme={'paraiso'}
                    iconStyle={'triangle'}
                    displayDataTypes={false}
                    enableClipboard={false}
                    displayObjectSize={false}
                    collapsed={true}
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
            </>
        )
    }

    const TableComponent = (data: any[]) => {
        console.log('data', data)
        return (
            <TableContainer>
                <Table variant="simple" size="sm">
                    <TableCaption>Imperial to metric conversion factors</TableCaption>
                    <Thead>
                        <Tr>
                            {Object.keys(data[0]).map((key) => (
                                <Th key={key}>{key}</Th>
                            ))}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data.map((item) => (
                            <Tr key={item.txHash}>
                                {Object.entries(item).map(([key, val]) => (
                                    <Td key={key}>{val}</Td>
                                ))}
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
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
                            placeholder="Wallet Name (optional)"
                            type="number"
                            my="2"
                            maxW="80%"
                            mx="auto"
                            borderColor="brand.400"
                            value={networkId}
                            onChange={(e) => setNetworkId(Number(e.currentTarget.value))}
                        />
                        <Input
                            placeholder="Wallet Name (optional)"
                            type="text"
                            my="2"
                            maxW="80%"
                            mx="auto"
                            borderColor="brand.400"
                            value={walletName}
                            onChange={(e) => setWalletName(e.currentTarget.value)}
                        />
                        <Input
                            placeholder="user Address (optional)"
                            type="text"
                            my="2"
                            maxW="80%"
                            mx="auto"
                            borderColor="brand.400"
                            value={userAddress}
                            onChange={(e) => setUserAddress(e.currentTarget.value)}
                        />
                        <Checkbox isChecked={userInitiated} onChange={(e) => setUserInitiated(e.target.checked)}>
                            User Initiated
                        </Checkbox>
                        <Checkbox isChecked={notUserInitiated} onChange={(e) => setNotUserInitiated(e.target.checked)}>
                            Not User Initiated
                        </Checkbox>
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
                        {link ? (
                            <Text mx="auto" mb="2">
                                <Link isExternal href={link}>
                                    etherscan link <ExternalLinkIcon mx="2px" />
                                </Link>
                            </Text>
                        ) : null}
                    </SimpleGrid>
                </form>
                {rows.length > 0 ? (
                    <CSVLink data={rows} filename={`${walletName}-${networkId == 137 ? 'Polygon' : 'Ethereum'}.csv`}>
                        Download me
                    </CSVLink>
                ) : null}
                {rows.length > 0 ? TableComponent(rows) : null}
                {/* {txData.map((tx) => SingleTxComponent(tx))} */}
            </Box>
        </Box>
    )
}

export default IndexPage
