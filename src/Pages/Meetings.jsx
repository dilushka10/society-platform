import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Input,
  Form,
  Card,
  Dropdown,
  Menu,
  message,
  Table,
} from "antd";
import {
  PlusOutlined,
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Navbar from "../Components/Navbar";
import CreateMeetingModel from "../Components/CreateMeetingModel";

function Meetings() {
  const [meetings, setMeetings] = useState([
    {
      id: "C001",
      date: "2024-12-26",
      name: "Tech Innovations",
      purpose: "Discuss latest tech trends",
      startTime: "10:00 AM",
      endTime: "12:00 PM",
      notice: "Please bring your ID card",
      status: "Active",
    },
    {
      id: "C002",
      date: "2024-12-27",
      name: "Business Strategies",
      purpose: "Plan for Q1 strategies",
      startTime: "2:00 PM",
      endTime: "4:00 PM",
      notice: "Team leads must attend",
      status: "Scheduled",
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size for responsive design
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Show Modal
  const showModal = () => setIsModalVisible(true);

  // Hide Modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Handle New Meeting Creation
  const handleCreateMeeting = (values) => {
    const newMeeting = {
      id: `C${String(meetings.length + 1).padStart(3, "0")}`,
      ...values,
      status: "Active", // Default status for new meetings
    };
    setMeetings([...meetings, newMeeting]);
    message.success("Meeting created successfully!");
    setIsModalVisible(false);
    form.resetFields();
  };

  // Delete a Meeting
  const handleDeleteMeeting = (id) => {
    setMeetings(meetings.filter((meeting) => meeting.id !== id));
    message.success("Meeting deleted successfully!");
  };

  // Action Menu for Edit/Delete
  const actionMenu = (id) => (
    <Menu>
      <Menu.Item
        key="edit"
        icon={<EditOutlined />}
        onClick={() => message.info("Edit functionality coming soon!")}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined />}
        danger
        onClick={() => handleDeleteMeeting(id)}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  // Table Columns for Desktop View
  const columns = [
    {
      title: "Meeting ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Purpose",
      dataIndex: "purpose",
      key: "purpose",
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "Notice",
      dataIndex: "notice",
      key: "notice",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`font-semibold ${
            status === "Active" ? "text-green-500" : "text-yellow-500"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Dropdown overlay={actionMenu(record.id)} trigger={["click"]}>
          <Button shape="circle" icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-[#F5F9FF] font-custom">
      <Navbar />
      <div className="flex flex-col flex-grow">
        {/* Header */}
        <header className="bg-white shadow py-4 px-8 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-xl text-gray-800">Meetings</h1>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showModal}
              className="bg-[#0D47A1] hover:bg-[#1565C0] border-none text-white"
            >
              Create New Meeting
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="px-8 pt-8">
          {/* Desktop Table View */}
          {!isMobile && (
            <Table
              columns={columns}
              dataSource={meetings}
              rowKey="id"
              bordered
              pagination={{ pageSize: 5 }}
            />
          )}

          {/* Mobile Card View */}
          {isMobile && (
            <div className="space-y-4">
              {meetings.map((meeting) => (
                <Card
                  key={meeting.id}
                  title={`${meeting.name} (${meeting.id})`}
                  extra={
                    <Dropdown
                      overlay={actionMenu(meeting.id)}
                      trigger={["click"]}
                    >
                      <Button shape="circle" icon={<EllipsisOutlined />} />
                    </Dropdown>
                  }
                  className="shadow-md border border-gray-200"
                >
                  <p>
                    <strong>Date:</strong> {meeting.date}
                  </p>
                  <p>
                    <strong>Purpose:</strong> {meeting.purpose}
                  </p>
                  <p>
                    <strong>Start Time:</strong> {meeting.startTime}
                  </p>
                  <p>
                    <strong>End Time:</strong> {meeting.endTime}
                  </p>
                  <p>
                    <strong>Notice:</strong> {meeting.notice}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`font-semibold ${
                        meeting.status === "Active"
                          ? "text-green-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {meeting.status}
                    </span>
                  </p>
                </Card>
              ))}
            </div>
          )}

          {/* Create Meeting Modal */}
          <CreateMeetingModel
            isModalVisible={isModalVisible}
            handleCancel={handleCancel}
            handleCreateMeeting={handleCreateMeeting}
            form={form}
          />
        </div>
      </div>
    </div>
  );
}

export default Meetings;
