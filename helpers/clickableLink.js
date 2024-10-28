export default function createClickableLink(url, text) {
    return `\u001b]8;;${url}\u001b\\${text}\u001b]8;;\u001b\\`; // ANSI escape codes for clickable links
}