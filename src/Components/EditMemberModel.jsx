import React, { useState } from "react";
import { Modal, Form, Input, Button } from "antd";

const EditMemberModal = ({ visible, onCancel, onSubmit, initialData }) => {
  const [form] = Form.useForm();
  const [QRimage,setQRimage] = useState('');

  React.useEffect(() => {
    if (initialData) {
      console.log("Initial data",initialData);
      setQRimage(initialData.qrCodeUrl)
      form.setFieldsValue({
        membershipNo: initialData.membershipNo,
        date: initialData.date,
        name: initialData.name,
        address: initialData.address,
        nicNo: initialData.nicNo,
        contactNo: initialData.contactNo,
      });
    }
  }, [initialData, form]);

  const handleFinish = (values) => {
    onSubmit(values); 
  };

  return (
    <Modal
      title={
        <div className="text-xl md:text-2xl font-bold text-gray-900 text-center">
          Edit Member
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
      style={{
        borderRadius: "12px",
        maxWidth: "95%",
        minWidth: "30%",
        maxHeight: "90%",
        padding: 0,
      }}
      className="md:max-w-lg md:min-w-[400px] mx-auto"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="space-y-4"
      >
        {/* Image */}
        <div className="flex justify-center mb-4 md:mb-6">
          <img
            src={QRimage}
            className="w-24 h-24 md:w-32 md:h-32 rounded-md shadow-md border border-black"
          />
        </div>

        {/* Membership Number */}
        <Form.Item
          name="membershipNo"
          label="Membership Number"
          rules={[
            { required: true, message: "Please enter the membership number!" },
          ]}
        >
          <Input placeholder="Enter Membership Number" />
        </Form.Item>

        {/* Registered Date */}
        <Form.Item
          name="date"
          label="Registered Date"
          rules={[
            { required: true, message: "Please enter the registered date!" },
          ]}
        >
          <Input type="date" />
        </Form.Item>

        {/* Name */}
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter the Name!" }]}
        >
          <Input type="name" />
        </Form.Item>

        {/* Address */}
        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: "Please enter the address!" }]}
        >
          <Input placeholder="Enter Address" />
        </Form.Item>

        {/* NIC No */}
        <Form.Item
          name="nicNo"
          label="NIC Number"
          rules={[{ required: true, message: "Please enter the NIC number!" }]}
        >
          <Input placeholder="Enter NIC Number" />
        </Form.Item>

        {/* Phone Number */}
        <Form.Item
          name="contactNo"
          label="Phone Number"
          rules={[
            { required: true, message: "Please enter the phone number!" },
            {
              pattern: /^[0-9]{10}$/,
              message: "Please enter a valid 10-digit phone number!",
            },
          ]}
        >
          <Input placeholder="Enter Phone Number" />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditMemberModal;
