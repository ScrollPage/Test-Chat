import { useContext } from 'react';
import styled from 'styled-components';
import { Form, Input, Button } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import VisitorLayout from '@/components/Layout/VisitorLayout';
import { useRouter } from 'next/router';
import { AuthContext } from '@/context/auth/AuthContext';

const validationSchema = Yup.object().shape({
  email: Yup.string()
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

export default function Login() {

  const { authLogin } = useContext(AuthContext);

  const { push } = useRouter();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      authLogin(values.email, values.password);
      setSubmitting(true);
      setTimeout(() => {
        resetForm();
        setSubmitting(false);
      }, 500)
    }
  });

  const { handleSubmit, handleChange, handleBlur, isSubmitting, errors, touched, values } = formik;

  return (
    <VisitorLayout>
      <StyledLogin>
        <div className="log__top">
          <h3>Войти в аккаунт</h3>
          <p>Пожалуйста войдите в свой аккаунт</p>
        </div>
        <Form onFinish={handleSubmit}>
          <Form.Item
            name="email"
            hasFeedback
            help={errorMessege(touched.email, errors.email)}
            validateStatus={!touched.email ? null : errors.email ? "error" : "success"}
          >
            <Input
              id="email"
              name="email"
              size="large"
              placeholder="E-mail"
              prefix={<MailOutlined />}
              value={values.email}
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
        <Link href='/register'><a><p>Зарегистрироваться</p></a></Link>
      </StyledLogin>
    </VisitorLayout>
  );
}

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
