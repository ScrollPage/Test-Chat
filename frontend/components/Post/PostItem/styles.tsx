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
    }
    .user-post__close {
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
    .user-post__header {
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
    .user-post__body {
        display: flex;
        flex-direction: column;
        > div {
            margin-top: 12px;
            img {
                max-width: 100%;
            }
        }
    }
    .user-post__footer {
        margin-top: 20px;
        display: flex;
        > div {
            display: flex;
            align-items: center;
            h2 {
                margin-bottom: 4px;
            }
        }
    }
    .user-post__avatar {
        margin-right: 10px;
    }
`;
