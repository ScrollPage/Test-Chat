import styled, { css } from 'styled-components';

export const StyledPartyHeader = styled.div<{ isAdmin: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f4f4f4;
    padding: 10px;
    margin-bottom: 20px;
    .party-header {
        &__main {
            display: flex;
            justify-content: flex-start;
            @media (max-width: 767.98px) {
                margin-bottom: 20px;
            }
        }
        &__image {
            margin-right: 20px;
            position: relative;
            ${props =>
                props.isAdmin &&
                css`
                    &:hover {
                        .party-header__hover {
                            display: flex !important;
                        }
                    }
                `}
        }
        &__name {
            display: flex;
            align-items: center;
            h2 {
                margin: 0;
            }
        }
        &__hover {
            display: none !important;
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background: #000;
            color: #fff;
            opacity: 0.7;
            cursor: pointer;
            /* display: flex; */
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            font-size: 12px;
            @media (max-width: 767.98px) {
                font-size: 9px;
            }
        }
    }
    @media (min-width: 991.98px) {
        font-size: 16px;
    }
    @media (max-width: 767.98px) {
        flex-direction: column;
    }
`;
