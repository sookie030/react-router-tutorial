import React from "react";

class DefaultApplicationTrainingContainer extends React.Component {
    
  sourceCanvasRef = React.createRef();
  roiCanvasRef = React.createRef();
  previewCanvasRef = React.createRef();

  render() {
    return (
      <React.Fragment>
        <div className="module-area">
          <div className="preview-area">
            <canvas
              className="preview-canvas"
              ref={r => (this.previewCanvasRef = r)}
              width="210"
              height="210"
            />
          </div>
          <div className="context-area">
            <div className="nm500-area-title">
              <p>Context (Training)</p>
            </div>
            <div className="nm500-area-id">
              <p>{this.props.nm500.context.id}</p>
            </div>
            <div className="nm500-area-name">
              <p>{this.props.nm500.context.name}</p>
            </div>
          </div>

          <div className="category-area">
            <div className="nm500-area-title">
              <p>Category</p>
            </div>
            <div className="nm500-area-id">
              <p>{this.props.nm500.category.id}</p>
            </div>
            <div className="nm500-area-name">
              <p>{this.props.nm500.category.name}</p>
            </div>
          </div>
        </div>
        <div className="module-area">
          <div className="source-area">
            <canvas
              className="source-canvas"
              ref={r => (this.sourceCanvasRef = r)}
            />
            <canvas
              className="roi-canvas"
              ref={r => (this.roiCanvasRef = r)}
              onMouseDown={this.props.hasROI ? this.props.handleROIMouseDown : null}
              onMouseMove={this.props.hasROI ? this.props.handleROIMouseMove : null}
              onMouseUp={this.props.hasROI ? this.props.handleROIMouseUp : null}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default DefaultApplicationTrainingContainer;
