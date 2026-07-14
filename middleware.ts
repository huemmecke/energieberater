const REALM = 'die energieweiser – Vorschau';

function validateBasicAuth(
  authHeader: string | null,
  expectedUser: string,
  expectedPassword: string,
): boolean {
  if (!authHeader?.startsWith('Basic ')) return false;

  try {
    const decoded = atob(authHeader.slice(6));
    const colon = decoded.indexOf(':');
    if (colon === -1) return false;

    const user = decoded.slice(0, colon);
    const password = decoded.slice(colon + 1);
    return user === expectedUser && password === expectedPassword;
  } catch {
    return false;
  }
}

export default function middleware(request: Request) {
  const password = process.env.SITE_PASSWORD;
  if (!password) return;

  const username = process.env.SITE_USERNAME ?? 'preview';

  if (validateBasicAuth(request.headers.get('authorization'), username, password)) {
    return;
  }

  return new Response('Zugang nur mit Passwort.', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
      'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
    },
  });
}

export const config = {
  matcher: ['/:path*'],
};
