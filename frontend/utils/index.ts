import useSWR from 'swr';
import cookies from 'next-cookies';
import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';

export const getUserFromServer = (ctx: GetServerSidePropsContext<ParsedUrlQuery>) => {
    const userId = cookies(ctx)?.userId || null;
    const firstName = cookies(ctx)?.firstName || null;
    const lastName = cookies(ctx)?.lastName || null;
    const user = {
        userId: Number(userId),
        firstName: firstName,
        lastName: lastName
    }
    return user
}
