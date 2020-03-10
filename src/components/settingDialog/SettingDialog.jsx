import React from 'react';
import Draggable from 'react-draggable';
import '../../assets/styles/property-setting-dialog.css';

const SettingDialog = props => (
  <div className="Modal-overlay">
    <Draggable
      defaultPosition={{
        x: window.innerWidth * 1/2 - 250, // Dialog width = 500
        y: window.innerHeight * 3/10,
      }}
    >
      <div className="Modal">
        <p className="title">{props.node.getName()}</p>
        <div className="content">{props.propertyCompopent}</div>
        <div className="button-wrap">
          <button
            id="btn-confirm"
            className={props.disableToConfirm ? 'disabled' : ''}
            value="confirm"
            disabled={props.disableToConfirm}
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
          >
            Confirm
          </button>
          <button
            id="btn-cancel"
            value="cancel"
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
          >
            Cancel
          </button>
        </div>
      </div>
    </Draggable>
  </div>
);

export default SettingDialog;
