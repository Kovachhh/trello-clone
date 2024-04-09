import { Button, Dropdown, Select, message } from 'antd';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

// components
import ModalAddCard from './components/ModalAddCard';
import TrelloList from './components/TrelloList';

// context
import { useTodoContext } from './context/TodoContext';
import { useState } from 'react';
import ModalLogs from './components/ModalLogs';
import { ACTION_ADDED, ACTION_DELETED, TYPE_BOARD, TYPE_COLUMN } from './const/logs';
import ModalTags from './components/ModalTags';

export default function App() {
  const { tags, todos, setTodos, onDragEnd, setModalAddCard, handleAddLog } = useTodoContext();

  const boards = Object.values(todos.boards_list).map(item => ({ value: item.id, label: item.title }));

  const [messageApi, contextHolder] = message.useMessage();
  const [currentBoard, setCurrentBoard] = useState(boards[0].value);
  const [currentTag, setCurrentTag] = useState(null);

  const [isTagsVisible, setIsTagsVisible] = useState(false);
  const [isLogsVisible, setIsLogsVisible] = useState(false);

  const openTagsModal = () => {
    setIsTagsVisible(true);
  };

  const closeTagsModal = () => {
    setIsTagsVisible(false);
  };

  const openLogsModal = () => {
    setIsLogsVisible(true);
  };

  const closeLogsModal = () => {
    setIsLogsVisible(false);
  };

  const tagsList = tags.map((tag) => ({
    value: tag,
    key: tag,
    label: tag,
  }))

  const settingsMenu = [
    {
      key: '1',
      label: (
        <a onClick={openTagsModal}>
          Tags
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a onClick={openLogsModal}>
          Logs
        </a>
      ),
    },
  ];


  const getFilteredTodosByBoard = () => {
    const lists = {};
    const columns = Object.values(todos.lists).filter(item => item.board === currentBoard).map(item => item.id);
    const listElements = columns.filter(item => item.board === currentBoard).map(item => item)

    for (const l of listElements) {
      lists[l.id] = l;
    }

    return {
      ...todos,
      lists,
      columns
    }
  }

  async function handleAddList() {
    const newListTitle = window.prompt("Enter a title of new list:");

    const isExistWithName = Object.values(todos.lists).find(item => item.title === newListTitle.trim());

    if(isExistWithName) {
      messageApi.open({
        type: "error",
        content: "Column with that name is exist",
      });

      return;
    }


    if (newListTitle && newListTitle.trim() !== "") {
      const newListId = `list-${Math.random().toString(36).substr(2, 9)}`;

      const newList = {
        id: newListId,
        title: newListTitle,
        board: currentBoard,
        color: '#9097A1',
        cards: [],
      };


      setTodos((prevState) => ({
        ...prevState,
        columns: [...prevState.columns, newListId],
        lists: {
          ...prevState.lists,
          [newListId]: newList,
        },
      }));

      handleAddLog(TYPE_COLUMN, newList, ACTION_ADDED);
    }
  }

  async function handleAddBoard() {

    const newBoardTitle = window.prompt("Enter a title of new board:");

    const isExistWithName = Object.values(todos.boards_list).find(item => item.title === newBoardTitle.trim());

    if(isExistWithName) {
      messageApi.open({
        type: "error",
        content: "Board with that name is exist",
      });

      return;
    }

    if (newBoardTitle && newBoardTitle.trim() !== "") {

      const newBoardId = `board-${Math.random().toString(36).substr(2, 9)}`;

      const newBoard = {
        id: newBoardId,
        title: newBoardTitle,
        columns: [],
      };


      setTodos((prevState) => ({
        ...prevState,
        boards: [...prevState.columns, newBoardId],
        boards_list: {
          ...prevState.boards_list,
          [newBoardId]: newBoard,
        },
      }));


      handleAddLog(TYPE_BOARD, newBoard, ACTION_ADDED)
    }
  }

  //DELETE LIST 
  function handleDeleteList(listId) {
    const updatedTodos = { ...todos };
    const removedList = todos.lists[listId];
    updatedTodos.columns = updatedTodos.columns.filter((id) => id !== listId);
    delete updatedTodos.lists[listId];
    setTodos(updatedTodos);

    handleAddLog(TYPE_COLUMN, removedList, ACTION_DELETED)
  }

  const filteredTodos = getFilteredTodosByBoard();

  return (
    <>
      <div className="header_container">
        <div className="header_logo"></div>
        <div className="header_left">
          <Select
            size="middle"
            placeholder="Select a board"
            style={{
              width: "20%",
            }}
            options={boards}
            value={currentBoard}
            onChange={setCurrentBoard}
          />
          <Button onClick={handleAddBoard} icon={<PlusOutlined />}>
            Add board
          </Button>
        </div>
        <div className="header_right">
          <Select
            size="middle"
            placeholder="Filtering"
            style={{
              width: "20%",
            }}
            allowClear
            options={tagsList}
            onChange={setCurrentTag}
          />
          <Dropdown
            menu={{
              items: settingsMenu,
            }}
            placement="bottomRight"
            arrow
          >
            <Button icon={<SettingOutlined />}>Settings</Button>
          </Dropdown>
        </div>
      </div>

      <main>
        <div className="container">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" type="LIST" direction="vertical">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  style={{
                    display: "flex",
                  }}
                  {...provided.droppableProps}
                  className="listContainer"
                >
                  <>
                    {filteredTodos.columns.map((listId, listIndex) => {
                      const listItem = todos.lists[listId];
                      let cards = listItem.cards.map(
                        (cardId) => todos.cards[cardId]
                      )
                      
                      if (currentTag) {
                        cards = cards.filter(card => card.tags.includes(currentTag));
                      }
     
                      return (
                        <TrelloList
                          key={listItem.id}
                          index={listIndex}
                          title={listItem.title}
                          cards={cards}
                          listId={listItem.id}
                          setModalAddCard={setModalAddCard}
                          handleDeleteList={handleDeleteList}
                        />
                      );
                    })}
                  </>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Button onClick={handleAddList} icon={<PlusOutlined />} style={{marginTop: '5px'}}>
            Add another list
          </Button>
        </div>
      </main>

      <ModalTags
        visible={isTagsVisible}
        onClose={closeTagsModal}
      />
      <ModalLogs
        visible={isLogsVisible}
        onClose={closeLogsModal}
      />
      <ModalAddCard />
      {contextHolder}
    </>
  );
}

