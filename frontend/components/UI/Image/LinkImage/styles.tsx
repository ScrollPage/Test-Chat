import styled, { css } from 'styled-components';

export const StyledLinkImage = styled.div<{
    size?: string;
    isCircle?: boolean;
    isMedia?: boolean;
}>`
    position: relative;
    ${props =>
        props.size &&
        css`
            height: ${props.size}px;
            width: ${props.size}px;
        `}
    img {
        height: 100%;
    }
    ${props =>
        props.isCircle &&
        css`
            border-radius: 50%;
            overflow: hidden;
        `}
    ${({ isMedia, size }) =>
        isMedia &&
        size &&
        css`
            @media (max-width: 991.98px) {
                height: ${Number(size) * 0.7}px;
                width: ${Number(size) * 0.7}px;
                .ant-avatar-icon {
                    height: ${Number(size) * 0.7}px !important;
                    width: ${Number(size) * 0.7}px !important;
                }
            }
        `}
`;
