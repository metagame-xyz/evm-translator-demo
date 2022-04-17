import { PrismaClient } from '@prisma/client'

class TinTin {
    client: PrismaClient
    chainId: number

    constructor(chainId: number = 1) {
        this.chainId = chainId
        this.client = new PrismaClient()
    }

    public async getNameForContractAddress(address: string): Promise<string | null> {
        if (!address) return null

        return this.client.contract
            .findUnique({ where: { fqAddr: { address, chainId: this.chainId } } })
            .then((res) => res?.name)
    }
}

export default TinTin
