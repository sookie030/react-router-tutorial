import React from "react";

// import container
// import ModuleList from "../components/ModuleList";
import ModuleList from "./ModuleListContainer";

class WorkspaceContainer extends React.Component {
  state = {
    isWelcomeView: false,
    selectedDpl: 0,
  };

  handleOnChangeDpl = (e) => {
    this.setState({
      selectedDpl: e.target.value,
    });
  };

  render() {
    return (
      <section>
        <ModuleList />
        <div className="runlist">
          <div className="custom-select">
            <select
              value={this.state.selectedDpl}
              onChange={this.handleOnChangeDpl}
            >
              <option value="0">Image training.dpl</option>
              <option value="1">Image training.dpl</option>
              <option value="2">Grid detection.dpl</option>
              <option value="3">UI Template</option>
            </select>
          </div>
          <a href="#">
            <span>Run</span>
          </a>
        </div>
        <div className="board">
          <div className="tab" style={{ clear: "both" }}>
            <ul>
              <li className="acttab">
                <a href="#">
                  Welcome<span></span>
                </a>
              </li>
              <li>
                <a href="#">
                  facerecognition.dpl<span></span>
                </a>
              </li>
              <li>
                <a href="#">
                  detection.dpl<span></span>
                </a>
              </li>
            </ul>
          </div>

          <div className="workspace">
            <div id="moduleboard"> </div>
            <div className="modelingbtn">
              <a href="#"></a>
            </div>
            {/* <!-- properties 띄우려고 만든 체크박스임, 워크보드 하단에 있는 체크박스. 제어가능하면 <input ..>삭제하거나 hidden 해주면 됨. 참고는 board.html의 19줄의 체크박스 활용한거임 (좌측 모듈리스트)--></input ..> */}
            <input type="checkbox" id="menu-button" />
            <div className="properties">
              <p className="title">
                Properties<span className="rightbtn close"></span>
              </p>
              <hr />
              <div className="properties_contents">
                {/* <!-- 저장할때는 클래스명 modify를 save로 바꿈-->  */}
                <p className="modulename">
                  Regin Of interest<span className="rightbtn modify"></span>
                </p>
                <div className="option">
                  <p className="optionname">Area</p>
                  <form>
                    <label htmlFor="" className="labelstyle">
                      Position X
                    </label>
                    <br />
                    <input
                      type="text"
                      id=""
                      name=""
                      defaultValue="insert value"
                      style={{ marginBottom: "10px" }}
                      // onFocus="clearText(this)"
                      // onChange={props.handleOnChange}
                    />
                    <br />
                    <label htmlFor="">Position Y</label>
                    <br />
                    <input
                      type="text"
                      id=""
                      name=""
                      defaultValue="insert value"
                      // onFocus="clearText(this)"
                    />
                    <br />
                  </form>
                </div>
                <hr />
                <div className="option">
                  <p className="optionname"></p>
                  <form>
                    <label htmlFor="" className="labelstyle">
                      Width
                    </label>
                    <br />
                    <input
                      type="text"
                      id=""
                      name=""
                      defaultValue="insert value"
                      style={{ marginBottom: "10px" }}
                      // onFocus="clearText(this)"
                    />
                    <br />
                    <label htmlFor="">Height</label>
                    <br />
                    <input
                      type="text"
                      id=""
                      name=""
                      defaultValue="insert value"
                      // onFocus="clearText(this)"
                    />
                    <br />
                  </form>
                </div>
                <hr />
                <div className="option">
                  <p className="optionname"></p>
                  <form>
                    <label htmlFor="" className="labelstyle">
                      Color
                    </label>
                    <br />
                    <input
                      type="text"
                      id=""
                      name=""
                      defaultValue="insert value"
                      style={{ marginBottom: "10px" }}
                      // onFocus="clearText(this)"
                    />
                    <br />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="state">
          {/* <!-- 진행상황 보여주는 파란색 bar--> */}
          <div className="bar"></div>
          {/* <!--활성화시 div에 act클래스 추가--> */}
          <div className="processing">
            <p>
              Camera Processing...<span>14/30</span>
            </p>
          </div>
        </div>
      </section>
    );
  }
}

export default WorkspaceContainer;
