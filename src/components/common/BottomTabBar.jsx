// 떠 있는 하단 탭 바 (피그마 컴포넌트 "Tab Bar (Floating)")
// 사용 예) <BottomTabBar />
// 지금 주소(URL)를 보고 활성 탭을 자동으로 표시한다. (NavLink)
// 가운데 + 버튼을 누르면 글쓰기 메뉴(피그마 2-1-4)가 열린다.
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router'
import homeIcon from '../../assets/tabbar/home.svg'
import homeActiveIcon from '../../assets/tabbar/home-active.svg'
import communityIcon from '../../assets/tabbar/community.svg'
import communityActiveIcon from '../../assets/tabbar/community-active.svg'
import basketIcon from '../../assets/tabbar/basket.svg'
import basketActiveIcon from '../../assets/tabbar/basket-active.svg'
import myIcon from '../../assets/tabbar/my.svg'
import myActiveIcon from '../../assets/tabbar/my-active.svg'
import plusIcon from '../../assets/tabbar/plus.svg'
import closeIcon from '../../assets/tabbar/close.svg'
import writeHotdealIcon from '../../assets/tabbar/write-hotdeal.svg'
import writeCommunityIcon from '../../assets/tabbar/write-community.svg'
import './BottomTabBar.css'

// 글쓰기 메뉴 항목
// TODO: "자유게시판" 이름·아이콘은 기획 확정 후 변경 (설명 문구는 피그마 그대로)
const WRITE_MENU = [
  {
    key: 'hotdeal',
    title: '핫딜 공유',
    description: '나만의 꿀팁을 공유해볼까요?',
    icon: writeHotdealIcon,
  },
  {
    key: 'community',
    title: '자유게시판',
    description: '질문하거나 자유롭게 이야기해요',
    icon: writeCommunityIcon,
  },
]

const LEFT_TABS = [
  { to: '/home', label: '홈', icon: homeIcon, activeIcon: homeActiveIcon },
  { to: '/community', label: '짠돌이들', icon: communityIcon, activeIcon: communityActiveIcon },
]

const RIGHT_TABS = [
  { to: '/basket', label: '바구니', icon: basketIcon, activeIcon: basketActiveIcon },
  { to: '/my', label: '마이', icon: myIcon, activeIcon: myActiveIcon },
]

function Tab({ to, label, icon, activeIcon }) {
  return (
    <NavLink to={to} className="tab-bar__tab">
      {/* NavLink 는 지금 주소가 to 와 같으면 isActive 를 true 로 알려준다 */}
      {({ isActive }) => (
        <>
          <span className="tab-bar__icon">
            <img src={isActive ? activeIcon : icon} alt="" />
          </span>
          <span
            className={
              isActive
                ? 'tab-bar__label tab-bar__label--active text-caption-12-medium'
                : 'tab-bar__label text-caption-12-regular'
            }
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  )
}

function BottomTabBar() {
  const [isWriteMenuOpen, setIsWriteMenuOpen] = useState(false)
  const closeWriteMenu = () => setIsWriteMenuOpen(false)

  // 메뉴가 열려 있을 때만 Esc 로 닫기
  useEffect(() => {
    if (!isWriteMenuOpen) return
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsWriteMenuOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isWriteMenuOpen])

  const handleWriteMenuSelect = () => {
    // TODO: 핫딜 공유 → 4-1 핫딜 공유, 자유게시판 → 5-6 자유 글쓰기 화면을 만들면 이동
    closeWriteMenu()
  }

  return (
    <>
      {isWriteMenuOpen && (
        <>
          {/* 어두운 배경: 누르면 메뉴 닫힘 (탭 바는 이 위에 그대로 보임) */}
          <button
            type="button"
            className="tab-bar__dim"
            aria-label="글쓰기 메뉴 닫기"
            onClick={closeWriteMenu}
          />
          <ul className="tab-bar__write-menu" aria-label="글쓰기 메뉴">
            {WRITE_MENU.map((item) => (
              <li key={item.key}>
                <button
                  type="button"
                  className="tab-bar__write-item"
                  onClick={handleWriteMenuSelect}
                >
                  <span className={`tab-bar__write-icon tab-bar__write-icon--${item.key}`}>
                    <img src={item.icon} alt="" />
                  </span>
                  <span className="tab-bar__write-text">
                    <span className="tab-bar__write-title text-heading-16-bold">{item.title}</span>
                    <span className="tab-bar__write-description text-label-13-regular">
                      {item.description}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <nav className="tab-bar" aria-label="메인 메뉴">
        <div className="tab-bar__group tab-bar__group--left">
          {LEFT_TABS.map((tab) => (
            <Tab key={tab.to} {...tab} />
          ))}
        </div>

        {/* + 버튼: 메뉴가 열리면 검정 배경의 X 로 바뀜 */}
        <button
          type="button"
          className={`tab-bar__write ${isWriteMenuOpen ? 'tab-bar__write--open' : ''}`}
          aria-label={isWriteMenuOpen ? '글쓰기 메뉴 닫기' : '글쓰기'}
          aria-expanded={isWriteMenuOpen}
          onClick={() => setIsWriteMenuOpen(!isWriteMenuOpen)}
        >
          <img src={isWriteMenuOpen ? closeIcon : plusIcon} alt="" />
        </button>

        <div className="tab-bar__group tab-bar__group--right">
          {RIGHT_TABS.map((tab) => (
            <Tab key={tab.to} {...tab} />
          ))}
        </div>
      </nav>
    </>
  )
}

export default BottomTabBar
