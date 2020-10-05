import { useEffect, useState } from 'react';
import useSWR from 'swr';
import cookies from 'next-cookies';
import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';

export const getUserFromServer = (ctx: GetServerSidePropsContext<ParsedUrlQuery>) => {
    const userId = cookies(ctx)?.userId || "";
    const firstName = cookies(ctx)?.firstName || "";
    const lastName = cookies(ctx)?.lastName || "";
    const user = {
        userId: Number(userId),
        firstName: firstName,
        lastName: lastName
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
