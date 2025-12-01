import React from 'react'
import HeaderComponent from '../HeaderComponent/HeaderComponent'
import FooterComponent from '../FooterComponent/FooterComponent'
import styled from 'styled-components'

const WrapperLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const WrapperContent = styled.div`
  flex: 1;
`

const DefaultComponent = ({children}) => {
  return (
    <WrapperLayout>
        <HeaderComponent/>
        <WrapperContent>
          {children}
        </WrapperContent>
        <FooterComponent/>
    </WrapperLayout>
  )
}

export default DefaultComponent