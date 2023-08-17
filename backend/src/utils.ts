export function getLevelColor(level: number) {
    if(level < 6) return '#9b9b9b';
    else if(level < 10) return '#997c52';
    else if(level < 14) return '#d95b43';
    else if(level < 18) return '#fecc23';
    else if(level < 22) return '#467a3c';
    else if(level < 26) return '#4e8ddb';
    else if(level < 30) return '#7652c9';
    else if(level < 34) return '#c252c9';
    else if(level < 38) return '#542437';
    else return '#c02942';
}