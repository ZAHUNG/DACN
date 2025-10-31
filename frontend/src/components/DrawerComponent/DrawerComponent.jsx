import { Button, Drawer } from 'antd'
import React, { Children } from 'react'

const DrawerComponent = ({title= 'Drawer', placement='right', isOpen= false, children , ...rests}) => {
  return (
    <>  
      <Drawer title={title} placement={placement} open={isOpen} {...rests}>
          {children}
      </Drawer>
    </>
  )
}

export default DrawerComponent