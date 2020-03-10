import React from 'react';

// redux modules
import { connect } from 'react-redux';

import Toast from '../components/Toast';

class ToastContainer extends React.Component {
  toast = React.createRef();

  state = {
    // toast를 요청한 시간
    timeStamp: null,
    // toast 내용
    message: '',
    // toast를 보여줄 시간
    duration: 3000,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.timeStamp !== prevState.timeStamp) {
      return { timeStamp: nextProps.timeStamp, message: nextProps.message };
    }
    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.timeStamp !== nextProps.timeStamp;
  }

  showToast = () => {
    if (this.toast.style !== undefined) {
      this.toast.style.opacity = 1;
      setTimeout(() => {
        this.toast.style.opacity = 0;
      }, this.state.duration);
    }
  };

  /**
   * render
   */
  render() {
    this.showToast();
    return (
      <Toast
        toastRef={ref => (this.toast = ref)}
        message={this.props.message}
        messageType={this.props.messageType}
      />
    );
  }
}

let mapStateToProps = state => {
  return {
    timeStamp: state.toastManager.get('timeStamp'),
    message: state.toastManager.get('message'),
    messageType: state.toastManager.get('messageType'),
  };
};

let mapDispatchToProps = dispatch => {
  return {};
};
ToastContainer = connect(mapStateToProps, mapDispatchToProps)(ToastContainer);
export default ToastContainer;
