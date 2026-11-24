// 도움돼요/별로예요를 브라우저 저장소(localStorage)에 기억하기 (API가 나오기 전까지 임시)
// - 이 브라우저에서만 유지된다. 다른 기기·다른 사람에게는 반영되지 않음
// TODO: 추천 API가 나오면 서버에 저장하고, 상세 API 응답의 "내 반응" 값을 쓰도록 바꾸고 이 파일은 삭제

const STORAGE_KEY = 'eolmago.reactions' // { "1": "like", "2": "dislike", ... }

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    return {} // 저장된 값이 깨져 있으면 없는 것으로
  }
}

// 핫딜 번호에 내가 누른 반응: 'like' | 'dislike' | null
export function getMyReaction(hotdealId) {
  return readAll()[hotdealId] ?? null
}

export function saveMyReaction(hotdealId, reaction) {
  const all = readAll()
  all[hotdealId] = reaction
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}
