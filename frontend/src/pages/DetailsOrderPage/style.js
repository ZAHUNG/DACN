import styled from "styled-components";

export const WrapperHeaderUser = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  margin-bottom: 20px;
`;

export const WrapperInfoUser = styled.div`
  flex: 1;
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
`;

export const WrapperLabel = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
`;

export const WrapperContentInfo = styled.div`
  font-size: 14px;
  line-height: 22px;

  span {
    font-weight: 500;
  }
`;

export const WrapperStyleContent = styled.div`
  margin-top: 20px;
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  width: 100%;
`;

export const WrapperItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
`;

export const WrapperProduct = styled.div`
  display: flex;
  align-items: center;
  flex: 1;   /* chiếm phần còn lại */
  min-width: 0; /* cho phép text wrap nếu cần */
`;

export const WrapperItemLabel = styled.div`
  width: 150px;  /* width cố định cho các cột */
  text-align: center;
  font-size: 14px;
  flex-shrink: 0; /* không cho phép co lại */
`;

export const WrapperAllPrice = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-top: 1px solid #eee;
  margin-top: 10px;
  
  & > div:first-child {
    flex: 1;
    text-align: right;
    width: auto;
  }
  
  & > div:last-child {
    width: 150px;
    text-align: center;
  }
`
