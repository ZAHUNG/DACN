import axios from "axios"
import { axiosJWT } from "./UserService"

export const getAllProduct = async (limit = 10, page = 0) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/all?limit=${limit}&page=${page}`)
    return res.data
}

export const createProduct = async (data, access_token) => {
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/product/create`,
        data,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
        }
    )
    console.log(process.env.REACT_APP_API_URL)
    return res.data
}

export const getDetailsProduct = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/details/${id}`)
    return res.data
}
export const updateProduct = async (id, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/product/update/${id}`,data, {
            headers: {
                token: `Bearer ${access_token}`,
            }   
        })  
    return res.data
}
export const deleteProduct = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/product/delete/${id}`, {
            headers: {
                token: `Bearer ${access_token}`,
            }   
        })  
    return res.data
}

export const deleteMany = async (ids, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/product/delete-many`, { ids }, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}