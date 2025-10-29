import React, { Fragment, useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { routes } from './routes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import { isJsonString } from './utils'
import axios from 'axios'
// import { useQuery } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode';
import * as UserService from './services/UserService'
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from './redux/slides/userSlide';
import Loading from './components/LoadingComponent/Loading'



function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] =useState(false)
  const user = useSelector((state) => state.user)

  useEffect(() => {
    // setIsLoading(true)
    const { storageData, decoded} = handleDecoded()
    if(decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData)
    }
  }, [])

  const handleDecoded =() => {
    let storageData = localStorage.getItem('access_token')
    let decoded = {}
    //console.log('storageData:', storageData, isJsonString(storageData));
    if (storageData && isJsonString(storageData)){
      storageData = JSON.parse(storageData)
      decoded = jwtDecode(storageData)
    }
    return { decoded, storageData}
  }  

  UserService.axiosJWT.interceptors.request.use(async (config) => {
    const storageData = localStorage.getItem('access_token')
      // Nếu logout → không refresh token
      if (!storageData) return config
      // Do something before request is sent
    const currentTime = new Date()
    const {decoded} = handleDecoded()
    if ( decoded?.exp < currentTime.getTime() / 1000) {
      const data = await UserService.refreshToken()
      config.headers['token'] = ` Bearer ${data?.access_token}`
    }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  })

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({...res?.data, access_token: token}))
    // setIsLoading(false)
    // console.log('res', res)
  }

  return (
    <div>
      {/* <Loading isLoading={isLoading}> */}
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page
              const Layout = route.isShowHeader ? DefaultComponent : Fragment // If isShowHeader is true, use DefaultComponent, otherwise use Fragment
              const ischeckAuth = !route.isPrivate || user.isAdmin
              // ✅ Chỉ render route khi được phép
              if (!ischeckAuth) return null

              return (
                <Route key = {route.path} path = {route.path} element= {
                  <Layout>
                    <Page/>
                  </Layout>
                }/>
              )
            })}
          </Routes>
        </Router>
      {/* </Loading> */}
    </div>
  )
}

export default App