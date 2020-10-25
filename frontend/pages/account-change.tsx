import Head from 'next/head';
import cookies from 'next-cookies';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ensureAuth, getUserFromServer } from '@/utils/index';
import { useDispatch } from 'react-redux';

import styled from 'styled-components';
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import { Form, Input, Button } from 'antd';
import { authChange } from '@/store/actions/auth';
import PrivateLayout from '@/components/Layout/PrivateLayout';
import { GetServerSideProps } from 'next';
import { IUser } from '@/types/user';

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
});

const errorMessege = (touched: boolean | undefined, messege: string | undefined) => {
    if (!touched) {
        return;
    }
    if (messege) {
        return messege;
    }
};

interface IChange {
    email: string;
    user: IUser;
    phoneNumber: string;
}

export default function Change({ email, user, phoneNumber }: IChange) {
    const dispatch = useDispatch();

    const { firstName, lastName } = user;

    const initialValues = {
        email,
        firstName,
        lastName,
        phoneNumber,
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values, { setSubmitting, resetForm }) => {
            dispatch(
                authChange(
                    values.email,
                    values.firstName,
                    values.lastName,
                    values.phoneNumber
                )
            );
            setSubmitting(true);
            setTimeout(() => {
                resetForm();
                setSubmitting(false);
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
        <PrivateLayout user={user}>
            <Head>
                <title>Смена данных</title>
            </Head>
            <StyledChange>
                <div className="change__top">
                    <h3>Сменить данные</h3>
                </div>
                <Form onFinish={handleSubmit}>
                    <Form.Item
                        name="email"
                        hasFeedback
                        help={errorMessege(touched.email, errors.email)}
                        validateStatus={errors.email ? 'error' : 'success'}
                        initialValue={email}
                    >
                        <Input
                            id="change__email"
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
                        validateStatus={errors.firstName ? 'error' : 'success'}
                        initialValue={firstName}
                    >
                        <Input
                            id="change__firstName"
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
                        validateStatus={errors.lastName ? 'error' : 'success'}
                        initialValue={lastName}
                    >
                        <Input
                            id="change__lastName"
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
                        validateStatus={
                            errors.phoneNumber ? 'error' : 'success'
                        }
                        initialValue={phoneNumber}
                    >
                        <Input
                            id="change__phoneNumber"
                            name="phoneNumber"
                            placeholder="Телефон"
                            prefix={<PhoneOutlined />}
                            value={values.phoneNumber}
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
                            Подтвердить
                        </Button>
                    </Form.Item>
                </Form>
            </StyledChange>
        </PrivateLayout>
    );
}

export const getServerSideProps: GetServerSideProps<IChange> = async (ctx) => {
    ensureAuth(ctx);
    const email = cookies(ctx)?.email || "";
    const phoneNumber = cookies(ctx)?.phoneNumber || "";

    return {
        props: {
            email,
            phoneNumber,
            user: getUserFromServer(ctx)
        },
    };
};

const StyledChange = styled.div`
    margin: 50px auto;
    @media (max-width: 575.98px) {
        margin: 20px auto;
    }
    .change__top {
        margin-bottom: 1.5rem;
    }
    .ant-btn {
        width: 100%;
    }
    width: 100%;
    max-width: 400px;
    h3 {
        text-align: center;
    }
`;
