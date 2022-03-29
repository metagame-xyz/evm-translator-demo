import { ChakraProvider, extendTheme, Flex } from '@chakra-ui/react'
import '@fontsource/courier-prime'
import '@fontsource/lato'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import 'styles/globals.css'
import { theme } from 'styles/theme'

// const bgSize = ['100px', '120px', '220px', '300px']

function App({ Component, pageProps }: AppProps): JSX.Element {
    // const { route } = useRouter()
    // const hideNav = route.includes('generateGif') || route.includes('view') || route.includes('test')
    const hideNav = false

    if (hideNav) {
        return <Component {...pageProps} />
    } else {
        // const EthereumProvider = dynamic(() => import('providers/EthereumProvider'))
        const Layout = dynamic(() => import('components/Layout'))

        return (
            <ChakraProvider theme={theme}>
                {/* <EthereumProvider> */}
                <Flex bgColor="brand.100opaque" width="100%" minH="100vh">
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </Flex>
                {/* </EthereumProvider> */}
            </ChakraProvider>
        )
    }
}

export default App
