import React from 'react'
import Search from 'antd/lib/transfer/search'
import {Badge, Col} from 'antd'
import { WrapperHeader,WrapperTextHeader,WrapperHeaderAccount,WrapperTextHeaderSmall } from './style'
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom'; 



const HeaderComponent = () => {
  const navigate = useNavigate(); 
  const handleNavigateSignUp = () => {
    navigate('/sign-in'); 
  };


  return (
    <div style={{ width: '100%', background:'rgb (26,148,255)', display:'flex', justifyContent:'center'}}> 
      <WrapperHeader gutter={16}>
        <Col span={5}>
          <WrapperTextHeader>DOANCHUYENNGANH</WrapperTextHeader>
        </Col>
        <Col span={13}>
           <ButtonInputSearch
              size="large"
              
              textButton="Tìm kiếm"
              placeholder="input search text"
              // onSearch={onSearch}
            />
        </Col>
        <Col span={6} style={{display: 'flex', gap: '20px', alignItems: 'center' }}>
          <WrapperHeaderAccount>
            <UserOutlined style={{ fontSize: '30px'}}/>
            <div onClick={handleNavigateSignUp} style={{cursor: 'pointer'}}>
              <WrapperTextHeaderSmall>Đăng nhập/Đăng ký</WrapperTextHeaderSmall>
              <div>
                <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                <CaretDownOutlined />
              </div>
            </div>
          </WrapperHeaderAccount>
          <div>
            <div>
              <Badge count={4} size='small'>
              <ShoppingCartOutlined style={{ fontSize: '30px', color:'#fff'}}/>
              </Badge>
              <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
            </div>
          </div>
      </Col>
    </WrapperHeader>
    </div>
  )
}
 

export default HeaderComponent