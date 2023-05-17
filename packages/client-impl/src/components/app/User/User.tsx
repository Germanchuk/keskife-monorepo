import React from 'react';
import s from "./User.module.css";

export const User = ({children, onClick, selected, superSelected}: any) => {
    const superSelectedClass = superSelected ? s.superSelected : null;
    const selectedClass = (selected && !superSelected) ? s.selected : null;
    

  return (
    <button className={`${s.User} ${selectedClass} ${superSelectedClass}`} onClick={onClick}>{children}</button>
  );
}
