import React from 'react'
import { useAppSelector } from '../../app/hooks'
import { selectAllUsers } from '../../redux/selectors';
import { User } from '../../components/app/User/User';
import monkey from "./monkey.png";

export default function RewardingScreen() {
    const users = useAppSelector(selectAllUsers);
    const sortedUsers = Array.from(users).sort((a,b) => b.points - a.points);
    return (
      <div>
          <h2>AllUsersScreen</h2>
          {sortedUsers.length && sortedUsers.map(user => <User key={user.id}>{user.monkey && <img src={monkey} alt="monkey" width={32} height={32} />} {user.name} ({user.points})</User>)}
      </div>
    )
}
