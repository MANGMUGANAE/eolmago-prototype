// 핫딜·카테고리 API
import { apiRequest, toImageUrl } from './client.js'
import { formatTimeAgo } from '../utils/time.js'

// 카테고리 목록: [{ categoryId: 1, categoryName: '신선식품' }, …]
export async function getCategories() {
  const data = await apiRequest('/api/v1/categories')
  return data?.categories ?? []
}

// 정렬 값은 서버 값 그대로: 'latest'(최신순) · 'price'(가격순, 싼 것부터) · 'grade'(등급순, 높은 등급부터)
export const SORT_TYPES = ['latest', 'price', 'grade']

// 핫딜 목록 (한 페이지씩)
// - categoryId: 카테고리 번호 (없으면 전체)
// - keyword: 상품명 검색어
// - excludeEnded: true 면 종료된 핫딜 제외
// - hotDeal: true 면 서버의 '핫딜 필터' (중수 이상이 올렸고 신뢰도 조건을 만족하는 글)
// - sortType: SORT_TYPES 중 하나
// - page: 0 부터 시작, size: 한 페이지 개수 (최대 50)
// 돌려주는 값: { deals: [HotdealCard 에 넘길 모양], page, hasNext }
export async function getDealPosts({
  categoryId,
  keyword,
  excludeEnded = false,
  hotDeal = false,
  sortType = 'latest',
  page = 0,
  size = 20,
} = {}) {
  const data = await apiRequest('/api/v1/deal-posts', {
    query: {
      category: categoryId,
      keyword,
      // 서버의 ended=true 는 '종료된 글 제외'라는 뜻
      ended: excludeEnded ? true : undefined,
      hotDeal: hotDeal ? true : undefined,
      sortType,
      page,
      size,
    },
  })

  return {
    deals: (data?.dealPosts ?? []).map(toHotdealCard),
    page: data?.page ?? page,
    hasNext: Boolean(data?.hasNext),
  }
}

// 핫딜 상세 (본문·사진·작성자·도움돼요/별로예요·댓글 포함)
// 없는 글이거나 삭제된 글이면 ApiError(status 404)
export async function getDealPost(id) {
  const data = await apiRequest(`/api/v1/deal-posts/${id}`)
  return toHotdealDetail(id, data)
}

// 도움돼요 / 별로예요 누르기 (reaction: 'LIKE' | 'DISLIKE')
// 서버 규칙: 같은 버튼을 다시 누르면 취소(NONE), 다른 버튼을 누르면 그쪽으로 바뀜
// 돌려주는 값: { myReaction: 'LIKE'|'DISLIKE'|'NONE', likeCount, dislikeCount } (누른 뒤 상태)
export async function reactToDealPost(id, reaction) {
  const path = reaction === 'LIKE' ? 'like' : 'dislike'
  const data = await apiRequest(`/api/v1/deal-posts/${id}/${path}`, { method: 'POST' })
  return {
    myReaction: data?.reactionType ?? 'NONE',
    likeCount: data?.likeCount ?? 0,
    dislikeCount: data?.dislikeCount ?? 0,
  }
}

// 댓글 작성
// - parentCommentId 를 주면 그 댓글의 대댓글 (대댓글에 다시 답글은 안 됨 → 400)
// - 내용이 비어 있으면 400
// 돌려주는 값: { commentId, parentCommentId }
export function createComment(dealId, { content, parentCommentId } = {}) {
  return apiRequest(`/api/v1/deal-posts/${dealId}/comments`, {
    method: 'POST',
    json: { content, parentCommentId },
  })
}

// 서버 필드 이름 → 우리 화면(HotdealCard)에서 쓰는 이름
function toHotdealCard(post) {
  return {
    id: post.dealPostId,
    mall: post.storeName, // 판매처를 고르지 않은 글은 null
    title: post.productName,
    price: post.productPrice,
    commentCount: post.commentCount ?? 0,
    authorRank: post.jjandolRank, // 서버 등급 값 그대로 (STARTER ~ MASTER)
    likeCount: post.likeCount ?? 0,
    viewCount: post.viewCount ?? 0,
    timeAgo: formatTimeAgo(post.createdAt),
    isEnded: post.dealPostStatus === 'ENDED',
    thumbnailUrl: toImageUrl(post.thumbnailImageUrl),
  }
}

// 서버 상세 응답 → 상세 화면에서 쓰는 이름
function toHotdealDetail(id, data) {
  const author = data?.userInfo ?? {}
  const commentData = data?.dealPostCommentResponseDto ?? {}

  return {
    id: Number(id),
    mall: data.storeName,
    title: data.productName,
    price: data.productPrice,
    imageUrls: (data.imageFileUrlList ?? []).map(toImageUrl),
    authorName: author.nickname,
    authorRank: author.jjandolRank,
    authorImageUrl: toImageUrl(author.imageFileUrl),
    timeAgo: formatTimeAgo(data.createdAt),
    viewCount: data.viewCount ?? 0,
    content: data.content ?? '',
    purchaseUrl: data.purchaseLink,
    likeCount: data.likeCount ?? 0,
    dislikeCount: data.dislikeCount ?? 0,
    // userInfo 안에 있지만 글쓴이가 아니라 '보고 있는 나'의 반응 (서버 명세)
    myReaction: author.reactionType ?? 'NONE',
    comments: (commentData.comments ?? []).map(toComment),
    commentCount: commentData.commentCount ?? 0, // 대댓글 포함 전체 개수
  }
}

// 댓글 한 개 (replies 에 대댓글이 들어 있음, 대댓글의 replies 는 항상 빈 배열)
function toComment(comment) {
  const author = comment.userInfo ?? {}
  return {
    id: comment.commentId,
    parentId: comment.parentCommentId,
    authorName: author.nickname,
    authorRank: author.jjandolRank,
    authorImageUrl: toImageUrl(author.imageFileUrl),
    timeAgo: formatTimeAgo(comment.commentInfo?.createdAt),
    content: comment.commentInfo?.content ?? '',
    replies: (comment.replies ?? []).map(toComment),
  }
}
