export function useCommonSwrConfig(hasData: boolean) {
  return {
    revalidateOnMount: !hasData,
    refreshInterval: hasData ? 5 * 60 * 1000 : 0,
    dedupingInterval: 60 * 1000,
    shouldRetryOnError: true,
    errorRetryCount: 3,
  }
}
