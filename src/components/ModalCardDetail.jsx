import { Modal, Typography } from 'antd';
import { useTodoContext } from '../context/TodoContext';
import { CalendarTwoTone, ContactsTwoTone, FileTextTwoTone, PushpinTwoTone, TagsTwoTone } from '@ant-design/icons';
import { getUserById } from '../helpers/getUserById';


const { Text } = Typography;

// eslint-disable-next-line react/prop-types
function ModalCardDetail({ cardId, visible, onClose }) {
  const { users, todos } = useTodoContext();
  const card = todos.cards[cardId];

  const assignee = getUserById(users, card.assignee);
  const author = getUserById(users, card.author);

  return (
    <Modal
      title={card.title}
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <div className='expiration'>
        <CalendarTwoTone style={{ fontSize: '16px', marginRight: '10px' }} />
        <Text strong >Expiration date:</Text>
        <br />
        <div style={{ marginTop: "5px", marginLeft: "30px" }}>
          <Text >{card.expiration || '-'}</Text>
        </div>
      </div>

      <div className='description'>
        <FileTextTwoTone style={{ fontSize: '16px', marginRight: '10px' }} />
        <Text strong >Description:</Text>
        <br />
        <div style={{ marginTop: "5px", marginLeft: "30px" }}>
          <Text >{card.description || '-'}</Text>
        </div>
      </div>

      <div className='tags' style={{ marginTop: "10px" }}>
        <TagsTwoTone style={{ fontSize: '16px', marginRight: '10px' }} />
        <Text strong >Tags:</Text>
        <br />
        <div style={{ marginTop: "5px", marginLeft: "30px" }}>
          <Text>{card.tags?.join(', ') || '-'}</Text>
        </div>
      </div>

      <div className='assignee' style={{ marginTop: "10px" }}>
        <ContactsTwoTone style={{ fontSize: '16px', marginRight: '10px' }} />
        <Text strong >Assignee:</Text>
        <br />
        <div style={{ marginTop: "5px", marginLeft: "30px" }}>
          <Text>{(assignee ? (`${assignee.name.first} ${assignee.name.last}`) : card.assignee) || '-'}</Text>
        </div>
      </div>

      <div className='author' style={{ marginTop: "10px" }}>
        <PushpinTwoTone style={{ fontSize: '16px', marginRight: '10px' }} />
        <Text strong >Author:</Text>
        <br />
        <div style={{ marginTop: "5px", marginLeft: "30px" }}>
          <Text >{(author ? (`${author.name.first} ${author.name.last}`) : card.author) || '-'}</Text>
        </div>
      </div>

    </Modal>
  );
}

export default ModalCardDetail;
