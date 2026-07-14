const SESSION_COOKIE = 'ew_session';
const PUBLIC_PATHS = new Set(['/login', '/login.html', '/api/auth']);

async function createSessionToken(password: string): Promise<string> {
  const encoded = new TextEncoder().encode(`energieweiser:${password}`)
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded)
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function getCookie(request: Request, name: string): string | undefined {
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) return undefined

  for (const part of cookieHeader.split(';')) {
    const [key, ...valueParts] = part.trim().split('=')
    if (key === name) return valueParts.join('=')
  }

  return undefined
}

function loginRedirect(request: Request): Response {
  const url = new URL(request.url)
  const next = `${url.pathname}${url.search}`
  const loginUrl = new URL('/login.html', request.url)

  if (next && next !== '/' && next !== '/login' && next !== '/login.html') {
    loginUrl.searchParams.set('next', next)
  }

  return Response.redirect(loginUrl, 302)
}

export default async function middleware(request: Request) {
  const password = process.env.SITE_PASSWORD
  if (!password) return

  const { pathname } = new URL(request.url)
  if (PUBLIC_PATHS.has(pathname)) return

  const expectedToken = await createSessionToken(password)
  const session = getCookie(request, SESSION_COOKIE)

  if (session === expectedToken) return

  return loginRedirect(request)
}

export const config = {
  matcher: ['/:path*'],
}
