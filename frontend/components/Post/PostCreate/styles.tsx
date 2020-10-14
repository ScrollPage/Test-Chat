import styled from 'styled-components';

export const StyledPostCreate = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 20px;
    padding-bottom: 12px !important;
    background-color: #f4f4f4;
`;

export const StyledTopPost = styled.div`
    flex: 1;
    display: flex;
    @media (max-width: 991.98px) {
        flex-direction: column;
    }
    > div {
        &:first-of-type {
            margin-right: 20px;
            flex: 1;
            @media (max-width: 991.98px) {
                margin-right: 0px;
            }
        }
        &:last-of-type {
            .ant-upload-select-picture-card {
                height: 98px;
                width: 98px;
            }
            @media (max-width: 991.98px) {
                width: 100%;
                margin-top: 20px;
                .ant-upload-select-picture-card {
                    width: 100%;
                    height: 20px;
                }
            }
        }
    }
`;
