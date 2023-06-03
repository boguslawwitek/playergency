export function cookiesParse() {
    return Object.fromEntries(document.cookie.split(/; */).map(c => {
        const [ key, v ] = c.split('=', 2);
        return [ key, decodeURIComponent(v) ];
    }));
}