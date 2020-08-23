import React from 'react';;
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useReactRouter from 'use-react-router';
import { Form, Input, Button } from 'antd';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { authLogin } from '../store/actions/auth';

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Введите логин'),
  password: Yup.string()
    .required('Введите пароль')
});

const errorMessege = (touched, messege) => {
  if (!touched) {
    return;
  }
  if (messege) {
    return messege;
  }
};

const Login = () => {

  const { history } = useReactRouter()

  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      dispatch(authLogin(values.username, values.password));
      setSubmitting(true);
      setTimeout(() => {
        resetForm();
        setSubmitting(false);
        history.push('/dialogs');
      }, 500)
    }
  });

  const { handleSubmit, handleChange, handleBlur, isSubmitting, errors, touched, values } = formik;

  return (
    <StyledLogin>
      <div className="log__top">
        <h3>Войти в аккаунт</h3>
        <p>Пожалуйста войдите в свой аккаунт</p>
      </div>
      <Form onFinish={handleSubmit}>
        <Form.Item
          name="username"
          hasFeedback
          help={errorMessege(touched.username, errors.username)}
          validateStatus={!touched.username ? null : errors.username ? "error" : "success"}
        >
          <Input
            id="log__username"
            name="username"
            size="large"
            placeholder="E-mail"
            prefix={<UserOutlined />}
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Form.Item>
        <Form.Item
          name="password"
          hasFeedback
          help={errorMessege(touched.password, errors.password)}
          validateStatus={!touched.password ? null : errors.password ? "error" : "success"}
        >
          <Input.Password
            id="log__password"
            name="password"
            size="large"
            placeholder="Пароль"
            prefix={<LockOutlined />}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Form.Item>
        <Form.Item >
          <Button type="primary" htmlType="submit" size="large" disabled={isSubmitting}>
            Войти в аккаунт
            </Button>
        </Form.Item>
      </Form>
      <Link to='/register'><p>Зарегистрироваться</p></Link>
    </StyledLogin>
  );
}

export default Login;

const StyledLogin = styled.div`
  .log__top {
    padding-bottom: 3rem;
  }
  .ant-btn {
    width: 100%;
  }    
  width: 100%;
  max-width: 400px;
  padding: 50px ;
  border-radius: 1rem;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.3);
  h3, p {
    text-align: center;
  }   
  p {
    opacity: 0.8;  
  }
`;