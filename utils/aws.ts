export const s3UrlToParts = (s3Url: string): {} => {
    const s3UrlRe = /^[sS]3:\/\/(.*?)\/(.*)/

    if (!s3Url) {
        throw new Error('Expected S3 URL argument')
    }
    const match = s3Url.match(s3UrlRe)
    if (!match) {
        throw new Error(`Not a valid S3 URL: ${s3Url}`)
    }

    return {
        Bucket: match[1],
        Key: match[2],
    }
}
