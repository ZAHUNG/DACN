import axios from "axios"
import { axiosJWT } from "./UserService"

export const createOrder = async (access_token, data) => {
    console.log('access_token', access_token)
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/create`,data, {
            headers: {
                token: `Bearer ${access_token}`,
            }    
        })  
    return res.data
}
export const getOrderbyUserId = async (id,access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-order/${id}`, {
            headers: {
                token: `Bearer ${access_token}`,
            }    
        })  
    return res.data
}

export const getDetailsOrder = async (id,access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-details-order/${id}`, {
            headers: {
                token: `Bearer ${access_token}`,
            }    
        })  
    return res.data
}