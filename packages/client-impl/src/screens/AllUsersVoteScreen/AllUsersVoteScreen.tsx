import React from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAllUsers, selectUserId, selectVoted } from '../../redux/selectors';
import { User } from '../../components/app/User/User';
import { ForServerActions } from '../../Shared';

export default function AllUsersVoteScreen() {
  const users = useAppSelector(selectAllUsers);
  const voted = useAppSelector(selectVoted);
  const id = useAppSelector(selectUserId);

  const dispatch = useAppDispatch();
  const [selectedUser, setSelectedUser] = React.useState('');
  const [superSelected, setSuperSelected] = React.useState(voted);

  function handleClick(selectedId: string) {
    if (!superSelected) {
      if (selectedUser === selectedId) {
        dispatch({
          type: ForServerActions.VOTE_THE_USER,
          payload: selectedUser,
        })
        setSuperSelected(selectedId);
      } else {
        setSelectedUser(selectedId);
      }
    }
  }

  return (
    <div>
        <h2>AllUsersScreen</h2>
        {users.length && users.map(user => {
          if(user.id === id) {
            return null;
          }
         return <User
            onClick={() => handleClick(user.id)}
            selected={user.id === selectedUser}
            superSelected={user.id === superSelected}
            key={user.id}
          >
            {user.name}
          </User>
        })}
    </div>
  )
}
