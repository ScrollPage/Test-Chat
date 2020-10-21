import { addViewPostMutate } from '@/mutates/post';
import { addViewPost } from '@/store/actions/post';
import { whereAreThePostLink } from '@/utils';
import { registerObserver } from '@/utils/intersectionObserver';
import { EyeOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { StyledViews } from './styles';

interface IViews {
    isWatched: boolean;
    postId: number;
    pageUserId?: number;
    partyId?: number;
}

const Views: React.FC<IViews> = ({
    isWatched,
    postId,
    pageUserId,
    partyId,
}) => {
    const dispatch = useDispatch();
    const placeHolderRef = useRef<HTMLDivElement>(null);
    const [isWatchedOnClient, setIsWatchedOnClient] = useState(false);

    const viewsMutate = (): void => {
        const postUrl = whereAreThePostLink(pageUserId, partyId);
        addViewPostMutate(postUrl, postId);
        dispatch(addViewPost(postId));
    };

    useEffect(() => {
        registerObserver(placeHolderRef.current, setIsWatchedOnClient);
    }, []);

    useEffect(() => {
        if (isWatchedOnClient && !isWatched) {
            viewsMutate();
        }
    }, [isWatchedOnClient]);

    return (
        <StyledViews ref={placeHolderRef}>
            <EyeOutlined style={{ fontSize: '23px' }} />
        </StyledViews>
    );
};

export default Views;
