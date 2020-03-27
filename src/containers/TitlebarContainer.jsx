import React from "react";
import "../assets/styles/titlebar.css";

// redux module
import { connect } from "react-redux";

// router module
import { withRouter } from "react-router";

// import images
import icLogo from "../assets/images/ic_logo.png";

const BrowserWindow = window.BrowserWindow;

const TITLEBAR_BUTTONS = {
  MINIMIZE: "minimize",
  MAXIMAZE: "maximize",
  CLOSE: "close"
};

class TitlebarContainer extends React.Component {
  handleClickButton = (button, e) => {
    let theWindow = BrowserWindow.getFocusedWindow();

    switch (button) {
      case TITLEBAR_BUTTONS.MINIMIZE:
        theWindow.minimize();
        break;
      case TITLEBAR_BUTTONS.MAXIMAZE:
        theWindow.maximize();
        break;
      case TITLEBAR_BUTTONS.CLOSE:
        theWindow.close();
        break;
      default:
        break;
    }
  };

  render() {
    return (
      <div className="titlebar-content">
        <div className="icon-area">
          <img src={icLogo} alt="" width="30" height="30" />
        </div>
        <div className="title-area">
          <p>Welcome</p>
        </div>
        <div className="button-area">
          <span
            onClick={e => this.handleClickButton(TITLEBAR_BUTTONS.MINIMIZE, e)}
          >
            최소화
          </span>
          <span
            onClick={e => this.handleClickButton(TITLEBAR_BUTTONS.MAXIMAZE, e)}
          >
            최대화
          </span>
          <span
            onClick={e => this.handleClickButton(TITLEBAR_BUTTONS.CLOSE, e)}
          >
            닫기
          </span>
        </div>
      </div>
    );
  }
}

let mapStateToProps = state => {
  return {};
};

let mapDispatchToProps = dispatch => {
  return {};
};
TitlebarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TitlebarContainer);
export default withRouter(TitlebarContainer);
