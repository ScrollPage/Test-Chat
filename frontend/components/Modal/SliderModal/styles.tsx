import styled from 'styled-components';
import { motion } from 'framer-motion';

export const StyledSliderModal = styled(motion.div).attrs(props => ({
    className: props.className,
}))`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10;
    > div {
        padding: 100px 0;
        display: flex;
        justify-content: center;
        > div {
            height: 100%;
            display: flex;
        }
    }
    .slider-modal {
        &__amount {
            font-size: 24px;
            position: absolute;
            color: #fff;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            -ms-user-select: none;
            -moz-user-select: none;
            -khtml-user-select: none;
            -webkit-user-select: none;
        }
        &__inner {
            z-index: 11;
            display: flex;
            flex-direction: row;
            @media (max-width: 767.98px) {
                flex-direction: column;
                padding: 30px 10px;
            }
        }
        &__photo {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #181818;
            width: 670px;
            position: relative;
            -ms-user-select: none;
            -moz-user-select: none;
            -khtml-user-select: none;
            -webkit-user-select: none;
            img {
                max-height: 100%;
                max-width: 100%;
            }
            @media (max-width: 575.98px) {
            }
            @media (max-width: 1199.98px) {
                width: 500px;
            }
            @media (max-width: 991.98px) {
                width: 300px;
            }
            @media (max-width: 767.98px) {
                width: 100%;
                height: 65%;
            }
        }
        &__main {
            width: 350px;
            height: 100%;
            padding: 20px 20px 0px 20px;
            background-color: #fff;
            display: flex;
            flex-direction: column;
            overflow-y: scroll;
            &::-webkit-scrollbar {
                width: 5px;
                border-radius: 50%;
                background-color: #f5f5f5;
                @media (max-width: 575.98px) {
                    width: 0px;
                }
            }
            &::-webkit-scrollbar-track {
                height: 90%;
            }
            &::-webkit-scrollbar-thumb {
                background-color: #1890ff;
            }
            @media (max-width: 767.98px) {
                width: 100%;
                height: 35%;
            }
            > div {
                &:first-of-type {
                    display: flex;
                    align-items: center;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #f0f0f0;
                    h3 {
                        margin-left: 20px;
                        margin-bottom: 0;
                    }
                }
            }
        }
        &__close {
            position: fixed;
            right: 15px;
            top: 15px;
            cursor: pointer;
            color: #fff;
        }
        &__arrow {
            position: absolute;
            top: 0;
            right: 0;
            height: 100%;
            width: 50%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            > span {
                margin: 0 10px;
            }
            &:first-of-type {
                left: 0;
                justify-content: flex-start;
            }
        }
    }
`;
