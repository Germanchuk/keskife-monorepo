import React from 'react';
import s from "./Input.module.css";

export const Input: React.FC<any> = (props) => {
  return (
    <input className={s.Input} {...props} />
  )
}
