import React from 'react'
import { Avatar} from 'antd';
import randomcolor from 'randomcolor';

const UserFriends = ({friends}) => {

  return (
    <Avatar.Group maxCount={6} maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
      {friends.map(friend => (
        <Avatar key={`{user-friend__key__${friend.id}}`} style={{ backgroundColor: `${randomcolor()}` }} />
      ))}
    </Avatar.Group>
  )
}

export default UserFriends
