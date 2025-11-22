import axios from "axios"
import { axiosJWT } from "./UserService"

// export const createProduct = async (data, access_token) => {
//     const res = await axios.post(
//         `${process.env.REACT_APP_API_URL}/product/create`,
//         data,
//         {
//             headers: {
//                 token: `Bearer ${access_token}`,
//             },
//         }
//     )
//     console.log(process.env.REACT_APP_API_URL)
//     return res.data
// }

export const createOrder = async (access_token, data) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/create`,data, {
            headers: {
                token: `Bearer ${access_token}`,
            }    
        })  
    return res.data
}