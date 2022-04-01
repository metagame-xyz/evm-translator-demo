import { Address, InterepterTemplateGenerator } from 'evm-translator'
import { NextApiRequest, NextApiResponse } from 'next'

import { ETHERSCAN_API_KEY } from 'utils/constants'

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    try {
        const contractAddress = _req.query.contractAddress as Address

        const interepter = new InterepterTemplateGenerator(ETHERSCAN_API_KEY)

        const template = await interepter.generateInterpreter(contractAddress)
        // console.log('logan', template)
        res.status(200).json({ template })
    } catch (err: any) {
        console.error(err)
        res.status(500).json({ statusCode: 500, message: err.message })
    }
}

export default handler
