/* eslint-disable react/prop-types */
import { Modal, Form, Input, Select, Space, Avatar, DatePicker, message, Tag } from 'antd';
import dayjs from 'dayjs';

import { useForm } from 'antd/es/form/Form';

const { TextArea } = Input;

// context
import { useTodoContext } from '../context/TodoContext'
import { useState } from 'react';
import { DATE_FORMAT } from '../const/date';

function ModalAddCard() {
  const { todos, users, tags, modalAddCard, setModalAddCard, handleAddTodo } = useTodoContext();
  const [form] = useForm();
  const [expirationDate, setExpirationDate] = useState(null);

  const [messageApi, contextHolder] = message.useMessage();

  const usersList = users.map((user) => ({
    value: user.id.value,
    key: user.id.value,
    label: (
      <>
        <Space direction="vertical" size={16}>
          <Space wrap size={16}>
            <Avatar src={user.picture.medium} />
          </Space>
        </Space>
        <span>{user.name.first} {user.name.last}</span>
      </>
    ),
  }))

  const tagsList = tags.map((tag) => ({
    value: tag,
    key: tag,
    label: tag,
  }))

  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color={value}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{
          marginInlineEnd: 4,
        }}
      >
        {label}
      </Tag>
    );
  };

  const onFinish = (values) => {

    const isExistWithName = Object.values(todos.cards).find(item => item.title === values.title.trim());

    if(isExistWithName) {
      messageApi.open({
        type: "error",
        content: "Todo with that name is exist",
      });

      return;
    }

    form.resetFields();
    handleAddTodo({
      ...values,
      expiration: expirationDate
    });
    _handleClose();
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  function _handleClose() {
    setModalAddCard(prevState => ({
      ...prevState,
      listId: null,
      isOpen: false
    }))
  }

  const changeExpirationHandler = (date, dateString) => {
    setExpirationDate(dateString);
  };

  return (
    <>
      <Modal title="Add Card" open={modalAddCard.isOpen} onOk={form.submit} onCancel={_handleClose}>
        <Form
          name="basic"
          form={form}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            title: '',
            expiration: undefined,
            description: '',
            tags: undefined,
            assignee: undefined,
            author: undefined,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                message: 'Field is required',
              },
            ]}
          >
            <Input placeholder='Enter a title' maxLength={20} />
          </Form.Item>

          <Form.Item
            label="Expiration date"
            name="expiration"
            rules={[
              {
                required: true,
                message: 'Field is required',
              },
            ]}
          >
            <DatePicker placeholder='Choose a date' minDate={dayjs(new Date())} format={DATE_FORMAT} onChange={changeExpirationHandler} value={expirationDate} />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Field is required",
              },
            ]}
          >
            <TextArea rows={4} placeholder='Enter a description' maxLength={2000}/>
          </Form.Item>

          <Form.Item
            name="tags"
            label="Tags"
            rules={[
              {
                required: true,
                message: "Field is required",
              },
            ]}
          >
            <Select
              mode="multiple"
              size="middle"
              placeholder="Select a tag"
              style={{
                width: '100%',
              }}
              options={tagsList}
              tagRender={tagRender}
            />

          </Form.Item>

          <Form.Item
            name="assignee"
            label="Assignee"
            rules={[
              {
                required: true,
                message: 'Field is required',
              },
            ]}
          >
            <Select
              size="middle"
              placeholder="Select an assignee"
              style={{
                width: '100%',
              }}
              options={usersList}
            />

          </Form.Item>

          <Form.Item
            name="author"
            label="Authour"
            rules={[
              {
                required: true,
                message: 'Field is required',
              },
            ]}
          >
            <Select
              size="middle"
              placeholder="Select an author"
              style={{
                width: '100%',
              }}
              options={usersList}
            />

          </Form.Item>

        </Form>
      </Modal >
      {contextHolder}
    </>
  )
}

export default ModalAddCard