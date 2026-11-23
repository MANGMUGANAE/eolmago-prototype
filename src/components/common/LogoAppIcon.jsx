// 얼마고 앱 아이콘 (피그마 컴포넌트 "Logo/App Icon", 64px)
// 초록 둥근 배경 위에 로고 마크 조각을 겹쳐서 만든다.
import background from '../../assets/logo/app-icon/background.svg'
import basketHandle from '../../assets/logo/app-icon/basket-handle.svg'
import basketBody from '../../assets/logo/app-icon/basket-body.svg'
import basketLine from '../../assets/logo/app-icon/basket-line.svg'
import priceTag from '../../assets/logo/app-icon/price-tag.svg'
import './LogoAppIcon.css'

function LogoAppIcon() {
  return (
    <div className="logo-app-icon" role="img" aria-label="얼마고 앱 아이콘">
      <img className="logo-app-icon__bg" src={background} alt="" />
      <img className="logo-app-icon__handle" src={basketHandle} alt="" />
      <img className="logo-app-icon__body" src={basketBody} alt="" />
      <img className="logo-app-icon__line logo-app-icon__line--1" src={basketLine} alt="" />
      <img className="logo-app-icon__line logo-app-icon__line--2" src={basketLine} alt="" />
      <img className="logo-app-icon__line logo-app-icon__line--3" src={basketLine} alt="" />
      <div className="logo-app-icon__tag-area">
        <img className="logo-app-icon__tag" src={priceTag} alt="" />
      </div>
    </div>
  )
}

export default LogoAppIcon
