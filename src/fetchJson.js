export async function fetchJson(url, options) {
  const res = await fetch(url, options)

  if (res.ok) {
    const text = await res.text()
    return text ? JSON.parse(text) : null
  }

  let message = `Request failed (${res.status})`
  try {
    const data = await res.json()
    message = data?.message || data?.error || message
  } catch {
    try {
      const text = await res.text()
      if (text) message = text
    } catch {
    }
  }
  throw new Error(message)
}

