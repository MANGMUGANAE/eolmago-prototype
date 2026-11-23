// 떠 있는 하단 탭 바 (피그마 컴포넌트 "Tab Bar (Floating)")
// 사용 예) <BottomTabBar />
// 지금 주소(URL)를 보고 활성 탭을 자동으로 표시한다. (NavLink)
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
import './BottomTabBar.css'

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
  const handleWrite = () => {
    // TODO: 글쓰기 메뉴(핫딜 공유 / 질문하기)를 만들면 여기서 열기
  }

  return (
    <nav className="tab-bar" aria-label="메인 메뉴">
      <div className="tab-bar__group tab-bar__group--left">
        {LEFT_TABS.map((tab) => (
          <Tab key={tab.to} {...tab} />
        ))}
      </div>

      <button type="button" className="tab-bar__write" aria-label="글쓰기" onClick={handleWrite}>
        <img src={plusIcon} alt="" />
      </button>

      <div className="tab-bar__group tab-bar__group--right">
        {RIGHT_TABS.map((tab) => (
          <Tab key={tab.to} {...tab} />
        ))}
      </div>
    </nav>
  )
}

export default BottomTabBar
