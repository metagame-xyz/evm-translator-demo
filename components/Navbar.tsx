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
import { useRouter } from 'next/router'
import React from 'react'

import { copy } from 'utils/content'

function Navbar(props) {
    const router = useRouter()

    return (
        <Flex width="100%" bgColor="transparent" boxShadow="md">
            <HStack as="nav" width="100%" margin="auto" justify="center" align="center" p={4} {...props}>
                <HStack align="center" spacing={2} pr={[0, 2]}>
                    <Heading as="h1" fontSize="34px">
                        {copy.title}
                    </Heading>
                </HStack>
                <Spacer />
                <HStack align="center" spacing={[3, 4, 5, 6]}>
                    <Button
                        onClick={() => router.push('/')}
                        fontWeight="normal"
                        colorScheme="brand"
                        variant={router.pathname === '/' ? 'solid' : 'outline'}
                        _hover={router.pathname === '/' ? {} : { bg: 'brand.400' }}
                        size="md"
                        fontSize="lg"
                    >
                        Demo Txs
                    </Button>
                    <Button
                        onClick={() => router.push('/contribute')}
                        fontWeight="normal"
                        colorScheme="brand"
                        variant={router.pathname === '/contribute' ? 'solid' : 'outline'}
                        _hover={router.pathname === '/contribute' ? {} : { bg: 'brand.400' }}
                        size="md"
                        fontSize="lg"
                    >
                        Contribute
                    </Button>
                </HStack>
            </HStack>
        </Flex>
    )
}

export default Navbar
