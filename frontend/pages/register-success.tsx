import { useRouter } from 'next/router';
import Error from 'next/error';
import { useDispatch } from 'react-redux';
import { phoneActivate } from '@/store/actions/auth';
import styled from 'styled-components';
import VisitorLayout from '@/components/Layout/VisitorLayout';
import { GetServerSideProps } from 'next';
import { Button, Input } from 'antd';
import { getAsString } from '@/utils';
import { FormEvent, useState } from 'react';

interface IRegisterSuccess {
    confirmMethod?: string;
}

export default function RegisterSuccess({ confirmMethod }: IRegisterSuccess) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const { push } = useRouter();

    if (
        !confirmMethod ||
        !(confirmMethod === 'phone' || confirmMethod === 'email')
    ) {
        return <Error statusCode={404} />;
    }

    const onsubmitHandler = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (code.trim() !== '') {
            dispatch(phoneActivate(code));
        }
    };

    return (
        <VisitorLayout>
            <StyledRegisterSuccess>
                {confirmMethod === ('email' as string) && (
                    <>
                        <h2>На ваш E-mail пришло письмо с подтверждением</h2>
                        <Button
                            type="primary"
                            onClick={() =>
                                push({ pathname: '/' }, undefined, {
                                    shallow: true,
                                })
                            }
                        >
                            Перейти на страницу входа
                        </Button>
                    </>
                )}
                {confirmMethod === ('phone' as string) && (
                    <>
                        <form onSubmit={onsubmitHandler}>
                            <h2>На ваш телефон пришел код</h2>
                            <Input
                                size="large"
                                name="confirmCode"
                                placeholder="Код"
                                value={code}
                                onChange={({ target }) => setCode(target.value)}
                            />
                            <small>{error}</small>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={!code}
                            >
                                Подтвердить
                            </Button>
                        </form>
                    </>
                )}
            </StyledRegisterSuccess>
        </VisitorLayout>
    );
}

export const getServerSideProps: GetServerSideProps<IRegisterSuccess> = async ctx => {
    let confirmMethod = getAsString(ctx.query.confirmMethod);
    return {
        props: {
            confirmMethod,
        },
    };
};

const StyledRegisterSuccess = styled.div`
    flex-direction: column;
    align-items: center;
    display: flex;
    width: 100%;
    max-width: 400px;
    padding: 50px;
    border-radius: 1rem;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.3);
    font-weight: 700;
    .ant-input-lg {
        margin-top: 20px;
    }
    .ant-btn {
        margin-top: 30px;
    }
    > form {
        display: flex;
        flex-direction: column;
    }

    h2 {
        text-align: center;
    }
`;
