// A module, imported by main.js -- proof the bundler resolves imports rather
// than relying on files being concatenated in the right order.

export function formatTime(date = new Date()) {
    return new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(date);
}
