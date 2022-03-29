import {
    Avatar,
    Box,
    Button,
    Flex,
    Grid,
    Heading,
    HStack,
    Spacer,
    Stack,
    Text,
    useBreakpointValue,
} from '@chakra-ui/react'
import React from 'react'

import { copy } from 'utils/content'

// import { useEthereum } from '@providers/EthereumProvider';
import { TwelveCircles, Twitter } from 'components/Icons'

function Navbar(props) {
    // const { userName, openWeb3Modal, avatarUrl } = useEthereum();

    const showName = useBreakpointValue({ base: false, md: true })

    return (
        <Flex width="100%" bgColor="transparent" boxShadow="md" alignItems="center" justify="center" h="20">
            <Heading color="brand.600" as="h1" fontSize="34px">
                {copy.title}
            </Heading>
        </Flex>
    )
}

export default Navbar
