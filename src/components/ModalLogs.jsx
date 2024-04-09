import { Modal, Typography } from 'antd';
import { useTodoContext } from '../context/TodoContext';
import { FileTextTwoTone } from '@ant-design/icons';

const { Text } = Typography;

// eslint-disable-next-line react/prop-types
function ModalLogs({ visible, onClose }) {
  const { logs } = useTodoContext();

  return (
    <Modal title="Logs" open={visible} onCancel={onClose} footer={null}>
      {logs.map((item) => (
        <div key={item} style={{ display: 'flex', marginBottom: '5px'}}>
          <FileTextTwoTone style={{ fontSize: "16px", marginRight: "10px" }} />
          <div style={{ marginLeft: "30px" }}>
              <Text>{item}</Text>
            <br />
          </div>
        </div>
      ))}
    </Modal>
  );
}

export default ModalLogs;
