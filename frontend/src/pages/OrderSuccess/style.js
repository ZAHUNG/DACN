import styled from "styled-components";
import { Radio } from "antd";

export const WrapperContainer = styled.div`
    width: 100%;
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

export const WrapperValue = styled.div`
    background: rgb(240, 248, 255);
    border: 2px solid rgb(194, 225, 225);
    padding: 10px;
    width: fit-content;
    border-radius: 6px;
    margin-top: 4px;
    font-size: 16px;
`;

export const WrapperListOrder = styled.div`
    background: #fff;
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
`;

export const WrapperItemOrder = styled.div`
    display: flex;
    align-items: center;
    padding: 9px 16px;
    background: #fff;
    margin-top: 12px;
    justify-content: center;
`;

export const WrapperCountOrder = styled.div`
    display: flex;
    align-items: center;
    width: 84px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

export const WrapperRight = styled.div`
    width: 320px;
    margin-left: 20px;   
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
`;

export const WrapperInfo = styled.div`
    padding: 17px 20px;
    border-bottom: 1px solid #f5f5f5;
    background: #fff;    
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
`;

export const WrapperItemOrderInfo = styled.div`
    padding: 17px 20px;
    border-bottom: 1px solid #f5f5f5;
    background: #fff;    
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
    display: flex;
    justify-content: center;
    flex-direction: column; /* thêm column để danh sách sản phẩm xếp dọc */
    gap: 10px;
`;

export const WrapperTotal = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;    
    padding: 17px 20px;  
    background: #fff;    
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
    font-size: 18px;
`;

export const Lable = styled.span`
    font-size: 12px;
    color: #000;
    font-weight: bold;
`;

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
`;

/* Các styled-components mới để thay các div trong OrderSuccess */
export const PageWrapper = styled.div`
    background: #f5f5fa;
    width: 100%;
    min-height: 100vh;
    padding: 50px 0;
`;

export const ContentWrapper = styled.div`
    width: 1270px;
    margin: 0 auto;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
`;

export const SectionTitle = styled.h3`
    margin-bottom: 20px;
    color: #28a745;
    font-size: 24px;
    font-weight: bold;
`;

export const TextBold = styled.span`
    font-weight: bold;
    color: ${props => props.color || '#000'};
`;

export const ProductInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    width: 500px;
`;

export const ProductName = styled.div`
    width: 260px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;
