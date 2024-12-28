import React from "react";
import { Modal, Form, Input, Button } from "antd";

const RegisterMemberModal = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    console.log("Form Values:", values);
    form.resetFields();
    onSubmit(values);
  };

  return (
    <Modal
      title={
        <div className="text-xl md:text-2xl font-bold text-gray-900 text-center">
          Register New Member
        </div>
      }
      visible={visible}
      onCancel={onCancel}
      footer={null}
      centered
      bodyStyle={{
        borderRadius: "12px",
        padding: "16px",
        maxHeight: "80vh",
        overflowY: "auto",
      }}
     
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="space-y-4"
      >
        
        <div className="flex justify-center mb-4 md:mb-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
            alt="Generated Member ID"
            className="w-24 h-24 md:w-32 md:h-32 rounded-md shadow-md border border-black"
          />
        </div>

        {/* Membership Number */}
        <Form.Item
          name="membershipNo"
          label={
            <span className="font-medium text-black text-sm md:text-base">
              Membership Number
            </span>
          }
          rules={[
            { required: true, message: "Please enter the membership number!" },
          ]}
        >
          <Input
            placeholder="Enter Membership Number"
            className="rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </Form.Item>

        {/* Registered Date */}
        <Form.Item
          name="date" 
          label={
            <span className="font-medium text-black text-sm md:text-base">
              Registered Date
            </span>
          }
          rules={[
            { required: true, message: "Please enter the registered date!" },
          ]}
        >
          <Input
            type="date"
            className="rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </Form.Item>

        {/* Name */}
        <Form.Item
          name="name"
          label={
            <span className="font-medium text-black text-sm md:text-base">
              Name
            </span>
          }
          rules={[{ required: true, message: "Please enter the name!" }]}
        >
          <Input
            placeholder="Enter Full Name"
            className="rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </Form.Item>

        {/* Address */}
        <Form.Item
          name="address"
          label={
            <span className="font-medium text-black text-sm md:text-base">
              Address
            </span>
          }
          rules={[{ required: true, message: "Please enter the address!" }]}
        >
          <Input
            placeholder="Enter Address"
            className="rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </Form.Item>

        {/* NIC No */}
        <Form.Item
          name="nic"
          label={
            <span className="font-medium text-black text-sm md:text-base">
              NIC Number
            </span>
          }
          rules={[{ required: true, message: "Please enter the NIC number!" }]}
        >
          <Input
            placeholder="Enter NIC Number"
            className="rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </Form.Item>

        {/* Phone Number */}
        <Form.Item
          name="phoneNumber"
          label={
            <span className="font-medium text-black text-sm md:text-base">
              Phone Number
            </span>
          }
          rules={[
            { required: true, message: "Please enter the phone number!" },
            {
              pattern: /^[0-9]{10}$/,
              message: "Please enter a valid 10-digit phone number!",
            },
          ]}
        >
          <Input
            placeholder="Enter Phone Number"
            className="rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm md:text-lg"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RegisterMemberModal;
