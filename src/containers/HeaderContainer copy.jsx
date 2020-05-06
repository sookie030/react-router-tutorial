// import React from "react";
// import { withRouter } from "react-router";
// import "../assets/css/common.css";

// // import constants
// import * as EVENT_TYPE from "../constants/EventType";
// import { MESSAGE_TYPE } from "../constants/Message";

// // redux modules
// import { connect } from "react-redux";
// import { setPipelineManager, setDummyNumber, setToast } from "../redux/actions";

// import PipelineManager from "../manager/PipelineManager";

// const WelcomeHeader = (props) => {
//   return (
//     <div className="header-area">
//       <img src={icLogo} alt="" width="30" height="30" />
//       <div className="header-text-area">
//         <p className="header-text">Knowledge Studio 2.0</p>
//       </div>
//     </div>
//   );
// };

// const LinkboardHeader = (props) => {
//   return (
//     <div className="header-area">
//       <div className="button" onClick={props.handleClickBackBtn}>
//         <img src={icBack} alt="" width="30" height="30" />
//       </div>
//       <div className="header-text-area">
//         <p className="header-text">{props.name}</p>
//       </div>
//       <div className="header-button-area">
//         <div
//           className="header-button bg-color-green"
//           onMouseUp={props.handleClickRunBtn}
//         >
//           {props.isPipelineRunning ? "STOP" : "RUN"}
//         </div>
//         <div
//           className={`header-button bg-color-orange ${
//             props.isPipelineRunning ? "disabled" : ""
//           }`}
//           onClick={() => {
//             if (!props.isPipelineRunning) {
//               props.handleClickRunBtn();
//               props.history.push("/appview/0");
//             }
//           }}
//         >
//           Application View
//         </div>
//       </div>
//     </div>
//   );
// };

// const AppViewHeader = (props) => {
//   return (
//     <div className="header-area bg-color-orange">
//       <div className="button" onClick={props.handleClickBackBtn}>
//         <img src={icBack} alt="" width="30" height="30" />
//       </div>
//       <div className="header-text-area">
//         <p className="header-text">Pipeline Link</p>
//       </div>
//       <div className="header-button-area">
//         <div
//           className="header-button bg-color-green"
//           onMouseUp={props.handleClickRunBtn}
//         >
//           {props.isPipelineRunning === true ? "STOP" : "RUN"}
//         </div>
//       </div>
//     </div>
//   );
// };

// // const Header = props => {
// class Header extends React.Component {
//   state = {
//     isPipelineRunning: false,
//   };

//   /**
//    * PipelineManager 클래스 인스턴스를 생성하여
//    * Reducer에 설정한다.
//    */
//   UNSAFE_componentWillMount() {
//     let pipelineManager = new PipelineManager();

//     // 파이프라인 사이클 한 번 돌았음을 알려줌
//     pipelineManager.addListener(
//       EVENT_TYPE.ONE_PIPELINE_CYCLE_IS_OVER,
//       (flag) => {
//         console.log("ONE_PIPELINE_CYCLE_IS_OVER");
//         if (flag) {
//           console.log("PIPELINE_RUN_OR_STOP");
//           let flag = this.state.isPipelineRunning;
//           this.setState(
//             {
//               isPipelineRunning: !flag,
//             },
//             () => {
//               this.props.pipelineManager.setIsPipelineRunning(!flag);
//             }
//           );
//         }
//         if (!this.props.isPipelineDragging) {
//           this.props.onSetDummyNumber();
//         }
//       }
//     );

//     // Toast 띄우기
//     pipelineManager.addListener(
//       EVENT_TYPE.POP_UP_TOAST,
//       (message, messageType) => {
//         this.props.onSetToast(Date.now(), message, messageType);

//         if (messageType === MESSAGE_TYPE.ERROR) {
//           this.setState(
//             {
//               isPipelineRunning: false,
//             },
//             () => {
//               this.props.pipelineManager.setIsPipelineRunning(false);
//               // this.props.onIsPipelineRunning(false);
//             }
//           );
//         }
//       }
//     );

//     this.props.onSetPipelineManager(pipelineManager);
//   }

//   handleClickBackBtn = (e) => {
//     this.props.history.goBack();
//   };

//   /**
//    * Pipeline 실행
//    */
//   handleClickRunBtn = (e) => {
//     let flag = this.state.isPipelineRunning;
//     this.setState(
//       {
//         isPipelineRunning: !flag,
//       },
//       () => {
//         this.props.pipelineManager.setIsPipelineRunning(!flag);
//         // this.props.onIsPipelineRunning(!flag);
//       }
//     );
//   };

//   getHeader() {
//     const location = this.props.location.pathname;
//     console.log(location);
//     switch (location) {
//       case "/":
//         return <WelcomeHeader />;

//       case "/linkboard":
//         return (
//           <LinkboardHeader
//             name={"untitled"}
//             isPipelineRunning={this.state.isPipelineRunning}
//             handleClickRunBtn={this.handleClickRunBtn}
//             handleClickBackBtn={this.handleClickBackBtn}
//             history={this.props.history}
//           />
//         );

//       case "/appview/0":
//         return (
//           <AppViewHeader
//             isPipelineRunning={this.state.isPipelineRunning}
//             handleClickRunBtn={this.handleClickRunBtn}
//             handleClickBackBtn={this.handleClickBackBtn}
//             history={this.props.history}
//           />
//         );

//       default:
//         return null;
//     }
//   }

//   render() {
//     // let header = this.getHeader();
//     // return this.getHeader();
//     return (
//       <React.Fragment>
//         <header>
//           <h1>
//             <a href="#"></a>
//           </h1>
//           {/* <!-- Titlebar menu --> */}
//           <nav className="nav">
//             <ul>
//               <li>
//                 {/* <!-- 1depth --> */}
//                 <a href="#">File</a>
//                 <ul>
//                   <li>
//                     {/* <!-- 2depth --> */}
//                     <a href="">
//                       New <span>Ctrl+N</span>
//                     </a>
//                   </li>
//                   <li>
//                     <a href="">
//                       New Templete<span className="viewsub"></span>
//                     </a>
//                     <ul>
//                       <li>
//                         {/* <!-- 3depth --> */}
//                         <a href="">Object Recognation</a>
//                       </li>
//                       <li>
//                         <a href="">Grid Detection</a>
//                       </li>
//                       <li>
//                         <a href="">Face Recognation</a>
//                       </li>
//                     </ul>
//                   </li>
//                   <li>
//                     <a href="">
//                       Open<span>Ctrl+O</span>
//                     </a>
//                   </li>
//                   <li>
//                     <a href="">
//                       Open Recently<span className="viewsub"></span>
//                     </a>
//                     <ul>
//                       <li>
//                         {/* <!-- 3depth --> */}
//                         <a href="">fimename.dpl</a>
//                       </li>
//                       <li>
//                         <a href="">filename2.dpl</a>
//                       </li>
//                     </ul>
//                   </li>
//                   <hr />
//                   <li>
//                     <a href="">
//                       Save<span>Ctrl+S</span>
//                     </a>
//                   </li>
//                   <li>
//                     <a href="">
//                       Save As<span>Ctrl+Alt+Save</span>
//                     </a>
//                   </li>
//                   <li>
//                     <hr />
//                   </li>
//                   <li>
//                     <a href="">
//                       Quite<span>Ctrl+Q</span>
//                     </a>
//                   </li>
//                 </ul>
//               </li>
//               <li>
//                 <a href="">Tools</a>
//                 <ul>
//                   <li>
//                     {/* <!-- 2depth --> */}
//                     <a href="">
//                       Knowledge Model Analysis <span></span>
//                     </a>
//                   </li>
//                   <hr />
//                   <li>
//                     <a href="">
//                       Add UI Templates <span></span>
//                     </a>
//                   </li>
//                   <hr />
//                   <li>
//                     <a href="">
//                       Export Data Pipeline <span></span>
//                     </a>
//                   </li>
//                 </ul>
//               </li>
//               <li>
//                 <a href="">Help</a>
//                 <ul>
//                   <li>
//                     {/* <!-- 2depth --> */}
//                     <a href="">
//                       About Knowledge Studio <span> </span>
//                     </a>
//                   </li>
//                   <li>
//                     <a href="">
//                       Documentation... <span> </span>
//                     </a>
//                   </li>
//                   <li>
//                     <a href="">
//                       Report Bug and Enhancement... <span> </span>
//                     </a>
//                   </li>
//                   <hr />
//                   <li>
//                     <a href="">
//                       Check for Updates <span> </span>
//                     </a>
//                   </li>
//                   <li>
//                     <a href="">
//                       Licenses <span></span>
//                     </a>
//                   </li>
//                   <li>
//                     <a href="">
//                       Login<span></span>
//                     </a>
//                   </li>
//                 </ul>
//               </li>
//             </ul>
//           </nav>
//           <div className="welcome">
//             <span>Welcome</span>
//           </div>
//           <div className="windowsbtn">
//             <ul>
//               <li>
//                 <a href=""></a>
//               </li>
//               <li>
//                 <a href=""></a>
//               </li>
//               <li>
//                 <a href=""></a>
//               </li>
//             </ul>
//           </div>
//         </header>
//       </React.Fragment>
//     );
//   }
// }

// let mapStateToProps = (state) => {
//   return {
//     links: state.linksManager.get("links"),
//     pipelineManager: state.pipelineManager.get("pipelineManager"),
//     isPipelineDragging: state.pipelineManager.get("isDragging"),
//   };
// };

// let mapDispatchToProps = (dispatch) => {
//   return {
//     onSetPipelineManager: (pipelineManager) =>
//       dispatch(setPipelineManager(pipelineManager)),
//     onSetDummyNumber: () => dispatch(setDummyNumber()),

//     onSetToast: (timeStamp, message, messageType) =>
//       dispatch(setToast(timeStamp, message, messageType)),
//   };
// };
// Header = connect(mapStateToProps, mapDispatchToProps)(Header);
// export default withRouter(Header);
