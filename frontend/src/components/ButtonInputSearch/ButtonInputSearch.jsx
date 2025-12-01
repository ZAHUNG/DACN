import React from "react"
import {SearchOutlined} from '@ant-design/icons'
import InputComponent from '../InputComponent/InputComponent'

const ButtonInputSearch = (props) => {
    const {
        size, placeholder, 
        bordered, backgroundColorInput = "#fff"
    } = props

    return(
        <div style={{ position: 'relative', width: '100%' }}>
            <InputComponent 
                size={size} 
                placeholder={placeholder} 
                bordered={bordered} 
                style={{ backgroundColor: backgroundColorInput }} 
                {...props}
            />
            <SearchOutlined 
                style={{ 
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#999',
                    fontSize: '16px',
                    pointerEvents: 'none'
                }} 
            />
        </div>
    )
}

export default ButtonInputSearch