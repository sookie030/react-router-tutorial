import React from "react";
import "../assets/styles/welcome.css";

// redux module
import { connect } from "react-redux";

// import external component
import { Link } from "react-router-dom";

// import constants
import * as MODULES from "../constants/module/Modules";
import * as GROUPS from "../constants/module/Groups";

class WelcomeContainer extends React.Component {
  createLinkboard = (templateID, e) => {
    this.props.pipelineManager.clearPipeline();
    switch (templateID) {
      case 1:
        // Face Recognition
        this.props.pipelineManager.addNode(MODULES.FACE_CAMERA, GROUPS.SOURCE, {
          x: 600,
          y: 80
        });
        this.props.pipelineManager.addNode(MODULES.SUBSAMPLE, GROUPS.FEATURE, {
          x: 600,
          y: 230
        });
        this.props.pipelineManager.addNode(MODULES.NM500, GROUPS.AI, {
          x: 600,
          y: 380
        });

        break;
      case 2:
        // Object Recognition
        this.props.pipelineManager.addNode(MODULES.CAMERA, GROUPS.SOURCE, {
          x: 600,
          y: 80
        });
        this.props.pipelineManager.addNode(MODULES.ROI, GROUPS.FILTER, {
          x: 600,
          y: 230
        });
        this.props.pipelineManager.addNode(MODULES.SUBSAMPLE, GROUPS.FEATURE, {
          x: 600,
          y: 380
        });
        this.props.pipelineManager.addNode(MODULES.NM500, GROUPS.AI, {
          x: 600,
          y: 530
        });

        break;
      case 3:
        // Grid Recognition
        this.props.pipelineManager.addNode(MODULES.CAMERA, GROUPS.SOURCE, {
          x: 600,
          y: 80
        });
        this.props.pipelineManager.addNode(MODULES.GRID, GROUPS.FILTER, {
          x: 600,
          y: 230
        });
        this.props.pipelineManager.addNode(MODULES.SUBSAMPLE, GROUPS.FEATURE, {
          x: 600,
          y: 380
        });
        this.props.pipelineManager.addNode(
          MODULES.GRID_MAKER,
          GROUPS.NOTIFIER,
          { x: 950, y: 380 }
        );
        this.props.pipelineManager.addNode(MODULES.HOG, GROUPS.FEATURE, {
          x: 600,
          y: 530
        });
        this.props.pipelineManager.addNode(MODULES.NM500, GROUPS.AI, {
          x: 950,
          y: 530
        });

        break;
      case 4:
        // Data Processing Pro

        break;
      default:
        break;
    }
  };

  render() {
    return (
      <div className="content-area">
        <div className="global-content-area">
          <Link to="/linkboard">
            <button id="btn-new-link" onClick={e => this.createLinkboard(0, e)}>
              Create new link
            </button>
          </Link>
          <div>
            <div className="welcome-process-area">
              <h1>Welcome</h1>
              <h3>Create your own link</h3>
              <div className="welcome-table">
                <div className="welcome-table-cell welcome-process-oval">
                  <p>1. Make a link</p>
                </div>
                <div className="welcome-table-cell welcome-process-oval">
                  <p>2. Training</p>
                </div>
                <div className="welcome-table-cell welcome-process-oval">
                  <p>3. Classification</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="welcome-title-area">
              <h1>Create New Link</h1>
            </div>

            <div className="welcome-table">
              <Link to="/linkboard">
                <div
                  className="welcome-table-cell welcome-border-button"
                  onClick={e => this.createLinkboard(0, e)}
                >
                  <p>New Link</p>
                </div>
              </Link>
              <Link to="/linkboard">
                <div
                  className="welcome-table-cell welcome-border-button"
                  onClick={e => this.createLinkboard(1, e)}
                >
                  <p>Face recognition</p>
                </div>
              </Link>
              <Link to="/linkboard">
                <div
                  className="welcome-table-cell welcome-border-button"
                  onClick={e => this.createLinkboard(2, e)}
                >
                  <p>Object recognition</p>
                </div>
              </Link>
              <Link to="/linkboard">
                <div
                  className="welcome-table-cell welcome-border-button"
                  onClick={e => this.createLinkboard(3, e)}
                >
                  <p>Grid Detection</p>
                </div>
              </Link>
              <Link to="/linkboard">
                <div
                  className="welcome-table-cell welcome-border-button"
                  onClick={e => this.createLinkboard(4, e)}
                >
                  <p>Data processing (Pro)</p>
                </div>
              </Link>
            </div>
          </div>

          <div>
            <div className="welcome-title-area">
              <h1>Popular Templates</h1>
            </div>
            <div className="welcome-table">
              <div className="welcome-table-cell welcome-border-button">
                <p>Face recognition</p>
              </div>
              <div className="welcome-table-cell welcome-border-button">
                <p>Object recognition</p>
              </div>
              <div className="welcome-table-cell welcome-border-button">
                <p>Data processing (Pro)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

let mapStateToProps = state => {
  return {
    pipelineManager: state.pipelineManager.get("pipelineManager")
  };
};

let mapDispatchToProps = dispatch => {
  return {};
};

WelcomeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(WelcomeContainer);
export default WelcomeContainer;
