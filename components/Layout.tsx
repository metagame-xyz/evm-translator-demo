import Footer from './Footer'
import Navbar from './Navbar'
import { Box, Flex, Spacer } from '@chakra-ui/react'
import React from 'react'

export const maxW = { xl: '1800' }

export default function Layout(props) {
    return (
        <Flex direction="column" width="100%" {...props}>
            <Navbar maxW={maxW} />
            <Box width="100%">{props.children}</Box>
            <Spacer />
            <Footer maxW={maxW} />
        </Flex>
    )
}
