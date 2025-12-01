import styled from "styled-components"

export const WrapperLeft = styled.div`
    width: 950px;
`;

export const WrapperStyleHeader = styled.div`
    background: rgb(255, 255, 255);
    padding: 9px 16px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    span{
        color: rgb(36, 36, 36);
        font-weight: 400;
        font-size: 13px;
    }
`;

export const WrapperStyleHeaderDelivery = styled.div`
    background: rgb(255, 255, 255);
    padding: 9px 16px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    span{
        color: rgb(36, 36, 36);
        font-weight: 400;
        font-size: 13px;
    }
    margin-bottom: 14px;
`



export const WrapperListOrder = styled.div`
    display: flex;
    flex-direction:column;
    gap: 10px;
    padding-top: 20px;
`;

export const WrapperItemOrder = styled.div`
    display: flex;
    align-items: center;
    padding: 9px 16px;
    background: #fff;
    margin-top: 12px;
    flex-direction: column;
    width: 950px;
    margin: 0 auto;
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 12px 12px #ccc;

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

export const WrapperContainer = styled.div`
  width: 100%;
  background-color: #f5f5fa;
`;

export const WrapperHeaderItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #fff;
  margin-bottom: 12px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.12);
  }

  img {
    width: 70px;
    height: 70px;
    object-fit: cover;
    border: 1px solid #eee;
    padding: 2px;
    border-radius: 4px;
  }

  div {
    width: 260px;
    margin-left: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    margin-left: auto;
    font-size: 13px;
    color: #242424;
    font-weight: 500;
  }
`;

export const WrapperStatus = styled.div`
  display: flex;
  align-item: flex-start;
  width: 100%;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgb(235, 235, 240);
  flex-direction: column;
`;

export const WrapperFooterItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;  /* ✨ Tổng tiền nằm bên phải */
  align-items: center;
  padding: 10px 0;
  border-top: 1px solid #f5f5f5;
  gap: 10px;  /* khoảng cách nếu có nhiều phần tử bên trong */

  div {
    display: flex;
    align-items: center;
    gap: 8px;
    
    span:first-child {
      color: rgb(255, 66, 78);
      font-weight: 500;
    }

    span:last-child {
      font-size: 13px;
      color: rgb(56, 56, 61);
      font-weight: 700;
    }
  }
`;
