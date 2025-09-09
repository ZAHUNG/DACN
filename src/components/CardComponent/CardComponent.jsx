import { Card } from 'antd'
import React from 'react'
import { StyleNameProduct, WrapperPriceText, WrapperReportText, WrapperDiscountText,WrapperCardStyle } from './style'
import { StarFilled } from '@ant-design/icons'
import logo from '../../assets/images/logo.png'

const CardComponent = () => {
  return (
    <WrapperCardStyle
        hoverable
        headStyle ={{ width: '200px', height: '200px'}}
        style={{ width: 200 }}
        bodyStyle={{padding: '10px'}}
        cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
    >
        <img
            src={logo}
            style={{
                width: '68px', height: '14px', position: 'absolute', top: -1, left: -1,
                borderTopLeftRadius: '3px', borderTopRightRadius: '4px'
            }}
        />
        <StyleNameProduct> iPhone 13</StyleNameProduct>
        <WrapperReportText> 
            <span style = {{ marginRight: '4px'}}>
                <span> 4.5 </span> <StarFilled style={{ fontSize: '12px', color: 'yellow'}}/>
            </span> 
            <span> | Da ban 1000+</span>
            
        </WrapperReportText>
        <WrapperPriceText> 
            1.000.000đ 
            <WrapperDiscountText>
                -5%
            </WrapperDiscountText>
        </WrapperPriceText>
  </WrapperCardStyle>
  )
}

export default CardComponent