import React, { useState } from "react";
import { Dropdown, Menu, Button, Table } from "antd";
import {
  EllipsisOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Navbar from "../Components/Navber";
import RegisterMemberModal from "../Components/RegisterMemberModal";

const Members = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = (values) => {
    console.log("Submitted Values:", values);
    setIsModalVisible(false);
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
      dataIndex: "nic",
      key: "nic",
    },
    {
      title: "Phone Number",
      dataIndex: "phonenumber",
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

  const data = [
    {
      key: "1",
      membershipNo: "00545",
      date: "2024-12-26",
      name: "John Doe",
      address: "123 Main St, Colombo",
      nic: "982374567V",
      phonenumber: "0775555555",
    },
    {
      key: "2",
      membershipNo: "00546",
      date: "2024-12-25",
      name: "Jane Doe",
      address: "456 High St, Kandy",
      nic: "983746528V",
      phonenumber: "0776666666",
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
                dataSource={data}
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
              {data.map((record) => (
                <div
                  key={record.key}
                  className="bg-white shadow rounded-lg p-4 border border-gray-300"
                >
                  <p>
                    <span className="font-medium text-gray-700">Membership No:</span>{" "}
                    {record.membershipNo}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Registered Date:</span>{" "}
                    {record.date}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Name:</span>{" "}
                    {record.name}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Address:</span>{" "}
                    {record.address}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">NIC No:</span>{" "}
                    {record.nic}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Phone Number:</span>{" "}
                    {record.phonenumber}
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
