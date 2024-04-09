/* eslint-disable react/prop-types */
import { Modal, Form, Input, Select, Space, Avatar, Tag } from 'antd';
import { useTodoContext } from '../context/TodoContext';
import { ACTION_UPDATED, TYPE_CARD } from '../const/logs';

function ModalEditCard({ card, visible, onClose }) {
  const { users, tags, setTodos, handleAddLog } = useTodoContext();
  const [form] = Form.useForm();

  const usersList = users.map((user) => ({
    value: user.id.value,
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

  const handleEditSubmit = (values) => {
    const updatedCard = {
      ...card,
      title: values.title,
      description: values.description,
      tags: values.tags,
      assignee: values.assignee,
      author: values.author
    };

    setTodos((prevState) => ({
      ...prevState,
      cards: {
        ...prevState.cards,
        [card.id]: updatedCard,
      },
    }));

    handleAddLog(TYPE_CARD, updatedCard, ACTION_UPDATED)
    onClose();
  };

  return (
    <Modal
      title="Edit Card"
      open={visible}
      onCancel={onClose}
      onOk={form.submit}
    >
      <Form
        form={form}
        onFinish={handleEditSubmit}
        initialValues={{
          title: card.title,
          description: card.description,
          tags: card.tags,
          assignee: card.assignee,
          author: card.author,
        }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              required: true,
              message: "Field is required",
            },
          ]}
        >
          <Input maxLength={20} />
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
          <Input.TextArea rows={4} maxLength={2000} />
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
              width: "100%",
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
              message: "Field is required",
            },
          ]}
        >
          <Select
            size="middle"
            placeholder="Select an assignee"
            style={{
              width: "100%",
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
              message: "Field is required",
            },
          ]}
        >
          <Select
            size="middle"
            placeholder="Select an author"
            style={{
              width: "100%",
            }}
            options={usersList}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ModalEditCard;
