import { Form, Select, Button } from 'antd';
import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import useReactRouter from 'use-react-router';
import { closeAddChatPopup } from '../store/actions/nav';
import { getUserChats } from '../store/actions/messages';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const AddChatForm = () => {

  const { history } = useReactRouter();

  const token = useSelector(state => state.auth.token);
  const username = useSelector(state => state.auth.username);

  const dispatch = useDispatch();

  const [usernames, setUsernames] = useState([]);
  const [error, setError] = useState(null);

  const handleChange = value => {
    setUsernames(value);
  }

  const onFinish = values => {
    const combinedUsers = [...usernames, username];
    console.log(combinedUsers);
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };
    axios.post('http://127.0.0.1:8000/api/v1/chat/', {
      messages: [],
      participants: combinedUsers
    })
    .then(res => {
      history.push(`${res.data.id}`);
      dispatch(closeAddChatPopup());
      dispatch(getUserChats(username, token));
    })
    .catch(err => {
      console.log(err);
      setError(err);
    })
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      {...layout}
      name="basic"
      initialValues={{
        remember: true
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      {error ? `У вас данная ошибка: ${error}` : null}
      <Form.Item
        label="Username"
        name="username"
      >
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="Add a user"
          onChange={handleChange}
        >

        </Select>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Start a chat
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddChatForm;

