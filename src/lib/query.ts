// Shared query string parser/serializer and React hook for URL sync
// Keep implementation minimal and dependency-free

export type Primitive = string | number | boolean | null | undefined

export type QueryInput = Record<string, Primitive | Primitive[]>

export function canonicalizeParams(params: QueryInput): URLSearchParams {
  const search = new URLSearchParams()
  const keys = Object.keys(params).sort()
  for (const key of keys) {
    const value = params[key]
    if (value == null) continue
    if (Array.isArray(value)) {
      const filtered = value.filter((v) => v != null && `${v}`.trim() !== "") as (string | number | boolean)[]
      if (filtered.length === 0) continue
      // stable order, no duplicates
      const unique = Array.from(new Set(filtered.map((v) => `${v}`)))
      unique.sort()
      search.set(key, unique.join(","))
    } else {
      const str = `${value}`.trim()
      if (str === "" || str === "undefined" || str === "null") continue
      search.set(key, str)
    }
  }
  return search
}

export function parseQuery(searchString: string): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {}
  const sp = new URLSearchParams(searchString.startsWith("?") ? searchString : `?${searchString}`)
  for (const [k, v] of sp.entries()) {
    if (v.includes(",")) {
      out[k] = v.split(",").map((s) => s.trim()).filter((s) => s.length > 0)
    } else {
      out[k] = v
    }
  }
  return out
}

// Lightweight state<->URL sync helper
export type SyncConfig = {
  // map of param name -> getter/setter
  bindings: Record<string, { get: () => Primitive | Primitive[]; set: (val: string | string[] | undefined) => void }>
  // replace instead of push when updating the URL
  replace?: boolean
}

export function syncUrlWithState(config: SyncConfig) {
  const url = new URL(window.location.href)
  const next = new URL(url.href)

  const params: QueryInput = {}
  for (const [key, binding] of Object.entries(config.bindings)) {
    params[key] = binding.get()
  }
  const canonical = canonicalizeParams(params)

  // Apply canonical params
  next.search = canonical.toString()
  if (next.href !== url.href) {
    if (config.replace) {
      window.history.replaceState({}, "", next)
    } else {
      window.history.pushState({}, "", next)
    }
  }
}

export function applyUrlToState(config: SyncConfig) {
  const current = parseQuery(window.location.search)
  for (const [key, binding] of Object.entries(config.bindings)) {
    binding.set(current[key])
  }
}

