import type { UseFetchOptions } from 'nuxt/app';

export function useAPI<T>(
  url: string,
  options?: UseFetchOptions<T>,
) {
  return useFetch(url, {
    ...options,
    $fetch: useNuxtApp().$api,
  });
}
