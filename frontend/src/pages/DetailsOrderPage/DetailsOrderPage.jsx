import React from 'react'
import {
  WrapperContentInfoUser,
  WrapperHeaderUser,
  WrapperInfoUser,
  WrapperItem,
  WrapperItemLabel,
  WrapperLabel,
  WrapperProduct,
  WrapperStyleContent,
  WrapperContentInfo
} from './style'
import { useParams, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import * as OrderService from '../../services/OrderService'
import Loading from '../../components/LoadingComponent/Loading'
import { convertPrice } from '../../utils'
import { orderContant } from '../../contant';

const DetailsOrderPage = () => {
  const params = useParams();
  const location = useLocation();
  const { state } = location;
  const { id } = params;

  const fetchDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrder(id, state?.token);
    return res.data;
  }

  const queryOrder = useQuery({
    queryKey: ['orders-details'],
    queryFn: fetchDetailsOrder,
    enabled: Boolean(id)
  })

  const { isLoading, data } = queryOrder;
  const {shippingAddress, orderIteams, shippingPrice, paymentMethod, isPaid} = data

  return (
    <Loading isLoading={isLoading}>
      <div style={{ width: '100%', minHeight: '100vh', background: '#f5f5fa', paddingBottom: '40px' }}>
        <div style={{ width: '1270px', margin: '0 auto' }}>
          <h3 style={{ padding: '20px 0' }}>Chi tiết đơn hàng</h3>

          {/* HEADER THÔNG TIN */}
          <WrapperHeaderUser>

            {/* Người nhận */}
            <WrapperInfoUser>
              <WrapperLabel>Địa chỉ người nhận</WrapperLabel>
              <WrapperContentInfo>
                <div className='name-info'><span>{shippingAddress?.fullName}</span></div>
                <div className='address-info'><span>Địa chỉ: </span><span>{`${shippingAddress?.address} ${shippingAddress?.city}`}</span></div>
                <div className='phone-info'><span>Điện thoại: </span><span>{shippingAddress?.phone}</span></div>
              </WrapperContentInfo>
            </WrapperInfoUser>

            {/* Giao hàng */}
            <WrapperInfoUser>
              <WrapperLabel>Hình thức giao hàng</WrapperLabel>
              <WrapperContentInfo>
                <div className='delivery-info'><span>FAST</span> - Giao hàng tiết kiệm</div>
                <div className='delivery-fee'><span>Phí giao hàng: </span><span>{shippingPrice}</span></div>
              </WrapperContentInfo>
            </WrapperInfoUser>

            {/* Thanh toán */}
            <WrapperInfoUser>
              <WrapperLabel>Hình thức thanh toán</WrapperLabel>
              <WrapperContentInfo>
                <div className='payment-info'>{orderContant[paymentMethod]}</div>
                <div className='status-payment'>{data?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
              </WrapperContentInfo>
            </WrapperInfoUser>

          </WrapperHeaderUser>

          {/* DANH SÁCH SẢN PHẨM */}
          <WrapperStyleContent>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #ddd' }}>
              <div style={{ width: '500px', fontWeight: '600' }}>Sản phẩm</div>
              <WrapperItemLabel>Giá</WrapperItemLabel>
              <WrapperItemLabel>Số lượng</WrapperItemLabel>
              <WrapperItemLabel>Giảm giá</WrapperItemLabel>
              <WrapperItemLabel>Tạm tính</WrapperItemLabel>
              <WrapperItemLabel>Phí vận chuyển</WrapperItemLabel>
              <WrapperItemLabel>Tổng cộng</WrapperItemLabel>
            </div>

            {data?.orderItems?.map((item) => (
              <WrapperItem key={item._id}>
                <WrapperProduct>
                  <img src={item.image} alt={item.name} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '6px' }} />
                  <div style={{ marginLeft: '10px' }}>{item.name}</div>
                </WrapperProduct>

                <WrapperItemLabel>{convertPrice(item.price)}</WrapperItemLabel>
                <WrapperItemLabel>{item.amount}</WrapperItemLabel>
                <WrapperItemLabel>{convertPrice(item.discount || 0)}</WrapperItemLabel>
                <WrapperItemLabel>{convertPrice(item.price * item.amount)}</WrapperItemLabel>
                <WrapperItemLabel>{convertPrice(data?.shippingPrice)}</WrapperItemLabel>
                <WrapperItemLabel>{convertPrice(data?.totalPrice)}</WrapperItemLabel>
              </WrapperItem>
            ))}

          </WrapperStyleContent>

        </div>
      </div>
    </Loading>
  )
}

export default DetailsOrderPage;