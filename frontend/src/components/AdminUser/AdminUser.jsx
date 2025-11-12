import React, { useState, useEffect } from 'react'
import { WrapperHeader } from './style'
import { Button, Form, Input, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { useMutationHooks } from '../../Hook/useMutationHook'
import Loading from '../LoadingComponent/Loading'
import * as message from '../Message/Message'
import { useQuery } from '@tanstack/react-query'
import * as UserService from '../../services/UserService'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const AdminUser = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('')
    const [searchText, setSearchText] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const user = useSelector((state) => state?.user)
    const handleOnChangeAdmin = (checked) => {setStateUserDetails({...stateUserDetails,isAdmin: checked})
}
    const [stateUser, setStateUser] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        isAdmin: false
    })
    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        isAdmin: false
    })

    const [form] = Form.useForm();
    const [formUpdate] = Form.useForm();

    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id, token, ...rests } = data
            const res = UserService.updateUser(id, {...rests}, token)
            return res
        }
    )

    const mutationDeleted = useMutationHooks(
        (data) => {
            const { id, token } = data
            const res = UserService.deleteUser(id, token)
            return res
        }
    )

    const mutationCreate = useMutationHooks(
        (data) => {
            const res = UserService.signupUser(data)
            return res
        }
    )

    const getAllUser = async () => {
        const res = await UserService.getAllUser(pageSize, currentPage, user?.access_token)
        return res
    }
    const getAllUserFull = async () => {
    const res = await UserService.getAllUser(999999, 0, user?.access_token)
    return res?.data || []
    }
    const fetchGetDetailsUser = async (userId) => {
        try {
            const res = await UserService.getDetailsUser(userId, user?.access_token)
            if (res?.data) {
                setStateUserDetails({
                    name: res?.data?.name,
                    email: res?.data?.email,
                    phone: res?.data?.phone,
                    address: res?.data?.address,
                    isAdmin: res?.data?.isAdmin
                })
            }
        } catch (e) {
            console.error('fetchGetDetailsUser error', e)
            message.error('Không thể tải chi tiết người dùng')
        } finally {
            setIsLoadingUpdate(false)
        }
    }

    useEffect(() => {
        form.setFieldsValue(stateUserDetails)
    }, [form, stateUserDetails])

    useEffect(() => {
        formUpdate.setFieldsValue(stateUserDetails)
    }, [formUpdate, stateUserDetails])

    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted
    const { data: dataCreated, isLoading: isLoadingCreated, isSuccess: isSuccessCreated, isError: isErrorCreated } = mutationCreate
    
    const queryUser = useQuery({ queryKey: ['users', currentPage, pageSize], queryFn: getAllUser })
    const { isLoading: isLoadingUser, data: users } = queryUser
    console.log('users', users)

    const handleOpenEdit = async (record) => {
        const id = record._id
        setRowSelected(id)
        setIsLoadingUpdate(true)
        await fetchGetDetailsUser(id)
        setIsOpenDrawer(true)
    }

    const renderAction = (text, record) => {
        return (
            <div>
                <DeleteOutlined
                    style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }}
                    onClick={() => {
                        setRowSelected(record._id)
                        setIsModalOpenDelete(true)
                    }}
                />
                <EditOutlined
                    style={{ color: 'orange', fontSize: '30px', cursor: 'pointer', marginLeft: '10px' }}
                     onClick={() => handleOpenEdit(record)}
                />
            </div>
        )
    }

    const dataTable = (users?.data && users.data.map((user) => ({ ...user, key: user._id }))) || []

    const filteredData = searchText
        ? dataTable.filter((u) => u.email && u.email.toLowerCase().includes(searchText.toLowerCase()))
        : dataTable

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page - 1)
        setPageSize(pageSize)
    }

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
        if (isSuccessCreated && dataCreated?.status === 'OK') {
            message.success()
            handleCancel()
            queryUser.refetch()
        } else if (isErrorCreated) {
            message.error()
        }
    }, [isSuccessCreated])

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateUserDetails({
            name: '',
            email: '',
            phone: '',
            address: '',
            isAdmin: false
        })
        formUpdate.resetFields()
    };

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }

    const handleDeleteUser = () => {
        mutationDeleted.mutate({ id: rowSelected, token: user?.access_token }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateUser({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            address: '',
            isAdmin: false
        })
        form.resetFields()
    };

    const handleOnChange = (e) => {
        setStateUser({
            ...stateUser,
            [e.target.name]: e.target.value
        })
    }

    const handleOnChangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value
        })
    }

    const onFinish = () => {
        mutationCreate.mutate(stateUser, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            render: (text) => <a>{text}</a>
        },
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => (a.name || '').localeCompare(b.name || '')
        },
        {
            title: 'Phone',
            dataIndex: 'phone'
        },
        {
            title: 'Address',
            dataIndex: 'address',
            sorter: (a, b) => (a.address || '').localeCompare(b.address || '')
        },
        {
            title: 'Admin',
            dataIndex: 'isAdmin',
            render: (isAdmin) => isAdmin ? 'Yes' : 'No',
            filters: [
                { text: 'Admin', value: true },
                { text: 'User', value: false },
            ],
            onFilter: (value, record) => record.isAdmin === value
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction
        },
    ];

    const onUpdateUser = () => {
        mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateUserDetails }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    const handleExportExcel = async () => {
    try {
        const allUsers = await getAllUserFull()

        if (!allUsers || allUsers.length === 0) {
            message.error('Không có dữ liệu để xuất!')
            return
        }

        const exportData = allUsers.map(user => ({
            Email: user.email,
            Name: user.name,
            Phone: user.phone,
            Address: user.address,
            'Is Admin': user.isAdmin ? 'Yes' : 'No',
            'Created At': new Date(user.createdAt).toLocaleString(),
            'Updated At': new Date(user.updatedAt).toLocaleString(),
        }))

        const worksheet = XLSX.utils.json_to_sheet(exportData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users')

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
        saveAs(blob, `All_Users_${new Date().toISOString().slice(0, 10)}.xlsx`)

        message.success('Xuất toàn bộ dữ liệu người dùng thành công!')
        } catch (error) {
            console.error('Export error:', error)
            message.error('Xuất Excel thất bại!')
        }
    }


    return (
        <div>
            <WrapperHeader>Quản lý người dùng</WrapperHeader>
            <div style={{ marginTop: '10px' }}>
                <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }} onClick={() => setIsModalOpen(true)}><PlusOutlined style={{ fontSize: '60px' }} /></Button>
            </div>
            <div style={{ marginTop: '20px', width: '1200px' }}>
                <Input.Search
                    placeholder="Nhập email người dùng cần tìm"
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
                <TableComponent columns={columns} isLoading={isLoadingUser} data={filteredData} pagination={{ pageSize: pageSize, current: currentPage + 1, total: users?.totalUser || 0, onChange: handlePageChange }} onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                            setRowSelected(record._id)
                        }
                    }
                }} />
            </div>

            <DrawerComponent title='Chi tiết người dùng' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
                <Form
                    name="formUpdate"
                    labelCol={{ span: 2 }}
                    wrapperCol={{ span: 22 }}
                    onFinish={onUpdateUser}
                    autoComplete="on"
                    form={formUpdate}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input email!' }]}
                    >
                        <InputComponent value={stateUserDetails.email} onChange={handleOnChangeDetails} name="email" />
                    </Form.Item>

                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input name!' }]}
                    >
                        <InputComponent value={stateUserDetails.name} onChange={handleOnChangeDetails} name="name" />
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
                    <Form.Item
                        label="Is Admin"
                        name="isAdmin"
                        valuePropName="checked" 
                    >
                    <Switch
                        checked={stateUserDetails.isAdmin}
                        onChange={handleOnChangeAdmin}
                        name="isAdmin"
                    />
                </Form.Item>

                    <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                        <Button type="primary" htmlType="submit" loading={isLoadingUpdated}>
                            Apply
                        </Button>
                    </Form.Item>
                </Form>
            </DrawerComponent>
                
            <ModalComponent title="Xóa người dùng" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser}>
                <Loading isLoading={isLoadingDeleted}>
                    <div>Bạn có chắc xóa người dùng này không?</div>
                </Loading>
            </ModalComponent>

            <ModalComponent title="Thêm người dùng" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    onFinish={onFinish}
                    autoComplete="off"
                    form={form}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input email!' }]}
                    >
                        <InputComponent value={stateUser.email} onChange={handleOnChange} name="email" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input password!' }]}
                    >
                        <Input.Password value={stateUser.password} onChange={handleOnChange} name="password" />
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        rules={[{ required: true, message: 'Please confirm password!' }]}
                    >
                        <Input.Password value={stateUser.confirmPassword} onChange={handleOnChange} name="confirmPassword" />
                    </Form.Item>

                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input name!' }]}
                    >
                        <InputComponent value={stateUser.name} onChange={handleOnChange} name="name" />
                    </Form.Item>

                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: 'Please input phone!' }]}
                    >
                        <InputComponent value={stateUser.phone} onChange={handleOnChange} name="phone" />
                    </Form.Item>

                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: 'Please input address!' }]}
                    >
                        <InputComponent value={stateUser.address} onChange={handleOnChange} name="address" />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                        <Button type="primary" htmlType="submit" loading={isLoadingCreated}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </ModalComponent>
        </div>
    )
}

export default AdminUser