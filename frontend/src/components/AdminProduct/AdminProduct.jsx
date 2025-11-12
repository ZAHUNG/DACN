import React, { useState, useEffect } from 'react'
import { WrapperHeader } from './style'
import { Button, Descriptions, Form, Input } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { WrapperUploadFile } from './style'
import { getBase64 } from '../../utils'
import * as ProductService from '../../services/ProductService'
import { useMutationHooks } from '../../Hook/useMutationHook'
import Loading from '../LoadingComponent/Loading'
import * as message from '../Message/Message'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'


const AdminProduct = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected,setRowSelected] = useState('')
    const [rowsSelected, setRowsSelected] = useState([])
    const [searchText, setSearchText] = useState('')
    const [isOpenDrawer,setIsOpenDrawer] = useState(false)
    const [isLoadingUpdate,setIsLoadingUpdate] = useState(false)
    const [isModalOpenDelete,setIsModalOpenDelete] = useState(false)
    const [isModalOpenDeleteMany,setIsModalOpenDeleteMany] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const user = useSelector((state) => state?.user)

    const [stateProduct, setStateProduct] = useState({
        name: '',
        type:'',
        countInStock: '',
        price: '',
        description: '',
        rating: '',
        image: ''
    })
    const [stateProductDetails, setStateProductDetails] = useState({
        name: '',
        type:'',
        countInStock: '',
        price: '',
        description: '',
        rating: '',
        image: ''
    })

    const [form] = Form.useForm();

    const mutation = useMutationHooks(
        (data) => {
            const { name, type, countInStock, price, description, rating, image } = data
            const res = ProductService.createProduct({name, type, countInStock, price, description, rating, image})
            return res
        }
    )
    
    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id, token, ...rests } = data
            const res = ProductService.updateProduct(id, token, {...rests})
            return res
        }
    )
    
    const mutationDeleted = useMutationHooks(
        (data) => {
            const { id, token} = data
            const res = ProductService.deleteProduct(id, token)
            return res
        }
    )

    const mutationDeletedMany = useMutationHooks(
        (data) => {
            const { ids, token} = data
            const res = ProductService.deleteMany(ids, token)
            return res
        }
    )

    const getAllProduct = async () => {
        const res = await ProductService.getAllProduct(pageSize, currentPage)
        return res
    }
    const getAllProductFull = async () => {
    const res = await ProductService.getAllProduct(999999, 0, user?.access_token)
    return res?.data || []
    }
    const fetchGetDetailsProduct = async (rowSelected) => {
        const res = await ProductService.getDetailsProduct(rowSelected)
        if(res?.data){
            setStateProductDetails({
                name: res?.data?.name,
                type: res?.data?.type,
                countInStock: res?.data?.countInStock,
                price: res?.data?.price,
                description: res?.data?.description,
                rating: res?.data?.rating,
                image: res?.data?.image
            })
        }
        setIsLoadingUpdate(false)
    }

    useEffect(() => {
    if (stateProductDetails) {
        form.setFieldsValue(stateProductDetails)
    }
    }, [stateProductDetails, form])

    useEffect(() => {
        if(rowSelected){
            setIsLoadingUpdate(true)
            fetchGetDetailsProduct(rowSelected)
        }
    }, [rowSelected])

    
    const handleDetailsProduct = () => {
        setIsOpenDrawer(true)
    }
    
    const { data, isLoading, isSuccess, isError } = mutation
    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted
    const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeletedMany

    console.log('dataUpdated', dataUpdated)
    const queryProduct = useQuery({queryKey: ['products', currentPage, pageSize],queryFn: getAllProduct })
    const {isLoading : isLoadingProduct, data: products} = queryProduct
    console.log('products', products)

    const renderAction = () => {
        return(
            <div>
                <DeleteOutlined style={{color: 'red', fontSize:'30px', cursor:'pointer'}} onClick={() => setIsModalOpenDelete(true)}/>
                <EditOutlined style={{color: 'orange', fontSize:'30px', cursor:'pointer'}} onClick={handleDetailsProduct}/>
            </div>
        )
    }

    const dataTable = (products?.data && products.data.map((product) => ({ ...product, key: product._id }))) || []

    const filteredData = searchText
        ? dataTable.filter((p) => p.name && p.name.toLowerCase().includes(searchText.toLowerCase()))
        : dataTable
    
    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page - 1)
        setPageSize(pageSize)
    }
    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            message.success()
            handleCancel()
        } else if (isError) {
            message.error()
        }
    }, [isSuccess])

    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            message.success()
            handleCloseDrawer()
        } else if (isErrorUpdated) {
            message.error()
        }
    }, [isSuccessUpdated])

    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success()
            handleCancelDelete()
        } else if (isErrorDeleted) {
            message.error()
        }
    }, [isSuccessDeleted])

    useEffect(() => {
        if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
            message.success()
            handleCancelDeleteMany()
            setRowsSelected([])
        } else if (isErrorDeletedMany) {
            message.error()
        }
    }, [isSuccessDeletedMany])

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateProductDetails({
            name: '',
            type: '',
            countInStock: '',
            price: '',
            description: '',
            rating: '',
            image: ''
        })
        form.resetFields()
    };

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }

    const handleDeleteProduct = () => {
        mutationDeleted.mutate({ id: rowSelected, token: user?.access_token}, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const handleCancelDeleteMany = () => {
        setIsModalOpenDeleteMany(false)
    }

    const handleDeleteManyProduct = () => {
        setIsModalOpenDeleteMany(true)
    }

    const handleConfirmDeleteMany = () => {
        mutationDeletedMany.mutate({ ids: rowsSelected, token: user?.access_token}, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateProduct({
            name: '',
            type: '',
            countInStock: '',
            price: '',
            description: '',
            rating: '',
            image: ''
        })
        form.resetFields()
    };

    const onFinish = () => {
        mutation.mutate(stateProduct,{
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const handleOnChange = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value
        })
    }
    const handleOnChangeDetails = (e) => {
        setStateProductDetails({
            ...stateProductDetails,
            [e.target.name]: e.target.value
        })
    }
    

    const typeFilters = Array.from(new Set(dataTable.map(d => d.type).filter(Boolean))).map(t => ({ text: t, value: t }))

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => (a.name || '').length - (b.name || '').length
        },
        {
            title: 'Type',
            dataIndex: 'type',
            filters: typeFilters,
            onFilter: (value, record) => record.type === value
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: (a, b) => Number(a.price || 0) - Number(b.price || 0),
            filters: [
                { text: 'Giá trên 200000', value: '>=' },
                { text: 'Giá dưới 200000', value: '<=' },
            ],
            onFilter: (value, record) => {
                if (value === '>=') return Number(record.price || 0) >= 200000
                return Number(record.price || 0) <= 200000
            }
        },
        {
            title: 'Count InStock',
            dataIndex: 'countInStock',
            sorter: (a, b) => Number(a.countInStock || 0) - Number(b.countInStock || 0),
            filters: [
                { text: 'Số lượng trên 10', value: '>=' },
                { text: 'Số lượng dưới 10', value: '<=' },
            ],
            onFilter: (value, record) => {
                if (value === '>=') return Number(record.countInStock || 0) >= 10
                return Number(record.countInStock || 0) <= 10
            }
        },
       
        
         {
            title: 'Rating',
            dataIndex: 'rating',
            sorter: (a, b) => Number(a.rating || 0) - Number(b.rating || 0),
            filters: [
                { text: 'Đánh giá trên 4 sao', value: '>=' },
                { text: 'Đánh giá dưới 4 sao', value: '<=' },
            ],
            onFilter: (value, record) => {
                if (value === '>=') return Number(record.rating || 0) >= 4
                return Number(record.rating || 0) <= 4
            }
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction
        },

    ];

    const handleOnchangeAvatar = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProduct({
            ...stateProduct,
            image: file.preview
        })
    }
    const handleOnchangeAvatarDetails = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProductDetails({
            ...stateProductDetails,
            image: file.preview
        })
    }

    const handleExportExcel = async () => {
        try {
            const allProducts = await getAllProductFull()
    
            if (!allProducts || allProducts.length === 0) {
                message.error('Không có dữ liệu để xuất!')
                return
            }
    
            const exportData = allProducts.map(product => ({
                'Product ID': product._id,
                'Name': product.name,
                'Type': product.type,
                'Count InStock': product.countInStock,
                'Price': product.price,
                'Description': product.description,
                'Rating': product.rating,
                'Created At': new Date(product.createdAt).toLocaleString(),
                'Updated At': new Date(product.updatedAt).toLocaleString(),
            }))
    
            const worksheet = XLSX.utils.json_to_sheet(exportData)
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Products')
    
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
            const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
            saveAs(blob, `All_Products_${new Date().toISOString().slice(0, 10)}.xlsx`)
    
            message.success('Xuất toàn bộ dữ liệu sản phẩm thành công!')
            } catch (error) {
                console.error('Export error:', error)
                message.error('Xuất Excel thất bại!')
            }
        }

    const onUpdateProduct = () => {
        mutationUpdate.mutate({id: rowSelected, token: user?.access_token, ...stateProductDetails},{
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    return (
        <div>
            <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
            <div style={{ marginTop: '10px'}}>
                <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }} onClick={() => setIsModalOpen(true)}><PlusOutlined style={{ fontSize: '60px'}} /></Button>
            </div>
            <div style={{ marginTop: '20px', width: '1200px'}}>
                <Input.Search
                    placeholder="Nhập tên sản phẩm cần tìm"
                    allowClear
                    onSearch={(value) => setSearchText(value)}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ marginBottom: 12, width: 360 }}
                />
                <Button
                    type="primary"
                    onClick={handleExportExcel}
                >
                    Xuất Dữ Liệu 
                </Button>

                {rowsSelected.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                        <Button danger onClick={handleDeleteManyProduct}>
                            Xóa {rowsSelected.length} sản phẩm
                        </Button>
                    </div>
                )}
                <TableComponent 
                    columns={columns} 
                    isLoading={isLoadingProduct} 
                    data={filteredData} 
                    pagination={{ pageSize: pageSize, current: currentPage + 1, total: products?.totalProduct || 0, onChange: handlePageChange }}
                    rowSelection={{
                        onChange: (selectedRowKeys, selectedRows) => {
                            setRowsSelected(selectedRowKeys)
                        }
                    }}
                    onRow={(record,rowIndex) =>{
                        return{
                            onClick: event => {
                                setRowSelected(record._id)
                            }
                        }
                    }}
                />
            </div>
            <ModalComponent title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
                {/* <Loading isLoading={isLoading}> */}
                    <Form
                        name="basic"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        onFinish={onFinish}
                        autoComplete="off"
                        form={form}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <InputComponent value={stateProduct.name} onChange={handleOnChange} name="name" />
                        </Form.Item>

                        <Form.Item
                            label="Type"
                            name="type"
                            rules={[{ required: true, message: 'Please input your type!' }]}
                        >
                            <InputComponent value={stateProduct.type} onChange={handleOnChange} name="type" />
                        </Form.Item>

                        <Form.Item
                            label="Count InStock"
                            name="countInStock"
                            rules={[{ required: true, message: 'Please input your count inStock!' }]}
                        >
                            <InputComponent value={stateProduct.countInStock} onChange={handleOnChange} name="countInStock" />
                        </Form.Item>

                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[{ required: true, message: 'Please input your price!' }]}
                        >
                            <InputComponent value={stateProduct.price} onChange={handleOnChange} name="price" />
                        </Form.Item>

                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[{ required: true, message: 'Please input your description!' }]}
                        >
                            <InputComponent value={stateProduct.description} onChange={handleOnChange} name="description" />
                        </Form.Item>

                        <Form.Item
                            label="Rating"
                            name="rating"
                            rules={[{ required: true, message: 'Please input your rating!' }]}
                        >
                            <InputComponent value={stateProduct.rating} onChange={handleOnChange} name="rating" />
                        </Form.Item>
                        
                        <Form.Item
                            label="Image"
                            name="image"
                            rules={[{ required: true, message: 'Please input your image!' }]}
                        >
                            <WrapperUploadFile action={false} beforeUpload={() => false} onChange={handleOnchangeAvatar} maxCount={1}>
                                <Button>Select File</Button>
                                {stateProduct?.image && (
                                    <img src={stateProduct?.image} style={{
                                        height: '60px',
                                        width: '60px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginLeft: '10px'
                                    }} alt="avatar" />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                {/* </Loading> */}
            </ModalComponent>
            <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
                <Loading isLoading={isLoadingUpdate || isLoadingUpdate}>
                    <Form
                        name="basic"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                        onFinish={onUpdateProduct}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <InputComponent value={stateProductDetails['name']} onChange={handleOnChangeDetails} name="name" />
                        </Form.Item>

                        <Form.Item
                            label="Type"
                            name="type"
                            rules={[{ required: true, message: 'Please input your type!' }]}
                        >
                            <InputComponent value={stateProductDetails.type} onChange={handleOnChangeDetails} name="type" />
                        </Form.Item>

                        <Form.Item
                            label="Count InStock"
                            name="countInStock"
                            rules={[{ required: true, message: 'Please input your count inStock!' }]}
                        >
                            <InputComponent value={stateProductDetails.countInStock} onChange={handleOnChangeDetails} name="countInStock" />
                        </Form.Item>

                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[{ required: true, message: 'Please input your price!' }]}
                        >
                            <InputComponent value={stateProductDetails.price} onChange={handleOnChangeDetails} name="price" />
                        </Form.Item>

                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[{ required: true, message: 'Please input your description!' }]}
                        >
                            <InputComponent value={stateProductDetails.description} onChange={handleOnChangeDetails} name="description" />
                        </Form.Item>

                        <Form.Item
                            label="Rating"
                            name="rating"
                            rules={[{ required: true, message: 'Please input your rating!' }]}
                        >
                            <InputComponent value={stateProductDetails.rating} onChange={handleOnChangeDetails} name="rating" />
                        </Form.Item>
                        
                        <Form.Item
                            label="Image"
                            name="image"
                            rules={[{ required: true, message: 'Please input your image!' }]}
                        >
                            <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
                                <Button>Select File</Button>
                                {stateProductDetails?.image && (
                                    <img src={stateProductDetails?.image} style={{
                                        height: '60px',
                                        width: '60px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginLeft: '10px'
                                    }} alt="avatar" />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Apply
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </DrawerComponent>
            <ModalComponent title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
                <Loading isLoading={isLoadingDeleted}>
                    <div>Bạn có chắc xóa sản phẩm này không?</div>
                </Loading>
            </ModalComponent>
            <ModalComponent title="Xóa nhiều sản phẩm" open={isModalOpenDeleteMany} onCancel={handleCancelDeleteMany} onOk={handleConfirmDeleteMany}>
                <Loading isLoading={isLoadingDeletedMany}>
                    <div>Bạn có chắc xóa {rowsSelected.length} sản phẩm này không?</div>
                </Loading>
            </ModalComponent>
        </div>
    )   
}

export default AdminProduct