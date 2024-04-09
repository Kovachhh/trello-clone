/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';

// mocks
import { data } from '../mocks/data'
import { ACTION_ADDED, ACTION_DELETED, ACTION_UPDATED, ADDED_TEXT, DELETED_TEXT, TYPE_BOARD, TYPE_CARD, TYPE_COLUMN, TYPE_TAG, UPDATED_TEXT } from '../const/logs';

const TodoContext = React.createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = React.useState(data);
  const tags = todos.tags;
  const logs = todos.logs;
  const [users, setUsers] = React.useState([]);
  const [modalAddCard, setModalAddCard] = React.useState({
    listId: null,
    values: null,
    isOpen: false,
  })

  
  useEffect(() => {
    fetch('https://randomuser.me/api/?results=10')
    .then((response) => {
      return response.json();
    })
    .then((data) => setUsers(data.results))

  }, []);

  function handleAddLog(type, object, action) {
    let newLog = '';

    console.log(type, object, action);

    switch (type) {
      case TYPE_BOARD:
        console.log(todos.boards_list)
        newLog += object.title + ' board';
        break;
      case TYPE_COLUMN:
        newLog += object.title + ' column';
        break;
      case TYPE_CARD:
        newLog += object.title + ' card';
        break;
      default:
        return;
    }

    switch (action) {
      case ACTION_ADDED:
        newLog += ADDED_TEXT;
        break;
      case ACTION_UPDATED:
        newLog += UPDATED_TEXT;
        break;
      case ACTION_DELETED:
        newLog += DELETED_TEXT;
        break;

      default:
        return;
    }

    console.log('newLog', newLog);

    setTodos((prevState) => {
      return {
        ...prevState,
        logs: [...prevState.logs, newLog],
      };
    });
  }

  function handleDeleteCard(listId, cardId) {
    const removedCard = todos.cards[cardId];

    setTodos((prevState) => {
      const updatedLists = { ...prevState.lists };
      const updatedCards = { ...prevState.cards };

      updatedLists[listId].cards = updatedLists[listId].cards.filter((id) => id !== cardId);

      delete updatedCards[cardId];

      return {
        ...prevState,
        lists: updatedLists,
        cards: updatedCards,
      };
    });

    handleAddLog(TYPE_CARD, removedCard, ACTION_DELETED)
  }

  function handleDeleteTag(tag) {
    setTodos((prevState) => {
      const updatedTags = [ ...prevState.tags ];

      const result = updatedTags.filter((item) => item !== tag);
      return {
        ...prevState,
        tags: result
      };
    });

    console.log(tags);
    handleAddLog(TYPE_TAG, tag, ACTION_DELETED)
  }

  function handleAddTodo(values) {
    const cardItem = {
      id: `card-${Date.now()}`,
      title: values.title,
      expiration: values.expiration,
      description: values.description,
      tags: values.tags,
      assignee: values.assignee,
      author: values.author
    };
    const listId = modalAddCard.listId;

    setTodos(prevState => ({
      ...prevState,
      lists: {
        ...prevState.lists,
        [listId]: {
          ...prevState.lists[listId],
          cards: [...prevState.lists[listId].cards, cardItem.id]
        }
      },
      cards: {
        ...prevState.cards,
        [cardItem.id]: cardItem
      }
    }))

    handleAddLog(TYPE_CARD, cardItem, ACTION_ADDED)
  }

  const onDragEnd = React.useCallback((result) => {
    const { destination, source, draggableId, type } = result;

    // If the destination is null or the draggable item is dropped back into its original position, do nothing
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    // List dragging
    if (type === 'LIST') {
      const newListOrder = Array.from(todos.columns);
      newListOrder.splice(source.index, 1);
      newListOrder.splice(destination.index, 0, draggableId);

      setTodos((prevState) => ({
        ...prevState,
        columns: newListOrder,
      }));

      return;
    }

    const startList = todos.lists[source.droppableId];
    const endList = todos.lists[destination.droppableId];

    if (startList === endList) {
      const newCardOrder = Array.from(startList.cards);
      newCardOrder.splice(source.index, 1);
      newCardOrder.splice(destination.index, 0, draggableId);

      const newStartList = {
        ...startList,
        cards: newCardOrder,
      };

      setTodos((prevState) => ({
        ...prevState,
        lists: {
          ...prevState.lists,
          [newStartList.id]: newStartList,
        },
      }));
    } else {
      const startCardOrder = Array.from(startList.cards);
      startCardOrder.splice(source.index, 1);

      const newStartList = {
        ...startList,
        cards: startCardOrder,
      };

      const endCardOrder = Array.from(endList.cards);
      endCardOrder.splice(destination.index, 0, draggableId);

      const newEndList = {
        ...endList,
        cards: endCardOrder,
      };

      setTodos((prevState) => ({
        ...prevState,
        lists: {
          ...prevState.lists,
          [newStartList.id]: newStartList,
          [newEndList.id]: newEndList,
        },
      }));
    }
  }, [todos]);
  


  return (
    <TodoContext.Provider 
      value={{
        // states
        todos,
        users,
        tags,
        logs,
        setTodos,
        modalAddCard,

        // actions
        handleAddTodo,
        onDragEnd,
        setModalAddCard,
        handleDeleteCard,
        handleDeleteTag,
        handleAddLog
      }}
    >
      {children}
    </TodoContext.Provider>
  )
}

export const useTodoContext = () => React.useContext(TodoContext);