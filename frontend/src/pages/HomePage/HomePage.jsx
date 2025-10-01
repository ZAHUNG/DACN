import React from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperTypeProduct,WrapperButtonMore,WrapperProducts } from './style'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import Slider1 from '../../assets/images/Slider1.webp'
import Slider2 from '../../assets/images/Slider2.webp'
import Slider3 from '../../assets/images/Slider3.webp'
import CardComponent from '../../components/CardComponent/CardComponent'


const HomePage = () => {
  const arr =  ['TV','Tu lanh', 'Lap top']
  return (
    <>
      <div style={{ width:'1270px', margin:'0 auto' }}>
        <WrapperTypeProduct>
          {arr.map((item) => {
            return(
              <TypeProduct name={item} key={item} />
            )
          })}
        </WrapperTypeProduct>
      </div>
      <div className='body' style={{ width: '100%', backgroundColor: '#efefef' }}>
  <div id="container" style={{ height: '1000px', width: '1270px', margin: '0 auto' }}>
    <SliderComponent arrImages={[ Slider1, Slider2, Slider3]} />
    <WrapperProducts>
      <CardComponent />
      <CardComponent />
      <CardComponent />
      <CardComponent />
      <CardComponent />
      <CardComponent />
      <CardComponent />
      <CardComponent />
      <CardComponent />
    </WrapperProducts>

    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
      <WrapperButtonMore
        textButton="Xem thêm"
        type="outline"
        styleButton={{
          border: '1px solid rgb(11, 116, 229)',
          color: 'rgb(11, 116, 229)',
          width: '240px',
          height: '38px',
          borderRadius: '4px'
        }}
        styleTextButton={{ fontWeight: 500 }}
      />
    </div>
  </div>
</div>
    </>
  )
}

export default HomePage