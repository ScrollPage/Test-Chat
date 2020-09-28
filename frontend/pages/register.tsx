import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    PhoneOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import { Form, Input, Button } from 'antd';
import { authSignup } from '@/store/actions/auth';
import VisitorLayout from '@/components/Layout/VisitorLayout';

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Некорректный E-mail')
        .required('Введите E-mail'),
    firstName: Yup.string()
        .min(3, 'Слишком короткое имя')
        .max(30, 'Слишком длинное имя')
        .required('Введите имя'),
    lastName: Yup.string()
        .min(3, 'Слишком короткая фамилия')
        .max(30, 'Слишком длинная фамилия')
        .required('Введите имя'),
    phoneNumber: Yup.string()
        .min(11, 'Необходимо 11 символов')
        .max(11, 'Необходимо 11 символов')
        .required('Введите номер телефона'),
    password: Yup.string()
        .matches(
            // @ts-ignore: Unreachable code error
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})',
            'Слишком легкий пароль'
        )
        .required('Введите пароль'),
    confirmPassword: Yup.string()
        .required('Введите пароль')
        .oneOf([Yup.ref('password'), ''], 'Пароли должны совпадать'),
});

const validateHandler = (touched: boolean | undefined, message: string | undefined) => {
    if (!touched) {
        return '';
    }
    if (message) {
        return 'error';
    } else {
        return 'success';
    }
};

const errorMessege = (touched: boolean | undefined, messege: string | undefined) => {
    if (!touched) {
        return;
    }
    if (messege) {
        return messege;
    }
};

export default function Register() {
    const dispatch = useDispatch();

    const { push } = useRouter();

    const formik = useFormik({
        initialValues: {
            email: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: (values, { setSubmitting, resetForm }) => {
            dispatch(
                authSignup(
                    values.email,
                    values.firstName,
                    values.lastName,
                    values.phoneNumber,
                    values.password
                )
            );
            setSubmitting(true);
            setTimeout(() => {
                resetForm();
                setSubmitting(false);
                push({ pathname: '/' }, undefined, { shallow: true });
            }, 500);
        },
    });

    const {
        handleSubmit,
        handleChange,
        handleBlur,
        isSubmitting,
        errors,
        touched,
        values,
    } = formik;

    return (
        <VisitorLayout>
            <StyledRegister>
                <div className="reg__top">
                    <h3>Зарегистрироваться</h3>
                    <p>Пожалуйста заполните данные</p>
                </div>
                <Form onFinish={handleSubmit}>
                    <Form.Item
                        name="email"
                        hasFeedback
                        help={errorMessege(touched.email, errors.email)}
                        validateStatus={validateHandler(
                            touched.email,
                            errors.email
                        )}
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
                        name="firstName"
                        hasFeedback
                        help={errorMessege(touched.firstName, errors.firstName)}
                        validateStatus={validateHandler(
                            touched.firstName,
                            errors.firstName
                        )}
                    >
                        <Input
                            id="firstName"
                            name="firstName"
                            placeholder="Имя"
                            prefix={<UserOutlined />}
                            value={values.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Form.Item>
                    <Form.Item
                        name="lastName"
                        hasFeedback
                        help={errorMessege(touched.lastName, errors.lastName)}
                        validateStatus={validateHandler(
                            touched.lastName,
                            errors.lastName
                        )}
                    >
                        <Input
                            id="lastName"
                            name="lastName"
                            placeholder="Фамилия"
                            prefix={<TeamOutlined />}
                            value={values.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Form.Item>
                    <Form.Item
                        name="phoneNumber"
                        hasFeedback
                        help={errorMessege(
                            touched.phoneNumber,
                            errors.phoneNumber
                        )}
                        validateStatus={validateHandler(
                            touched.phoneNumber,
                            errors.phoneNumber
                        )}
                    >
                        <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            placeholder="Телефон"
                            prefix={<PhoneOutlined />}
                            value={values.phoneNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        hasFeedback
                        help={errorMessege(touched.password, errors.password)}
                        validateStatus={validateHandler(
                            touched.password,
                            errors.password
                        )}
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
                        help={errorMessege(
                            touched.confirmPassword,
                            errors.confirmPassword
                        )}
                        validateStatus={validateHandler(
                            touched.confirmPassword,
                            errors.confirmPassword
                        )}
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
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={isSubmitting}
                        >
                            Зарегистрироваться
                        </Button>
                    </Form.Item>
                </Form>
                <Link href="/">
                    <a>
                        <p>Войти</p>
                    </a>
                </Link>
            </StyledRegister>
        </VisitorLayout>
    );
}

const StyledRegister = styled.div`
    .reg__top {
        padding-bottom: 2rem;
    }
    .ant-btn {
        width: 100%;
    }
    width: 100%;
    max-width: 400px;
    padding: 30px 50px;
    border-radius: 1rem;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.3);
    h3,
    p {
        text-align: center;
    }
    p {
        opacity: 0.8;
    }
`;
