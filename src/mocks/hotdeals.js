// 가짜 핫딜 데이터 (백엔드 API가 나오기 전까지 화면 확인용)
// 내용은 피그마 "2-1 홈"·"2-1-2 홈 (신선식품)" 화면에 있는 그대로.
// TODO: 핫딜 목록 API가 나오면 src/api/ 에서 받아오도록 바꾸고 이 파일은 삭제

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
  { id: 1, category: '가공식품·음료', mall: '쿠팡', title: '신라면 멀티팩 40개입', price: 25400, commentCount: 31, authorRank: 'novice', likeCount: 96, viewCount: 1350, timeAgo: '23분 전', isEnded: false },
  { id: 2, category: '가공식품·음료', mall: '이마트몰', title: '제주 삼다수 2L × 12병', price: 8900, commentCount: 24, authorRank: 'beginner', likeCount: 128, viewCount: 1786, timeAgo: '1시간 전', isEnded: false },
  { id: 3, category: '신선식품', mall: '홈플러스몰', title: '한돈 삼겹살 1kg', price: 13900, commentCount: 57, authorRank: 'expert', likeCount: 214, viewCount: 2885, timeAgo: '2시간 전', isEnded: false },
  { id: 4, category: '가공식품·음료', mall: '네이버쇼핑', title: '코카콜라 제로 355ml × 24캔', price: 16800, commentCount: 12, authorRank: 'novice', likeCount: 77, viewCount: 1079, timeAgo: '3시간 전', isEnded: true },
  { id: 5, category: '신선식품', mall: '롯데마트몰', title: '바나나 1송이', price: 1990, commentCount: 8, authorRank: 'master', likeCount: 45, viewCount: 643, timeAgo: '5시간 전', isEnded: false },
  { id: 6, category: '가공식품·음료', mall: '쿠팡', title: '햇반 210g × 24개입', price: 19800, commentCount: 31, authorRank: 'novice', likeCount: 96, viewCount: 1350, timeAgo: '6시간 전', isEnded: false },
  { id: 7, category: '가공식품·음료', mall: '홈플러스몰', title: '농심 백산수 2L × 6병', price: 4980, commentCount: 24, authorRank: 'beginner', likeCount: 128, viewCount: 1786, timeAgo: '7시간 전', isEnded: false },

  // ===== 2-1-2 홈 (신선식품) =====
  { id: 8, category: '신선식품', mall: '쿠팡', title: '부사 사과 3kg (13~15과)', price: 19900, commentCount: 31, authorRank: 'novice', likeCount: 96, viewCount: 1350, timeAgo: '8시간 전', isEnded: false },
  { id: 9, category: '신선식품', mall: '이마트몰', title: '청송 꿀사과 1.5kg', price: 9980, commentCount: 24, authorRank: 'beginner', likeCount: 128, viewCount: 1786, timeAgo: '9시간 전', isEnded: false },
  { id: 10, category: '신선식품', mall: '홈플러스몰', title: '못난이 사과 2kg, 주스용', price: 7900, commentCount: 57, authorRank: 'middle', likeCount: 214, viewCount: 2885, timeAgo: '10시간 전', isEnded: false },
  { id: 11, category: '신선식품', mall: '네이버쇼핑', title: '홍로 사과 5kg', price: 29800, commentCount: 12, authorRank: 'novice', likeCount: 77, viewCount: 1079, timeAgo: '11시간 전', isEnded: true },
  { id: 12, category: '신선식품', mall: '롯데마트몰', title: '사과 1봉 (6입)', price: 6990, commentCount: 8, authorRank: 'master', likeCount: 45, viewCount: 643, timeAgo: '12시간 전', isEnded: false },
]
