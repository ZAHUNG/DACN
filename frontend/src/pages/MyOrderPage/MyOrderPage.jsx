import React, { useMemo, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query';
import * as OrderService from '../../services/OrderService'
import Loading from '../../components/LoadingComponent/Loading';
import { useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import { WrapperContainer, WrapperHeaderItem, WrapperListOrder, WrapperItemOrder, WrapperStatus, WrapperFooterItem} from './style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutationHooks } from '../../Hook/useMutationHook'
import * as message from '../../components/Message/Message'

const MyOrderPage = () => {
  const location = useLocation();
  const {state} = location;
  const navigate = useNavigate();
  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderbyUserId(state?.id, state?.token)
    // console.log('res',res)
    return res.data;
  }
  const queryOrder = useQuery({queryKey:['users'], queryFn: fetchMyOrder,
    enabled: Boolean(state?.id && state?.token)
  })
  const { isLoading, data } = queryOrder
  // console.log('data', data)

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`,{
      state:{
        token: state?.token
      }
    })
  }
  
  const mutation = useMutationHooks(
  (data) => {
    const { id, token } = data
    const res = OrderService.cancelOrder(id, token)
    return res
  }
)

const handleCancelOrder = (id) => {
  mutation.mutate({ id, token: state?.token }, {
    onSuccess: () => {
      queryOrder.refetch()
    }
  })
}

const { isLoading: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancel, data: dataCancel } = mutation

useEffect(() => {
  if (isSuccessCancel && dataCancel?.status === 'OK') {
    message.success()
  } else if (isErrorCancel) {
    message.error()
  }
}, [isErrorCancel, isSuccessCancel])


  const renderProduct = (data) => {
    return data?.map((order) => {
      return <WrapperHeaderItem>
                <img src={order?.image}
                  style={{
                    width:'70px',
                    height:'70px',
                    objectFit:'cover',
                    border: '1px solid rgb(238, 238, 238)',
                    padding: '2px'
                  }}
                  />
                  <div style={{
                    width: 260,
                    overflow: 'hidden',
                    textOverFlow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginLeft: '10px'
                  }}>{order?.name}</div>
                  <span style={{ fontSize: '13px', color: '#242424', marginLeft:'auto'}}>{convertPrice(order?.price)}</span>
            </WrapperHeaderItem>
        })
    }
            

  return (
    <Loading isLoading={isLoading}>
      <WrapperContainer>
        <div style={{height:'100%', width:'1270px', margin: '0 auto'}}>
            <h4> Đơn hàng của tôi</h4>
            <WrapperListOrder>
              {data?.map((order) => {
                return (
                  <WrapperItemOrder key={order?.id}>
                  <WrapperStatus>
                    <span style={{fontSize: '14px', fontWeight: 'bold'}}>Trạng thái</span>
                    <div><span style={{color: 'rgb(255, 66, 78)'}}>Giao hàng</span>{`${order.isDelivered ? 'Đã giao hàng': 'Chưa giao hàng'}`}</div>
                    <div><span style={{color: 'rgb(255, 66, 78)'}}>Giao hàng</span>{`${order.isPaid ? 'Đã thanh toans': 'Chưa thanh toán'}`}</div>
                  </WrapperStatus>
                  {renderProduct(order?.orderItems)}
                  <WrapperFooterItem>
                  <div>
                    <span style={{ color:'rgb(255, 66, 78)'}}>Tổng tiền</span>
                    <span style={{fontSize: '13px', color:'rgb(56, 56, 61)', fontWeight: 700}}>
                      {convertPrice(order?.totalPrice)}
                    </span>
                  </div>
                   <div style={{display: 'flex', gap: '10px'}}>
                      <ButtonComponent
                        onClick={() => handleCancelOrder(order?._id)}
                        size={40}
                        styleButton={{
                          height: '36px',
                          border: '1px solid rgb(11, 116, 229)'
                        }}
                        textButton={'Hủy đơn hàng'}
                        styleTextButton={{ color: 'rgb(11, 116, 229', fontSize:'14px'}}
                      >
                      </ButtonComponent>
                      <ButtonComponent
                        onClick={() => handleDetailsOrder(order._id)}
                        size={40}
                        styleButton={{
                          height: '36px',
                          border: '1px solid rgb(11, 116, 229)'
                        }}
                        textButton={'Xem chi tiết'}
                        styleTextButton={{ color: 'rgb(11, 116, 229', fontSize:'14px'}}
                      >
                      </ButtonComponent>
                  </div>
                  </WrapperFooterItem>
                  </WrapperItemOrder>
                )

              })}
            </WrapperListOrder>
        </div>
      </WrapperContainer>
    </Loading>
  )
}


export default MyOrderPage