// 댓글 한 줄 (피그마 2-2 핫딜 상세의 "Comment")
// 사용 예) <CommentItem comment={comment} />
//   comment = { authorName: '성수동물개', authorRank: 'novice', timeAgo: '10분 전', content: '...' }
// 핫딜 상세뿐 아니라 짠돌이들 글 상세(5-2, 5-5)에서도 쓸 예정이라 common 에 둔다.
import RankBadge from './RankBadge.jsx'
import avatarPlaceholder from '../../assets/profile/avatar-placeholder-32.svg'
import './CommentItem.css'

function CommentItem({ comment }) {
  const { authorName, authorRank, timeAgo, content } = comment

  return (
    <article className="comment-item">
      {/* TODO: 프로필 사진이 생기면 교체 */}
      <img className="comment-item__avatar" src={avatarPlaceholder} alt="" />
      <div className="comment-item__body">
        <div className="comment-item__header">
          <span className="comment-item__name text-label-13-bold">{authorName}</span>
          <RankBadge rank={authorRank} size="S" />
          <span className="comment-item__time text-caption-12-regular">{timeAgo}</span>
        </div>
        <p className="comment-item__content text-body-14-paragraph">{content}</p>
      </div>
    </article>
  )
}

export default CommentItem
