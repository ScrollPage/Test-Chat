import React from 'react';
import styled from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';

interface IModal {
    isOpen: boolean;
    setIsOpen: (b: boolean) => void;
    children: React.ReactNode;
};

const Modal: React.FC<IModal> = ({ isOpen, setIsOpen, children }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <>
            <StyledModal>
                <div>
                    <div
                        className="modal__close"
                        onClick={() => setIsOpen(false)}
                    >
                        <CloseOutlined />
                    </div>
                    {children}
                </div>
            </StyledModal>
            <StyledBackDrop onClick={() => setIsOpen(false)} />
        </>
    );
};

const StyledModal = styled.div`
    position: fixed;
    z-index: 10;
    width: 600px;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    @media (max-width: 575.98px) {
        width: 90%;
        > div {
            padding: 40px 10px !important;
        }
    }
    > div {
        position: relative;
        height: 100%;
        width: 100%;
        background-color: #fff;
        padding: 40px;
        border-radius: 5px;
        border: 1px solid #d9d9d9;
        .modal__close {
            position: absolute;
            right: 10px;
            top: 10px;
            cursor: pointer;
        }
    }
`;

const StyledBackDrop = styled.div`
    z-index: 8;
    background-color: rgba(0, 0, 0, 0.7);
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
`;

export default Modal;
