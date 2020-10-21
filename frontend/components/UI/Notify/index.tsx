import { BellOutlined } from '@ant-design/icons';
import React from 'react';
import { StyledNotify } from './styles';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { getNotify } from '@/store/selectors';

const Notify = () => {
    const notify = useSelector(getNotify);

    return (
        <StyledNotify>
            <Link href="/notify">
                <a>
                    <BellOutlined style={{ fontSize: '22px' }} />
                    {notify !== 0 ? (
                        <div className="notify__count">
                            <span>{notify}</span>
                        </div>
                    ) : null}
                </a>
            </Link>
        </StyledNotify>
    );
};

export default Notify;
