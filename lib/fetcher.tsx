import { NotFoundError, ValidationError } from './errors'
import supabase from './supabase'

export async function fetchAPI<T>(
  path: string,
  method?: string,
  body?: any,
  signal?: AbortSignal
) {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  let url = `/api${path}`
  // if (typeof window === 'undefined') {
  //   url = `${process.env.NEXT_PUBLIC_APP_URL}${url}`
  // }

  const res = await fetch(url, {
    method,
    signal,
    credentials: 'same-origin',
    headers: new Headers({
      ...(body && { 'Content-Type': 'application/json' }),
      ...(session && { Authorization: `Bearer ${session.access_token}` }),
    }),
    ...(body && { body: JSON.stringify(body) }),
  })

  const isJsonResponse = res.headers.get('Content-Type')?.includes('json')
  const parsedBody = isJsonResponse ? await res.json() : await res.text()

  if (res.status === 404) {
    throw new NotFoundError(`Not Found: ${parsedBody}`)
  }

  if (res.status === 400 && parsedBody?.code === 'VALIDATION_ERROR') {
    throw new ValidationError('Validation Error', parsedBody?.errors)
  }

  if (res.ok) {
    return parsedBody as T
  } else {
    throw parsedBody
  }
}
