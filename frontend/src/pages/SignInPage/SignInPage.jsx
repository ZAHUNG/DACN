import React from 'react'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import InputForm from '../../components/InputForm/InputFrom'
import { WrapperContainerLeft, WrapperContainerRight } from './style'
import imageLogo from '../../assets/images/logo-login.png'
import {Image} from 'antd'
import  { useState } from 'react'
import { EyeFilled, EyeInvisibleFilled} from '@ant-design/icons'
import { WrapperContainerLight } from './style'

const SignInPage = () => {
  const [ isShowPassWord, setIsShowPassword] = useState (false)
  return (
   <div style={{display:'flex', alignItems:'center', justifyContent:'center', background:'rgb(0, 0, 0, 0.53)', height:'100vh'}}>
     <div style = {{ width:'800px', height:'445px', borderRadius:'6px', backgroundColor:'#fff', display:'flex'}}>
      <WrapperContainerLeft>
        <h1>Xin Chào</h1>
        <p>Đăng nhập hoặc tạo tài khoản</p>
        <InputForm style = {{ marginBottom: '10px'}} placeholder="abc@gmail.com"/>
        <div style ={{ position:'relative'}}>
          <span 
            style={{
              zIndex: 10,
              position: 'absolute',
              top: '4px',
              right: '8px',
              
            }}
            >{
              isShowPassWord ? (
                <EyeFilled style={{ fontSize: '20px', cursor: 'pointer' }}/>
              ) : (
                <EyeInvisibleFilled style={{ fontSize: '20px', cursor: 'pointer' }}/>
              )
            }
            
          </span>
           <InputForm  placeholder="Password" type= {isShowPassWord ? "text" : "password"} />
        </div>
       
       
        <ButtonComponent
                        bordered={false}
                        size={40}
                        styleButton={{
                            background: 'rgb(255, 57, 69)',
                            height: '48px',
                            width: '100%',
                            bordered: 'none',
                            borderedRadius: '4px',
                            margin: '26px 0 10px'
                        }} 
                        textButton={'Đăng Nhập'}
                        styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                    ></ButtonComponent>
                    <p><WrapperContainerLight>Quên Mật Khẩu ?</WrapperContainerLight></p>
                    <p> Chưa có tài Khoản ? <WrapperContainerLight> Tạo Tài Khoản</WrapperContainerLight></p>
      </WrapperContainerLeft>
      <WrapperContainerRight>
        <Image src={imageLogo} preview={false} alt= "imageLogo" height="203px" width="203px" />
        <h4>Mua sắm tại TiKi</h4>
      </WrapperContainerRight>
    </div>
   </div>
  )
}

export default SignInPage