export const sanitizedLocation = {
  get href() {
    const { href, pathname } = window.location
    const hasDupSlashes = pathname.includes('//')
    const needSanitize = hasDupSlashes
    if (!needSanitize) return href

    const url = new URL(href)
    url.pathname = sanitizedLocation.pathname
    return url.href
  },
  get pathname() {
    const { pathname } = window.location
    // remove duplicated slashes
    return pathname.replace(/^\/\/+/g, '/')
  },
}

export const githubURL = () => {
  const { protocol, host, pathname } = window.location
  if (host !== 'github.com') return null
  const paths = pathname.split('/')
  if (paths.length < 3) return null

  const [owner, repo, ...rest] = paths.slice(1)
  return { protocol, host, owner, repo, rest }
}
