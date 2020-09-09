import {
  SET_SEARCH
} from '../types';

import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { SearchContext } from './SearchContext';
import { SearchReducer } from './SearchReducer';

export const SearchState = ({ children }) => {
  
  const initialState = {
    search: ''
  };

  const [state, dispatch] = useReducer(SearchReducer, initialState);

  const addSearch = (search) => dispatch({ type: SET_SEARCH, search });

  const { search } = state;

  return (
    <SearchContext.Provider value={{
      addSearch, search
    }}>
      {children}
    </SearchContext.Provider>
  );
}

SearchState.propTypes = {
  children: PropTypes.element
}

