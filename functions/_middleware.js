// 사이트 비밀번호 잠금 (Cloudflare Pages Functions)
// Cloudflare → conis-site → 설정 → 환경 변수에 SITE_PASSWORD 를 넣으면 잠기고, 지우면 다시 공개됩니다.
// 아이디는 SITE_USER (없으면 conis). 비밀번호는 영문·숫자로 정하세요.
export async function onRequest({ request, env, next }) {
  const password = env.SITE_PASSWORD;
  if (!password) return next();
  const user = env.SITE_USER || 'conis';

  const header = request.headers.get('Authorization') || '';
  if (header.startsWith('Basic ')) {
    try {
      const decoded = atob(header.slice(6));
      const i = decoded.indexOf(':');
      if (i > -1 && decoded.slice(0, i) === user && decoded.slice(i + 1) === password) {
        const res = await next();
        const out = new Response(res.body, res);
        out.headers.set('X-Robots-Tag', 'noindex');
        out.headers.set('Cache-Control', 'private, no-store');
        return out;
      }
    } catch (e) {}
  }
  return new Response('비공개 사이트입니다. 아이디와 비밀번호를 입력해 주세요.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="conis.co.kr", charset="UTF-8"',
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
