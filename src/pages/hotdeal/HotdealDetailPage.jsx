// 2-2 핫딜 상세 화면 (/hotdeal/:id)
// 1단계: 사진 영역 + 기본 정보 + 작성자
// 2단계: 본문 + 구매 링크 + 도움돼요/별로예요
// 3단계: 댓글 목록
// 4단계: 하단 고정 바 (구매하러 가기·담기 ↔ 댓글 입력칸, 피그마 2-2 · 2-4)
// 데이터는 핫딜 상세 API(api/dealPosts.js 의 getDealPost)에서 받아 온다
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import RankBadge from '../../components/common/RankBadge.jsx'
import CommentItem from '../../components/common/CommentItem.jsx'
import { createComment, getDealPost, reactToDealPost } from '../../api/dealPosts.js'
import externalLinkIcon from '../../assets/icons/external-link.svg'
import sendIcon from '../../assets/icons/send.svg'
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

// 하단 바 (피그마 2-2): 구매하러 가기 + 담기
function BuyBar({ purchaseUrl }) {
  return (
    <div className="hotdeal-detail__buy-bar">
      {purchaseUrl ? (
        <a
          className="hotdeal-detail__buy text-heading-16-bold"
          href={purchaseUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="hotdeal-detail__buy-icon">
            <img src={externalLinkIcon} alt="" />
          </span>
          구매하러 가기
        </a>
      ) : (
        <button type="button" className="hotdeal-detail__buy text-heading-16-bold" disabled>
          구매 링크가 없어요
        </button>
      )}
      {/* TODO: 바구니 API가 생기면 담기 연결 (계정별 저장이라 서버가 필요) */}
      <button type="button" className="hotdeal-detail__save text-heading-16-bold">
        담기
      </button>
    </div>
  )
}

// 하단 댓글 입력칸 (피그마 2-4)
function CommentForm({ value, onChange, onFocusChange, onSubmit, isPosting, error }) {
  const canSend = value.trim() !== '' && !isPosting

  return (
    <form className="hotdeal-detail__comment-form" onSubmit={onSubmit}>
      {error && (
        <p className="hotdeal-detail__comment-error text-caption-12-medium" role="alert">
          {error}
        </p>
      )}
      <div className="hotdeal-detail__comment-field">
        <input
          className="hotdeal-detail__comment-input text-body-15-regular"
          type="text"
          value={value}
          placeholder="댓글을 남겨 보세요"
          aria-label="댓글 입력"
          enterKeyHint="send"
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => onFocusChange(true)}
          onBlur={() => onFocusChange(false)}
        />
        <button
          type="submit"
          className="hotdeal-detail__comment-send"
          aria-label="댓글 보내기"
          disabled={!canSend}
        >
          <span className="hotdeal-detail__comment-send-icon">
            <img src={sendIcon} alt="" />
          </span>
        </button>
      </div>
    </form>
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
  const hasDeal = Boolean(result.deal)

  // 스크롤 위치에 따라 바뀌는 것 (피그마 2-4)
  // - 사진이 위로 지나가면 뒤로 가기·공유·더보기 줄에 흰 배경
  // - 댓글이 화면 위쪽 70% 안에 들어오면 하단 바가 댓글 입력칸으로 바뀜
  const photoRef = useRef(null)
  const commentsRef = useRef(null)
  const [isPhotoHidden, setIsPhotoHidden] = useState(false)
  const [isCommentsInView, setIsCommentsInView] = useState(false)

  // 댓글 입력
  const [commentText, setCommentText] = useState('')
  const [isCommentFocused, setIsCommentFocused] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const [commentError, setCommentError] = useState('')
  // 입력 중이거나 쓰다 만 글이 있으면 스크롤해도 입력칸 유지
  const showCommentForm = isCommentsInView || isCommentFocused || commentText.trim() !== ''

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

  // 사진·댓글 영역이 화면에 보이는지 지켜봄 (상세 내용이 화면에 나온 뒤에 시작)
  useEffect(() => {
    if (!hasDeal) return
    const photoObserver = new IntersectionObserver(
      ([entry]) => setIsPhotoHidden(!entry.isIntersecting),
      { rootMargin: '-48px 0px 0px 0px' }, // 위쪽 줄(48px) 아래로 사진이 다 지나가면
    )
    const commentsObserver = new IntersectionObserver(
      ([entry]) => setIsCommentsInView(entry.isIntersecting),
      { rootMargin: '0px 0px -30% 0px' }, // 화면 아래 30%는 빼고 봄
    )
    photoObserver.observe(photoRef.current)
    commentsObserver.observe(commentsRef.current)
    return () => {
      photoObserver.disconnect()
      commentsObserver.disconnect()
    }
  }, [hasDeal])

  // 댓글 등록 → 성공하면 입력칸을 비우고 댓글 목록을 다시 불러옴
  const handleSubmitComment = async (event) => {
    event.preventDefault() // 폼 기본 동작(페이지 새로고침) 막기
    const content = commentText.trim()
    if (!content || isPosting) return

    setIsPosting(true)
    setCommentError('')
    try {
      await createComment(result.deal.id, { content })
    } catch (error) {
      if (error.status === 401) {
        navigate('/login', { replace: true })
        return
      }
      setCommentError('댓글을 등록하지 못했어요. 잠시 후 다시 시도해 주세요')
      setIsPosting(false)
      return
    }

    setCommentText('')
    try {
      const updated = await getDealPost(result.deal.id)
      setResult({ id, deal: updated, error: null })
    } catch {
      // 등록은 됐으니 목록 새로고침 실패는 넘어감 (다시 들어오면 보임)
    }
    setIsPosting(false)
  }

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
        ref={photoRef}
        className={`hotdeal-detail__photo ${
          deal.imageUrls.length > 0 ? 'hotdeal-detail__photo--has-images' : ''
        }`}
      >
        <PhotoGallery key={deal.id} imageUrls={deal.imageUrls} />

        {/* 화면 맨 위에 고정. 사진이 지나가면 흰 배경 (피그마 2-4) */}
        <nav className={`hotdeal-detail__nav ${isPhotoHidden ? 'hotdeal-detail__nav--solid' : ''}`}>
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
        {/* 댓글 작성은 하단 입력칸에서. TODO: 대댓글 달기·내 댓글 삭제 (피그마·서버 값 확인 후) */}
        <section ref={commentsRef} className="hotdeal-detail__comments" aria-label="댓글">
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

      {/* ===== 하단 고정 바 ===== */}
      <div className="hotdeal-detail__bottom">
        {showCommentForm ? (
          <CommentForm
            value={commentText}
            onChange={(text) => {
              setCommentText(text)
              setCommentError('')
            }}
            onFocusChange={setIsCommentFocused}
            onSubmit={handleSubmitComment}
            isPosting={isPosting}
            error={commentError}
          />
        ) : (
          <BuyBar purchaseUrl={deal.purchaseUrl} />
        )}
      </div>
    </div>
  )
}

export default HotdealDetailPage
