import Link from 'next/link';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    PhoneOutlined,
    TeamOutlined,
    FireOutlined
} from '@ant-design/icons';
import { Button, Steps } from 'antd';
import { authSignup } from '@/store/actions/auth';
import VisitorLayout from '@/components/Layout/VisitorLayout';
import { object, string, ref } from 'yup';
import { Form, Input, Radio, Select, DatePicker } from 'formik-antd';
import { useState, Children } from 'react';
import { Formik} from 'formik';

const DataValidate = object().shape({
    email: string()
        .email('Некорректный E-mail')
        .required('Введите E-mail'),
    firstName: string()
        .min(3, 'Слишком короткое имя')
        .max(30, 'Слишком длинное имя')
        .required('Введите имя'),
    lastName: string()
        .min(3, 'Слишком короткая фамилия')
        .max(30, 'Слишком длинная фамилия')
        .required('Введите имя'),
    phoneNumber: string()
        .min(11, 'Необходимо 11 символов')
        .max(11, 'Необходимо 11 символов')
        .required('Введите номер телефона'),
    password: string()
        .matches(
            // @ts-ignore: Unreachable code error
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})',
            'Слишком легкий пароль'
        )
        .required('Введите пароль'),
    confirmPassword: string()
        .required('Введите пароль')
        .oneOf([ref('password'), ''], 'Пароли должны совпадать'),
});

const AddValidate = object().shape({
    country: string()
        .required('Выберите страну'),
    city: string()
        .required('Выберите город'),
    date: string()
        .required('Выберите дату рождения'),
    status: string()
        .required('Введите статус')
        .min(3, 'Слишком короткий статус')
        .max(30, 'Слишком длинная статус')
});

export default function Register() {
    return (
        <VisitorLayout>
            <StyledRegister>
                <FormikStepper
                    initialValues={{
                        email: '',
                        firstName: '',
                        lastName: '',
                        phoneNumber: '',
                        password: '',
                        confirmPassword: '',
                        confirmMethod: '',
                        country: '',
                        city: '',
                        status: '',
                        date: ''
                    }}
                    enableReinitialize={true}
                >
                    <FormikStep
                        label="Данные"
                        validationSchema={DataValidate}
                    >
                        <Link href="/">
                            <a>
                                <p>У вас уже есть аккаунт? Войти</p>
                            </a>
                        </Link>
                        <Form.Item name="email">
                            <Input
                                name="email"
                                placeholder="E-mail"
                                prefix={<MailOutlined />}
                            />
                        </Form.Item>
                        <Form.Item name="firstName">
                            <Input
                                name="firstName"
                                placeholder="Имя"
                                prefix={<UserOutlined />}
                            />
                        </Form.Item>
                        <Form.Item name="lastName">
                            <Input
                                name="lastName"
                                placeholder="Фамилия"
                                prefix={<TeamOutlined />}
                            />
                        </Form.Item>
                        <Form.Item name="phoneNumber">
                            <Input
                                name="phoneNumber"
                                placeholder="Номер телефона"
                                prefix={<PhoneOutlined />}
                            />
                        </Form.Item>
                        <Form.Item name="password">
                            <Input.Password
                                name="password"
                                placeholder="Пароль"
                                prefix={<LockOutlined />}
                            />
                        </Form.Item>
                        <Form.Item name="confirmPassword">
                            <Input.Password
                                name="confirmPassword"
                                placeholder="Повторите пароль"
                                prefix={<LockOutlined />}
                            />
                        </Form.Item>
                    </FormikStep>
                    <FormikStep label="Дополнительно" validationSchema={AddValidate} >
                        <div className="form-item">
                            <Select
                            size="large"
                                name="country"
                                style={{ width: '100%' }}
                                placeholder="Выберите страну"
                            >
                                <Select.Option value={'Россия'}>
                                    Россия
                                </Select.Option>
                                <Select.Option value={'Туркеминстан'}>
                                    Туркеминстан
                                </Select.Option>
                                <Select.Option value={'Азербайджан'}>
                                    Азербайджан
                                </Select.Option>
                            </Select>
                        </div>
                        <div className="form-item">
                            <Select
                            size="large"
                                name="city"
                                style={{ width: '100%' }}
                                placeholder="Выберите город"
                            >
                                <Select.Option value={'Чебоксары'}>
                                    Чебоксары
                                </Select.Option>
                                <Select.Option value={'Москва'}>
                                    Москва
                                </Select.Option>
                                <Select.Option value={'Королев'}>
                                    Королев
                                </Select.Option>
                            </Select>
                        </div>
                        <div className="form-item">
                            <DatePicker
                            size="large"
                                name="date"
                                placeholder="Дата рождения"
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div className="form-item">
                            <Input
                            size="large"
                                name="status"
                                placeholder="Введите ваш статус"
                                prefix={<FireOutlined />}
                            />
                        </div>
                    </FormikStep>
                    <FormikStep label="Поддтверждение">
                        <h3>Выберите способ подтверждения аккаунта:</h3>
                        <Radio.Group name="confirmMethod">
                            <Radio name="Email" value={'email'}>
                                Письмо на E-mail
                            </Radio>
                            <Radio name="Phone" value={'phone'}>
                                Сообщение на телефон
                            </Radio>
                        </Radio.Group>
                    </FormikStep>
                </FormikStepper>
            </StyledRegister>
        </VisitorLayout>
    );
}

function FormikStep({ children }) {
    return <>{children}</>;
}

function FormikStepper({ children, ...stepperProps }) {
    const dispatch = useDispatch();

    const [step, setStep] = useState(0);
    const childrenArray = Children.toArray(children);
    const currentChild = childrenArray[step];

    const isLastElement = () => {
        return step === childrenArray.length - 1;
    };

    return (
        <Formik
            {...stepperProps}
            validationSchema={currentChild.props.validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                if (isLastElement()) {
                    setSubmitting(true);
                    console.log(values);
                    dispatch(
                        authSignup(
                            values.email,
                            values.firstName,
                            values.lastName,
                            values.phoneNumber,
                            values.password,
                            values.confirmMethod,
                            values.country,
                            values.city, 
                            values.date, 
                            values.status
                        )
                    );
                    setTimeout(() => {
                        setSubmitting(false);
                    }, 1000);
                } else {
                    setStep(e => e + 1);
                }
            }}
        >
            {({ isSubmitting, onSubmitHandler }) => (
                <Form onSubmit={onSubmitHandler}>
                    <Steps current={step} size="small">
                        {childrenArray.map(child => (
                            <Steps.Step
                                key={child.props.label}
                                title={child.props.label}
                            />
                        ))}
                    </Steps>
                    <StyledForm>{currentChild}</StyledForm>
                    <StyledButtons>
                        {step > 0 ? (
                            <Button
                                onClick={() => setStep(e => e - 1)}
                                type="primary"
                                disabled={isSubmitting}
                            >
                                Назад
                            </Button>
                        ) : null}
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={isSubmitting}
                        >
                            {isLastElement() ? 'Зарегистрироваться' : 'Дальше'}
                        </Button>
                    </StyledButtons>
                </Form>
            )}
        </Formik>
    );
}

// export const getServerSideProps = async ctx => {
//     let countries = [];

//     await instanceWithSSR(ctx)
//         .get('https://parseapi.back4app.com/classes/Country/volodya?keys=name,code,capital')
//         .then(response => {
//             countries = response?.data;
//         })
//         .catch(error => {
//             console.log(error);
//         });
//     return {
//         props: {
//             countries
//         },
//     };
// };

const StyledRegister = styled.div`
    display: flex;
    width: 100%;
    max-width: 600px;
    padding: 30px 50px;
    border-radius: 1rem;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.3);
    min-height: 504px;
    .ant-form {
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    .ant-steps {
        margin-bottom: 40px;
    }
    .ant-radio-wrapper {
        display: block;
        margin-top: 30px;
    }
    .avatar-uploader {
        margin-top: 30px;
        display: flex;
        justify-content: center;
    }
    .ant-radio-group {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .ant-radio-wrapper {
            width: 160px;
        }
    }
    .form-item {
        margin-bottom: 24px;
    }
    h3 {
        text-align: center;
    }
    @media (max-width: 600px) {
        .ant-steps-item {
            padding-left: 0 !important;
        }
        .ant-steps {
            margin-bottom: 10px;
        }
    }
`;

const StyledButtons = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex: 0;
`;

const StyledForm = styled.div`
    flex: 1;
`;
