// 백엔드 API를 부를 때 공통으로 쓰는 함수 모음
//
// 모든 API는 apiRequest() 를 거쳐서 부른다. 이 함수가 대신 해 주는 일:
// 1) 서버 주소(API_BASE_URL)를 앞에 붙인다
// 2) 로그인 토큰을 Authorization 헤더에 붙인다
// 3) 토큰이 만료돼서 401이 오면 리프레시 토큰으로 새 토큰을 받고 한 번 더 시도한다
// 4) 서버 응답 { localDateTime, responseCode, statusCode, message, data } 에서 data 만 꺼내 준다
// 5) 실패하면 ApiError 를 던진다 (화면에서 try/catch 로 받아 안내 문구를 띄운다)
import {
  API_BASE_URL,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from './auth.js'

// 서버가 실패를 알려 줄 때 쓰는 에러
// status: HTTP 상태 (401, 404 …), code: 서버의 statusCode (예: 'NICKNAME_REQUIRED')
export class ApiError extends Error {
  constructor(status, body) {
    super(body?.message ?? `요청에 실패했어요 (${status})`)
    this.name = 'ApiError'
    this.status = status
    this.code = body?.statusCode ?? null
  }
}

// 서버가 주는 이미지 주소는 '/files/...' 처럼 앞부분이 없어서 서버 주소를 붙여 준다
export function toImageUrl(path) {
  if (!path) return null
  if (/^https?:\/\//.test(path)) return path
  return `${API_BASE_URL}${path}`
}

// ===== 토큰 재발급 =====
// 여러 요청이 동시에 401을 받아도 재발급은 한 번만 하도록 진행 중인 요청을 같이 기다린다
let refreshPromise = null

function refreshTokens() {
  if (!refreshPromise) {
    refreshPromise = requestNewTokens().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

// 성공하면 true, 실패하면 false (실패하면 다시 로그인해야 함)
async function requestNewTokens() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false

  try {
    // 이 API만 액세스 토큰이 아니라 리프레시 토큰을 보낸다
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${refreshToken}` },
    })
    if (!response.ok) return false

    const body = await response.json()
    // 다시 받으면 두 토큰 모두 새 값으로 바뀌므로 둘 다 저장한다
    saveTokens(body.data)
    return true
  } catch {
    return false
  }
}

// ===== API 요청 =====
// path: '/api/v1/...' 처럼 서버 주소 뒤에 붙는 부분
// options.method: 'GET'(기본) · 'POST' · 'DELETE'
// options.query: 주소 뒤에 ?key=value 로 붙일 값 (값이 없는 항목은 빼고 보냄)
// options.json: JSON 으로 보낼 내용
// options.formData: 파일과 함께 보낼 내용 (FormData)
export async function apiRequest(path, { method = 'GET', query, json, formData } = {}) {
  const url = new URL(`${API_BASE_URL}${path}`)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, value)
      }
    }
  }

  const send = () => {
    const headers = {}
    const accessToken = getAccessToken()
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`

    let body
    if (json !== undefined) {
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify(json)
    } else if (formData) {
      // FormData 는 Content-Type 을 직접 쓰지 않는다 (브라우저가 알아서 붙임)
      body = formData
    }

    return fetch(url, { method, headers, body })
  }

  let response = await send()

  // 토큰이 만료됐으면 새로 받아서 한 번만 다시 시도
  if (response.status === 401 && (await refreshTokens())) {
    response = await send()
  }

  // 응답 본문이 없거나 JSON 이 아닐 수도 있어서 실패해도 null 로 둔다
  const body = await response.json().catch(() => null)

  if (!response.ok) {
    // 재발급까지 실패한 401이면 저장된 토큰은 더 이상 쓸 수 없다
    if (response.status === 401) clearTokens()
    throw new ApiError(response.status, body)
  }

  return body?.data ?? null
}
