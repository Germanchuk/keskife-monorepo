import React from 'react';
import s from "./WelcomeScreen.module.css";
import { Input } from '../../components/core/Input/Input';
import { Button } from '../../components/core/Button/Button';
import { useDispatch } from 'react-redux';
import { ForServerActions } from '../../Shared';

export default function WelcomeScreen() {
  const [ name, setName ] = React.useState('');
  const dispatch = useDispatch();

  function handleSubmit(e: any) {
    e.preventDefault();
    console.log(name);
    dispatch({
      type: ForServerActions.SET_USER_NAME,
      payload: name
    });
  }

  return (
    <div>
      <h1 className={s.logo}>Keskife</h1>
      <form className={s.form} onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Введіть своє імʼя"
          value={name}
          onChange={(e: any) => setName(e.target.value)}
        />
        <Button type="submit">Логін</Button>
      </form>
    </div>
  )
}
