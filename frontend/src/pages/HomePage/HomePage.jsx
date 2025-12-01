import React, { useEffect } from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperTypeProduct,WrapperButtonMore,WrapperProducts } from './style'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import Slider1 from '../../assets/images/Slider1.webp'
import Slider2 from '../../assets/images/Slider2.webp'
import Slider3 from '../../assets/images/Slider3.webp'
import CardComponent from '../../components/CardComponent/CardComponent'
import * as ProductService from '../../services/ProductService';
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import Loading from '../../components/LoadingComponent/Loading'
import { useDebounce } from '../../Hook/useDebounceHook'



const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const searchDebounce = useDebounce(searchProduct,500)
  const [loading, setLoading] = useState (false)
  const [limit, setLimit] = useState (6)

  const [typeProduct, setTypeProduct] = useState ([])
  const fetchProductAll = async (context) => {
    console.log('context',context)
    const limit = context?.queryKey && context?.queryKey[1]
    const search = context?.queryKey && context?.queryKey[2]
    const res = await ProductService.getAllProduct(search, limit)
    
    return res
    }

    const fetchAllTypeProduct = async () => {
      const res = await ProductService.getAllTypeProduct()
      if(res?.status === 'OK'){
        setTypeProduct(res?.data)
        
      }
     
    }

  const { isLoading, data: products, isPrevousData } = useQuery({
    queryKey: ['products', limit, searchDebounce],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
  })

    useEffect(() => {
      fetchAllTypeProduct()

    }, [])


  return (
    <Loading isLoading = {isLoading || loading}>
      <div style={{ width:'1270px', margin:'0 auto' }}>
        <WrapperTypeProduct>
          {typeProduct.map((item) => {
            return(
              <TypeProduct name={item} key={item} />
            )
          })}
        </WrapperTypeProduct>
      </div>
      <div className='body' style={{ width: '100%', backgroundColor: '#efefef', minHeight: '100vh' }}>
        <div id="container" style={{ width: '1270px', margin: '0 auto', paddingBottom: '20px' }}>
          <SliderComponent arrImages={[ Slider1, Slider2, Slider3]} />
          <WrapperProducts>
            {products?.data?.map((product) => {
              console.log('product', product)
              return (
                <CardComponent 
                  key={product._id} 
                  countInStock={product.countInStock} 
                  description={product.description} 
                  image={product.image} 
                  name={product.name}
                  price={product.price}
                  rating={product.rating}
                  type={product.type}
                  selled={product.selled}
                  discount={product.discount}
                  id ={product._id}
                />
              )
            })}
            {/* <CardComponent />
            <CardComponent />
            <CardComponent />
            <CardComponent />
            <CardComponent />
            <CardComponent />
            <CardComponent />
            <CardComponent />
            <CardComponent />
            <CardComponent /> */}
          </WrapperProducts>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <WrapperButtonMore
            
              textButton= {isPrevousData ? 'Load More': "Xem thêm" }
              type="outline"
              styleButton={{
                border: '1px solid rgb(11, 116, 229)',
                color: `${products?.total === products?.data?.length ? '#ccc': 'rgb(11, 116, 229)'}`,
                width: '240px',
                height: '38px',
                borderRadius: '4px'
              }}
              disabled={products?.total === products?.data?.length || products?.totalPage === 1}
              styleTextButton={{ fontWeight: 500 , color: products?.total === products?.data?.length && '#fff' }}
              onClick = {() => setLimit((prev) => prev + 6)}

            />
          </div>
        </div>
      </div>
    </Loading>
  )
}

export default HomePage