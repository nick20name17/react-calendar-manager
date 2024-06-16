export const capitalize = (string: string) =>
    string?.replace(/\b\w/g, (char) => char?.toUpperCase())

export function getBodyText(htmlString: string) {
    // Create a new DOMParser instance
    const parser = new DOMParser()

    // Parse the HTML string into a Document object
    const doc = parser.parseFromString(htmlString, 'text/html')

    // Get the body element
    const body = doc.body

    // Return the text content of the body
    return body.textContent || ''
}
