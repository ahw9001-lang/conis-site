# conis.co.kr — 안희원 기술 노트

정보통신 · BIM 기술 블로그. [Astro](https://astro.build)로 만든 정적 사이트이며, 글은 [Pages CMS](https://app.pagescms.org)에서 웹으로 씁니다.

## 글 쓰기·수정 (평소에 하는 일)

1. https://app.pagescms.org 접속 → GitHub로 로그인 → 이 저장소 선택
2. 왼쪽 메뉴
   - **글**: 새 글 쓰기, 수정, 삭제
   - **소개 페이지**: 소개 내용 수정
   - **사이트 설정**: 이름, 사진, 이메일, GitHub, 분류(색·아이콘)
3. **Save** 를 누르면 1~2분 뒤 conis.co.kr 에 자동 반영됩니다.

- 글의 **주소**는 영문 소문자와 하이픈으로 적어 주세요 (예: `ifc-outlet` → conis.co.kr/posts/ifc-outlet/).
- **임시저장**을 켜 두면 사이트에 보이지 않습니다.
- 분류 이름을 바꾸거나 새로 만들 때는 `사이트 설정 › 분류`와 `.pages.yml`의 글 › 분류 목록(values)을 같이 맞춰야 합니다.

## 폴더 구조

| 경로 | 내용 |
| --- | --- |
| `src/content/posts/` | 글 (마크다운) |
| `src/content/pages/about.md` | 소개 페이지 |
| `src/data/site.json` | 사이트 설정 |
| `public/images/` | 올린 이미지 |
| `src/layouts`, `src/components`, `src/styles` | 디자인 |
| `.pages.yml` | 글 관리 메뉴(Pages CMS) 설정 |

## 직접 미리보기 (선택)

```
npm install
npm run dev
```
