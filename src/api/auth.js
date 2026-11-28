// 로그인(인증) 관련 함수 모음
//
// 소셜 로그인 흐름
// 1) 로그인 버튼 → getSocialLoginUrl() 주소로 이동 (백엔드 → 카카오/구글 로그인)
// 2) 로그인이 끝나면 백엔드가 redirectUri 로 돌려보내면서 주소 뒤에
//    ?accessToken=...&refreshToken=...&isNewUser=true|false 를 붙여 준다
// 3) /oauth/callback 화면(OAuthCallbackPage)이 토큰을 꺼내 저장하고,
//    신규 회원이면 프로필 설정, 기존 회원이면 홈으로 보낸다

export const API_BASE_URL = 'https://api.eolmago.co.kr'

// 로그인이 끝나고 돌아올 우리 화면 주소 (개발 중엔 http://localhost:5173/oauth/callback)
export const OAUTH_CALLBACK_PATH = '/oauth/callback'

// provider: 'kakao' | 'google'
export function getSocialLoginUrl(provider) {
  const redirectUri = `${window.location.origin}${OAUTH_CALLBACK_PATH}`
  return `${API_BASE_URL}/oauth2/authorization/${provider}?redirectUri=${encodeURIComponent(redirectUri)}`
}

// ===== 토큰 저장 =====
// 토큰은 "로그인했다는 증명서"라서 다른 사람에게 보이면 안 된다.
// 지금은 프로토타입이라 브라우저 저장소(localStorage)에 보관한다.
//
// - 액세스 토큰: API를 부를 때마다 함께 보내는 증명서 (1시간 동안 유효)
// - 리프레시 토큰: 액세스 토큰이 만료되면 새로 받을 때 쓰는 증명서
//   (POST /api/v1/auth/refresh. 다시 받으면 두 토큰 모두 새 값으로 바뀜)

const ACCESS_TOKEN_KEY = 'eolmago.accessToken'
const REFRESH_TOKEN_KEY = 'eolmago.refreshToken'

export function saveTokens({ accessToken, refreshToken }) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

// 로그아웃할 때 두 토큰을 모두 지운다
export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}
