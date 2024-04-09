/* eslint-disable react/prop-types */
import { Card, Button, Tooltip, Dropdown, message } from "antd";
import { PlusOutlined, ToolOutlined } from "@ant-design/icons";
import { Draggable, Droppable } from "react-beautiful-dnd";

// compoents
import CardItem from "./CardItem";
import ModalEditList from "./ModalEditList";
import { useState } from "react";
import { useTodoContext } from "../context/TodoContext";

function TrelloList({
  index,
  listId,
  title,
  cards,
  setModalAddCard,
  handleDeleteList,
}) {
  const { todos } = useTodoContext();

  const list = todos.lists[listId];
  const [messageApi, contextHolder] = message.useMessage();
  const [editModalVisible, setEditModalVisible] = useState(false);

  const openEditModal = () => {
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
  };

  function _handleOpenModalAddCard() {
    setModalAddCard((prevState) => ({
      ...prevState,
      listId,
      isOpen: true,
    }));
  }

  function _handleDeleteList() {
    if (!list.cards.length) {
      handleDeleteList(listId);
    } else {
      messageApi.open({
        type: "error",
        content: "Column should not contain todos",
      });
    }
  }

  const contextMenu = [
    {
      key: "1",
      label: <a onClick={openEditModal}>Edit</a>,
    },
    {
      key: "2",
      label: <a onClick={_handleDeleteList}>Delete</a>,
    },
  ];

  return (
    <>
      <Draggable draggableId={String(listId)} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="todoList"
          >
            <Droppable droppableId={String(listId)} type="CARD">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <Card
                    className="cardList"
                    title={title}
                    headStyle={{ background: list.color, color: "white" }}
                    extra={
                      <>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <Tooltip placement="top" title="Add a task">
                            <Button
                              shape="circle"
                              icon={<PlusOutlined />}
                              onClick={_handleOpenModalAddCard}
                            />
                          </Tooltip>
                          <Tooltip placement="top" title="Context menu">
                            <Dropdown
                              menu={{
                                items: contextMenu,
                              }}
                              placement="bottom"
                              arrow={{
                                pointAtCenter: true,
                              }}
                            >
                              <Button shape="circle" icon={<ToolOutlined />} />
                            </Dropdown>
                          </Tooltip>
                        </div>
                      </>
                    }
                    style={{
                      width: 300,
                    }}
                  >
                    {cards.map((card, cardIndex) => {
                      return (
                        <CardItem
                          key={card.id}
                          card={card}
                          index={cardIndex}
                          listId={listId}
                        />
                      );
                    })}

                    {provided.placeholder}
                  </Card>
                  <ModalEditList
                    list={list}
                    visible={editModalVisible}
                    onClose={closeEditModal}
                  />
                </div>
              )}
            </Droppable>
          </div>
        )}
      </Draggable>
      {contextHolder}
    </>
  );
}

export default TrelloList;
