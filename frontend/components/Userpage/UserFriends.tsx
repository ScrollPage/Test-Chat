import React from 'react';
import { Avatar } from 'antd';
import { IContactUser } from '@/types/people';

interface UserFriends {
    friends: Array<IContactUser>;
}

const UserFriends: React.FC<UserFriends> = ({ friends }) => {
    return (
        <Avatar.Group
            maxCount={6}
            maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
        >
            {friends.map(friend => (
                <Avatar
                    key={`{user-friend__key__${friend.id}}`}
                    style={{ backgroundColor: 'red' }}
                />
            ))}
        </Avatar.Group>
    );
};

export default UserFriends;