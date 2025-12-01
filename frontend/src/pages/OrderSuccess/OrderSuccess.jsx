
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { orderContant } from '../../contant';
import { convertPrice } from '../../utils';
import {
  PageWrapper,
  ContentWrapper,
  SectionTitle,
  WrapperContainer,
  WrapperInfo,
  WrapperValue,
  Lable,
  WrapperItemOrderInfo,
  WrapperItemOrder,
  TextBold,
  ProductInfo,
  ProductName,
  WrapperTotal
} from './style';

const OrderSuccess = () => {
  const order = useSelector((state) => state.order);
  const location = useLocation();
  const { state } = location;

  if (!state) {
    return <PageWrapper>Không có dữ liệu đơn hàng.</PageWrapper>;
  }

  return (
    <PageWrapper>
      <ContentWrapper>
        <SectionTitle>Đơn hàng đã đặt thành công</SectionTitle>

        <WrapperContainer>
          {/* Phương thức giao hàng */}
          <WrapperInfo>
            <WrapperValue>
              <Lable>Phương thức giao hàng</Lable>
              <div>
                <TextBold color="#ea8500">
                  {orderContant.delivery[state?.delivery] || state?.delivery || 'Chưa chọn'}
                </TextBold>
              </div>
            </WrapperValue>
          </WrapperInfo>

          {/* Phương thức thanh toán */}
          <WrapperInfo>
            <WrapperValue>
              <Lable>Phương thức thanh toán</Lable>
              <div>
                <TextBold color="#ea8500">
                  {orderContant.payment[state?.payment] || state?.payment || 'Chưa chọn'}
                </TextBold>
              </div>
            </WrapperValue>
          </WrapperInfo>

          {/* Danh sách sản phẩm */}
          <WrapperInfo>
            <WrapperItemOrderInfo>
              {state?.orders.map((orderItem, index) => (
                <WrapperItemOrder key={index}>
                  <ProductInfo>
                    <img
                      src={orderItem.image}
                      alt={orderItem.name}
                      style={{ width: '77px', height: '79px', objectFit: 'cover' }}
                    />
                    <ProductName>{orderItem?.name}</ProductName>
                  </ProductInfo>
                  <div style={{ flex: 1, display: 'flex',flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ fontSize: '18px', color:'#242424' }}>
                      Giá tiền: {convertPrice(orderItem?.price)}
                    </span>
                    <span style={{ fontSize: '18px', color:'#242424' }}>
                      Số lượng: {orderItem?.amount}
                    </span>
                  </div>
                </WrapperItemOrder>
              ))}
            </WrapperItemOrderInfo>
          </WrapperInfo>

          {/* Tổng tiền */}
          <WrapperInfo>
            <WrapperTotal>
              <span>Tổng tiền :</span>
              <TextBold color="red">{convertPrice(state?.totalPriceMemo)}</TextBold>
            </WrapperTotal>
          </WrapperInfo>
        </WrapperContainer>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default OrderSuccess;
