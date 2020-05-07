import React from "react";
import Draggable from "react-draggable";

import * as MODULE_MANAGER from "../../constants/ModuleInfo";

class Node extends React.Component {
  OUTPUT_WIDTH = 293;
  OUTPUT_HEIGHT = 165;

  // TEXT_SPACE_X = 6;
  // TEXT_SPACE_Y = 13;
  // TEXT_LINE_SPACE_Y = 5;
  // PREVIEW_SIZE = 200;

  // canvasRef = React.createRef();

  // componentWillUpdate() {
  //   if (
  //     this.props.preview &&
  //     this.props.output !== undefined &&
  //     this.props.output !== null
  //   ) {
  //     this.updateCanvas();
  //   }
  // }

  // /**
  //  * Canvas에 캡쳐 이미지 뿌리기
  //  */
  // updateCanvas() {
  //   const canvasCtx = this.canvasRef.getContext("2d");
  //   // canvasCtx.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height);
  //   // canvasCtx.drawImage(
  //   //   this.props.output,
  //   //   0,
  //   //   0,
  //   //   this.props.output.width,
  //   //   this.props.output.height,
  //   //   0,
  //   //   0,
  //   //   this.canvasRef.width,
  //   //   this.canvasRef.height
  //   // );

  //   // canvasCtx.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height);
  //   // console.log("Node.. ", this.props.output);

  //   // imageData resize
  //   createImageBitmap(this.props.output, {
  //     resizeWidth: this.canvasRef.width,
  //     resizeHeight: this.canvasRef.height,
  //     resizeQuality: "high"
  //   }).then(image => {
  //     canvasCtx.drawImage(image, 0, 0, image.width, image.height);
  //   });
  // }

  render() {
    return (
      <Draggable
        defaultPosition={{
          x: this.props.node.getPosition()["x"],
          y: this.props.node.getPosition()["y"],
        }}
        onDrag={this.props.handleNodeDrag}
        onStop={this.props.handleNodeDragStop}
      >
        <div className="box">
          <div className="modulebox moduleboxdefault" id="modulebox">
            <span className="groupname">
              {this.props.node.getGroup()}
              <a href="" className="setting">
                <span className="oval"></span>
                <span className="oval"></span>
                <span className="oval"></span>
                <div className="deloption">
                  <img src="images/moduledel.svg" />
                  <span>Remove</span>
                </div>
              </a>
            </span>
            <hr />
            <div className="module">
              <span className="name">{this.props.node.getName()}</span>
              <span className="info">
                {MODULE_MANAGER.DESC[this.props.node.getName()].long}
              </span>
              <div className="option">
                {this.props.propertyCompopent}
                {/* <span>
                  <strong>Camera</strong>0
                </span>
                <span>
                  <strong>PositionX</strong>100
                </span>
                <span>
                  <strong>Size</strong>100x300
                </span> */}
              </div>
            </div>
            <div
              id="hiddenid"
              className={`hiddenimg ${this.props.preview ? "" : "hidden"}`}
            >
              {/* <img src="images/images.png" /> */}
              <canvas
                ref={(r) => (this.canvasRef = r)}
                width={this.OUTPUT_WIDTH}
                height={this.OUTPUT_HEIGHT}
              ></canvas>
            </div>
            <hr />
            <div
              id="more"
              className={this.props.preview ? "" : "rotation"}
              onMouseDown={this.props.handlePreviewMouseDown}
            >
              <button type="button" className="more">
                <span className="tri"></span>
              </button>
            </div>
          </div>
          <div className={`point`} id="point">
            <span className="top"></span>
            <span className="left"></span>
            <span className="right"></span>
            <span className="bottom"></span>
          </div>
        </div>
      </Draggable>
    );
    // return (
    //   <svg>
    //     <Draggable
    //       defaultPosition={{
    //         x: this.props.node.getPosition()["x"],
    //         y: this.props.node.getPosition()["y"]
    //       }}
    //       onDrag={this.props.handleNodeDrag}
    //       onStop={this.props.handleNodeDragStop}
    //     >
    //       {/* Node body */}
    //       <g className="node-container" id={"node-" + this.props.node.getID()}>
    //         <rect
    //           className="node-background"
    //           x="0"
    //           y="0"
    //           rx="6"
    //           ry="6"
    //           width={this.props.node.getSize()["width"]}
    //           height={this.props.node.getSize()["height"]}
    //         />
    //         <g className="node">
    //           <text
    //             className="header-group"
    //             x={this.props.node.getSize()["width"] / 2}
    //             y="20"
    //           >
    //             {this.props.node.getGroup()}
    //           </text>
    //           <text
    //             className="header-title"
    //             x={this.props.node.getSize()["width"] / 2}
    //             y="35"
    //           >
    //             {this.props.node.getName()}
    //           </text>

    //           {/* Node properties in body */}
    //           {this.props.propertyCompopent.map((prop, index) => {
    //             return (
    //               <React.Fragment key={index}>
    //                 <rect
    //                   className="content-property-rect"
    //                   rx="6"
    //                   ry="10"
    //                   width={prop.width}
    //                   height={prop.height}
    //                   x={prop.x}
    //                   y={prop.y}
    //                 ></rect>
    //                 <text className="content-property">
    //                   {prop.value.map((v, index) => {
    //                     return (
    //                       <tspan
    //                         key={`v-${index}`}
    //                         x={prop.x + this.TEXT_SPACE_X}
    //                         y={
    //                           prop.y +
    //                           this.TEXT_LINE_SPACE_Y * index +
    //                           this.TEXT_SPACE_Y * (index + 1)
    //                         }
    //                       >
    //                         {v}
    //                       </tspan>
    //                     );
    //                   })}
    //                 </text>
    //               </React.Fragment>
    //             );
    //           })}
    //         </g>

    //         {/* Node mouse events */}
    //         <g
    //           onMouseOver={this.props.handleNodeMouseOver}
    //           onMouseLeave={this.props.handleNodeMouseLeave}
    //           onMouseDown={this.props.handleMouseDown}
    //           onClick={this.props.handleNodeClick}
    //           // onDoubleClick={this.props.handleNodeDoubleClick}
    //         >
    //           {/* Node stroke when mouse over */}
    //           <rect
    //             className={
    //               this.props.node.getID() === this.props.selectedNodeID
    //                 ? "node-selector selected"
    //                 : "node-selector"
    //             }
    //             x="0"
    //             y="0"
    //             rx="6"
    //             ry="6"
    //             width={this.props.node.getSize()["width"]}
    //             height={this.props.node.getSize()["height"]}
    //             // style={
    //             //   this.props.node.getID() === this.props.selectedNodeID
    //             //     ? { stroke: "#d0ff00" }
    //             //     : { stroke: "none" }
    //             // }
    //           />

    //           {/* Node Preview */}
    //           <g className="node-preview">
    //             <g
    //               className="node-preview-button"
    //               onMouseDown={this.props.handlePreviewMouseDown}
    //             >
    //               <rect
    //                 rx="3"
    //                 ry="3"
    //                 width={20}
    //                 height={10}
    //                 x={(this.props.node.getSize()["width"] - 20) / 2}
    //                 y={this.props.node.getSize()["height"] - 20}
    //               ></rect>

    //               <text
    //                 className="node-preview-text"
    //                 x={this.props.node.getSize()["width"] / 2}
    //                 y={this.props.node.getSize()["height"] - 11}
    //               >
    //                 {this.props.preview ? "∧" : "∨"}
    //               </text>
    //             </g>
    //             <g>
    //               {this.props.preview ? (
    //                 <foreignObject
    //                   x="10"
    //                   y={
    //                     this.props.node.getSize()["height"] -
    //                     this.PREVIEW_SIZE -
    //                     10
    //                   }
    //                   width={this.props.node.getSize()["width"] - 20}
    //                   height={this.props.node.getSize()["width"] - 20}
    //                 >
    //                   <canvas
    //                     ref={r => (this.canvasRef = r)}
    //                     width={this.props.node.getSize()["width"] - 20}
    //                     height={this.props.node.getSize()["width"] - 20}
    //                   ></canvas>
    //                 </foreignObject>
    //               ) : null}
    //             </g>
    //           </g>

    //           {/* Only display 4 ports when mouse over */}
    //           <g
    //             className="ports"
    //             style={
    //               this.props.node.getID() === this.props.selectedNodeID
    //                 ? { display: "block" }
    //                 : { display: "none" }
    //             }
    //           >
    //             <Ports
    //               node={this.props.node}
    //               onMouseDown={this.props.handlePortMouseDown}
    //             />
    //           </g>
    //         </g>
    //       </g>
    //     </Draggable>
    //   </svg>
    // );
  }
}

/**
 * 4 ports in a node
 * @param {*} props
 */
const Ports = (props) => (
  <g style={{ display: "block" }} onMouseDown={props.onMouseDown}>
    {/* Left port */}
    <g className="port" id={props.node.getID() + "-left"}>
      <circle
        className="port-outer"
        cx="0"
        cy={props.node.getSize()["height"] / 2}
        r="7.5"
      />
      <circle
        className="port-inner"
        cx="0"
        cy={props.node.getSize()["height"] / 2}
        r="5"
      />
    </g>

    {/* Right port */}
    <g className="port" id={props.node.getID() + "-right"}>
      <circle
        className="port-outer"
        cx={props.node.getSize()["width"]}
        cy={props.node.getSize()["height"] / 2}
        r="7.5"
      />
      <circle
        className="port-inner"
        cx={props.node.getSize()["width"]}
        cy={props.node.getSize()["height"] / 2}
        r="5"
      />
    </g>

    {/* Top port */}
    <g className="port" id={props.node.getID() + "-top"}>
      <circle
        className="port-outer"
        cx={props.node.getSize()["width"] / 2}
        cy="0"
        r="7.5"
      />
      <circle
        className="port-inner"
        cx={props.node.getSize()["width"] / 2}
        cy="0"
        r="5"
      />
    </g>

    {/* Bottom port */}
    <g className="port" id={props.node.getID() + "-bottom"}>
      <circle
        className="port-outer"
        cx={props.node.getSize()["width"] / 2}
        cy={props.node.getSize()["height"]}
        r="7.5"
      />
      <circle
        className="port-inner"
        cx={props.node.getSize()["width"] / 2}
        cy={props.node.getSize()["height"]}
        r="5"
      />
    </g>
  </g>
);

export default Node;
