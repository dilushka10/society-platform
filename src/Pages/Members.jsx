import React, { useState, useEffect, useRef } from "react";
import { Dropdown, Menu, Button, Table, Input, Modal, message } from "antd";
import {
  EllipsisOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { jsPDF } from "jspdf";
import Navbar from "../Components/Navbar";
import RegisterMemberModal from "../Components/RegisterMemberModal";
import * as htmlToImage from "html-to-image";
import image from "../assets/qr.png";
import EditMemberModel from "../Components/EditMemberModel";

const baseUrl = import.meta.env.VITE_SERVER_BASE_URL;

const Members = () => {
  // const [data,setData] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isCardModalVisible, setIsCardModalVisible] = useState(false);
  const [membersData, setMembersData] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);

  const cardRef = useRef();

  const soceityId = "123456";

  useEffect(() => {
    const getMembersData = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/api/v1/member/getall/${soceityId}`
        );
        // const response = await fetch(`https://5000-idx-society-platform-1735035301886.cluster-fu5knmr55rd44vy7k7pxk74ams.cloudworkstations.dev/api/v1/member/getall`);
        // console.log('res',response);

        if (response.ok) {
          const data = await response.json();
          console.log("data", data);
          if (data.message === "No members found for this society") {
            message.info("No members found for this society");
          } else {
            setMembersData(data);
            setFilteredData(data);
          }
        } else {
          console.error(`Error: ${response.status}`);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getMembersData();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleEditSubmit = async (updatedValues) => {
    console.log("up val", updatedValues);

    if (!selectedRecord.systemId) {
      console.error("No Members in selected record");
      return;
    }

    const body = {
      membershipNo: updatedValues.membershipNo,
      date: updatedValues.date,
      name: updatedValues.name,
      address: updatedValues.address,
      nicNo: updatedValues.nicNo,
      contactNo: updatedValues.contactNo,
    };

    const memberData = JSON.stringify(body);
    console.log("Payload Sent:", memberData);

    try {
      const response = await fetch(
        `${baseUrl}/api/v1/member/update/${selectedRecord.systemId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: memberData,
        }
      );

      // console.log("Response:", response);

      if (response.ok) {
        setIsEditModalVisible(false);
        setSelectedRecord(null);
        message.success("Member details updated successfully!", 3);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
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

  const handleSubmit = async (values) => {
    const body = {
      membershipNo: values.membershipNo,
      date: values.registeredDate,
      name: values.name,
      address: values.address,
      nicNo: values.nic,
      contactNo: values.phoneNumber,
      societyId: "123456", // Ensure this field exists in your form values or set a default value.
    };

    const memberData = JSON.stringify(body);
    // console.log("Payload Sent:", memberData);

    try {
      const response = await fetch(`${baseUrl}/api/v1/member/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: memberData,
      });

      // console.log("Response:", response);

      if (response.ok) {
        // const data = await response.json();
        // console.log("Server Response:", data);
        setFilteredData((prevData) => [...prevData, body]);
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

  // Open card
  const handleMenuClick = (action, record) => {
    if (action === "View") {
      setSelectedRecord(record);
      setIsCardModalVisible(true);
    }
    if (action === "Edit") {
      setSelectedRecord(record);
      setIsEditModalVisible(true);
    }
    if (action === "Delete") {
      setDeleteRecord(record);
      console.log("delete record", record);
      setIsDeleteModalVisible(true);
    }
  };

  const handleDeleteMember = async () => {
    if (!deleteRecord.systemId) {
      console.error("No Members in selected record");
      return;
    }

    try {
      const response = await fetch(
        `${baseUrl}/api/v1/member/delete/${deleteRecord.systemId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        message.success("Member Deleted Successfully");
        setIsDeleteModalVisible(false);
        setDeleteRecord(null);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
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

  // Close card
  const closeModal = () => {
    setIsCardModalVisible(false);
    setSelectedRecord(null);
  };

  const handleShare = async () => {
    if (!cardRef.current || !selectedRecord) {
      message.error("Card content not found.");
      return;
    }

    try {
      // Convert card to an image
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        pixelRatio: 2,
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [300, 400],
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);

      const pdfBlob = await pdf.output("blob");
      const file = new File([pdfBlob], `${selectedRecord.name}_ID_Card.pdf`, {
        type: "application/pdf",
      });

      // Check if sharing is supported
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${selectedRecord.name}'s ID Card`,
          text: `Here is the ID card for ${selectedRecord.name}.`,
          files: [file],
        });
        message.success("PDF shared successfully.");
      } else {
        message.warning("Web Share API not supported. Downloading the PDF...");
        pdf.save(`${selectedRecord.name}_ID_Card.pdf`);
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
      message.error("Failed to share PDF. Check console for details.");
    }
  };

  const handleDownloadPDF = async () => {
    if (!cardRef.current) {
      message.error("Card content not found.");
      return;
    }

    try {
      // Convert card content to an image
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        pixelRatio: 2, // Increase quality of the image
      });

      // Create a new jsPDF instance
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [300, 400],
      });

      // Get dimensions of the PDF page
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Add image to PDF
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Save the PDF with the member's name
      pdf.save(`${selectedRecord.name}_ID_Card.pdf`);
      message.success("PDF downloaded successfully.");
    } catch (error) {
      console.error("Error generating PDF:", error);
      message.error("Failed to generate PDF. Check console for details.");
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

  useEffect(() => {
    filterData();
  }, [searchText, membersData]);

  const filterData = () => {
    // console.log('search txt ', searchText);
    // console.log('Members data ', membersData);

    const filtered = membersData.filter(
      (item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.membershipNo.includes(searchText)
    );
    console.log("filtered", filtered);
    setFilteredData(filtered);
  };

  const clearField = () => {
    setSearchText("");
    setFilteredData(membersData);
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
                dataSource={filteredData}
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
                      {record.membershipNo}
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
            ref={cardRef}
            className="relative w-64 h-96  text-black rounded-lg shadow-xl border border-purple-500 p-4 mx-auto flex flex-col items-center overflow-hidden"
          >
            {/* Header */}
            <div className="relative text-xl font-bold uppercase mb-2 mt-5 tracking-wide text-center z-10">
              {selectedRecord.name}
            </div>

            {/* Sub-header */}
            <div className="relative text-sm italic  z-10">
              Member of {selectedRecord.society}
            </div>

            {/* Body */}
            <div className="relative flex flex-col items-center z-10">
              {/* QR Code */}
              <div className="w-full h-36 border-2 border-white rounded-md p-2 mt-4  bg-white">
                <img
                  src={
                    selectedRecord.qrCodeUrl ? selectedRecord.qrCodeUrl : image
                  }
                  alt="QR Code"
                  className="w-full h-full object-covered "
                />
              </div>

              {/* Details */}
              <div className="text-center text-sm">
                <p className="font-semibold text-black">
                  Society:{" "}
                  {selectedRecord.society ? selectedRecord.society : "Unknown"}
                </p>
                <p className="text-black">
                  Reg. No: {selectedRecord.societyId}
                </p>
                <p className="text-black">
                  Membership No: {selectedRecord.membershipNo}
                </p>
                <p className="text-black">Phone: {selectedRecord.contactNo}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between mt-4">
          <Button
            onClick={handleDownloadPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Download PDF
          </Button>
          <Button
            onClick={handleShare}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Share
          </Button>
        </div>
      </Modal>

      {/* Edit Member Modal */}
      <EditMemberModel
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onSubmit={handleEditSubmit}
        initialData={selectedRecord}
      />

      <RegisterMemberModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        visible={isDeleteModalVisible}
        footer={null}
        onCancel={() => setIsDeleteModalVisible(false)}
        centered
        width={400}
      >
        <div className="text-center">
          <div className="bg-red-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
            <DeleteOutlined className="text-red-500 text-3xl" />
          </div>
          <h2 className="text-red-500 text-lg font-semibold mt-4">
            Confirm Delete
          </h2>
          <p className="text-gray-600">
            Are you sure you want to delete this member? This action cannot be
            undone.
          </p>
          <div className="flex justify-center mt-4 space-x-4">
            <Button onClick={() => setIsDeleteModalVisible(false)}>
              Cancel
            </Button>
            <Button type="primary" danger onClick={handleDeleteMember}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Members;
