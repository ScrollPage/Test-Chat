import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authActivate } from '../store/actions/auth';
import useReactRouter from 'use-react-router'

const AccountActivation = () => {

  const { match } = useReactRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authActivate(match.params.token));
  }, [])

  return (
    <div>
      Привет 
    </div>
  );
}

export default AccountActivation;
