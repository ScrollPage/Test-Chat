import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authActivate } from '../store/actions/auth';
import useReactRouter from 'use-react-router';
import { Redirect } from 'react-router';

const AccountActivation = () => {

  const { location, history, match } = useReactRouter();

  const [redirect, setRedirect] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (new URLSearchParams(location.search).get("token") !== null 
    && new URLSearchParams(location.search).get("token") !== undefined) {
      dispatch(authActivate(new URLSearchParams(location.search).get("token")));
      setTimeout(() => {
        setRedirect(true);
      }, 5000)
    }
  }, [location.search])

  if (redirect) {
    return (
      <Redirect to="/" />
    )
  }

  return (
    <div>
      Через 5 секунд тебя перенаправит на сайт! 
    </div>
  );
}

export default AccountActivation;
