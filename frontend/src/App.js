import React, { Fragment} from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { routes } from './routes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'


function App() {
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