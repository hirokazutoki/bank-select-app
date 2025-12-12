let apiCallCount = 0;
let listeners: (() => void)[] = [];

export function incrementApiCall() {
    apiCallCount++;
    listeners.forEach((fn) => fn());
}

export function getApiCallCount() {
    return apiCallCount;
}

// Home などのコンポーネントから監視
export function subscribeApiCallCount(fn: () => void) {
    listeners.push(fn);
    return () => {
        listeners = listeners.filter((l) => l !== fn);
    };
}