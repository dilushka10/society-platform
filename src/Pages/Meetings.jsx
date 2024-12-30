import React, { useState } from "react";
import {
  Button,
  Dropdown,
  Menu,
  message,
  Card,
  Form,
  Modal,
  Input,
} from "antd";
import {
  PlusOutlined,
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  StopOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import Navbar from "../Components/Navbar";
import CreateMeetingModel from "../Components/CreateMeetingModel";
import MeetingCard from "../Components/Meetings/MeetingCard";

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
      status: "Pending",
    },
    {
      id: "C002",
      date: "2024-12-27",
      name: "Business Strategies",
      purpose: "Plan for Q1 strategies",
      startTime: "2:00 PM",
      endTime: "4:00 PM",
      notice: "Team leads must attend",
      status: "Today",
    },
    {
      id: "C003",
      date: "2024-12-28",
      name: "Marketing Campaign",
      purpose: "Discuss new marketing campaign",
      startTime: "11:00 AM",
      endTime: "1:00 PM",
      notice: "Bring your laptops",
      status: "Started",
      participants: 20,
      absents: 3,
    },
    {
      id: "C004",
      date: "2024-12-29",
      name: "Product Launch",
      purpose: "Plan for upcoming product launch",
      startTime: "3:00 PM",
      endTime: "5:00 PM",
      notice: "Prepare presentation",
      status: "Ended",
      participants: 15,
      absents: 5,
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPostponeModalVisible, setIsPostponeModalVisible] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [editForm] = Form.useForm();

  // Show Modal
  const showModal = () => setIsModalVisible(true);

  // Hide Modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Show Modal for Edit
  const showEditModal = (meeting) => {
    setEditingMeeting(meeting);
    editForm.setFieldsValue({
      date: meeting.date,
      name: meeting.name,
      purpose: meeting.purpose,
      notice: meeting.notice,
      startTime: meeting.startTime,
      endTime: meeting.endTime,
    });
    setIsEditModalVisible(true);
  };

  // Show Modal for Postpone
  const showPostponeModal = (meeting) => {
    setEditingMeeting(meeting);
    editForm.setFieldsValue({
      date: meeting.date,
      startTime: meeting.startTime,
      endTime: meeting.endTime,
    });
    setIsPostponeModalVisible(true);
  };

  // Hide Modal for Edit
  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setIsPostponeModalVisible(false);
    editForm.resetFields();
    setEditingMeeting(null);
  };

  // Handle New Meeting Creation
  const handleCreateMeeting = (values) => {
    const newMeeting = {
      id: `C${String(meetings.length + 1).padStart(3, "0")}`,
      ...values,
      status: "Pending",
    };
    setMeetings([...meetings, newMeeting]);
    message.success("Meeting created successfully!");
    setIsModalVisible(false);
    form.resetFields();
  };

  // Handle Update Meeting
  const handleUpdateMeeting = (values) => {
    setMeetings((prevMeetings) =>
      prevMeetings.map((meeting) =>
        meeting.id === editingMeeting.id ? { ...meeting, ...values } : meeting
      )
    );
    message.success("Meeting updated successfully!");
    handleEditCancel();
  };

  // Handle Start Meeting
  const handleStartMeeting = (id) => {
    const updatedMeetings = meetings.map((meeting) =>
      meeting.id === id ? { ...meeting, status: "Started" } : meeting
    );
    setMeetings(updatedMeetings);
    message.success("Meeting started successfully!");
  };

  // Delete a Meeting
  const handleDeleteMeeting = (id) => {
    setMeetings(meetings.filter((meeting) => meeting.id !== id));
    message.success("Meeting deleted successfully!");
  };

  // Action Menu for Different Statuses
  const actionMenu = (meeting) => {
    const { id, status } = meeting;
    if (status === "Pending") {
      return (
        <Menu>
          <Menu.Item
            key="edit"
            icon={<EditOutlined />}
            onClick={() => showEditModal(meeting)}
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
    } else if (status === "Ended") {
      return (
        <Menu>
          <Menu.Item
            key="view"
            icon={<EyeOutlined />}
            onClick={() => message.info("View functionality coming soon!")}
          >
            View
          </Menu.Item>
        </Menu>
      );
    } else if (status === "Started") {
      return (
        <Menu>
          <Menu.Item
            key="markAttendance"
            icon={<CheckCircleOutlined />}
            onClick={() =>
              message.info("Mark Attendance functionality coming soon!")
            }
          >
            Mark Attendance
          </Menu.Item>
          <Menu.Item
            key="endMeeting"
            icon={<StopOutlined />}
            onClick={() =>
              message.info("End Meeting functionality coming soon!")
            }
          >
            End Meeting
          </Menu.Item>
        </Menu>
      );
    } else if (status === "Today") {
      return (
        <Menu>
          <Menu.Item
            key="startMeeting"
            icon={<PlayCircleOutlined />}
            onClick={() => message.info("Start functionality coming soon!")}
          >
            Start Meeting
          </Menu.Item>
          <Menu.Item
            key="postpone"
            icon={<ClockCircleOutlined />}
            onClick={() => showPostponeModal(meeting)}
          >
            Postpone
          </Menu.Item>
        </Menu>
      );
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F9FF] font-custom">
      <Navbar />
      <div className="flex-grow ">
        {/* Header */}
        <header className="bg-white shadow py-4 px-8 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-xl text-gray-800">Meetings Management</h1>
          </div>
        </header>

        <div className="flex-grow px-4 pt-8 bg-red">
          <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
            <div className="flex justify-between items-center">
              <Input.Search
                placeholder="Search Meetings"
                style={{ width: "300px" }}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showModal}
                className="bg-[#0D47A1] hover:bg-[#1565C0] border-none text-white"
              >
                Create New Meeting
              </Button>
            </div>
          </div>
        </div>

        {/* Card Grid for All Screen Sizes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4  p-4">
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} onEdit={showEditModal} onDelete={handleDeleteMeeting} onStartMeeting={handleStartMeeting} onPostpone={showPostponeModal} />

          ))}
        </div>

        {/* Edit Meeting Modal */}
        <Modal
          className="text-center"
          title="Edit Meeting"
          visible={isEditModalVisible}
          onCancel={handleEditCancel}
          footer={null}
          bodyStyle={{
            borderRadius: "12px",
            padding: "16px",
            maxHeight: "70vh",
            overflowY: "auto",
          }}
        >
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleUpdateMeeting}
          >
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Please select the date!" }]}
            >
              <Input type="date" />
            </Form.Item>

            <Form.Item
              name="name"
              label="Meeting Name"
              rules={[{ required: true, message: "Please select the date!" }]}
            >
              <Input placeholder="Enter Meeting Name" />
            </Form.Item>

            <Form.Item
              name="purpose"
              label="Purpose"
              rules={[{ required: true, message: "Please select the date!" }]}
            >
              <Input placeholder="Enter Purpose" />
            </Form.Item>

            <Form.Item
              name="startTime"
              label="Start Time"
              rules={[
                { required: true, message: "Please enter the start time!" },
              ]}
            >
              <Input type="time" />
            </Form.Item>
            <Form.Item
              name="endTime"
              label="End Time"
              rules={[{ message: "Please enter the end time!" }]}
            >
              <Input type="time" />
            </Form.Item>

            <Form.Item
              name="notice"
              label="Notice"
              rules={[{ message: "Please Enter Notice!" }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Enter any special notices"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                Update
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Create Meeting Modal */}
        <CreateMeetingModel
          isModalVisible={isModalVisible}
          handleCancel={handleCancel}
          handleCreateMeeting={handleCreateMeeting}
          form={form}
        />

        {/* Postpone Modal */}
        <Modal
          className="text-center"
          title="Postpone Meeting"
          visible={isPostponeModalVisible}
          onCancel={handleEditCancel}
          footer={null}
          bodyStyle={{
            borderRadius: "12px",
            padding: "16px",
            maxHeight: "70vh",
            overflowY: "auto",
          }}
        >
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleUpdateMeeting}
          >
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Please select the date!" }]}
            >
              <Input type="date" />
            </Form.Item>





            <Form.Item
              name="startTime"
              label="Start Time"
              rules={[
                { required: true, message: "Please enter the start time!" },
              ]}
            >
              <Input type="time" />
            </Form.Item>
            <Form.Item
              name="endTime"
              label="End Time"
              rules={[{ message: "Please enter the end time!" }]}
            >
              <Input type="time" />
            </Form.Item>


            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                Update
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default Meetings;
