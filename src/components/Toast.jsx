import React from 'react';
import '../assets/styles/toast.css';

const Toast = props => (
  <div className={'toast ' + props.messageType} ref={props.toastRef}>
    {props.message}
  </div>
);

export default Toast;
