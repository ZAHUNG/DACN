import React, { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import * as OrderService from '../../services/OrderService'
import Loading from '../../components/LoadingComponent/Loading';
import { useSelector } from 'react-redux';

const MyOrderPage = () => {
  const user = useSelector((state) => state.user)
  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderbyUserId(user?.id, user?.access_token)
    console.log('res',res)
    return res.data;
  }
  const queryOrder = useQuery({queryKey:['users'], queryFn: fetchMyOrder,
    enabled: Boolean(user?.id && user?.access_token),
  })
  const { isLoading, data } = queryOrder
  return (
    <Loading isLoading={isLoading}>
      <div style={{background:'#f5f5fa', width:'100%', height: '100vh'}}>
        Myorder
      </div>
    </Loading>
  )
}


export default MyOrderPage