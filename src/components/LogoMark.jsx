// 얼마고 로고 마크 (피그마 컴포넌트 "Logo/Mark", 112px)
// 장바구니 손잡이·몸통·세로줄 3개·가격표 태그 SVG를 겹쳐서 만든다.
import basketHandle from '../assets/logo/basket-handle.svg'
import basketBody from '../assets/logo/basket-body.svg'
import basketLine from '../assets/logo/basket-line.svg'
import priceTag from '../assets/logo/price-tag.svg'
import './LogoMark.css'

function LogoMark() {
  return (
    <div className="logo-mark" role="img" aria-label="얼마고 로고">
      <img className="logo-mark__handle" src={basketHandle} alt="" />
      <img className="logo-mark__body" src={basketBody} alt="" />
      <img className="logo-mark__line logo-mark__line--1" src={basketLine} alt="" />
      <img className="logo-mark__line logo-mark__line--2" src={basketLine} alt="" />
      <img className="logo-mark__line logo-mark__line--3" src={basketLine} alt="" />
      <div className="logo-mark__tag-area">
        <img className="logo-mark__tag" src={priceTag} alt="" />
      </div>
    </div>
  )
}

export default LogoMark
