import { Card } from 'antd'
import React from 'react'
import { StyleNameProduct, WrapperPriceText, WrapperReportText, WrapperDiscountText, WrapperCardStyle, WrapperStyleTextSell} from './style'
import { StarFilled } from '@ant-design/icons'
import logo from '../../assets/images/logo.png'
import {useNavigate} from 'react-router-dom'
import { convertPrice } from '../../utils'

const CardComponent = (props) => {
    const navigate = useNavigate()
    const {countInStock, description, image, name, price, rating, type, discount, selled, id} = props
    const handleDetailsProduct = (id) => { 
        navigate(`/product-details/${id}`)
    }

    const displayPrice = (Number(price) || 0).toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }) 
      
    return (
        <WrapperCardStyle
            hoverable
            headStyle={{ width: '200px', height: '200px' }}
            style={{ width: 200 }}
            bodyStyle={{ padding: '10px' }}
            cover={<img alt="example" src={image} />}
            onClick = {() => countInStock !== 0 && handleDetailsProduct(id)}
            disabled={countInStock===0}
        >
            <img
                src={logo}
                style={{
                    width: '68px',
                    height: '14px',
                    position: 'absolute',
                    top: -1,
                    left: -1,
                    borderTopLeftRadius: '3px', borderTopRightRadius: '4px'
                }}
            />
            <StyleNameProduct>{name}</StyleNameProduct>
            <WrapperReportText>
                <span style={{ marginRight: '4px' }}>
                    <span>{rating}</span> <StarFilled style={{ fontSize: '12px', color: 'rgb(253, 216, 54)' }} />
                </span>
                <WrapperStyleTextSell> | Da ban {selled || 1000 }+</WrapperStyleTextSell>

            </WrapperReportText>
            <WrapperPriceText>
                 <span style={{ marginRight: '8px' }}>{convertPrice(price)}</span>
                <WrapperDiscountText>
                   - {discount || 5} %
                </WrapperDiscountText>
            </WrapperPriceText>
        </WrapperCardStyle>
    )
}

export default CardComponent