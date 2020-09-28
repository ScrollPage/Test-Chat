import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Alert as AntdAlert } from 'antd';
import { hide } from '@/store/actions/alert';
import { getAlertText, getAlertType } from '../../store/selectors';

const Alert = () => {
    const text = useSelector(getAlertText);
    const type = useSelector(getAlertType);
    
    const dispatch = useDispatch();

    useEffect(() => {
        setTimeout(() => {
            dispatch(hide());
        }, 3000);
        // eslint-disable-next-line
  }, [text]);

    const hideHandler = () => {
        dispatch(hide());
    };

    if (!text) return null;

    return (
        <StyledAlert
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
        >
            <AntdAlert
                message={text}
                type={type}
                closable
                onClose={hideHandler}
            />
        </StyledAlert>
    );
};

export default Alert;

const StyledAlert = styled(motion.div)`
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 100;
    display: flex;
    justify-content: center;
`;
