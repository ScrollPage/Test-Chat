import Cookie from 'js-cookie';
import axios from 'axios';

const token = Cookie.get('token');

export const instanceWithOutHeaders = axios.create({
  baseURL: 'http://localhost:8000'
})

export const instance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Token ${token}`
  }
})