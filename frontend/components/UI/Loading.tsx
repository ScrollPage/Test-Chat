import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styled from 'styled-components';

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

const StyledLoading = styled.div`
    min-height: calc(100vh - 210px);
    width: 100%;
    position: relative;
    > div {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -15px;
        margin-left: -15px;
    }
`;
