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
        &__photo {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #181818;
            width: 670px;
            position: relative;
            img {
                max-height: 100%;
                max-width: 100%;
            }
            @media (max-width: 575.98px) {
            }
            @media (max-width: 767.98px) {
            }
            @media (max-width: 991.98px) {
                width: 300px !important;
            }
            @media (max-width: 1199.98px) {
                width: 500px;
            }
        }
        &__main {
            width: 350px;
            height: 100%;
            background-color: #fff;
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
