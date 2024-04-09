export const data = {
  boards: ['board-1', 'board-2'],
  boards_list: {
    'board-1': {
      id: 'board-1',
      title: 'Board 1',
    },
    'board-2': {
      id: 'board-2',
      title: 'Board 2',
    }
  },
  columns: ['list-1', 'list-2', 'list-3'],
  lists: {
    'list-1': {
      id: 'list-1',
      title: 'To do',
      color: '#9097A1',
      board: 'board-1',
      cards: ['card-1', 'card-2', 'card-3', 'card-4']
    },
    'list-2': {
      id: 'list-2',
      title: 'In progress',
      color: '#1677ff',
      board: 'board-1',
      cards: ['card-2-1']
    },
    'list-3': {
      id: 'list-3',
      title: 'Done',
      color: '#56DE4F',
      board: 'board-1',
      cards: ['card-3-1']
    },
  },
  cards: {
    'card-1': {
      id: 'card-1',
      title: 'Card 1',
      expiration: '23/03/2024',
      description: 'Description 1',
      tags: ['green'],
      assignee: "",
      author: ""
    },
    'card-2': {
      id: 'card-2',
      title: 'Card 2',
      expiration: '23/03/2024',
      description: 'Description 2',
      tags: ['red'],
      assignee: "",
      author: ""
    },
    'card-3': {
      id: 'card-3',
      title: 'Card 3',
      expiration: '23/03/2024',
      description: 'Description 3',
      tags: ['red'],
      assignee: "",
      author: ""
    },
    'card-4': {
      id: 'card-4',
      title: 'Card 4',
      expiration: '23/03/2024',
      description: 'Description 4',
      tags: ['yellow'],
      assignee: "",
      author: ""
    },
    'card-2-1': {
      id: 'card-2-1',
      title: 'Card 2-1',
      expiration: '23/03/2024',
      description: 'Description 5',
      tags: ['blue'],
      assignee: "",
      author: ""
    },
    'card-3-1': {
      id: 'card-3-1',
      title: 'Card 3-1',
      expiration: '23/03/2024',
      description: 'Description 6',
      tags: ['red'],
      assignee: "",
      author: ""
    }
  },
  tags: ['red', 'blue', 'yellow', 'green'],
  logs: ['Default board was created']
}

