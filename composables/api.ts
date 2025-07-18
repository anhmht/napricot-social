export function $api<T>(
  request: Parameters<typeof $fetch<T>>[0],
  opts?: Parameters<typeof $fetch<T>>[1]
): Promise<any> {
  const config = useRuntimeConfig()

  return $fetch<T>(`${config.public.operationUrl}${request}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...opts?.headers
    },
    credentials: 'include',
    onResponseError({ request, response, options }) {
      // Handle CORS errors specifically
      if (response.status === 0 || response.status === 401) {
        console.warn('API Request failed:', request, response.status)
      }
    }
  })
}
