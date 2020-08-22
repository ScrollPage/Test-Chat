import React from 'react';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, TeamOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useReactRouter from 'use-react-router';
import { Form, Input, Button } from 'antd';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { authSignup } from '../store/actions/auth';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Некорректный E-mail')
    .required('Введите E-mail'),
  username: Yup.string()
    .min(3, 'Слишком короткое имя')
    .required('Введите имя'),
  password: Yup.string()
    .matches(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})',
      'Слишком легкий пароль'
    )
    .required('Введите пароль'),
  confirmPassword: Yup.string()
    .required('Введите пароль')
    .oneOf([Yup.ref("password"), null], 'Пароли должны совпадать')
});

const errorMessege = (touched, messege) => {
  if (!touched) {
    return
  }
  if (messege) {
    return messege
  }
};

const Register = () => {

  const { history } = useReactRouter();

  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      // authRegister(values.email, values.username, values.password)
      dispatch(authSignup(values.username, values.email, values.password ));
      setSubmitting(true);
      setTimeout(() => {
        resetForm();
        setSubmitting(false);
        history.push('/');
      }, 500)
    }
  });

  const { handleSubmit, handleChange, handleBlur, isSubmitting, errors, touched, values } = formik;

  return (
    <StyledRegister>
      <div>
        <div className="reg__top">
          <h3>Зарегистрироваться</h3>
          <p>Пожалуйста заполните данные</p>
        </div>
        <Form onFinish={handleSubmit}>
          <Form.Item
            name="email"
            hasFeedback
            help={errorMessege(touched.email, errors.email)}
            validateStatus={!touched.email ? null : errors.email ? "error" : "success"}
          >
            <Input
              id="reg__email"
              name="email"
              placeholder="E-mail"
              prefix={<MailOutlined />}
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Form.Item>
          <Form.Item
            name="username"
            hasFeedback
            help={errorMessege(touched.username, errors.username)}
            validateStatus={!touched.username ? null : errors.username ? "error" : "success"}
          >
            <Input
              id="username"
              name="username"
              placeholder="Имя"
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
              id="reg__password"
              name="password"
              placeholder="Пароль"
              prefix={<LockOutlined />}
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            hasFeedback
            help={errorMessege(touched.confirmPassword, errors.confirmPassword)}
            validateStatus={!touched.confirmPassword ? null : errors.confirmPassword ? "error" : "success"}
          >
            <Input.Password
              id="reg__confirmPassword"
              name="confirmPassword"
              placeholder="Повторите пароль"
              prefix={<LockOutlined />}
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={isSubmitting}>
              Зарегистрироваться
                        </Button>
          </Form.Item>
        </Form>
        <Link to='/'><p>Войти</p></Link>
      </div>
    </StyledRegister>
  );
}

export default Register;

const StyledRegister = styled.div`
  display: flex;
  justify-content: center;
  padding: 50px 0px;
  flex-grow: 10;
  .reg__top {
    padding-bottom: 2rem;
  }
  .ant-btn {
    width: 100%;
  }
  > div  {
    width: 100%;
    max-width: 400px;
    padding: 30px 50px ;
    border-radius: 1rem;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.3);
    h3, p {
      text-align: center;
    }
    p {
      opacity: 0.8;
    }
  }
`;