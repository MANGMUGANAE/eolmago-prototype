# CLAUDE.md

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
- 2026-11-23 기준: 화면용 API는 거의 없음. "🔐 인증/인가" 그룹은 이름의 `/` 때문에 명세를 불러올 수 없음 (팀원에게 이름 변경 요청 필요)
- **소셜 로그인** (2026-11-24 연결 완료, 카카오·Google 모두 실제 로그인 확인)
  - 시작 주소: `https://api.eolmago.co.kr/oauth2/authorization/{kakao|google}?redirectUri={돌아올 주소}`
  - 로그인이 끝나면 백엔드가 `{돌아올 주소}?accessToken=...`으로 돌려보냄. `localhost` 주소도 허용됨
  - 우리 쪽 돌아올 주소: `/oauth/callback` (`OAuthCallbackPage`가 토큰을 `localStorage`에 저장 후 이동)
  - 관련 함수는 `src/api/auth.js` (`getSocialLoginUrl`, `saveAccessToken`, `getAccessToken`, `clearAccessToken`)

## 폴더 구조

```
src/
├── pages/        화면 하나 = 파일 하나 (XxxPage.jsx + XxxPage.css), 피그마 번호별 폴더
│   ├── auth/     1. 시작: 스플래시, 로그인, 프로필 설정, 온보딩
│   ├── home/     2. 홈
│   └── hotdeal/  2-2 핫딜 상세 …
├── components/
│   ├── common/   여러 영역에서 같이 쓰는 부품 (LogoMark, LogoAppIcon, RankBadge, BottomTabBar …)
│   └── hotdeal/  핫딜 영역 부품 (HotdealCard …)
├── styles/
│   └── tokens.css  피그마 Foundations의 색상 변수·글꼴 클래스
├── assets/       피그마에서 받은 SVG (logo/, icons/, profile/ …)
├── api/          백엔드 API 호출·토큰 관리 함수 (auth.js …)
├── mocks/        API 대신 쓰는 가짜 데이터 (hotdeals.js …). API가 나오면 src/api/로 교체 후 삭제
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
- API 호출 함수는 `src/api/`에 기능별 파일로 모은다 (예: `auth.js`).

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
| 1-2 로그인 | `/login` | 완료 (카카오·Google 소셜 로그인 연결됨, 로그인 후 `/oauth/callback` → `/home`) |
| 1-2-2 프로필 설정 | `/profile-setup` | 완료 (닉네임 검사·사진 미리보기 동작) |
| 1-3·1-4 온보딩 | `/onboarding` | 완료 (한 페이지에서 step으로 두 화면 전환, 프로필 설정 "다음"과 연결됨) |
| 2-1 홈 | `/home` | 완료 (가짜 데이터 `mocks/hotdeals.js` 사용. 카테고리 칩 필터·종료 제외 동작, 5개마다 광고, 온보딩과 연결됨. 로고·알림 줄은 상단 고정, 검색창·칩·필터는 스크롤한 만큼 같이 밀려 올라가고 내려옴(`useHideOnScroll`), 로고 누르면 맨 위로) |

| 2-2 핫딜 상세 | `/hotdeal/:id` | 진행 중. 1단계 완료(사진 영역·기본 정보·작성자, 홈 카드와 연결). 남은 단계: 2) 본문·구매 링크·도움돼요/별로예요 3) 댓글 목록 4) 하단 고정 바(구매하러 가기·담기) |

화면 흐름: 스플래시 → 로그인 → (신규 회원) 프로필 설정 → 온보딩 → 홈 / (기존 회원) 홈 → 핫딜 카드 → 핫딜 상세

참고: 피그마에 2-3, 2-5 화면은 없음 (번호만 비어 있음)

## API 연결 대기 목록

방침: API가 필요한 연결만 미루고, 화면끼리 넘어가는 건 화면을 만들 때 바로 연결한다. 미룬 곳은 코드에 `// TODO`로 표시되어 있다.

- 로그인 후 신규 회원 구분: 지금은 모두 `/home`으로 이동. 신규 회원이면 `/profile-setup`으로 보내야 함 (백엔드에서 신규 여부를 알려주는 방법 확인 필요)
- 로그인 실패 처리: 지금은 토큰 없이 돌아오면 `/login`으로 보내기만 함. 실패할 때 백엔드가 어떤 주소·값으로 돌려보내는지 확인 필요
- 프로필 설정: 닉네임 중복 확인, 프로필 저장 (지금은 저장 없이 `/onboarding`으로 이동)
- 홈: 핫딜 목록(지금은 `mocks/hotdeals.js`), "인기" 정렬 기준(지금은 도움돼요 많은 순), 정렬(최신순·가격순 싼 것부터·등급순 높은 등급부터, 지금은 화면에서 직접 정렬), 광고 데이터

화면이 아직 없어서 미룬 연결:

- 홈 검색창: 입력은 됨. Enter(검색) → 2-6 검색 결과 화면으로 이동은 미구현
- 홈 알림 종 → 2-7 알림
- 핫딜 상세: 공유 버튼 / 더보기(⋯) → 3-1 더보기 메뉴 / 작성자 줄 → 8-2 상대방 프로필 / 사진 넘겨보기(상품 사진이 생기면)
- 글쓰기 메뉴: 핫딜 공유 → 4-1 핫딜 공유 / 자유게시판 → 5-6 자유 글쓰기 (지금은 누르면 메뉴만 닫힘)
- 탭 바 짠돌이들·바구니·마이 탭 → 각 화면

## 디자인과 맞춰 볼 것

- 프로필 설정의 빈 칸 안내 문구, 규칙 위반 상태(빨간 밑줄·문구), 비활성 "다음" 버튼 색은 피그마에 없어서 임의로 정함
- 온보딩의 등급 막대 글자색·고수/9단 그라데이션은 토큰에 없어서 일러스트 값을 그대로 사용
- 등급 배지(`RankBadge`)의 배경·글자색·그라데이션도 토큰에 없어서 피그마 Rank Badge 값을 그대로 사용 (중수 배경만 `--rank-middle`)
- 홈 "종료 제외" 체크된 모양(초록 배경 + 흰 체크), "인기" 칩이 선택된 모양(다른 칩처럼 검정 배경)은 피그마에 없어서 임의로 정함
- 핫딜 카드: 고수·9단이 쓴 글이 종료되면 종료 모양을 우선으로 함 (피그마에 없는 경우)
- 홈 검색창: 입력 중일 때 연한 회색 테두리(`--gray-300`)는 피그마에 없어서 임의로 넣음
- 홈 정렬 메뉴: 바깥을 누르거나 Esc를 누르면 닫힘 (피그마에 어두운 배경이 없어서). "인기" 칩 + "최신순"이면 인기 순서를 유지
- 글쓰기 메뉴: 항목에 마우스를 올리면 연한 회색 배경(`--gray-50`)은 피그마에 없어서 임의로 넣음. "자유게시판" 이름·아이콘은 기획 확정 후 변경

## 공통 부품 사용법

- `RankBadge`: `<RankBadge rank="novice" size="S" />`
  - rank: `beginner`(입문) · `novice`(초수) · `middle`(중수) · `expert`(고수) · `master`(9단)
  - size: `M`(진행도·마이용, 기본값) · `S`(피드·댓글용)
- `HotdealCard` (`components/hotdeal/`): `<HotdealCard deal={deal} />`
  - deal: `{ id, mall, title, price, commentCount, authorRank, likeCount, viewCount, timeAgo, isEnded }` (숫자는 콤마 없이 넘기면 카드가 `25,400`처럼 표시)
  - 카드를 누르면 `/hotdeal/{id}` 상세 화면으로 이동
  - 작성자 등급이 `expert`(고수)면 주황, `master`(9단)면 노랑으로 강조. `isEnded`면 등급과 상관없이 종료 모양(흐림)
  - 종료 모양은 피그마 Components의 Deal Item이 아니라 2-1 홈 화면 기준(썸네일 투명도 45%, 아래 정보 줄 60%)
- `BottomTabBar` (`components/common/`): `<BottomTabBar />`
  - 화면 아래에 떠 있도록 `position: fixed`(바닥에서 24px). 탭 바를 쓰는 화면은 내용이 가려지지 않게 아래 여백을 둘 것
  - 탭 주소: 홈 `/home` · 짠돌이들 `/community` · 바구니 `/basket` · 마이 `/my`. 활성 탭은 `NavLink`가 현재 주소를 보고 자동 표시
  - 가운데 + 버튼: 글쓰기 메뉴(피그마 2-1-4) 열기. 열리면 검정 배경 X 버튼, 화면은 어둡게(탭 바는 밝게 유지). 어두운 배경·Esc·X로 닫힘
  - 글쓰기 메뉴 항목: **핫딜 공유** / **자유게시판**(기획 중, 피그마의 "짠돌이들 글쓰기"를 대신함. 설명 문구는 피그마 그대로 "질문하거나 자유롭게 이야기해요")

## 화면 미리보기

- `.claude/launch.json`에 개발 서버 설정(`eolmago-dev`)이 있어 Claude 앱의 미리보기 브라우저에서 바로 실행 가능
- 로그인은 실제로 동작하지만 신규 회원 구분 전이라 로그인하면 홈으로 감. 프로필 설정·온보딩은 주소로 직접 접속 (예: `localhost:5173/profile-setup`)

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
