let started = false;

export async function startMsw() {
  if (started) return;
  if (typeof window === 'undefined') return;
  if (process.env.NODE_ENV !== 'development') return;

  started = true;
  const workerReady = await fetch('/mockServiceWorker.js', {
    cache: 'no-store',
  }).then((response) => response.ok);

  if (!workerReady) {
    console.warn(
      '[msw] mockServiceWorker.js not found. Run `npx msw init public` to enable API mocking.',
    );
    return;
  }

  const { worker } = await import('./browser');
  await worker.start({
    onUnhandledRequest: 'bypass',
  });
}
