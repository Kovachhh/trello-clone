/* eslint-disable react/prop-types */
import { Modal, Form, Input, ColorPicker } from 'antd';
import { useTodoContext } from '../context/TodoContext';
import { ACTION_UPDATED, TYPE_COLUMN } from '../const/logs';

function ModalEditList({ list, visible, onClose }) {
  const { setTodos, handleAddLog } = useTodoContext();
  const [form] = Form.useForm();

  const handleEditSubmit = (values) => {
    const updatedList = {
      ...list,
      title: values.title,
      color: values.color.toHexString(),
    };

    setTodos((prevState) => ({
      ...prevState,
      lists: {
        ...prevState.lists,
        [list.id]: updatedList,
      },
    }));

    handleAddLog(TYPE_COLUMN, updatedList, ACTION_UPDATED)
    onClose();
  };

  return (
    <Modal
      title="Edit column"
      open={visible}
      onCancel={onClose}
      onOk={form.submit}
    >
      <Form
        form={form}
        onFinish={handleEditSubmit}
        initialValues={{
          title: list.title,
          color: list.color,
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
          label="Color"
          name="color"
          rules={[
            {
              required: true,
              message: "Field is required",
            },
          ]}
        >
          <ColorPicker onChange={console.log} value={list.color}/>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ModalEditList;
