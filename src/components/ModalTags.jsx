import { Button, Modal, Typography, message } from 'antd';
import { useTodoContext } from '../context/TodoContext';
import { DeleteOutlined, PlusOutlined, TagOutlined } from '@ant-design/icons';
import { ACTION_ADDED, TYPE_TAG } from '../const/logs';

const { Text } = Typography;

// eslint-disable-next-line react/prop-types
function ModalTags({ visible, onClose }) {
  const { tags, setTodos, handleDeleteTag, handleAddLog } = useTodoContext();

  const [messageApi, contextHolder] = message.useMessage();

  function handleAddTag() {

    const newTagTitle = window.prompt("Enter a title of new tag:");

    if (newTagTitle && newTagTitle.trim() !== "") {
      setTodos((prevState) => ({
        ...prevState,
        tags: [...prevState.tags, newTagTitle]
      }));

      handleAddLog(TYPE_TAG, newTagTitle, ACTION_ADDED);
    }
  }

  const deleteTagHandler = (item) => {
    if (tags.length > 2) {
        handleDeleteTag(item);
    } else {
        messageApi.open({
            type: "error",
            content: "Minimum 2 tags should exist",
          });
    }
  }
  

  return (
    <Modal title="Tags" open={visible} onCancel={onClose} footer={null}>
      {tags.map((item) => (
        <div key={item} style={{ display: "flex", marginBottom: "10px" }}>
          <TagOutlined style={{ fontSize: "16px", marginRight: "10px" }} />
          <div style={{ marginLeft: "30px" }}>
          <Button onClick={() => deleteTagHandler(item)} style={{ marginRight: "5px" }} icon={<DeleteOutlined />} />
            <Text>{item}</Text>
            <br />
          </div>
        </div>
      ))}
      {tags.length <= 10 && (<Button onClick={handleAddTag} icon={<PlusOutlined />}>
        Add another tag
      </Button>)}
      {contextHolder}
    </Modal>
  );
}

export default ModalTags;
