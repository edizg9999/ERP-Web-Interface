
const listeners = new Set();

export function emitRefresh()
{
    for (const handler of listeners) handler();
}

export function onRefreshProduct(handler)
{
    listeners.add(handler);
    return () => listeners.delete(handler);
}