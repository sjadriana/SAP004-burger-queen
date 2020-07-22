import React from 'react';
import './Input.css'

const Input = (props) => {
  return <input type={props.type} id={props.id} className={props.class} placeholder={props.placeholder}></input>
}

export default Input;