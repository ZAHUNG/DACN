import React from 'react'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import InputForm from '../../components/InputForm/InputFrom'
import { WrapperContainerLeft, WrapperContainerRight } from './style'
import imageLogo from '../../assets/images/logo-login.png'
import {Image} from 'antd'
import  { useState } from 'react'
import { EyeFilled, EyeInvisibleFilled} from '@ant-design/icons'
import { WrapperContainerLight } from './style'
import { useNavigate } from 'react-router-dom';
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../Hook/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message';
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/slides/userSlide';



const SignInPage = () => {
  const [ isShowPassWord, setIsShowPassword] = useState (false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const mutation = useMutationHooks (
    data => UserService.loginUser(data)   
  )
  const { data, isLoading, isSuccess} = mutation

  useEffect(() => {
    if (isSuccess) {
      message.success();
      navigate('/')
      localStorage.setItem('access_token', JSON.stringify(data?.access_token))
      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token)
        // console.log('decode', decoded);
        if(decoded?.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token)
        }
      }
    } 
  }, [isSuccess])

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({...res?.data, access_token: token}))
    // console.log('res', res)
  }

  const handleNavigateSignUp = () => {
    navigate('/sign-up')
  }


  const handleOnchangeEmail = ( value) => {
    setEmail(value)
  }
  const handleOnchangePassword = ( value) => {   
    setPassword(value)
  }
  const handleSignIn = () => {
    mutation.mutate({ email, password}, )
    console.log('sign-in', {email, password})
  }

  return (
   <div style={{display:'flex', alignItems:'center', justifyContent:'center', background:'rgb(0, 0, 0, 0.53)', height:'100vh'}}>
     <div style = {{ width:'800px', height:'445px', borderRadius:'6px', backgroundColor:'#fff', display:'flex'}}>
      <WrapperContainerLeft>
        <h1>Xin Chào</h1>
        <p>Đăng nhập hoặc tạo tài khoản</p>
        <InputForm style = {{ marginBottom: '10px'}} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail} />
        <div style ={{ position:'relative'}}>
          <span 
            onClick={(() => setIsShowPassword(!isShowPassWord))}
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
           <InputForm  placeholder="Password" type= {isShowPassWord ? "text" : "password"} value={password} onChange={handleOnchangePassword} />
        </div>
       
        {data?.status === 'ERR' && <span style={{color:'red'}}>{data?.message}</span>} 
      {/* <Loading isLoading={isLoading}>  */}
        <ButtonComponent
          disabled ={ !email.length || !password.length }
          onClick={handleSignIn}
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
        {/* </Loading>  */}
        <p><WrapperContainerLight>Quên Mật Khẩu ?</WrapperContainerLight></p>
        <p> Chưa có tài Khoản ? <WrapperContainerLight onClick={handleNavigateSignUp} style={{cursor: 'pointer'}}> Tạo Tài Khoản</WrapperContainerLight></p>
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