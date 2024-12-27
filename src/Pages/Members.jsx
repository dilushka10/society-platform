import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Button, Table, message } from "antd";
import {
  EllipsisOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Navbar from "../Components/Navber";
import RegisterMemberModal from "../Components/RegisterMemberModal";

const baseUrl = import.meta.env.VITE_SERVER_BASE_URL;

const Members = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [memberData,setMemberData] = useState([
    // {
    //   key: "1",
    //   membershipNo: "00545",
    //   date: "2024-12-26",
    //   name: "John Doe",
    //   address: "123 Main St, Colombo",
    //   nic: "982374567V",
    //   phonenumber: "0775555555",
    // },
    // {
    //   key: "2",
    //   membershipNo: "00546",
    //   date: "2024-12-25",
    //   name: "Jane Doe",
    //   address: "456 High St, Kandy",
    //   nic: "983746528V",
    //   phonenumber: "0775158813",
    // },
  ]
);

const soceityId = '123456';

useEffect(()=>{

  const getMembersData = async ()=>{

    try {
      
      const response = await fetch(`${baseUrl}/api/v1/member/getall/${soceityId}`);
      // const response = await fetch(`https://5000-idx-society-platform-1735035301886.cluster-fu5knmr55rd44vy7k7pxk74ams.cloudworkstations.dev/api/v1/member/getall`);
      // console.log('res',response);

      if(response.ok){
        const data = await response.json()
        console.log('data',data);
        if(data.message ==='No members found for this society'){
          message.info('No members found for this society');
        }else{
          setMemberData(data);
        };

      }else{
        console.error(`Error: ${response.status}`);
      }


    } catch (error) {
      console.error(error);
    }

    
  };
  
  getMembersData();
},[]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values) => {
    console.log("Submitted Values:", values);
  
    const body = {
      membershipNo: values.membershipNo,
      date: values.registeredDate,
      name: values.name,
      address: values.address,
      nicNo: values.nic,
      contactNo: values.phoneNumber,
      societyId: '123456', // Ensure this field exists in your form values or set a default value.
    };
  
    const memberData = JSON.stringify(body);
    // console.log("Payload Sent:", memberData);
  
    try {
      const response = await fetch(`${baseUrl}/api/v1/member/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: memberData,
      });
 
      // console.log("Response:", response);
      
      if (response.ok) {
        // const data = await response.json();
        // console.log("Server Response:", data);
        setMemberData((prevData) => [...prevData, body]);
        message.success("Member Registered Successfully");
      } else {
        console.error(`Error: ${response.status}`);
        const errorResponse = await response.text();
        console.error("Error Details:", errorResponse);
        message.error(errorResponse);
      }
    } catch (error) {
      console.error("Request Failed:", error);
    }
  };
  
  const handleMenuClick = (action, record) => {
    console.log(`${action} clicked for`, record);
  };

  const actionMenu = (record) => (
    <Menu>
      <Menu.Item
        key="view"
        icon={<EyeOutlined />}
        onClick={() => handleMenuClick("View", record)}
      >
        View
      </Menu.Item>
      <Menu.Item
        key="edit"
        icon={<EditOutlined />}
        onClick={() => handleMenuClick("Edit", record)}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined />}
        onClick={() => handleMenuClick("Delete", record)}
        className="text-red-600"
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "Membership No",
      dataIndex: "membershipNo",
      key: "membershipNo",
    },
    {
      title: "Registered Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "NIC No",
      dataIndex: "nicNo",
      key: "nic",
    },
    {
      title: "Phone Number",
      dataIndex: "contactNo",
      key: "phonenumber",
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Dropdown overlay={actionMenu(record)} trigger={["click"]}>
          <Button
            shape="circle"
            icon={<EllipsisOutlined />}
            onClick={(e) => e.preventDefault()}
          />
        </Dropdown>
      ),
    },
  ];



  return (
    <div className="flex h-screen bg-[#F5F9FF] font-custom">
      {/* Sidebar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-col flex-grow">
        {/* Header */}
        <header className="bg-white shadow py-4 px-8 border-b border-gray-200">
          <h1 className="text-xl text-gray-800">Members Management</h1>
        </header>

        {/* Content */}
        <main className="flex-grow p-8">
          <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-700">
                Members List
              </h2>
              <Button
                type="primary"
                onClick={showModal}
                icon={<PlusOutlined />}
                className="bg-[#0D47A1] hover:bg-[#1565C0] border-none text-white"
              >
                Register New Member
              </Button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table
                columns={columns}
                dataSource={memberData}
                pagination={{ pageSize: 5 }}
                bordered
                rowClassName={(record, index) =>
                  index % 2 === 0 ? "bg-[#F5F9FF]" : "bg-white"
                }
                className="border border-gray-200"
              />
            </div>

            {/* Mobile Card View */}
            <div className="block md:hidden space-y-4">
              
              {memberData.map((record) => (
                <div
                  key={record.key}
                  className="bg-white shadow rounded-lg p-4 border border-gray-300"
                >
                  <p>
                    <span className="font-medium text-gray-700"><b>Membership No : </b></span>{" "}
                    {record.membershipNo}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700"><b>Registered Date : </b></span>{" "}
                    {record.date}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700"><b>Name : </b></span>{" "}
                    {record.name}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700"><b>Address : </b></span>{" "}
                    {record.address}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700"><b>NIC No : </b></span>{" "}
                    {record.nicNo}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700"><b>Phone Number : </b></span>{" "}
                    {record.contactNo}
                  </p>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button
                      size="small"
                      onClick={() => handleMenuClick("View", record)}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleMenuClick("Edit", record)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      danger
                      onClick={() => handleMenuClick("Delete", record)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white text-center py-4 border-t border-gray-200">
          <p className="text-gray-500">Society Management System ©2024</p>
        </footer>
      </div>

      {/* Register Member Modal */}
      <RegisterMemberModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Members;
