import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const SearchDialog: React.FC = () => {
    return (
        <StyledSearchDialog>
            <div>
                <SearchOutlined />
            </div>
            <div>
                <Input placeholder="Поиск" />
            </div>
        </StyledSearchDialog>
    );
};

export default SearchDialog;

const StyledSearchDialog = styled.div`
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
