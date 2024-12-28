import React from "react";
import { Modal, Form, Input, Button } from "antd";

const CreateMeetingModal = ({
  isModalVisible,
  handleCancel,
  handleCreateMeeting,
  form
}) => {
  return (
    <Modal
      title="Create New Meeting"
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleCreateMeeting}
      >
        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: "Please select the date!" }]}
        >
          <Input type="date" placeholder="Select meeting date" />
        </Form.Item>

        <Form.Item
          name="name"
          label="Meeting Name"
          rules={[{ required: true, message: "Please enter the meeting name!" }]}
        >
          <Input placeholder="Enter meeting name" />
        </Form.Item>

        <Form.Item
          name="purpose"
          label="Purpose"
          rules={[{ required: true, message: "Please enter the purpose!" }]}
        >
          <Input placeholder="Enter purpose of the meeting" />
        </Form.Item>

        <Form.Item
          name="startTime"
          label="Start Time"
          rules={[{ required: true, message: "Please enter the start time!" }]}
        >
          <Input type="time" placeholder="Enter start time" />
        </Form.Item>

        <Form.Item
          name="endTime"
          label="End Time"
          rules={[{  message: "Please enter the end time!" }]}
        >
          <Input type="time" placeholder="Enter end time" />
        </Form.Item>

        <Form.Item
          name="notice"
          label="Notice"
          rules={[{  message: "Please enter a notice!" }]}
        >
          <Input.TextArea rows={4} placeholder="Enter any special notices" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Create Meeting
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateMeetingModal;
