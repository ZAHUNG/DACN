import React from 'react'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import InputForm from '../../components/InputForm/InputFrom'
import { WrapperContainerLeft, WrapperContainerRight, WrapperContainerLight } from './style'
import imageLogo from '../../assets/images/logo-login.png'
import {Image} from 'antd'
import  { useState } from 'react'
import { EyeFilled, EyeInvisibleFilled} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';
import { useMutationHooks } from '../../Hook/useMutationHook'
import * as UserService from '../../services/UserService'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message';
import { useEffect } from 'react'



const SignUpPage = () => {
  const navigate = useNavigate();
  const [ isShowConfirmPassword, setIsShowConfirmPassword] = useState (false)
  const [ isShowPassWord, setIsShowPassword] = useState (false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')


  const handleOnchangeEmail = ( value) => {
    setEmail(value)
  }
  const handleOnchangePassword = ( value) => {
    setPassword(value)
  }
  const handleOnchangeConfirmPassword = ( value) => {
    setConfirmPassword(value)
  }

  const mutation = useMutationHooks (
      data => UserService.signupUser(data)   
    )

  const { data, isLoading, isSuccess, isError } = mutation

  useEffect(() => {
  if (isSuccess && data) {

    if (data?.status === 'ERR') {
      message.error(data?.message || "Đăng ký thất bại")
      return
    }

    // Thành công
    message.success("Đăng ký thành công")
    navigate('/sign-in')
  }

  if (isError) {
    message.error("Lỗi kết nối server")
  }
}, [isSuccess, isError, data])

  const handleNavigateSignIn = () =>{
    navigate('/sign-in')
  }

  const handleSignUp = () => {
    console.log('API URL:', process.env.REACT_APP_API_URL);
    mutation.mutate({ email, password, confirmPassword}, ) 
    console.log('sign up', {email, password, confirmPassword})
  }
  return (
<div style={{display:'flex', alignItems:'center', justifyContent:'center', background:'rgb(0, 0, 0, 0.53)', height:'100vh'}}>
     <div style = {{ width:'800px', height:'445px', borderRadius:'6px', backgroundColor:'#fff', display:'flex'}}>
      <WrapperContainerLeft>
        {/* <Loading isLoading={!!isLoading}> */}
        <h1>Xin Chào</h1>
        <p>Đăng nhập hoặc tạo tài khoản</p>
        <InputForm style = {{ marginBottom: '10px'}} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail}/>
        <div style ={{ position:'relative'}}>
          <span            
            onClick={(() => setIsShowPassword(!isShowPassWord))}    
            style={{
              zIndex: 10,
              position: 'absolute',
              top: '4px',
              right: '8px'
            }}
            >{
              isShowPassWord ? (
                <EyeFilled style={{ fontSize: '20px', cursor: 'pointer' }}/>
              ) : (
                <EyeInvisibleFilled style={{ fontSize: '20px', cursor: 'pointer' }}/>
              )
            }
            
          </span>
          <InputForm style = {{ marginBottom: '10px'}} placeholder="Password" type= {isShowPassWord ? "text" : "password"} 
              value={password} onChange={handleOnchangePassword}/>
        </div>
        <div style ={{ position:'relative'}}>
          <span 
           onClick={(() => setIsShowConfirmPassword(!isShowConfirmPassword))}
            style={{
              zIndex: 10,
              position: 'absolute',
              top: '4px',
              right: '8px'
            }}
            >{
              isShowConfirmPassword ? (
                <EyeFilled style={{ fontSize: '20px', cursor: 'pointer' }}/>
              ) : (
                <EyeInvisibleFilled style={{ fontSize: '20px', cursor: 'pointer' }}/>
              )
            }      
          </span>
          <InputForm style = {{ marginBottom: '10px'}} placeholder="Confirm Password" type= {isShowConfirmPassword ? "text" : "password"} 
              value={confirmPassword} onChange={handleOnchangeConfirmPassword}/>
          </div>
           {data?.status === 'ERR' && <span style={{color:'red'}}>{data?.message}</span>}
          {/* <Loading isLoading={!!isLoading}>  */}
        <ButtonComponent
          disabled ={ !email.length || !password.length || !confirmPassword.length}
          onClick={handleSignUp}
         
          size={40}
          styleButton={{
          background: 'rgb(255, 57, 69)',
          height: '48px',
          width: '100%',
          bordered: 'none',
          borderedRadius: '4px',
          margin: '26px 0 10px'
          }}           
          textButton={'Đăng Ký'}
          styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
        ></ButtonComponent>  
        {/* </Loading>          */}
                    
        <p> Bạn đã có tài Khoản ? <WrapperContainerLight onClick={handleNavigateSignIn} style={{cursor: 'pointer'}} > Đăng Nhập</WrapperContainerLight></p>
        {/* </Loading> */}
      </WrapperContainerLeft>
      <WrapperContainerRight>
        <Image src={imageLogo} preview={false} alt= "imageLogo" height="203px" width="203px" />
        <h4>Mua sắm tại TIKI</h4>
      </WrapperContainerRight>
    </div>
   </div>
  )
}


export default SignUpPage