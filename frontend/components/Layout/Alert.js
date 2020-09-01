import React, { useContext, useEffect } from 'react';
import { AlertContext } from '../../context/alert/AlertContext';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Alert as AntdAlert } from 'antd';
const Alert = () => {

  const { alert, hide } = useContext(AlertContext)

  useEffect(() => {
    setTimeout(() => {
      hide()
    }, 3000)
    //eslint-disable-next-line
  }, [alert])

  const hideHandler = () => {
    hide();
  }

  if (!alert) return null

  return (
    <StyledAlert
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <AntdAlert
        message={alert.text}
        type={alert.type}
        closable
        onClose={hideHandler}
      />
    </StyledAlert>
  );
}

export default Alert;

const StyledAlert = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 100;
  display: flex;
  justify-content: center;
`;