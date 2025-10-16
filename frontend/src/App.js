import React, { Fragment, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { routes } from './routes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import { isJsonString } from './utils'
import axios from 'axios'
// import { useQuery } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode';
import * as UserService from './services/UserService'
import { useDispatch } from 'react-redux';
import { updateUser } from './redux/slides/userSlide';



function App() {
  const dispatch = useDispatch();
    useEffect(() => {
      const { storageData, decoded} = handleDecoded()
            if(decoded?.id) {
               handleGetDetailsUser(decoded?.id, storageData)
            }
    },[])

  const handleDecoded =() => {
    let storageData = localStorage.getItem('access_token')
    let decoded = {}
    console.log('storageData:', storageData, isJsonString(storageData));
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
  });

    const handleGetDetailsUser = async (id, token) => {
      const res = await UserService.getDetailsUser(id, token)
      dispatch(updateUser({...res?.data, access_token: token}))
      // console.log('res', res)
      }

  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page
            const Layout = route.isShowHeader ? DefaultComponent : Fragment // If isShowHeader is true, use DefaultComponent, otherwise use Fragment
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
    </div>
  )
}

export default App