import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { StyledDialogSearch } from './styles';

const DialogSearch: React.FC = () => {
    return (
        <StyledDialogSearch>
            <div>
                <SearchOutlined />
            </div>
            <div>
                <Input placeholder="Поиск" />
            </div>
        </StyledDialogSearch>
    );
};

export default DialogSearch;