# CLAUDE.md

> ## ⚠️ 가장 중요한 규칙: 모든 답변은 반드시 한국어로
> - 사용자에게 보내는 **모든 답변을 한국어로** 쓴다. 제목, 표, 설명, 다음 단계 질문까지 전부.
> - 특히 **작업을 끝내고 결과를 정리하는 마지막 답변**에서 영어로 바뀌는 실수가 여러 번 반복됐다. 답변을 보내기 전에 한국어인지 반드시 확인한다.
> - 예외는 코드, 파일 경로, 명령어, 커밋 메시지 접두사(`feat` 등)뿐이다.

이 파일은 Claude Code가 이 저장소에서 작업할 때 참고하는 안내 문서입니다.

## 프로젝트 개요

- **이름**: 얼마고?(Eolmago) 웹 프로토타입
- **서비스 내용**: 실구매가·핫딜 공유 커뮤니티 서비스
- **목적**: 캡스톤디자인 수업 기말 프로젝트용이며, 졸업작품으로 이어질 예정

## 기술 스택

- React + Vite (JavaScript)
- ESLint
- Node.js 24

## 저장소

- GitHub: [MANGMUGANAE/eolmago-prototype](https://github.com/MANGMUGANAE/eolmago-prototype)
- 기본 브랜치: `main`

## 디자인

- 피그마: https://www.figma.com/design/4VifIO6LeNxqzm9E6pJ2hR/얼마고
- 모바일(iOS) 화면 기준으로 디자인되어 있음

## 백엔드 API

- API 명세(Swagger): https://api.eolmago.co.kr/swagger-ui/index.html
- 개발 완료된 API가 계속 추가되므로, API 연동 작업 전에는 최신 명세를 확인할 것
- 명세 원본(JSON): `https://api.eolmago.co.kr/v3/api-docs` (그룹별: `/v3/api-docs/{그룹이름}`)
- 모든 응답은 `{ localDateTime, responseCode, statusCode, message, data }` 형식이며 실제 데이터는 `data`에 있음
- 2026-11-28 기준 그룹: 인증(`auth`), 핫딜(`deal-posts`), 마이페이지(`users`), 카테고리(`category`), 판매처(`stores`), 알림(`notifications`), 알림 설정(`alerts`). 모든 API에 `Authorization: Bearer {액세스 토큰}` 필요 (카테고리 포함)
- **CORS 해결 (2026-11-28 확인)**: `localhost:5173`에서 모든 API 호출 가능. 카테고리·핫딜 목록·핫딜 상세 모두 실제 데이터 받음 확인
- 확인한 응답 특징
  - 이미지 주소(`thumbnailImageUrl`, `imageFileUrlList`, `imageFileUrl`)는 `/files/...`로 옴 → 앞에 `API_BASE_URL`을 붙여야 열림
  - 작성자 등급은 `jjandolRank`. 값: `STARTER`(입문) · `BEGINNER`(초수) · `INTERMEDIATE`(중수) · `EXPERT`(고수) · `MASTER`(9단). ⚠️ 서버의 `BEGINNER`는 '초수'이고 우리 코드의 `beginner`는 '입문'이라 헷갈리기 쉬움
  - **팀 결정 (2026-11-28): 등급 이름은 서버 값을 그대로 쓴다.** `RankBadge`·`HotdealCard`·온보딩 모두 서버 값으로 바꿈 (2026-11-28). CSS 클래스만 소문자(`rank-badge--starter` 등), 색 토큰(`--rank-beginner` 등)과 아이콘 파일 이름은 피그마 이름 그대로
  - 카테고리: 1 신선식품, 2 가공식품·음료, 3 생활용품, 4 뷰티·건강, 5 가전·디지털, 6 패션·잡화, 7 상품권·쿠폰, 8 기타
  - 상세의 `userInfo.reactionType`(`LIKE`/`DISLIKE`/`NONE`)은 글쓴이가 아니라 **보고 있는 사람(나)의 반응** (명세에 적혀 있음). 버튼 선택 상태 표시에 사용
  - 회원가입은 닉네임 중복을 검사하지 않음 (백엔드 코드 확인). 이미 가입한 사람이 다시 불러도 아무것도 바뀌지 않고 성공
- **소셜 로그인** (2026-11-24 연결 완료, 카카오·Google 모두 실제 로그인 확인)
  - 시작 주소: `https://api.eolmago.co.kr/oauth2/authorization/{kakao|google}?redirectUri={돌아올 주소}`
  - 로그인이 끝나면 백엔드가 `{돌아올 주소}?accessToken=...&refreshToken=...&isNewUser=true|false`로 돌려보냄. `localhost` 주소도 허용됨 (페이지 이동이라 CORS와 무관)
  - 우리 쪽 돌아올 주소: `/oauth/callback` (`OAuthCallbackPage`가 두 토큰을 `localStorage`에 저장 후 신규 회원 → `/profile-setup`, 기존 회원 → `/home`)
  - 액세스 토큰은 1시간 유효. 만료되면 `POST /api/v1/auth/refresh`에 리프레시 토큰을 `Authorization`으로 보내 두 토큰을 새로 받음 (아직 미구현)
  - 관련 함수는 `src/api/auth.js` (`getSocialLoginUrl`, `saveTokens`, `getAccessToken`, `getRefreshToken`, `clearTokens`)

## 폴더 구조

```
src/
├── pages/        화면 하나 = 파일 하나 (XxxPage.jsx + XxxPage.css), 피그마 번호별 폴더
│   ├── auth/     1. 시작: 스플래시, 로그인, 프로필 설정, 온보딩
│   ├── home/     2. 홈
│   └── hotdeal/  2-2 핫딜 상세 …
├── components/
│   ├── common/   여러 영역에서 같이 쓰는 부품 (LogoMark, LogoAppIcon, RankBadge, BottomTabBar, CommentItem …)
│   └── hotdeal/  핫딜 영역 부품 (HotdealCard …)
├── styles/
│   └── tokens.css  피그마 Foundations의 색상 변수·글꼴 클래스
├── assets/       피그마에서 받은 SVG (logo/, icons/, profile/ …)
├── api/          백엔드 API 호출 (client.js 공통 함수, auth.js 로그인·토큰, users.js 회원 …)
├── utils/        화면 여러 곳에서 쓰는 계산 함수 (time.js: '23분 전' 표시)
├── App.jsx       라우터: 주소(URL) → 화면 연결
├── main.jsx      시작점 (BrowserRouter, tokens.css 적용)
└── index.css     전체 기본 스타일 (리셋, 모바일 폭 레이아웃)
```

`pages/` 폴더는 피그마 화면 번호대로 나누고, 해당 화면을 만들 때 폴더를 새로 만든다.

| 폴더 | 피그마 번호 | 화면 |
| --- | --- | --- |
| `auth/` | 1 | 스플래시, 로그인, 프로필 설정, 온보딩 |
| `home/` | 2 | 홈, 검색 결과, 알림 |
| `hotdeal/` | 2~4 | 핫딜 상세, 댓글, 신고, 핫딜 공유 |
| `community/` | 5 | 짠돌이들 (질문·자유 목록, 상세, 글쓰기) |
| `basket/` | 6 | 바구니 |
| `my/` | 7 | 마이, 업적, 알림 설정, 내가 쓴 핫딜 |
| `profile/` | 8 | 내 프로필, 상대방 프로필 |
| `support/` | 9 | 피드백, 문의, 공지사항 |

- `components/common/`: 여러 영역에서 쓰는 부품. 한 영역에서만 쓰는 부품은 `components/{영역}/` (예: `components/hotdeal/HotdealCard.jsx`)
- 파일을 옮길 때는 `git mv`를 사용해 수정 기록을 유지한다.
- API 호출 함수는 `src/api/`에 기능별 파일로 모은다 (예: `users.js`, 핫딜은 `dealPosts.js`).
  - 서버 요청은 항상 `client.js`의 `apiRequest(path, { method, query, json, formData })`를 거친다. 토큰 붙이기, 만료 시 자동 재발급 후 한 번 더 시도, 응답에서 `data`만 꺼내기, 실패 시 `ApiError`(`status`, `code`) 던지기를 대신 해 줌
  - 서버가 주는 이미지 주소(`/files/...`)는 `toImageUrl()`로 바꿔서 사용
  - 화면에서는 `try/catch`로 받아 `error.status === 401`이면 `/login`으로 보낸다

## 코드 작성 규칙

- **스타일**: 일반 CSS 파일 사용 (Tailwind 사용 안 함). 클래스 이름은 `화면__요소--상태` 형식 (예: `login__button--kakao`)
- **색상**: 값을 직접 쓰지 말고 `var(--gray-900)`처럼 `tokens.css`의 변수를 사용. 브랜드 고정색(카카오 노랑 등)만 예외
- **글꼴**: `tokens.css`의 `text-{종류}-{크기}-{굵기}` 클래스 사용 (예: `text-title-28-bold`)
- **레이아웃**: 피그마는 아이폰 393px 기준. 앱은 최대 430px 폭으로 가운데 표시
- **피그마에서 만들지 않는 것**: 상태 바(9:41, 배터리)와 홈 바는 아이폰이 그리는 부분이라 제외
- **이미지**: 피그마 에셋은 `src/assets/`에 내려받아 사용 (임시 URL 직접 사용 금지)
- **라우터**: `react-router` 사용. 새 화면을 만들면 `App.jsx`에 주소 등록
- 작업 후 `npm run build`, `npm run lint`로 확인

## 화면 진행 현황

| 피그마 화면 | 주소 | 상태 |
| --- | --- | --- |
| 1-1 스플래시 | `/` | 완료 (2초 뒤 `/login`으로 이동) |
| 1-2 로그인 | `/login` | 완료 (카카오·Google 소셜 로그인 연결됨, 로그인 후 `/oauth/callback` → 신규 회원 `/profile-setup`, 기존 회원 `/home`) |
| 1-2-2 프로필 설정 | `/profile-setup` | 완료 (닉네임 검사·사진 미리보기 동작. "다음"을 누르면 회원가입 API로 저장 후 `/onboarding`) |
| 1-3·1-4 온보딩 | `/onboarding` | 완료 (한 페이지에서 step으로 두 화면 전환, 프로필 설정 "다음"과 연결됨) |
| 2-1 홈 | `/home` | 완료 (핫딜 목록·카테고리 API 연결. 카테고리 칩·인기·종료 제외·정렬을 서버에 요청, 20개씩 불러오고 맨 아래로 스크롤하면 다음 페이지. 불러오는 중·실패(다시 시도) 표시. 5개마다 광고, 온보딩과 연결됨. 로고·알림 줄은 상단 고정, 검색창·칩·필터는 스크롤한 만큼 같이 밀려 올라가고 내려옴(`useHideOnScroll`), 로고 누르면 맨 위로) |

| 2-2 핫딜 상세 | `/hotdeal/:id` | 진행 중. 1단계(사진 넘겨보기·기본 정보·작성자), 2단계(본문·구매 링크·도움돼요/별로예요), 3단계(댓글·대댓글 목록) 완료, 상세 API·추천 API 연결됨. 불러오는 중·없는 글·실패(다시 시도) 표시. 남은 단계: 4) 하단 고정 바(구매하러 가기·담기) |

- 피그마 2-4 "댓글 작성"은 별도 화면이 아니라 상세 화면을 아래로 내린 상태: 하단 바가 댓글 입력칸으로 바뀌고, 뒤로 가기·공유·더보기 줄이 흰 배경으로 맨 위에 고정됨 (4단계에서 함께 검토)

화면 흐름: 스플래시 → 로그인 → (신규 회원) 프로필 설정 → 온보딩 → 홈 / (기존 회원) 홈 → 핫딜 카드 → 핫딜 상세

참고: 피그마에 2-3, 2-5 화면은 없음 (번호만 비어 있음)

## API 연결 대기 목록

방침: API가 필요한 연결만 미루고, 화면끼리 넘어가는 건 화면을 만들 때 바로 연결한다. 미룬 곳은 코드에 `// TODO`로 표시되어 있다.

- 로그인 실패 처리: 지금은 토큰 없이 돌아오면 `/login`으로 보내기만 함. 실패할 때 백엔드가 어떤 주소·값으로 돌려보내는지 확인 필요
- 프로필 설정: 닉네임 중복 확인(API 없음, 서버도 중복을 막지 않음). 프로필 저장은 연결 완료 (`users.js`의 `signup`)
- 홈: 핫딜 목록·카테고리는 연결 완료 (`api/dealPosts.js`의 `getDealPosts`, `getCategories`). 남은 것: 광고 데이터(API 없음)
  - "인기" 칩은 서버의 `hotDeal=true`(중수 이상이 올렸고 신뢰도 점수 9 이하인 글)로 임시 연결. 우리 "인기"와 같은 뜻인지, "9 이하"가 맞는지 백엔드 확인 필요
- 핫딜 상세: 상세 데이터·도움돼요/별로예요는 연결 완료 (`dealPosts.js`의 `getDealPost`, `reactToDealPost`). 가짜 데이터(`mocks/`)는 삭제함
  - **팀 결정 (2026-11-28): 도움돼요/별로예요는 서버 규칙을 따른다.** 같은 버튼을 다시 누르면 취소(`NONE`), 다른 버튼을 누르면 그쪽으로 바뀜. 처음 선택 상태는 상세의 `userInfo.reactionType`(나의 반응)
  - 남은 것: 댓글 작성(`POST .../comments`, API 있음 → 4단계 하단 입력칸과 함께), 내 댓글 삭제(API 있음, 하지만 댓글이 내 것인지 알 수 있는 값이 응답에 없음 → 백엔드에 `isMine` 등 요청 필요)
  - 조회수: 상세를 봐도 서버가 조회수를 올리지 않음 (명세). 언제 오르는지 백엔드 확인 필요

화면이 아직 없어서 미룬 연결:

- 홈 검색창: 입력은 됨. Enter(검색) → 2-6 검색 결과 화면으로 이동은 미구현
- 홈 알림 종 → 2-7 알림
- 핫딜 상세: 공유 버튼 / 더보기(⋯) → 3-1 더보기 메뉴 / 작성자 줄 → 8-2 상대방 프로필- 글쓰기 메뉴: 핫딜 공유 → 4-1 핫딜 공유 / 자유게시판 → 5-6 자유 글쓰기 (지금은 누르면 메뉴만 닫힘)
- 탭 바 짠돌이들·바구니·마이 탭 → 각 화면

## 디자인과 맞춰 볼 것

- 프로필 설정의 빈 칸 안내 문구, 규칙 위반 상태(빨간 밑줄·문구), 비활성 "다음" 버튼 색은 피그마에 없어서 임의로 정함
- 프로필 설정 저장 중 "저장 중…" 버튼 글자, 저장 실패 안내(버튼 위 빨간 글자)도 피그마에 없어서 임의로 정함
- 온보딩의 등급 막대 글자색·고수/9단 그라데이션은 토큰에 없어서 일러스트 값을 그대로 사용
- 등급 배지(`RankBadge`)의 배경·글자색·그라데이션도 토큰에 없어서 피그마 Rank Badge 값을 그대로 사용 (중수 배경만 `--rank-middle`)
- 홈 "종료 제외" 체크된 모양(초록 배경 + 흰 체크), "인기" 칩이 선택된 모양(다른 칩처럼 검정 배경)은 피그마에 없어서 임의로 정함
- 홈 "핫딜을 불러오는 중이에요", 불러오기 실패 + "다시 시도" 버튼, 맨 아래 "더 불러오는 중…"은 피그마에 없어서 임의로 정함
- 핫딜 카드 썸네일: 피그마는 장바구니 아이콘이지만, 상품 사진이 있으면 사진을 칸에 꽉 채워 보여 줌 (사진이 없을 때만 장바구니 아이콘)
- 핫딜 카드: 고수·9단이 쓴 글이 종료되면 종료 모양을 우선으로 함 (피그마에 없는 경우)
- 홈 검색창: 입력 중일 때 연한 회색 테두리(`--gray-300`)는 피그마에 없어서 임의로 넣음
- 홈 정렬 메뉴: 바깥을 누르거나 Esc를 누르면 닫힘 (피그마에 어두운 배경이 없어서). "인기" 칩 + "최신순"이면 인기 순서를 유지
- 글쓰기 메뉴: 항목에 마우스를 올리면 연한 회색 배경(`--gray-50`)은 피그마에 없어서 임의로 넣음. "자유게시판" 이름·아이콘은 기획 확정 후 변경
- 핫딜 상세 도움돼요/별로예요: 처음엔 둘 다 꺼짐, 마우스를 올리면 눌렀을 때 색 미리 보기(마우스 있는 기기만) (사용자 결정). 누른 뒤 규칙은 서버 규칙(다시 누르면 취소, 다른 쪽 누르면 변경)으로 바꾸기로 함 (2026-11-28 팀 결정, 추천 API 연결 때 반영)
  - "별로예요" 켜진 모양은 연한 빨강(배경 `#FDEEEF`, 테두리 `#F9C9CD`, 글자 `#D93644`). 도움돼요 연한 초록과 같은 밝기로 `--red-500` 기준 임의 지정. "도움돼요" 꺼진 모양(회색 엄지)도 피그마에 없음. 아이콘 색은 CSS `mask`로 바꿈
- 핫딜 상세 사진: 피그마는 장바구니 아이콘이지만, 상품 사진이 있으면 옆으로 넘겨 보는 사진으로 보여 줌 ("1 / N"이 넘긴 사진 순서를 따라감). 사진이 없으면 장바구니 아이콘, 순서 표시는 숨김
- 핫딜 상세 대댓글: 댓글 아래에 42px 들여 써서 보여 줌 (피그마에 없어서 임의로 정함)
- 작성자·댓글 프로필 사진: 사진이 있으면 기본 그림과 같은 크기의 동그라미로 보여 줌
- 핫딜 상세 댓글이 없을 때 "아직 댓글이 없어요"(회색 글자)는 피그마에 없어서 임의로 정함

## 공통 부품 사용법

- `RankBadge`: `<RankBadge rank="novice" size="S" />`
  - rank: 서버 값 그대로 `STARTER`(입문) · `BEGINNER`(초수) · `INTERMEDIATE`(중수) · `EXPERT`(고수) · `MASTER`(9단). ⚠️ `BEGINNER`는 '초수'
  - size: `M`(진행도·마이용, 기본값) · `S`(피드·댓글용)
- `HotdealCard` (`components/hotdeal/`): `<HotdealCard deal={deal} />`
  - deal: `{ id, mall, title, price, commentCount, authorRank, likeCount, viewCount, timeAgo, isEnded, thumbnailUrl }` (숫자는 콤마 없이 넘기면 카드가 `25,400`처럼 표시). 서버 응답은 `dealPosts.js`의 `toHotdealCard`가 이 모양으로 바꿔 줌
  - 카드를 누르면 `/hotdeal/{id}` 상세 화면으로 이동
  - 작성자 등급이 `expert`(고수)면 주황, `master`(9단)면 노랑으로 강조. `isEnded`면 등급과 상관없이 종료 모양(흐림)
  - 종료 모양은 피그마 Components의 Deal Item이 아니라 2-1 홈 화면 기준(썸네일 투명도 45%, 아래 정보 줄 60%)
- `CommentItem` (`components/common/`): `<CommentItem comment={comment} />`
  - comment: `{ authorName, authorRank, authorImageUrl, timeAgo, content }` (`authorImageUrl`이 없으면 기본 프로필 그림). 핫딜 상세 댓글에 사용, 짠돌이들 글 상세(5-2, 5-5)에서도 재사용 예정
- `BottomTabBar` (`components/common/`): `<BottomTabBar />`
  - 화면 아래에 떠 있도록 `position: fixed`(바닥에서 24px). 탭 바를 쓰는 화면은 내용이 가려지지 않게 아래 여백을 둘 것
  - 탭 주소: 홈 `/home` · 짠돌이들 `/community` · 바구니 `/basket` · 마이 `/my`. 활성 탭은 `NavLink`가 현재 주소를 보고 자동 표시
  - 가운데 + 버튼: 글쓰기 메뉴(피그마 2-1-4) 열기. 열리면 검정 배경 X 버튼, 화면은 어둡게(탭 바는 밝게 유지). 어두운 배경·Esc·X로 닫힘
  - 글쓰기 메뉴 항목: **핫딜 공유** / **자유게시판**(기획 중, 피그마의 "짠돌이들 글쓰기"를 대신함. 설명 문구는 피그마 그대로 "질문하거나 자유롭게 이야기해요")

## 배포 (Vercel)

- **배포 주소: https://eolmago.co.kr** (팀원 확인용. 2026-11-28 첫 배포. Vercel 계정은 GitHub `20221355`로 로그인, 프로젝트 `eolmago-prototype`)
  - `eolmago.co.kr`은 원래 7월에 만든 API 테스트 페이지(`eolmago-fe` 프로젝트)에 연결돼 있었는데 2026-11-28에 이 프로젝트로 옮김. 예전 페이지는 `eolmago-fe.vercel.app`에 남아 있음
  - `www`로 넘기기는 끔 (`www.eolmago.co.kr`은 DNS 없음, 백엔드도 허용 안 함)
  - 백엔드가 `eolmago.co.kr`을 CORS·로그인 돌아올 주소로 허용함 → 로그인·API 모두 동작 확인 (2026-11-28)
  - `eolmago-prototype.vercel.app`도 열리지만 백엔드가 허용하지 않아(CORS `403`) 로그인·API는 안 됨
- GitHub `main`에 푸시하면 Vercel이 자동으로 다시 배포한다
- `vercel.json`: 어떤 주소로 들어와도 `index.html`을 보내서 `/home`, `/oauth/callback` 같은 화면 주소가 404가 나지 않게 함
- 배포 주소를 백엔드에 알려서 CORS 허용 주소와 로그인 후 돌아올 주소(`redirectUri`)에 추가해야 API·로그인이 동작함

## 화면 미리보기

- `.claude/launch.json`에 개발 서버 설정(`eolmago-dev`)이 있어 Claude 앱의 미리보기 브라우저에서 바로 실행 가능
- 로그인은 실제로 동작하고, 신규 회원이면 프로필 설정으로 감. 기존 회원으로 홈을 보려면 주소로 직접 접속 (예: `localhost:5173/home`)

## 커밋 메시지 규칙

`접두사 : 한글 내용` 형식을 따른다. (콜론 앞뒤로 공백 한 칸)

| 접두사 | 용도 | 예시 |
| --- | --- | --- |
| `feat` | 새 기능 추가 | `feat : 메인 페이지 구현` |
| `fix` | 버그 수정 | `fix : 로그인 오류 수정` |
| `style` | 디자인·스타일 수정 | `style : 버튼 디자인 수정` |
| `chore` | 설정·빌드 등 기타 변경 | `chore : 설정 변경` |
| `docs` | 문서 수정 | `docs : 문서 수정` |

## 작업 방식

- 사용자는 Git과 React를 배우는 중이다.
- 한 번에 많이 바꾸지 말고 **한 단계씩** 진행한다.
- 파일을 바꾸기 전에 **무엇을, 왜** 바꾸는지 짧게 설명한다.
- 대답은 항상 **한국어**로 한다.
- 요청받은 기능이 **서버(API) 등 아직 없는 것이 있어야 제대로 되는 방식**이면(예: 계정별 저장, 다른 사람에게 공유되는 숫자), 브라우저 저장소 같은 임시 방식으로 흉내 내지 않는다. **무엇이 필요한지 먼저 말하고**, 팀원(백엔드)에게 요청할 내용을 정리해 준다. 가짜 데이터로 화면 틀을 먼저 만드는 것은 괜찮다.
