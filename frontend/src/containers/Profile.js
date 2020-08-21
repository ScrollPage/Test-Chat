import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const Profile = () => {

  const token = useSelector(state => state.auth.token);
  const username = useSelector(state => state.auth.username);

  if (token === null) {
    return (
      <Redirect to="/" />
    )
  }

  return (
    <div className="contact-profile">
      {
        username !== null ?
          <>
            <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
            <p>{username}</p>
            <div className="social-media">
              <i className="fa fa-facebook" aria-hidden="true"></i>
              <i className="fa fa-twitter" aria-hidden="true"></i>
              <i className="fa fa-instagram" aria-hidden="true"></i>
            </div>
          </>
          :
          null
      }
    </div>
  )
}

export default Profile; 