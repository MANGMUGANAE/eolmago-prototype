// 가짜 핫딜 데이터 (백엔드 API가 나오기 전까지 화면 확인용)
// 내용은 피그마 "2-1 홈"·"2-1-2 홈 (신선식품)"·"2-2 핫딜 상세" 화면에 있는 그대로.
// 피그마에 없는 작성자 닉네임은 임의로 정함.
// TODO: 핫딜 목록·상세 API가 나오면 src/api/ 에서 받아오도록 바꾸고 이 파일은 삭제

export const CATEGORIES = [
  '신선식품',
  '가공식품·음료',
  '생활용품',
  '뷰티·건강',
  '가전·디지털',
  '패션·잡화',
  '상품권·쿠폰',
  '기타',
]

export const HOTDEALS = [
  // ===== 2-1 홈 =====
  { id: 1, category: '가공식품·음료', mall: '쿠팡', title: '신라면 멀티팩 40개입', price: 25400, commentCount: 31, authorName: '짠돌이자취러', authorRank: 'novice', likeCount: 96, viewCount: 1350, timeAgo: '23분 전', isEnded: false, imageCount: 2 },
  { id: 2, category: '가공식품·음료', mall: '이마트몰', title: '제주 삼다수 2L × 12병', price: 8900, commentCount: 24, authorName: '물먹는하마', authorRank: 'beginner', likeCount: 128, viewCount: 1786, timeAgo: '1시간 전', isEnded: false, imageCount: 1 },
  { id: 3, category: '신선식품', mall: '홈플러스몰', title: '한돈 삼겹살 1kg', price: 13900, commentCount: 57, authorName: '고기는진리', authorRank: 'expert', likeCount: 214, viewCount: 2885, timeAgo: '2시간 전', isEnded: false, imageCount: 3 },
  { id: 4, category: '가공식품·음료', mall: '네이버쇼핑', title: '코카콜라 제로 355ml × 24캔', price: 16800, commentCount: 12, authorName: '제로콜라중독', authorRank: 'novice', likeCount: 77, viewCount: 1079, timeAgo: '3시간 전', isEnded: true, imageCount: 1 },
  { id: 5, category: '신선식품', mall: '롯데마트몰', title: '바나나 1송이', price: 1990, commentCount: 8, authorName: '짠돌대장', authorRank: 'master', likeCount: 45, viewCount: 643, timeAgo: '5시간 전', isEnded: false, imageCount: 2 },
  { id: 6, category: '가공식품·음료', mall: '쿠팡', title: '햇반 210g × 24개입', price: 19800, commentCount: 31, authorName: '밥심', authorRank: 'novice', likeCount: 96, viewCount: 1350, timeAgo: '6시간 전', isEnded: false, imageCount: 1 },
  { id: 7, category: '가공식품·음료', mall: '홈플러스몰', title: '농심 백산수 2L × 6병', price: 4980, commentCount: 24, authorName: '물먹는하마', authorRank: 'beginner', likeCount: 128, viewCount: 1786, timeAgo: '7시간 전', isEnded: false, imageCount: 1 },

  // ===== 2-1-2 홈 (신선식품) =====
  { id: 8, category: '신선식품', mall: '쿠팡', title: '부사 사과 3kg (13~15과)', price: 19900, commentCount: 31, authorName: '사과좋아', authorRank: 'novice', likeCount: 96, viewCount: 1350, timeAgo: '8시간 전', isEnded: false, imageCount: 2 },
  { id: 9, category: '신선식품', mall: '이마트몰', title: '청송 꿀사과 1.5kg', price: 9980, commentCount: 24, authorName: '과일러버', authorRank: 'beginner', likeCount: 128, viewCount: 1786, timeAgo: '9시간 전', isEnded: false, imageCount: 1 },
  { id: 10, category: '신선식품', mall: '홈플러스몰', title: '못난이 사과 2kg, 주스용', price: 7900, commentCount: 57, authorName: '알뜰주부', authorRank: 'middle', likeCount: 214, viewCount: 2885, timeAgo: '10시간 전', isEnded: false, imageCount: 1 },
  { id: 11, category: '신선식품', mall: '네이버쇼핑', title: '홍로 사과 5kg', price: 29800, commentCount: 12, authorName: '사과좋아', authorRank: 'novice', likeCount: 77, viewCount: 1079, timeAgo: '11시간 전', isEnded: true, imageCount: 1 },
  { id: 12, category: '신선식품', mall: '롯데마트몰', title: '사과 1봉 (6입)', price: 6990, commentCount: 8, authorName: '짠돌대장', authorRank: 'master', likeCount: 45, viewCount: 643, timeAgo: '12시간 전', isEnded: false, imageCount: 1 },
]

// ===== 상세 화면에서만 쓰는 정보 (핫딜 번호별) =====
// content: 본문, purchaseUrl: 구매 링크, dislikeCount: 별로예요 수
// 구매 링크는 엉뚱한 실제 상품이 열리지 않도록 쇼핑몰 첫 화면 주소로 넣음
const MALL_URLS = {
  쿠팡: 'https://www.coupang.com/',
  이마트몰: 'https://emart.ssg.com/',
  홈플러스몰: 'https://front.homeplus.co.kr/',
  네이버쇼핑: 'https://shopping.naver.com/',
  롯데마트몰: 'https://www.lotteon.com/',
}

const HOTDEAL_DETAILS = {
  // 피그마 2-2 문구 그대로
  1: {
    content:
      '와우 회원 할인에 카드 즉시할인까지 같이 들어가서 이 가격 나왔어요. 개당 600원대라 자취생 비상식량으로 쟁여두기 딱 좋아요. 오늘 자정까지라고 하니 참고하세요!',
    dislikeCount: 2,
  },
  2: { content: '12병에 8,900원이면 병당 700원대예요.\n무료배송이라 무거운 물 사기 딱 좋아요.', dislikeCount: 3 },
  3: { content: '앞다리 아니고 삼겹살 1kg이에요. 마트 가격보다 확실히 싸요!', dislikeCount: 5 },
  4: { content: '쿠폰 적용하면 캔당 700원이었는데 지금은 끝났어요.', dislikeCount: 1 },
  5: { content: '오늘만 이 가격이래요. 한 송이에 6~7개 들어 있어요.', dislikeCount: 0 },
  6: { content: '카드 할인까지 받으면 개당 800원대예요.', dislikeCount: 4 },
  7: { content: '6병에 5천 원 안 돼요. 정기배송 할인은 따로예요.', dislikeCount: 2 },
  8: { content: '13~15과 들어 있고 당도 좋다는 후기가 많아요.', dislikeCount: 3 },
  9: { content: '꿀사과 1.5kg에 만 원 안 돼요!', dislikeCount: 2 },
  10: { content: '모양은 못생겼지만 주스용으로는 최고예요.\n갈아 마시기 딱 좋아요.', dislikeCount: 6 },
  11: { content: '5kg에 3만 원 안 됐는데 품절됐어요.', dislikeCount: 1 },
  12: { content: '6개 한 봉에 7천 원 안 돼요. 소량으로 사기 좋아요.', dislikeCount: 0 },
}

// ===== 핫딜별 댓글 (일부만. 실제 서버에서는 commentCount 와 목록 개수가 맞게 옴) =====
// 1번은 피그마 2-2 댓글 그대로, 나머지는 예시
const HOTDEAL_COMMENTS = {
  1: [
    { id: 1, authorName: '성수동물개', authorRank: 'novice', timeAgo: '10분 전', content: '방금 결제했어요! 덕분에 한 박스 쟁였습니다' },
    { id: 2, authorName: '라면러버', authorRank: 'beginner', timeAgo: '15분 전', content: '와우 회원 아니어도 이 가격인가요?' },
  ],
  2: [
    { id: 3, authorName: '자취3년차', authorRank: 'middle', timeAgo: '30분 전', content: '무료배송이라 좋네요. 바로 샀어요' },
  ],
  3: [
    { id: 4, authorName: '고기러버', authorRank: 'novice', timeAgo: '1시간 전', content: '두께 어떤가요? 구이용으로 괜찮나요?' },
    { id: 5, authorName: '고기는진리', authorRank: 'expert', timeAgo: '50분 전', content: '1.5cm 정도라 구이용으로 딱이에요!' },
    { id: 6, authorName: '짠돌대장', authorRank: 'master', timeAgo: '20분 전', content: '이 가격이면 두 팩 사도 되겠네요' },
  ],
  5: [
    { id: 7, authorName: '바나나우유', authorRank: 'beginner', timeAgo: '2시간 전', content: '오늘 받았는데 잘 익었어요' },
  ],
}

// 번호(id)로 핫딜 하나 찾기 (없으면 undefined)
// 목록 정보 + 상세 정보를 합쳐서 돌려준다 (실제 상세 API도 이렇게 한 번에 줄 예정)
export function findHotdeal(id) {
  const deal = HOTDEALS.find((item) => item.id === Number(id))
  if (!deal) return undefined

  return {
    ...deal,
    content: '',
    dislikeCount: 0,
    purchaseUrl: MALL_URLS[deal.mall],
    comments: HOTDEAL_COMMENTS[deal.id] ?? [],
    ...HOTDEAL_DETAILS[deal.id],
  }
}
