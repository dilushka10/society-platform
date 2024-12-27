import React, { useState, useEffect } from "react";
import { Button, Modal, Steps, Form, Input, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Navbar from "../Components/Navbar";

const { Step } = Steps;

function CreateMeetingModel({isModalVisible,form}) {
  const [meetings, setMeetings] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Show the modal
  const showModal = () => {
    form.resetFields();
    setCurrentStep(0); // Reset to the first step
    setIsModalVisible(true);
  };

  // Hide the modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Handle Next Step
  const handleNext = () => {
    form.validateFields().then(() => {
      setCurrentStep(currentStep + 1);
    });
  };

  // Handle Previous Step
  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  // Submit the form and create the meeting
  const handleCreateMeeting = (values) => {
    const newMeeting = {
      id: `C${String(meetings.length + 1).padStart(3, "0")}`,
      ...values,
      status: "Active",
    };
    setMeetings([...meetings, newMeeting]);
    message.success("Meeting created successfully!");
    handleCancel();
  };

  // Steps Content
  const steps = [
    {
      title: "Basic Info",
      content: (
        <>
          <Form.Item
            name="name"
            label="Meeting Name"
            rules={[{ required: true, message: "Please enter the meeting name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select the date!" }]}
          >
            <Input type="date" />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Details",
      content: (
        <>
          <Form.Item
            name="purpose"
            label="Purpose"
            rules={[{ required: true, message: "Please enter the purpose!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="notice"
            label="Notice"
            rules={[{ required: true, message: "Please enter the notice!" }]}
          >
            <Input />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Timing",
      content: (
        <>
          <Form.Item
            name="startTime"
            label="Start Time"
            rules={[{ required: true, message: "Please enter the start time!" }]}
          >
            <Input type="time" />
          </Form.Item>
          <Form.Item
            name="endTime"
            label="End Time"
            rules={[{ required: true, message: "Please enter the end time!" }]}
          >
            <Input type="time" />
          </Form.Item>
        </>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-[#F5F9FF] font-custom">
      <div className="flex flex-col flex-grow">
        {/* Create Meeting Modal */}
        <Modal
          title="Create New Meeting"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Steps current={currentStep} className="mb-6">
            {steps.map((step, index) => (
              <Step key={index} title={step.title} />
            ))}
          </Steps>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateMeeting}
            initialValues={{}}
          >
            {steps[currentStep].content}
            <div className="flex justify-between mt-6">
              {currentStep > 0 && (
                <Button onClick={handlePrev} className="bg-gray-300">
                  Previous
                </Button>
              )}
              {currentStep < steps.length - 1 && (
                <Button type="primary" onClick={handleNext}>
                  Next
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button type="primary" htmlType="submit">
                  Create Meeting
                </Button>
              )}
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

export default CreateMeetingModel;
