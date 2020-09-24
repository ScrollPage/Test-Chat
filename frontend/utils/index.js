import useSWR from 'swr';
import cookies from 'next-cookies';

export const swr = (url, iniitalData) => {
    const { data } = useSWR(url, { initialData: iniitalData });
    return data;
};

export const getUserFromServer = (ctx) => {
    const userId = cookies(ctx)?.userId || null;
    const firstName = cookies(ctx)?.firstName || null;
    const lastName = cookies(ctx)?.lastName || null;
    const user = {
        userId: userId,
        firstName: firstName,
        lastName: lastName
    }
    return user
}
