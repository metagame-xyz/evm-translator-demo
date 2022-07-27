// import { WEBSITE_URL } from 'utils/constants';

export interface MetaProps {
    description?: string
    image?: string
    title: string
    type?: string
}

const description = 'translates on-chain activity'

export const headMetadata: MetaProps = {
    title: 'evm-translator demo',
    description,
    // image: `https://${WEBSITE_URL}/site-preview.png`,
    type: 'website',
}

export const copy = {
    title: 'evm-translator',
    // nameLowercase: 'heartbeat',
    // heroSubheading: description,
    // heading1: 'Living, Breathing',
    // text1: 'Every night, your heartbeat is updated using your recent on-chain activity.',
    // heading2: 'Multi-chain',
    // text2: 'Activity is tracked across Ethereum, Polygon, Fantom, and Avalanche.',
    // heading3: 'Earned Attributes',
    // text3: 'The layers, speed, colors, and spikes are each based on a different length of time. What can you do to make yours more unique?',
    // bottomSectonHeading: 'The Metagame',
    // bottomSectionText: `Heartbeat is the third and final NFT of Metagame's Phase 1. Phase 2 will be an infinite series of achievements you earn by playing a game many of us are already playing whether we know it or not: The Metagame. These earned achievements will allow access to private spaces gated by shared experiences. Each achievement will contribute to leveling up your character. Follow along: `,
}
