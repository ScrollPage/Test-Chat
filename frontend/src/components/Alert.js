import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeAlert } from '../store/actions/alert';
import styled from 'styled-components';
import { Alert as AntdAlert } from 'antd';

export const Alert = () => {

  const text = useSelector(state => state.alert.text);
  const alertType = useSelector(state => state.alert.alertType);

  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      dispatch(closeAlert());
    }, 2000)
    //eslint-disable-next-line
  }, [text])

  const closeAlertHandler = () => {
    dispatch(closeAlert());
  }

  if (!text) return null

  return (
    <StyledAlert >
      <AntdAlert
        message={text}
        type={alertType}
        closable
        onClose={closeAlertHandler}
      />
    </StyledAlert>
  );
}

const StyledAlert = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 2000;
  display: flex;
  justify-content: center;
`;