import React, { useState, useEffect, useRef } from "react";
import { Dropdown, Menu, Button, Table, Input, Modal } from "antd";
import {
  EllipsisOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Navbar from "../Components/Navber";
import RegisterMemberModal from "../Components/RegisterMemberModal";
import * as htmlToImage from "html-to-image";
import image from'../assets/qr.png'

const Members = () => {
  const data = [
    {
      key: "1",
      membershipNo: "00545",
      date: "2024-12-26",
      name: "John Doe",
      society: "Kaluthara",
      societyregistrationnumber: "SRN0025",
      address: "123 Main St, Colombo",
      nic: "982374567V",
      phonenumber: "0775555555",
    },
    {
      key: "2",
      membershipNo: "00546",
      date: "2024-12-25",
      name: "Jane Doe",
      society: "Gampaha",
      societyregistrationnumber: "SRN0026",
      address: "456 High St, Kandy",
      nic: "983746528V",
      phonenumber: "0776666666",
    },
    {
      key: "3",
      membershipNo: "00547",
      date: "2024-12-24",
      name: "Alex Smith",
      society: "Ragama",
      societyregistrationnumber: "SRN0027",
      address: "789 Park Ave, Galle",
      nic: "976543289V",
      phonenumber: "0777777777",
    },
    {
      key: "4",
      membershipNo: "00548",
      date: "2024-12-23",
      name: "Sara Johnson",
      society: "Colombo",
      societyregistrationnumber: "SRN0028",
      address: "12 Baker St, Jaffna",
      nic: "985467382V",
      phonenumber: "0778888888",
    },
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredData, setFilteredData] = useState(data);
  const [searchText, setSearchText] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isCardModalVisible, setIsCardModalVisible] = useState(false);
  const [membersData, setMembersData] = useState(data);

  const cardRef = useRef();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = (values) => {
    const newMember = {
      key: membersData.length + 1,
      membershipNo: values.membershipNo,
      date: values.registeredDate,
      name: values.name,
      address: values.address,
      nic: values.nic,
      phonenumber: values.phoneNumber,
    };

    console.log("New Member:", newMember);
    setMembersData([...membersData, newMember]);
    setIsModalVisible(false);
  };

  // Open the card modal
  const handleMenuClick = (action, record) => {
    if (action === "Edit") {
      setSelectedRecord(record);
      setIsModalVisible(true);
    } else if (action === "Delete") {
      setMembersData(membersData.filter((member) => member.key !== record.key));
    } else if (action === "View") {
      setSelectedRecord(record);
      setIsCardModalVisible(true);
    }
  };

  // Close the card modal
  const closeModal = () => {
    setIsCardModalVisible(false);
  };

  const handlePrint = () => {
    if (!cardRef.current) return;

    const printableContent = `
      <div class="id-card">
        <div class="id-header">
          <h1>${selectedRecord.name}</h1>
        </div>
        <div class="id-body">
          <div class="qr-code">
            <img
              src="./qr.png"
              alt="QR Code"
            />
          </div>
          <div class="details">
            <p class="society">${selectedRecord.society}</p>
            <p>Reg. No: ${selectedRecord.societyregistrationnumber}</p>
            <p>Membership No: ${selectedRecord.membershipNo}</p>
            <p>Phone: ${selectedRecord.phonenumber}</p>
          </div>
        </div>
      </div>
    `;

    const printStyles = `
      <style>
        @media print {
          * {
            -webkit-print-color-adjust: exact; /* For WebKit browsers */
            color-adjust: exact; /* For modern browsers */
          }
        }
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #ffffff;
          height: 100vh;
        }
        .id-card {
          width: 250px;
          height: 400px;
          background-color: #ffffff;
          border-radius: 8px;
      
          text-align: center;
          overflow: hidden;
          border: 1px solid #e0e0e0;
          padding: 10px;
        }
        .id-header {
          color: black;
          padding: 15px 0;
          font-size: 10px;
          font-weight: bold;
          border-radius: 8px;
        }
        .id-body {
          padding: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }
        .qr-code img {
          width: 120px;
          height: 120px;
          border: 2px solid #ddd;
          padding: 5px;
          border-radius: 5px;
        }
        .details {
          padding: 10px;
          width: 100%;
          text-align: center;
        
        }
        .details p {
          font-size: 16px;
          margin: 4px 0;
          color: #333;
        }
        .details .society {
          font-weight: bold;
          color: #1565c0;
        }
      </style>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Name Tag</title>
            ${printStyles}
          </head>
          <body>
            ${printableContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  };

  const handleDownload = async () => {
    if (cardRef.current) {
      const dataUrl = await htmlToImage.toPng(cardRef.current);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${selectedRecord?.name}_ID_Card.png`;
      link.click();
    }
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

  useEffect(() => {
    filterData();
  }, [searchText]);

  const filterData = () => {
    const filtered = data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.membershipNo.includes(searchText)
    );
    setFilteredData(filtered);
  };

  const clearField = () => {
    setSearchText("");
  };

  return (
    <div className="flex h-screen bg-[#F5F9FF] font-custom">
      <Navbar />
      <div className="flex flex-col flex-grow">
        <header className="bg-white shadow py-4 px-8 border-b border-gray-200">
          <h1 className="text-xl text-gray-800">Members Management</h1>
        </header>
        <div className="flex-grow px-8 pt-8 ">
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
            <div className="flex flex-row">
              <Input
                placeholder="Search by Name or ID"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full mb-4"
              />
              <Button className="ml-5" onClick={clearField}>
                Clear
              </Button>
            </div>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table
                columns={columns}
                dataSource={membersData}
                pagination={{ pageSize: 5 }}
                bordered
                rowClassName={(record, index) =>
                  index % 2 === 0 ? "bg-[#F5F9FF]" : "bg-white"
                }
                className="border border-gray-200"
              />
            </div>

            {/* Mobile Card View */}
            <div className="block md:hidden space-y-4  mb-20">
              {filteredData.map((record) => (
                <div
                  key={record.key}
                  className="bg-white shadow-lg rounded-lg p-4 border border-gray-300"
                >
                  <div className="flex justify-between items-center  border-b pb-2 mb-4">
                    <h3 className="text-lg font-semibold">{record.name}</h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg">
                      #{record.membershipNo}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Registered Date: </span>
                      {record.date}
                    </p>
                    <p>
                      <span className="font-medium">Address: </span>
                      {record.address}
                    </p>
                    <p>
                      <span className="font-medium">NIC No: </span>
                      {record.nic}
                    </p>
                    <p>
                      <span className="font-medium">Phone: </span>
                      {record.phonenumber}
                    </p>
                  </div>
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
        </div>
      </div>
      {/* Card Modal */}
      <Modal
  visible={isCardModalVisible}
  onCancel={closeModal}
  footer={null}
  centered
>
  {selectedRecord && (
    <div
      id="printableArea"
      ref={cardRef}
      className="relative w-64 h-96 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg shadow-xl border border-purple-500 p-4 mx-auto flex flex-col items-center overflow-hidden"
    >





<div className="relative w-full h-screen bg-gray-900">
  {/* Background Layer */}
  <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900"></div>
</div>











      {/* Header */}
      <div className="relative text-xl font-bold uppercase mb-2 mt-5 tracking-wide text-center z-10">
        {selectedRecord.name}
      </div>

      {/* Sub-header */}
      <div className="relative text-sm italic mb-4 z-10">
        Member of {selectedRecord.society}
      </div>

      {/* Body */}
      <div className="relative flex flex-col items-center z-10">
        {/* QR Code */}
        <div className="w-32 h-32 border-2 border-white rounded-md p-2 mt-4 mb-6 bg-white">
          <img
            src={image} // Replace with the actual QR image source
            alt="QR Code"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Details */}
        <div className="text-center text-sm">
          <p className="font-semibold text-yellow-300 mb-1">
            Society: {selectedRecord.society}
          </p>
          <p className="text-gray-100 mb-1">
            Reg. No: {selectedRecord.societyregistrationnumber}
          </p>
          <p className="text-gray-100 mb-1">
            Membership No: {selectedRecord.membershipNo}
          </p>
          <p className="text-gray-100">
            Phone: {selectedRecord.phonenumber}
          </p>
        </div>
      </div>
    </div>
  )}

  {/* Action Buttons */}
  <div className="flex justify-between mt-4">
    <Button
      onClick={handlePrint}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Print
    </Button>
    <Button
      onClick={handleDownload}
      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
    >
      Download
    </Button>
  </div>
</Modal>





      <RegisterMemberModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Members;
