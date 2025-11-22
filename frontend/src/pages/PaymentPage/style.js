import styled from "styled-components"
import { Radio } from "antd";

export const WrapperLeft = styled.div`
    width: 950px;
`;

export const WrapperStyleHeader = styled.div`
    display: flex;
    align-items: center;
    background: #fff;
    padding: 10px 20px;
    font-weight: 500;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
    border-bottom: 1px solid #f5f5f5;
`;

export const WrapperListOrder = styled.div`
    background: #fff;
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
`;

export const WrapperItemOrder = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 20px;
    border-top: 1px solid #f5f5f5;
`;


export const WrapperCountOrder = styled.div`
    display: flex;
    align-items: center;
    width: 84px;
    border: 1px solid #ccc;
    border-radius: 4px;
`

export const WrapperRight = styled.div`
    width: 320px;
    margin-left: 20px;   
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
`

export const WrapperInfo = styled.div`
    padding: 17px 20px;
    border-bottom: 1px solid #f5f5f5;
    background: #fff;    
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
`

export const WrapperTotal = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;    
    padding: 17px 20px;  
    background: #fff;    
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
`
export const Lable = styled.span`
    font-size: 12px;
    color: #000;
    font-weight: bold;
`
export const WrapperRadio = styled(Radio.Group)`
    margin-top: 6px;
    background: rgb(240, 248, 255);
    border: 1px solid rgb(194, 225, 255);
    width: 500px;
    border-radius: 4px;
    height: 100px;
    padding: 16px;
    font-weigth: normal;
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
`
