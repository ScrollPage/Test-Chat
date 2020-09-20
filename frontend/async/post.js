
// import { AlertContext } from '@context/alert/AlertContext';
// import { UseContext } from 'react';

// const { show } = useContext(AlertContext);
import axios from 'axios';
import Cookie from 'js-cookie';

export const addPost = (text, imageUrl) => {
  axios.post('/api/v1/post/', {
    slug: Cookie.get('slug'),
    text: text,
    image: imageUrl 
  })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    })
};

export const addLike = (postId) => {
  axios.post('/api/v1/like/add/', {
    user: Number(Cookie.get('userId')),
    post_id: postId
  })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    })
};

export const removeLike = (postId) => {
  axios.post('/api/v1/like/remove/', {
    user: Cookie.get('userId'),
    post_id: postId
  })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    })
};