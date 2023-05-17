import React from 'react'
import { useAppSelector } from '../../app/hooks'
import { selectAllUsers } from '../../redux/selectors';
import { User } from '../../components/app/User/User';

export default function AllUsersScreen() {
    const users = useAppSelector(selectAllUsers);
  return (
    <div>
        <h2>AllUsersScreen</h2>
        {users.length && users.map(user => <User  key={user.id}>{user.name}</User>)}
    </div>
  )
}
