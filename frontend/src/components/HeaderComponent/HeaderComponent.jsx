import React , { useState }from 'react'
import Search from 'antd/lib/transfer/search'
import {Badge, Col, Popover, Button} from 'antd'
import { WrapperHeader,WrapperTextHeader,WrapperHeaderAccount,WrapperTextHeaderSmall } from './style'
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom'; 
import { useSelector, useDispatch } from 'react-redux';
import { WrapperContentPopup } from './style';
import * as UserService from '../../services/UserService';
import { resetUser } from '../../redux/slides/userSlide';


const HeaderComponent = () => {
  const navigate = useNavigate(); 
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);
  const handleNavigateSignUp = () => {
    navigate('/sign-in'); 
  };
  const handleLogout = async () => {
  setLoading(true)
  await UserService.logoutUser()          // Xoá cookie refresh_token trên BE
  localStorage.removeItem('access_token') // Xoá token FE
  dispatch(resetUser())                   // Reset Redux user
  setLoading(false)
  window.location.reload()                // Reload để reset UI hoàn toàn
}

  const content = (
    <div>
      <WrapperContentPopup onClick={handleLogout}>Đăng xuất</WrapperContentPopup>
      <WrapperContentPopup>Thông tin người dùng</WrapperContentPopup>
    </div>
  );

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
        {/* <Loading isLoading={loading}> */}
          <WrapperHeaderAccount>
            <UserOutlined style={{ fontSize: '30px'}}/>
            {user?.name ? (
              <>
              <Popover content={content}WrapperContentPopup trigger="click">
                <div style={{cursor: 'pointer'}}>{user.name}</div>
              </Popover>
              </>
            ) : (

              <div onClick={handleNavigateSignUp} style={{cursor: 'pointer'}}>
              <WrapperTextHeaderSmall>Đăng nhập/Đăng ký</WrapperTextHeaderSmall>
              <div>
                <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                <CaretDownOutlined />
              </div>
            </div>

            )}
          </WrapperHeaderAccount> 
          {/* </Loading> */}
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