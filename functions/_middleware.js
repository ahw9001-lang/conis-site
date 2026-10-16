// 사이트 비밀번호 잠금 (Cloudflare Pages Functions)
// Cloudflare → conis-site → 설정 → 변수 및 비밀에 SITE_PASSWORD 를 넣으면 잠기고, 지우면 다시 공개됩니다.
// 방문자는 비밀번호 입력 화면만 보게 되며, 한 번 맞게 입력하면 30일 동안 다시 묻지 않습니다.

const COOKIE = 'conis_auth';
const MAX_AGE = 60 * 60 * 24 * 30;

async function tokenFor(password) {
  const data = new TextEncoder().encode('conis.co.kr:' + password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function readCookie(request, name) {
  const raw = request.headers.get('Cookie') || '';
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=');
  }
  return '';
}

function loginPage(error) {
  const html = `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>CONIS</title>
<style>
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#E2ECEF;
font-family:"Malgun Gothic","Apple SD Gothic Neo","Noto Sans KR",system-ui,sans-serif;color:#1E2230;padding:16px}
.card{position:relative;width:100%;max-width:380px;background:#fff;border-radius:26px;padding:56px 32px 32px;
box-shadow:0 10px 30px rgba(40,48,70,.08)}
.icon{position:absolute;top:-30px;left:32px;width:60px;height:60px;border-radius:50%;background:#17A9CE;
box-shadow:0 10px 20px rgba(23,169,206,.35);display:flex;align-items:center;justify-content:center}
h1{margin:0 0 6px;font-size:22px}
p{margin:0 0 22px;color:#5A6070;font-size:14px}
label{display:block;font-size:13px;font-weight:600;margin-bottom:6px}
input{width:100%;height:48px;border:1px solid #D7E0E4;border-radius:12px;padding:0 14px;font-size:16px;font-family:inherit}
input:focus{outline:2px solid #08809F;outline-offset:1px;border-color:transparent}
button{margin-top:14px;width:100%;height:48px;border:0;border-radius:12px;background:#08809F;color:#fff;
font-size:15px;font-weight:600;font-family:inherit;cursor:pointer}
button:hover{background:#066A84}
.err{margin:10px 0 0;color:#B42318;font-size:13px}
</style></head><body>
<form class="card" method="post" action="/__login">
<span class="icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg></span>
<h1>CONIS</h1>
<p>비공개 사이트입니다. 비밀번호를 입력해 주세요.</p>
<label for="pw">비밀번호</label>
<input id="pw" name="password" type="password" autocomplete="current-password" autofocus required>
${error ? '<p class="err" role="alert">비밀번호가 맞지 않아요.</p>' : ''}
<button type="submit">들어가기</button>
</form></body></html>`;
  return new Response(html, {
    status: 401,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
  });
}

export async function onRequest({ request, env, next }) {
  const password = env.SITE_PASSWORD;
  if (!password) return next();

  const url = new URL(request.url);
  const token = await tokenFor(password);

  if (url.pathname === '/__login' && request.method === 'POST') {
    const form = await request.formData();
    if (String(form.get('password') || '') === password) {
      return new Response(null, {
        status: 303,
        headers: {
          Location: '/',
          'Set-Cookie': `${COOKIE}=${token}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
          'Cache-Control': 'no-store',
        },
      });
    }
    return loginPage(true);
  }

  if (readCookie(request, COOKIE) === token) {
    const res = await next();
    const out = new Response(res.body, res);
    out.headers.set('X-Robots-Tag', 'noindex');
    out.headers.set('Cache-Control', 'private, no-store');
    return out;
  }

  return loginPage(false);
}
