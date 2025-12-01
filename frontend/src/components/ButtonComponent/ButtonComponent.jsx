import React from "react"; 
import { Button } from 'antd';

const ButtonComponent = ({size, styleButton, styleTextButton, textButton, disabled, icon, ...rests}) => {
    return(
        <Button 
            size={size} 
            style={{
                ...styleButton,
                background: disabled ? '#ccc': styleButton?.background
            }}
            disabled={disabled}
            {...rests}
        >
            {icon && <span style={{ marginRight: textButton ? '8px' : '0' }}>{icon}</span>}
            {textButton && <span style={styleTextButton}>{textButton}</span>}
        </Button>
    )
}

export default ButtonComponent