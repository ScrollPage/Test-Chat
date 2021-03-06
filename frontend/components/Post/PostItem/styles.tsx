import styled from 'styled-components';

export const StyledPostItem = styled.div`
    padding: 20px;
    padding-bottom: 0px;
    background-color: #f4f4f4;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    position: relative;
    .user-post {
        display: flex;

        &__close {
            position: absolute;
            right: 10px;
            top: 10px;
            cursor: pointer;
        }
        hr {
            background-color: #fff;
            border: 2px solid #fff;
            width: calc(100% + 38px);
            margin-left: -20px;
            &:first-of-type {
                margin-top: 30px;
                margin-bottom: 20px;
            }
            &:last-of-type {
                margin-bottom: 0px;
            }
        }
        &__header {
            display: flex;
            justify-content: flex-start;
            > div {
                &:first-of-type {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                &:last-of-type {
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    a {
                        color: black;
                    }
                    p {
                        margin-bottom: 0;
                        font-weight: 600;
                    }
                    small {
                        opacity: 0.6;
                    }
                }
            }
        }
        &__body {
            display: flex;
            flex-direction: column;
            > div {
                margin-top: 12px;
                img {
                    max-width: 100%;
                }
            }
        }
        &__footer {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            h2 {
                margin-bottom: 4px;
            }
        }
        &__tap {
            display: flex;
            > div {
                display: flex;
                align-items: center;
            }
        }
        &__views {
            display: flex;
            align-items: center;
        }
        &__avatar {
            margin-right: 10px;
        }
        &__offer {
            padding: 20px 20px 20px 0;
        }
    }
`;
