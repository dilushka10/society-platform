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
import Cardbg from "../assets/cardbg.png";

const Members = () => {
  const data = [
    {
      key: "1",
      membershipNo: "SRC0012/23/123",
      date: "2024-12-26",
      name: "T.W.M. Janith Wijethunga",
      society: "Kaluthara1 dead Society",
      societyregistrationnumber: "SRN00251",
      address: "123 Main St, Colombo1",
      nic: "982374567V",
      phonenumber: "0775458951",
    },
    {
      key: "2",
      membershipNo: "005462",
      date: "2024-12-25",
      name: "Jane Doe22",
      society: "Gampaha2",
      societyregistrationnumber: "SRN00262",
      address: "456 High St, Kandy2",
      nic: "983746528V2",
      phonenumber: "0776666662",
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
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);

  const cardRef = useRef();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleEditSubmit = (updatedValues) => {
    setMembersData((prevData) =>
      prevData.map((member) =>
        member.key === selectedRecord.key
          ? {
              ...member,
              membershipNo: updatedValues.membershipNo,
              date: updatedValues.registeredDate,
              name: updatedValues.name,
              address: updatedValues.address,
              nic: updatedValues.nic,
              phonenumber: updatedValues.phoneNumber,
            }
          : member
      )
    );
    setIsEditModalVisible(false);
    setSelectedRecord(null);
    message.success("Member details updated successfully!", 3);
  };

  const handleSubmit = (values) => {
    const newMember = {
      key: membersData.length + 1,
      membershipNo: values.membershipNo,
      date: values.date,
      name: values.name,
      address: values.address,
      nic: values.nic,
      phonenumber: values.phoneNumber,
    };

    console.log("New Member:", newMember);
    setMembersData([...membersData, newMember]);
    setIsModalVisible(false);
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
      setIsDeleteModalVisible(true);
    }
  };

  const handleDeleteMember = () => {
    setMembersData((prevData) =>
      prevData.filter((member) => member.key !== deleteRecord.key)
    );
    message.success("Member deleted successfully!");
    setIsDeleteModalVisible(false);
    setDeleteRecord(null);
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
  }, [searchText, membersData]);

  const filterData = () => {
    const filtered = membersData.filter(
      (item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.membershipNo.includes(searchText)
    );
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
        <header className="bg-white shadow py-4 px-8 border-b border-gray-200 flex  justify-between items-center">
          <h1 className="text-xl text-gray-800">Members Management</h1>
          <Button
            type="primary"
            onClick={showModal}
            icon={<PlusOutlined />}
            className="bg-[#0D47A1] hover:bg-[#1565C0] border-none text-white"
          >
            Register New Member
          </Button>
        </header>
        <div className="flex-grow px-8 pt-8 ">
          <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-700">
                Members List
              </h2>
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
            className="relative w-80 bg-white shadow-xl rounded-lg mx-auto p-6 overflow-hidden flex flex-col items-center"
          >
            {/* Background Layer */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src={Cardbg}
                alt="Card Background"
                className="w-full h-full object-fill rounded-lg "
              />
            </div>

            {/* Header */}
            <div className="relative text-3xl font-bold uppercase text-center mt-4 tracking-widest text-white z-10">
              {selectedRecord.name}
            </div>

            {/* Sub-header */}
            <div className="relative text-sm italic text-white mb-6 text-center z-10">
              Member of {selectedRecord.society}
            </div>

            {/* QR Code */}
            <div className="relative w-40 h-40 border-4 border-gray-200 rounded-lg p-2 mb-6 bg-white shadow-lg z-10">
              <img
                src={image}
                alt="QR Code"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Details */}
            <div className="relative text-center text-base z-10 space-y-3">
              <p className="text-black">
                <span className="font-semibold">Reg. No:</span>{" "}
                {selectedRecord.societyregistrationnumber}
              </p>
              <p className="text-black">
                <span className="font-semibold">Membership No:</span>{" "}
                {selectedRecord.membershipNo}
              </p>
              <p className="text-black">
                <span className="font-semibold">Phone:</span>{" "}
                {selectedRecord.phonenumber}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex  mt-6 space-x-4">
          <Button
            onClick={handleDownloadPDF}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg"
          >
            Download PDF
          </Button>
          <Button
            onClick={handleShare}
            className="flex-1 bg-blue-800 hover:bg-blue-700 text-white font-bold  rounded-lg"
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
