// 시간 표시 함수 모음

// 서버 시간 글자(예: '2026-11-28T16:30:32.071266')를 Date 로 바꾼다
// 서버는 한국 시간을 시간대 표시 없이 보내서 '+09:00'을 붙여 준다.
// 소수점 아래가 6자리로 와서 3자리(밀리초)까지만 남긴다.
export function parseServerTime(value) {
  if (!value) return null
  const trimmed = value.replace(/(\.\d{3})\d+/, '$1')
  const hasZone = /([zZ]|[+-]\d{2}:\d{2})$/.test(trimmed)
  return new Date(hasZone ? trimmed : `${trimmed}+09:00`)
}

// 얼마 전에 올렸는지: '방금 전', '23분 전', '1시간 전', '3일 전', 일주일이 넘으면 '11월 28일'
export function formatTimeAgo(value, now = new Date()) {
  const date = parseServerTime(value)
  if (!date || Number.isNaN(date.getTime())) return ''

  const minutes = Math.floor((now - date) / 60000)
  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}일 전`

  return `${date.getMonth() + 1}월 ${date.getDate()}일`
}
