import React,{useMemo} from 'react'
import {
  WrapperContentInfoUser,
  WrapperHeaderUser,
  WrapperInfoUser,
  WrapperItem,
  WrapperItemLabel,
  WrapperLabel,
  WrapperProduct,
  WrapperStyleContent,
  WrapperContentInfo,
  WrapperAllPrice
} from './style'
import { useParams, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import * as OrderService from '../../services/OrderService'
import Loading from '../../components/LoadingComponent/Loading'
import { convertPrice } from '../../utils'

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

  const priceMemo = useMemo(() => {
      const result = data?.orderItems?.reduce((total, cur) => {
        return total + (cur.price * cur.amount)
      }, 0)
      return result
    }, [data])

  return (
    <Loading isLoading={isLoading}>
      <div style={{ width: '100%', background: '#f5f5fa', paddingBottom: '40px' }}>
        <div style={{ width: '1270px', margin: '0 auto' }}>
          <h3 style={{ padding: '20px 0' }}>Chi tiết đơn hàng</h3>

          {/* HEADER THÔNG TIN */}
          <WrapperHeaderUser>

            {/* Người nhận */}
            <WrapperInfoUser>
              <WrapperLabel>Địa chỉ người nhận</WrapperLabel>
              <WrapperContentInfo>
                <div className='name-info'><span>{data?.shippingAddress?.fullName}</span></div>
                <div className='address-info'><span>Địa chỉ: </span><span>{data?.shippingAddress?.address}</span></div>
                <div className='phone-info'><span>Điện thoại: </span><span>{data?.shippingAddress?.phone}</span></div>
              </WrapperContentInfo>
            </WrapperInfoUser>

            {/* Giao hàng */}
            <WrapperInfoUser>
              <WrapperLabel>Hình thức giao hàng</WrapperLabel>
              <WrapperContentInfo>
                <div className='delivery-info'><span>FAST</span> - Giao hàng tiết kiệm</div>
                <div className='delivery-fee'><span>Phí giao hàng: </span><span>{convertPrice(data?.shippingPrice)}</span></div>
              </WrapperContentInfo>
            </WrapperInfoUser>

            {/* Thanh toán */}
            <WrapperInfoUser>
              <WrapperLabel>Hình thức thanh toán</WrapperLabel>
              <WrapperContentInfo>
                <div className='payment-info'>{data?.paymentMethod}</div>
                <div className='status-payment'>{data?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
              </WrapperContentInfo>
            </WrapperInfoUser>

          </WrapperHeaderUser>

          {/* DANH SÁCH SẢN PHẨM */}
          <WrapperStyleContent>
            <div style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #ddd' }}>
              <WrapperProduct style={{ fontWeight: '600' }}>Sản phẩm</WrapperProduct>
              <WrapperItemLabel>Giá</WrapperItemLabel>
              <WrapperItemLabel>Số lượng</WrapperItemLabel>
              <WrapperItemLabel>Giảm giá</WrapperItemLabel>
              
            </div>

            {data?.orderItems?.map((order) => (
              <WrapperItem key={order._id}>
                <WrapperProduct>
                  <img src={order.image} alt={order.name} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '6px' }} />
                  <div style={{ marginLeft: '10px' }}>{order.name}</div>
                </WrapperProduct>

                <WrapperItemLabel>{convertPrice(order.price)}</WrapperItemLabel>
                <WrapperItemLabel>{order.amount}</WrapperItemLabel>
                <WrapperItemLabel style={{color:'red', fontWeight: 'bold'}}>{order?.discount ? convertPrice(order.discount) : '0 VND'}</WrapperItemLabel>
                {/* <WrapperItemLabel>{convertPrice(item.price * item.amount)}</WrapperItemLabel>
                <WrapperItemLabel>{convertPrice(data?.shippingPrice)}</WrapperItemLabel>
                <WrapperItemLabel>{convertPrice(data?.totalPrice)}</WrapperItemLabel> */}
              </WrapperItem>
            ))}
            <WrapperAllPrice>
              <WrapperItemLabel>Tạm tính</WrapperItemLabel>
              <WrapperItemLabel style={{color:'red', fontWeight: 'bold'}}>{convertPrice(priceMemo)}</WrapperItemLabel>
            </WrapperAllPrice>
            <WrapperAllPrice>
              <WrapperItemLabel>Phí vận chuyển</WrapperItemLabel>
              <WrapperItemLabel style={{color:'red', fontWeight: 'bold'}}>{convertPrice(data?.shippingPrice)}</WrapperItemLabel>
            </WrapperAllPrice>
            <WrapperAllPrice>
              <WrapperItemLabel>Tổng cộng</WrapperItemLabel>
              <WrapperItemLabel style={{color:'red', fontWeight: 'bold'}}>{convertPrice(data?.totalPrice)}</WrapperItemLabel>
            </WrapperAllPrice>
            

          </WrapperStyleContent>

        </div>
      </div>
    </Loading>
  )
}

export default DetailsOrderPage;