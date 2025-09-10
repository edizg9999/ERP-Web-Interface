
const listeners = new Set();

export function emitRefreshClickedRow()
{
    for (const handler of listeners) handler();
}

export function onRefreshClickedRow(handler)
{
    listeners.add(handler);
    return () => listeners.delete(handler);
}