import React from 'react'
import NavBarComponent from '../../components/NavbarComponent/NavBarComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import { Row, Col } from 'antd'
import { WrapperProducts } from './style'

const TypeProductPage = () => {
  return (
    <Row style={{padding: '0 120px', background: '#efefef', flexWrap: 'nowrap', paddingTop: '10px'}}>
        <Col span={4} style={{ background: '#fff', marginRight: '10px', padding: '10px', borderRadius: '6px'}}>
            <NavBarComponent /> 
        </Col>
        <WrapperProducts>
            <CardComponent />
            <CardComponent />
            <CardComponent />
            <CardComponent />
            <CardComponent />
            <CardComponent />
            <CardComponent />
        </WrapperProducts>
        
    </Row>
  )
}

export default TypeProductPage