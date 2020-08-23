import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authActivate } from '../store/actions/auth';
import useReactRouter from 'use-react-router';
import styled from 'styled-components';

const AccountActivation = () => {

  const { location, history } = useReactRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    if (new URLSearchParams(location.search).get("token") !== null 
    && new URLSearchParams(location.search).get("token") !== undefined) {
      dispatch(authActivate(new URLSearchParams(location.search).get("token")));
      setTimeout(() => {
        history.push('/');
      }, 5000)
    }
  }, [location.search])

  return (
    <StyledAccountActivation>
      <h1>Через 5 секунд тебя перенаправит на сайт!</h1> 
    </StyledAccountActivation>
  );
}

export default AccountActivation;

const StyledAccountActivation = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

