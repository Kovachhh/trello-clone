/* eslint-disable react/prop-types */

import PropTypes from 'prop-types';
import { EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import { Avatar, Card, Tooltip } from 'antd';
import { Draggable } from 'react-beautiful-dnd';
import { useTodoContext } from '../context/TodoContext';
import ModalCardDetail from './ModalCardDetail';
import { useState } from 'react';
import ModalEditCard from './ModalEditCard';
import { getUserById } from '../helpers/getUserById';

const { Meta } = Card;

function CardItem({ card, index, listId }) {
  const { users, handleDeleteCard } = useTodoContext();

  const assignee = getUserById(users, card.assignee);

  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const [editModalVisible, setEditModalVisible] = useState(false);

  const openEditModal = () => {
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
  };

  const _handleDeleteCard = () => {
    handleDeleteCard(listId, card.id);
  };

  const openDetailModal = () => {
    setDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setDetailModalVisible(false);
  };

  return (
    <>
      <Draggable draggableId={String(card.id)} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className='card'
          >
            <Card
              actions={[
                <Tooltip placement="top" title='View' key='view'>
                  <FileTextOutlined key="view" onClick={openDetailModal} />
                </Tooltip>,

                <Tooltip placement="top" title='Edit' key='edit'>
                  <EditOutlined key="edit" onClick={openEditModal} />
                </Tooltip>,

                <Tooltip placement="top" title='Delete' key='delete'>
                  <DeleteOutlined key="delete" onClick={_handleDeleteCard} />
                </Tooltip>,
              ]}
            >
              <Meta
                title={card.title}
                description={card.expiration}
              />
              <div className='avatarGroup'>
                <Avatar.Group
                  maxCount={2}
                  maxPopoverTrigger="click"
                  size="medium"
                  maxStyle={{
                    color: '#f56a00',
                    backgroundColor: '#fde3cf',
                    cursor: 'pointer',
                  }}
                >
                  <Tooltip placement="top" title={assignee ? (`${assignee.name.first} ${assignee.name.last}`) : 'Unassigned'}>
                    <Avatar src={assignee ? assignee.picture?.medium : 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Blank_user.svg'}/>
                  </Tooltip>
                </Avatar.Group>
              </div>
            </Card>
            <ModalCardDetail
              cardId={card.id}
              visible={detailModalVisible}
              onClose={closeDetailModal}
            />
            <ModalEditCard
              card={card}
              visible={editModalVisible}
              onClose={closeEditModal}
            />
          </div>
        )}
      </Draggable>
    </>
  )
}

export default CardItem

CardItem.propTypes = {
  todo: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.description
  })
}