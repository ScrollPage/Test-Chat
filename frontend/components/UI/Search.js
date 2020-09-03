import React, { useContext } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { SearchContext } from '@/context/search/SearchContext';

const SearchDialog = () => {

  const {search, addSearch} = useContext(SearchContext);

  return (
    <StyledSearch>
      <div>
        <SearchOutlined />
      </div>
      <div>
        <Input
          placeholder="Поиск"
          onChange={(e) => addSearch(e.target.value)}
          value={search}
        />
      </div>
    </StyledSearch>
  );
}

export default SearchDialog;

const StyledSearch = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  /* max-width: 200px; */
  > div {
    &:first-of-type {
      margin: 0 20px 0 0px;
    }
    &:last-of-type {
      flex: 1;
    }
  }
`;
