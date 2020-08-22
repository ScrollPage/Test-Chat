import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authActivate } from '../store/actions/auth';
import useReactRouter from 'use-react-router';

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
    <div>
      Через 5 секунд тебя перенаправит на сайт! 
    </div>
  );
}

export default AccountActivation;
