const { createStore, applyMiddleware } = require("redux");
const thunk = require("redux-thunk").default;
const { default: axios } = require("axios");

//constant define
const GET_TODOS_REQUEST = "GET_TODOS_REQUEST";
const GET_TODOS_SUCCESS = "GET_TODOS_SUCCESS";
const GET_TODOS_FAILED = "GET_TODOS_FAILED";
const API_URL = "https://jsonplaceholder.typicode.com/todos";
// state define
const initialTodosState = {
  todos: [],
  isLoading: false,
  error: null,
};
// action
const getTodosRequest = () => {
  return {
    type: GET_TODOS_REQUEST,
  };
};

const getTodosSuccess = (todos) => {
  return {
    type: GET_TODOS_SUCCESS,
    payload: todos,
  };
};

const getTodosFailed = (error) => {
  return {
    type: GET_TODOS_SUCCESS,
    payload: error,
  };
};
// reducer
const TodosReducer = (state = initialTodosState, action) => {
  switch (action.type) {
    case GET_TODOS_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case GET_TODOS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        todos: action.payload,
      };
    case GET_TODOS_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

// async action creator
const fetchData = () => {
  return (dispatch) => {
    dispatch(getTodosRequest());
    axios
      .get(API_URL)
      .then((res) => {
        const todos = res.data;
        const tiles = todos.map((todo) => todo.title);
        dispatch(getTodosSuccess(tiles));
      })
      .catch((error) => {
        const errorMessage = error.message;
        dispatch(getTodosFailed(errorMessage));
      });
  };
};

// store
const store = createStore(TodosReducer, applyMiddleware(thunk));

store.subscribe(() => {
  console.log(store.getState());
});

store.dispatch(fetchData());
