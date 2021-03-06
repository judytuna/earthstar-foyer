
let smul = (s: string, n: number): string =>
    // repeat a string, n times
    Array.from(Array(n)).map(x => s).join('');

let makeLogger = (indent: number, tag: string, style: string = '') =>
    (...args: any[]) =>
        console.log(`${smul('    ', indent)}%c| ${tag} `, style, ...args);

export let logEarthbarStore = makeLogger(0, 'earthbar store', 'color: black; background: pink');
export let logKit           = makeLogger(1, 'kit', 'color: black; background: #f94ac5');
export let logEarthbar      = makeLogger(2, 'earthbar view', 'color: black; background: cyan');
export let logEarthbarPanel = makeLogger(3, 'earthbar panel', 'color: black; background: #08f');
export let logFoyerApp      = makeLogger(3, 'foyer app', 'color: black; background: orange');
export let logHelloApp      = makeLogger(3, 'hello app', 'color: black; background: yellow');
export let logDebugApp      = makeLogger(3, 'debug app', 'color: black; background: #af8');
export let logTodoApp       = makeLogger(3, 'todo app', 'color: black; background: #8fa');
export let logTodoHook      = makeLogger(0, 'todo hook', 'color: white; background: #80c');
export let logTodoLayer     = makeLogger(1, 'todo layer', 'color: white; background: blue');
