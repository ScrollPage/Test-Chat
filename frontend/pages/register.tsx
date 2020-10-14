import Link from 'next/link';
import ImgCrop from 'antd-img-crop';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    PhoneOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import { Upload, Button, Steps, message } from 'antd';
import { authSignup } from '@/store/actions/auth';
import VisitorLayout from '@/components/Layout/VisitorLayout';
import { object, string, ref } from 'yup';
import { Form, Input, Radio } from 'formik-antd';
import { useState, Children } from 'react';
import { Formik } from 'formik';

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

export default function Register() {

    const [avatarImage, setAvatarImage] = useState<any>(null);
    const [mutatedImage, setMutatedImage] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    function getBase64(img: any, callback: any) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    function beforeUpload(file: any) {
        const isJpgOrPng =
            file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    }

    const onPreview = async (file: any) => {
        let src = file.url;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    const handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (mutatedImage: any) => {
                setAvatarImage(info.file.originFileObj);
                setMutatedImage(mutatedImage);
                setLoading(false);
            });
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Загрузить фотографию</div>
        </div>
    );

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
                    }}
                    enableReinitialize={true}
                >
                    <FormikStep label="Данные" validationSchema={DataValidate}>
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
                    <FormikStep label="Аватар">
                        <h3>Выберите аватар вашего профиля:</h3>
                        <ImgCrop grid>
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                beforeUpload={beforeUpload}
                                onChange={handleChange}
                                onPreview={onPreview}
                            >
                                {mutatedImage ? (
                                    <img
                                        src={mutatedImage}
                                        alt="avatar"
                                        style={{ width: '100%' }}
                                    />
                                ) : (
                                    uploadButton
                                )}
                            </Upload>
                        </ImgCrop>
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
            onSubmit={async (values, { setSubmitting }) => {
                if (isLastElement()) {
                    setSubmitting(true);
                    dispatch(
                        authSignup(
                            values.email,
                            values.firstName,
                            values.lastName,
                            values.phoneNumber,
                            values.password,
                            values.confirmMethod
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
