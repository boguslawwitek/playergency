export function cookiesParse() {
    return Object.fromEntries(document.cookie.split(/; */).map(c => {
        const [ key, v ] = c.split('=', 2);
        return [ key, decodeURIComponent(v) ];
    }));
}

export function arrayMove(arr: any, old_index: number, new_index: number) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
};

export const generateRandomString = () => {
    return Math.floor(Math.random() * Date.now()).toString(36);
};

export const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json());