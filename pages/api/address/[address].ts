import { NextApiRequest, NextApiResponse } from 'next'

import getTranslator from 'utils/translator'

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    try {
        // const address = _req.query.address as string
        // const networkId = parseInt(_req.query.networkId as string) || 1

        // const translator = await getTranslator(networkId, address)

        // const txHashArr = await translator.getTxHashArrayForAddress(address, 1000)

        // const txArr = await translator.allDataFromTxHashArr(txHashArr, address)

        // res.status(200).json({ txArr })
        res.status(200).json({})
    } catch (err: any) {
        console.error(err)
        res.status(500).json({ statusCode: 500, message: err.message })
    }
}

export default handler
