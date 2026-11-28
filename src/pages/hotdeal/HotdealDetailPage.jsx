// 2-2 핫딜 상세 화면 (/hotdeal/:id)
// 1단계: 사진 영역 + 기본 정보 + 작성자
// 2단계: 본문 + 구매 링크 + 도움돼요/별로예요
// 3단계: 댓글 목록
// 데이터는 핫딜 상세 API(api/dealPosts.js 의 getDealPost)에서 받아 온다
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import RankBadge from '../../components/common/RankBadge.jsx'
import CommentItem from '../../components/common/CommentItem.jsx'
import { getDealPost, reactToDealPost } from '../../api/dealPosts.js'
import cartLargeIcon from '../../assets/hotdeal/cart-large.svg'
import backIcon from '../../assets/icons/back.svg'
import shareIcon from '../../assets/icons/share.svg'
import moreIcon from '../../assets/icons/more.svg'
import eyeIcon from '../../assets/icons/eye-13.svg'
import avatarPlaceholder from '../../assets/profile/avatar-placeholder.svg'
import linkIcon from '../../assets/icons/link.svg'
import chevronRightIcon from '../../assets/icons/chevron-right-18.svg'
import thumbUpIcon from '../../assets/icons/thumb-up-18.svg'
import thumbDownIcon from '../../assets/icons/thumb-down-18.svg'
import './HotdealDetailPage.css'

// 25400 → "25,400"
const formatNumber = (value) => value.toLocaleString('ko-KR')

// "https://www.coupang.com/" → "www.coupang.com" (화면에 보여줄 때만)
const formatUrl = (url) => url.replace(/^https?:\/\//, '').replace(/\/$/, '')

// 아이콘 모양만 쓰고 색은 CSS(currentColor)로 바꾸기 위한 스타일
// (작은 SVG는 빌드할 때 글자로 바뀌어 들어가서, 주소를 꼭 따옴표로 감싸야 함)
const maskStyle = (icon) => ({
  maskImage: `url("${icon}")`,
  WebkitMaskImage: `url("${icon}")`,
})

// 상품 사진: 옆으로 넘겨 보기 (사진이 없으면 피그마처럼 장바구니 아이콘)
function PhotoGallery({ imageUrls }) {
  const [index, setIndex] = useState(0) // 지금 보이는 사진 순서 (0부터)

  if (imageUrls.length === 0) {
    return <img className="hotdeal-detail__photo-placeholder" src={cartLargeIcon} alt="" />
  }

  // 넘긴 거리로 몇 번째 사진인지 계산
  const handleScroll = (event) => {
    const track = event.currentTarget
    setIndex(Math.round(track.scrollLeft / track.clientWidth))
  }

  return (
    <>
      <div className="hotdeal-detail__photo-track" onScroll={handleScroll}>
        {imageUrls.map((url, i) => (
          <img
            key={url}
            className="hotdeal-detail__photo-image"
            src={url}
            alt={`상품 사진 ${i + 1}`}
          />
        ))}
      </div>
      <span className="hotdeal-detail__photo-count text-caption-12-medium">
        {index + 1} / {imageUrls.length}
      </span>
    </>
  )
}

// 도움돼요 / 별로예요 (서버 규칙, 2026-11-28 팀 결정)
// - 처음 상태는 상세 응답의 '내가 누른 반응'(myReaction)으로 시작 (계정별로 유지)
// - 같은 버튼을 다시 누르면 취소, 다른 버튼을 누르면 그쪽으로 바뀜
// - 누를 때마다 서버에 저장하고, 서버가 돌려준 숫자·상태로 화면을 바꿈
// - 마우스를 올리면 눌렀을 때 색을 미리 보여줌 (마우스 있는 기기만, CSS)
function ReactionButtons({ dealId, likeCount, dislikeCount, myReaction }) {
  const navigate = useNavigate()
  const [reaction, setReaction] = useState({ myReaction, likeCount, dislikeCount })
  const [isSaving, setIsSaving] = useState(false)

  const handleReact = async (type) => {
    setIsSaving(true)
    try {
      setReaction(await reactToDealPost(dealId, type))
    } catch (error) {
      if (error.status === 401) navigate('/login', { replace: true })
      // 그 밖의 실패는 화면을 그대로 둠 (다시 누르면 됨)
    } finally {
      setIsSaving(false)
    }
  }

  const buttons = [
    { type: 'LIKE', className: 'like', label: '도움돼요', count: reaction.likeCount, icon: thumbUpIcon },
    { type: 'DISLIKE', className: 'dislike', label: '별로예요', count: reaction.dislikeCount, icon: thumbDownIcon },
  ]

  return (
    <div className="hotdeal-detail__reactions">
      {buttons.map((button) => {
        const isSelected = reaction.myReaction === button.type
        return (
          <button
            key={button.type}
            type="button"
            className={`hotdeal-detail__reaction hotdeal-detail__reaction--${button.className} ${
              isSelected ? 'hotdeal-detail__reaction--selected' : ''
            } text-label-14-medium`}
            disabled={isSaving}
            aria-pressed={isSelected}
            onClick={() => handleReact(button.type)}
          >
            <span className="hotdeal-detail__reaction-icon">
              <span style={maskStyle(button.icon)} />
            </span>
            {button.label} {formatNumber(button.count)}
          </button>
        )
      })}
    </div>
  )
}

// 불러오는 중·찾을 수 없음·실패 때 보여 주는 가운데 안내
function DetailMessage({ message, actionLabel, onAction }) {
  return (
    <div className="hotdeal-detail__not-found" role="status">
      <p className="text-body-15-regular">{message}</p>
      {actionLabel && (
        <button type="button" className="text-label-14-bold" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}

function HotdealDetailPage() {
  const navigate = useNavigate()
  // 주소 /hotdeal/3 의 "3" 을 꺼냄 (App.jsx 에서 path="/hotdeal/:id" 로 등록)
  const { id } = useParams()

  // id: 어떤 핫딜을 불러온 결과인지 → 주소의 id 와 다르면 "불러오는 중"
  const [result, setResult] = useState({ id: null, deal: null, error: null })
  const [retryCount, setRetryCount] = useState(0)
  const isLoading = result.id !== id

  // 상세 화면에 들어오면 맨 위부터 보이게
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  // 핫딜 상세 불러오기 (늦게 온 예전 응답은 ignore 로 버림)
  useEffect(() => {
    let ignore = false
    getDealPost(id)
      .then((deal) => {
        if (!ignore) setResult({ id, deal, error: null })
      })
      .catch((error) => {
        if (ignore) return
        if (error.status === 401) {
          navigate('/login', { replace: true })
          return
        }
        setResult({ id, deal: null, error })
      })
    return () => {
      ignore = true
    }
  }, [id, retryCount, navigate])

  const goBack = () => navigate(-1) // 브라우저 뒤로 가기와 같음
  const goHome = () => navigate('/home')

  const handleRetry = () => {
    setResult({ id: null, deal: null, error: null })
    setRetryCount((count) => count + 1)
  }

  if (isLoading) {
    return <DetailMessage message="핫딜을 불러오는 중이에요" />
  }

  if (result.error) {
    // 없는 글·삭제된 글은 404
    return result.error.status === 404 ? (
      <DetailMessage message="핫딜을 찾을 수 없어요" actionLabel="홈으로 가기" onAction={goHome} />
    ) : (
      <DetailMessage message="핫딜을 불러오지 못했어요" actionLabel="다시 시도" onAction={handleRetry} />
    )
  }

  const { deal } = result

  return (
    <div className="hotdeal-detail">
      {/* ===== 사진 영역 ===== */}
      <section
        className={`hotdeal-detail__photo ${
          deal.imageUrls.length > 0 ? 'hotdeal-detail__photo--has-images' : ''
        }`}
      >
        <PhotoGallery key={deal.id} imageUrls={deal.imageUrls} />

        <nav className="hotdeal-detail__nav">
          <button type="button" className="hotdeal-detail__back" aria-label="뒤로 가기" onClick={goBack}>
            <img src={backIcon} alt="" />
          </button>
          <div className="hotdeal-detail__nav-actions">
            {/* TODO: 공유 기능 */}
            <button type="button" className="hotdeal-detail__nav-button" aria-label="공유하기">
              <img src={shareIcon} alt="" />
            </button>
            {/* TODO: 3-1 더보기 메뉴(신고·내 글 삭제 등)를 만들면 연결 */}
            <button type="button" className="hotdeal-detail__nav-button" aria-label="더보기">
              <img src={moreIcon} alt="" />
            </button>
          </div>
        </nav>
      </section>

      <section className="hotdeal-detail__body">
        {/* ===== 기본 정보 ===== */}
        {deal.mall && <p className="hotdeal-detail__mall text-label-13-regular">{deal.mall}</p>}
        <h1 className="hotdeal-detail__title text-title-21-bold">{deal.title}</h1>
        <p className="hotdeal-detail__price text-title-26-bold">{formatNumber(deal.price)}원</p>

        {/* ===== 작성자 ===== */}
        {/* TODO: 8-2 상대방 프로필 화면을 만들면 연결 */}
        <button type="button" className="hotdeal-detail__author">
          <img
            className={`hotdeal-detail__avatar ${deal.authorImageUrl ? 'hotdeal-detail__avatar--photo' : ''}`}
            src={deal.authorImageUrl ?? avatarPlaceholder}
            alt=""
          />
          <span className="hotdeal-detail__author-info">
            <span className="hotdeal-detail__author-name-row">
              <span className="text-body-15-bold">{deal.authorName}</span>
              <RankBadge rank={deal.authorRank} size="S" />
            </span>
            <span className="hotdeal-detail__author-meta text-caption-12-regular">
              {deal.timeAgo} ·
              <span className="hotdeal-detail__eye">
                <img src={eyeIcon} alt="조회수" />
              </span>
              {formatNumber(deal.viewCount)}
            </span>
          </span>
        </button>

        {/* ===== 본문 ===== */}
        <p className="hotdeal-detail__content text-body-15-paragraph">{deal.content}</p>

        {/* ===== 구매 링크 (새 탭으로 열림) ===== */}
        {deal.purchaseUrl && (
          <a
            className="hotdeal-detail__purchase-link"
            href={deal.purchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="hotdeal-detail__link-icon">
              <img src={linkIcon} alt="" />
            </span>
            <span className="hotdeal-detail__link-text">
              <span className="hotdeal-detail__link-label text-caption-12-regular">구매 링크</span>
              <span className="hotdeal-detail__link-url text-label-14-medium">
                {formatUrl(deal.purchaseUrl)}
              </span>
            </span>
            <span className="hotdeal-detail__link-chevron">
              <img src={chevronRightIcon} alt="" />
            </span>
          </a>
        )}

        {/* ===== 도움돼요 / 별로예요 ===== */}
        {/* key: 다른 핫딜로 넘어가면 누른 상태를 새로 시작 */}
        <ReactionButtons
          key={deal.id}
          dealId={deal.id}
          likeCount={deal.likeCount}
          dislikeCount={deal.dislikeCount}
          myReaction={deal.myReaction}
        />

        {/* ===== 댓글 ===== */}
        {/* TODO: 댓글 작성은 4단계 하단 입력칸(피그마 2-4)과 함께 (댓글 작성 API 있음) */}
        <section className="hotdeal-detail__comments" aria-label="댓글">
          <h2 className="hotdeal-detail__comments-title text-heading-17-bold">
            댓글
            <span className="hotdeal-detail__comments-count">{formatNumber(deal.commentCount)}</span>
          </h2>

          {deal.comments.length > 0 ? (
            <ul className="hotdeal-detail__comment-list">
              {deal.comments.map((comment) => (
                <li key={comment.id}>
                  <CommentItem comment={comment} />
                  {/* 대댓글: 댓글 아래에 들여 써서 보여 줌 (피그마에 없어서 임의로 정함) */}
                  {comment.replies.length > 0 && (
                    <ul className="hotdeal-detail__replies">
                      {comment.replies.map((reply) => (
                        <li key={reply.id}>
                          <CommentItem comment={reply} />
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="hotdeal-detail__comments-empty text-body-14-paragraph">
              아직 댓글이 없어요
            </p>
          )}
        </section>
      </section>
    </div>
  )
}

export default HotdealDetailPage
