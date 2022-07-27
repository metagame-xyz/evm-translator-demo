import { v4 as uuid } from 'uuid'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const downloadJsonFile = async (jsonString: string) => {
    const templateJSON = JSON.parse(jsonString)
    const fileName = `${templateJSON.contractOfficialName}_${templateJSON.contractAddress.slice(0, 6)}`
    // Set the HREF to a Blob representation of the data to be downloaded
    const blob = new Blob([jsonString], { type: 'application/json' })
    try {
        // create an invisible A element
        const link = document.createElement('a')
        link.style.display = 'none'
        document.body.appendChild(link)

        const href = await window.URL.createObjectURL(blob)
        // blob ready, download it
        link.href = href
        link.download = `${fileName}.json`

        // trigger the download by simulating click
        link.click()

        // cleanup
        window.document.body.removeChild(link)
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log('Error: fail to download a file.')
    }
}
