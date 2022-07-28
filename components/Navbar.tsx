import { TwelveCircles } from './Icons'
import {
    Avatar,
    Box,
    Button,
    Flex,
    Grid,
    Heading,
    HStack,
    Link,
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
                    <TwelveCircles boxSize={10} />

                    <Link href="https://themetagame.xyz/" isExternal>
                        <Heading as="h1" fontSize="34px">
                            Metagame's evm-translator
                        </Heading>
                    </Link>
                </HStack>
                <Spacer />
                <HStack align="center" spacing={[3, 4, 5, 6]}>
                    <Link href="https://app.wonderverse.xyz/organization/Metagame/boards" isExternal>
                        Wonder Bounty Board
                    </Link>
                    <Link href="https://github.com/metagame-xyz/evm-translator/blob/main/CONTRIBUTE.md" isExternal>
                        contributor docs
                    </Link>
                    <Link href="https://github.com/metagame-xyz/evm-translator" isExternal>
                        Github
                    </Link>
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
