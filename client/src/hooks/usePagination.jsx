import { useReducer } from "react";

const paginationReducer = (state, action) => {
  const { type, tableKey, value } =  action;

  switch (type) {
    case 'CHANGE_PAGE':
      return{
        ...state,
        [tableKey]: { ...state[tableKey], page: value}
      };
    case 'CHANGE_ROWS_PER_PAGE':
      return {
        ...state,
        [tableKey]: {
          ...state[tableKey],
          rowPerPage: value,
          page: 0
        }
      };
    default:
      return state;
  }
};

const usePaginationReducer = (initialState) => {
  return useReducer(paginationReducer, initialState)
}

export default usePaginationReducer