import { useEffect, useState } from 'react';
import cookies from 'next-cookies';
import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';

export const whereAreThePostLink = (pageUserId?: number, partyId?: number, isOffer?: boolean) => {
    if (pageUserId) {
        return `/api/v1/post/?id=${pageUserId}`;
    }
    if (isOffer && partyId) {
        return `/api/v1/group/offer/${partyId}/`
    }
    if (partyId) {
        return `/api/v1/group/accept/${partyId}/`;
    }
    return '/api/v1/feed/';
};

export function getAsString(value: string | string[] | undefined): string | undefined {
    if (Array.isArray(value)) {
        return value[0];
    }
    return value;
}

export const getUserFromServer = (ctx: GetServerSidePropsContext<ParsedUrlQuery>) => {
    const userId = cookies(ctx)?.userId || "";
    const firstName = cookies(ctx)?.firstName || "";
    const lastName = cookies(ctx)?.lastName || "";
    const smallAvatar = cookies(ctx)?.smallAvatar || "";
    const user = {
        userId: Number(userId),
        firstName: firstName,
        lastName: lastName,
        smallAvatar: smallAvatar
    }
    return user
}

export const renderTimestamp = (timestamp: string): string => {
    let prefix = '';
    const timeDiff = Math.round(
        (new Date().getTime() - new Date(timestamp).getTime()) / 60000
    );
    if (timeDiff < 1) {
        prefix = 'только что...';
    } else if (timeDiff < 60 && timeDiff > 1) {
        prefix = `${timeDiff} минут назад`;
    } else if (timeDiff < 24 * 60 && timeDiff > 60) {
        prefix = `${Math.round(timeDiff / 60)} часов назад`;
    } else if (timeDiff < 31 * 24 * 60 && timeDiff > 24 * 60) {
        prefix = `${Math.round(timeDiff / (60 * 24))} дней назад`;
    } else {
        prefix = `${new Date(timestamp)}`;
    }
    return prefix;
};


export const isImageLoaded = (src: string) => {

    const [loadImage, setLoadImage] = useState(false);

    const loadImageWithPromiseTimeout = (src: string) =>
        new Promise((resolve, reject) => {
            const image = new Image();

            const timeout = setTimeout(() => {
                image.onload = null;
                reject();
            }, 1000);

            image.onload = () => {
                clearTimeout(timeout);
                resolve();
            };

            image.src = src;
        });

    const awaitImage = async () => {
        try {
            await loadImageWithPromiseTimeout(src);
            setLoadImage(true);
        } catch {
            console.error(`Unable to load ${src} in 1s`);
            setLoadImage(true);
        }
    };

    useEffect(() => {
        awaitImage();
    })

    return loadImage
}
