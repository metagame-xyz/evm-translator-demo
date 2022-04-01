import { Box, Button, Center, Flex, FormControl, Heading, Input, SimpleGrid, Stack } from '@chakra-ui/react'
import { InterpreterMap } from 'evm-translator/lib/interfaces/contractInterpreter'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false })

const IndexPage = () => {
    // const [txHash, setTxHash] = useState('0x11dcc41c833868064028af07fae001acdd4a46f10555be7bde959e57fd5c8e3b')
    const [contractAddress, setContractAddress] = useState('0x7a250d5630b4cf539739df2c5dacb4c659f2488d')
    const [templateJSON, setTemplateJSON] = useState<InterpreterMap>()
    const [isLoading, setIsLoading] = useState(false)

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

    const downloadFile = ({ data, fileName }) => {
        // Create a blob with the data we want to download as a file
        const blob = new Blob([data], { type: 'text/json' })
        // Create an anchor element and dispatch a click event on it
        // to trigger a download
        const a = document.createElement('a')
        a.download = fileName
        a.href = window.URL.createObjectURL(blob)
        const clickEvt = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
        })
        a.dispatchEvent(clickEvt)
        a.remove()
    }

    const exportToJSON = (e) => {
        e.preventDefault()

        const fileName = `${templateJSON.contractOfficialName}_${contractAddress.slice(0, 6)}.json`.replace(/ /g, '_')
        downloadFile({
            data: JSON.stringify(templateJSON, null, 4),
            fileName,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (validAddress.test(contractAddress)) {
            let apiUrl = `/api/generator/${contractAddress}`

            setIsLoading(true)
            const data = (await fetch(apiUrl, { headers: { 'Content-Type': 'application/json' } }).then((res) =>
                res.json(),
            )) as { template: InterpreterMap }
            setTemplateJSON(data.template)

            console.log(data)
            // setTxData(data.txArr)
            setIsLoading(false)
        }
    }

    const dataToShow = templateJSON

    return (
        <Box m="4">
            <Box mx="auto" maxW="1280px">
                <Flex alignItems="center" justify="center" m="4">
                    <Heading>Contract Address Interpreter Template Generator </Heading>
                </Flex>
                <SimpleGrid columns={[1, 1, 1, 3]} spacing="2" alignItems="center">
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
                        Get Template
                    </Button>
                    <Button
                        isDisabled={templateJSON === undefined}
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
                        onClick={exportToJSON}
                    >
                        Download JSON file
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
