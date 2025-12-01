import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Radio} from "antd";
import { Checkbox, Form } from 'antd';
import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { WrapperTotal,WrapperLeft,WrapperStyleHeader, WrapperListOrder,WrapperItemOrder, WrapperCountOrder, WrapperRight, WrapperInfo, Lable, WrapperRadio} from './style';
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
import { useNavigate } from 'react-router-dom';
import PayPalButton from '../../components/PaypalButton/PaypalButton';

const PaymentPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const [delivery, setDelivery] = useState('fast')
  const [payment, setPayment] = useState('later_money');
  const [showPayPalButton, setShowPayPalButton] = useState(false);
  const navigate = useNavigate();
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
    if(payment === 'paypal') {
      return; // PayPal Button sẽ xử lý
    }
  const orderItems = order?.orderItemsSelected || [];

  // Validate đơn hàng
  if (!user?.access_token) {
    return message.error("Bạn chưa đăng nhập!");
  }

  if (!orderItems.length) {
    return message.error("Giỏ hàng rỗng!");
  }

  // Ưu tiên thông tin người dùng đã sửa trong stateUserDetails
  const shippingAddress = {
    fullname: stateUserDetails.name || user?.name,
    address: stateUserDetails.address || user?.address,
    city: stateUserDetails.city || user?.city,
    phone: stateUserDetails.phone || user?.phone,
  };

  const payload = {
    orderItems,
    shippingAddress,
    paymentMethod: payment,
    itemsPrice: priceMemo || 0,
    shippingPrice: deliveryPriceMemo || 0,
    totalPrice: totalPriceMemo || 0,
    user: user?.id
  };

  // console.log("ORDER PAYLOAD SEND:", payload);

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
  const {data: dataAdd, isLoading: isLoadingAddOrder, isSuccess, isError} = mutationAddOrder;

  useEffect(() => {
    if ( isSuccess && dataAdd?.status === 'Ok' ) {
      const arrayOrdered = [];
      order?.orderItemsSelected?.forEach(element =>{
        arrayOrdered.push(element.product)
      })
      dispatch(removeAllOrderProduct({listChecked: arrayOrdered}))
      message.success("Đặt hàng thành công!");
      // console.log('dat hang thanh cong', dataAdd);
      navigate('/orderSuccess',{
        state: {
          delivery,
          payment,
          orders: order?.orderItemsSelected,
          totalPriceMemo: totalPriceMemo
        }
      });
    } else if ( isError){
      message.error("Đặt hàng thất bại!");
    }
  },[isSuccess, isError, dataAdd]);


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

  const handleDelivery = (e) => {
    setDelivery(e.target.value)
  }
  const handlePayment = (e) => {
    setPayment(e.target.value)
    if(e.target.value === 'paypal') {
      setShowPayPalButton(true);
    } else {
      setShowPayPalButton(false);
    }
  }

  const handlePayPalSuccess = () => {
  const arrayOrdered = [];
  order?.orderItemsSelected?.forEach(element => {
    arrayOrdered.push(element.product)
  })
  dispatch(removeAllOrderProduct({listChecked: arrayOrdered}))
  message.success("Thanh toán PayPal thành công!");
  navigate('/orderSuccess', {
    state: {
      delivery,
      payment,
      orders: order?.orderItemsSelected,
      totalPriceMemo: totalPriceMemo
    }
  });
  }

  return (
    <div style={{background:'#f5f5fa', width:'100%', height: '100vh'}}>
      {/* <Loading isLoading={isLoadingAddOrder}> */}
      <div style={{height: '100%',width: '1270px', margin: '0 auto'}}>
        <h3>Phương thức thanh toán</h3>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <WrapperLeft>
              <WrapperInfo>
                <div>
                  <Lable>Chọn phương thức giao hàng</Lable>
                  <WrapperRadio onChange={handleDelivery} value={delivery}>
                    <Radio value="fast"><span style={{color: '#ea8500', fontWeight: 'bold'}}>FAST</span> Giao hàng tiết kiệm</Radio>
                    <Radio value="gojek"><span style={{color: '#ea8500', fontWeight: 'bold'}}>GO_JEK</span> Giao hàng tiết kiệm</Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <Lable>Chọn phương thức thanh toán</Lable>
                  <WrapperRadio onChange={handlePayment} value={payment}>
                    <Radio value="later_money">Thanh toán khi nhận hàng</Radio>
                    <Radio value="paypal">Paypal</Radio>
                  </WrapperRadio>
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
                        {payment === 'paypal' ? (
              <PayPalButton 
                totalPrice={totalPriceMemo}
                orderItems={order?.orderItemsSelected || []}
                shippingAddress={{
                  fullname: stateUserDetails.name || user?.name,
                  address: stateUserDetails.address || user?.address,
                  city: stateUserDetails.city || user?.city,
                  phone: stateUserDetails.phone || user?.phone,
                }}
                onSuccess={handlePayPalSuccess}
                user={user}
              />
            ) : (
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
            )}
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
      {/* </Loading> */}
    </div>
  )
}


export default PaymentPage