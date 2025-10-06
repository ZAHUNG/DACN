import React, { Fragment } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { routes } from './routes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
// import axios from 'axios'
// import { useQuery } from '@tanstack/react-query'


function App() {
   

  // useEffect(() => {
  //     fecthApi()
  // }, [])
  // const fecthApi = async () => {
  //   const res = await axios.get(`http://localhost:3001/api/product/all`)
  //   return res.data
  //  }

  // const query = useQuery({ queryKey: ['todos'], queryFn: fecthApi})
  // console.log('query', query)


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