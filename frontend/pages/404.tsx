import styled from 'styled-components';
import Head from 'next/head';

export default function Custom404() {
    return (
        <StyledCustom404>
            <Head>
                <title>404 ошибка</title>
            </Head>
            <h1>404 - Страница не найдена</h1>
        </StyledCustom404>
    );
}

const StyledCustom404 = styled.div`
    display: flex;
    height: 100vh;
    width: 100%;
    justify-content: center;
    align-items: center;
`;
