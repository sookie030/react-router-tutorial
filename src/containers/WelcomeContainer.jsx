import React from "react";
import "../assets/styles/welcome.css";

// redux module
import { connect } from "react-redux";

// import constants
import * as TEMPLATES from "../constants/TemplateType";
import { MODULES, GROUPS } from "../constants/ModuleInfo";

class WelcomeContainer extends React.Component {
  createLinkboard = (template, e) => {
    this.props.pipelineManager.clearPipeline();
    switch (template) {
      case TEMPLATES.FACE_RECOGNITION:
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
      case TEMPLATES.OBJECT_RECOGNITION:
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
      case TEMPLATES.GRID_RECOGNITION:
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
      case TEMPLATES.DATA_PROCESSING_PRO:
        // Data Processing Pro

        break;
      default:
        break;
    }
    this.props.history.push("/linkboard");
  };

  getTemplateList() {
    const templates = Object.values(TEMPLATES);
    let templateList = templates.map((template, index) => {
      return (
        <p
          key={index}
          className="worklinks"
          onClick={e => this.createLinkboard(template, e)}
        >
          {template}
        </p>
      );
    });

    return templateList;
  }

  render() {
    const templateList = this.getTemplateList();
    return (
      <div className="content-area">
        <div className="welcome-view">
          <div>
            <div className="start-area">
              <h1>Start</h1>
              <p className="worklinks" onClick={e => this.createLinkboard(e)}>
                New Data Pipeline
              </p>
              <p className="worklinks">Knowledge Model Analysis</p>
            </div>

            <div className="recent-area">
              <h1>Recent</h1>
              <p className="worklinks">Test</p>
              <p className="worklinks">hi</p>
              <p className="worklinks">Knowledge Model Analysis</p>
            </div>
          </div>
          <div>
            <div className="tutorial-area">
              <h1>Tutorials</h1>
              {templateList}
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
