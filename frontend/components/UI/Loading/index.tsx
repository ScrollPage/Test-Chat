import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { StyledLoading } from './styles';

const Loading: React.FC = () => {
    const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />;

    return (
        <StyledLoading>
            <div>
                <Spin indicator={antIcon} />
            </div>
        </StyledLoading>
    );
};

export default Loading;
