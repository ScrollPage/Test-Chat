import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { setSearch } from '@/store/actions/search';
import { getSearch } from '../../store/selectors';

const Search: React.FC = () => {
    const dispatch = useDispatch();
    const search = useSelector(getSearch);

    return (
        <StyledSearch>
            <div>
                <SearchOutlined />
            </div>
            <div>
                <Input
                    placeholder="Поиск"
                    onChange={e => dispatch(setSearch(e.target.value))}
                    value={search}
                />
            </div>
        </StyledSearch>
    );
};

export default Search;

const StyledSearch = styled.div`
    width: 100%;
    height: 60px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    > div {
        &:first-of-type {
            margin: 0 20px 0 10px;
        }
        &:last-of-type {
            flex: 1;
        }
    }
`;
