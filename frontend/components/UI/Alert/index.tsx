import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert as AntdAlert } from 'antd';
import { hide } from '@/store/actions/alert';
import { getAlertText, getAlertType } from '../../../store/selectors';
import { StyledAlert } from './styles';

const Alert: React.FC = () => {
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
        <StyledAlert>
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
