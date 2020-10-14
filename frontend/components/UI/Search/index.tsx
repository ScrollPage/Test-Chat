import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { setSearch } from '@/store/actions/search';
import { getSearch } from '../../../store/selectors';
import { StyledSearch } from './styles';

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
