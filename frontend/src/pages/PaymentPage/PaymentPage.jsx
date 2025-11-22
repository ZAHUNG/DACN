import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Checkbox, Form } from 'antd';
import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { WrapperTotal,WrapperLeft,WrapperStyleHeader, WrapperListOrder,WrapperItemOrder, WrapperCountOrder, WrapperRight, WrapperInfo  } from './style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '../../redux/slides/orderSlide';
import { convertPrice } from '../../utils';
import { useEffect } from 'react';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import { useMutationHooks } from '../../Hook/useMutationHook';
import * as UserService from '../../services/UserService';
import * as OrderService from '../../services/OrderService';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message';
import { updateUser } from '../../redux/slides/userSlide';

const PaymentPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const orderItems = useSelector((state) => state.order);
  const [payment, setPayment] = useState('COD')
  const [listChecked, setListChecked] = useState([])
  const[isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [stateUserDetails, setStateUserDetails] = useState({
          name: '',
          phone: '',
          address: '',
          city: ''
      })
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  
  useEffect(() => {
      if (stateUserDetails) {
          form.setFieldsValue(stateUserDetails)
      }
      }, [stateUserDetails, form])

  useEffect(() => {
    if(isOpenModalUpdateInfo){
      setStateUserDetails({
        ...stateUserDetails,
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone
      })
    }
    }, [isOpenModalUpdateInfo])

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true)
  }

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + (cur.price * cur.amount)
    }, 0)
    return result
  }, [order])

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + (cur.discount * cur.amount)
    }, 0)
    if(Number(result)){
      return result
    }
    return 0
  }, [order])

  const deliveryPriceMemo = useMemo(() => {
    if(priceMemo > 200000){
      return 10000;
    }else if(priceMemo === 0){
      return 0;
    }else{
      return 20000;
    }
  }, [order])

  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) - Number(priceDiscountMemo) + Number(deliveryPriceMemo)
  }, [priceMemo, priceDiscountMemo, deliveryPriceMemo])

  
  const handleAddOrder = () => {
  const payload = {
    orderItems: order?.orderItemsSelected,

    shippingAddress: {
      fullname: user?.name || stateUserDetails.name,
      address: user?.address || stateUserDetails.address,
      city: user?.city || stateUserDetails.city,
      phone: stateUserDetails.phone || user?.phone
    },

    paymentMethod: payment,
    itemsPrice: priceMemo,
    shippingPrice: deliveryPriceMemo,
    totalPrice: totalPriceMemo,
    user: user?.id,
  };

  console.log("ORDER PAYLOAD SEND:", payload);

  mutationAddOrder.mutate({
    token: user?.access_token,
    ...payload
  });
};

  console.log('order', order, user)

  const mutationUpdate = useMutationHooks(
          (data) => {
              const { id, token, ...rests } = data
              const res = UserService.updateUser(id, {...rests}, token)
              return res
          }
      )
  
  const mutationAddOrder = useMutationHooks(
          (data) => {
              const {token, ...rests } = data
              const res = OrderService.createOrder(token, {...rests})
              return res
          }
      )

  const { isLoading, data} = mutationUpdate;


  const handleCancleUpdate = () => {
    setStateUserDetails({
            name: '',
            email: '',
            phone: '',
            isAdmin: false
        })
        form.resetFields()
    setIsOpenModalUpdateInfo(false)
  }
   console.log("data:", data);

  const handleUpdateInfoUser = () => {
    console.log('stateUserDetails', stateUserDetails);
    const {name , phone, address, city} = stateUserDetails
    if(name && phone && address && city){
       mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails },{
        onSuccess: () => {
          dispatch(updateUser({name , phone, address, city}))
          setIsOpenModalUpdateInfo(false)
        }
       })
    }
    }

  const handleOnChangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value
        })
    }
  console.log('stateUserDetails', stateUserDetails);

  return (
    <div style={{background:'#f5f5fa', width:'100%', height: '100vh'}}>
      <div style={{height: '100%',width: '1270px', margin: '0 auto'}}>
        <h3>Phương thức thanh toán</h3>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <WrapperLeft>
              <WrapperInfo>
                    <div>
                        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Chọn phương thức giao hàng</span>
                    </div>
                    
                    {/* Giả lập lựa chọn Giao hàng, giá trị được tính ở deliveryPriceMemo */}
                    <div style={{ marginTop: '10px' }}>
                        <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '8px' }}>
                            <input type="radio" checked={true} readOnly />
                            <label style={{ marginLeft: '8px', fontWeight: 'bold' }}>Giao hàng tiêu chuẩn</label>
                            <p style={{ margin: '0 0 0 25px', fontSize: '12px', color: '#000' }}>Phí: {convertPrice(deliveryPriceMemo)}</p>
                        </div>
                    </div>
                </WrapperInfo>
                
                {/* 2. CHỌN PHƯƠNG THỨC THANH TOÁN */}
                <WrapperInfo>
                    <div>
                        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Chọn phương thức thanh toán</span>
                    </div>
                    
                    <div style={{ marginTop: '10px' }}>
                        {/* Thanh toán khi nhận hàng (COD) */}
                        <div 
                            onClick={() => setPayment('COD')} 
                            style={{ padding: '10px', border: payment === 'COD' ? '1px solid blue' : '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            <input type="radio" checked={payment === 'COD'} onChange={() => setPayment('COD')} />
                            <label style={{ marginLeft: '8px' }}>Thanh toán khi nhận hàng</label>
                        </div>
                        
                        {/* Ví dụ về phương thức khác (nếu có) */}
                        {/* <div 
                            onClick={() => setPayment('PAYPAL')} 
                            style={{ padding: '10px', border: payment === 'PAYPAL' ? '1px solid blue' : '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', marginTop: '8px' }}
                        >
                            <input type="radio" checked={payment === 'PAYPAL'} onChange={() => setPayment('PAYPAL')} />
                            <label style={{ marginLeft: '8px' }}>Thanh toán qua PayPal</label>
                        </div> */}
                    </div>
                </WrapperInfo>
          </WrapperLeft>
          <WrapperRight>
            <div style={{width: '100%'}}>
              <WrapperInfo>
                <div>
                  <span>Địa chỉ: </span>
                  <span style={{fontWeight: 'bold'}}>{`${user?.address} ${user?.city}`}</span>
                  <span onClick={handleChangeAddress} style={{color: 'blue' , cursor:'pointer'}}>Thay đổi</span>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div style={{display: 'flex', alignItems:'center', justifyContent:'space-between'}}>
                  <span>Tạm tính</span>
                  <span style={{color:'#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceMemo)}</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>Giảm giá</span>
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{`${priceDiscountMemo} %`}</span>
                </div>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                  <span>Phí giao hàng</span>
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(deliveryPriceMemo)}</span>
                </div>
              </WrapperInfo>
              <WrapperTotal>
                <span>Tổng tiền</span>
                <span style={{display: 'flex', flexDirection:'column'}}>
                  <span style={{color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight:'bold'}}>{convertPrice(totalPriceMemo)}</span>
                  <span style={{color: '#000', fontSize:'11px'}}>(Đã bao gồm VAT nếu có)</span>
                </span>
              </WrapperTotal>
            </div>
            <ButtonComponent 
            onClick= {() => handleAddOrder()}
            size={40}
            styleButton={{
              background: 'rgb(255, 57, 69)',
              height: '48px',
              width: '320px',
              border: 'none',
              borderRadius: '4px'
            }}
            textButton={'Đặt hàng'}
            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
            ></ButtonComponent>
          </WrapperRight>
        </div>
      </div>
      <ModalComponent title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancleUpdate} onOk={handleUpdateInfoUser}>
                {/* <Loading isLoading={isLoading}> */}
                <>
                     <Form
                    name="basic"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    // onFinish={onUpdateUser}
                    autoComplete="on"
                    form={form}
                    >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input name!' }]}
                    >
                        <InputComponent value={stateUserDetails.name} onChange={handleOnChangeDetails} name="name" />
                    </Form.Item>

                    <Form.Item
                        label="City"
                        name="city"
                        rules={[{ required: true, message: 'Please input name!' }]}
                    >
                        <InputComponent value={stateUserDetails.city} onChange={handleOnChangeDetails} name="city" />
                    </Form.Item>

                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: 'Please input phone!' }]}
                    >
                        <InputComponent value={stateUserDetails.phone} onChange={handleOnChangeDetails} name="phone" />
                    </Form.Item>

                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: 'Please input address!' }]}
                    >
                        <InputComponent value={stateUserDetails.address} onChange={handleOnChangeDetails} name="address" />
                    </Form.Item>
                </Form>
                </>
                {/* </Loading> */}
        </ModalComponent>
    </div>
  )
}


export default PaymentPage