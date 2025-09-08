
const listeners = new Set();

export function emitRefresh()
{
    for (const handler of listeners) handler();
}

export function onRefresh(handler)
{
    listeners.add(handler);
    return () => listeners.delete(handler);
}