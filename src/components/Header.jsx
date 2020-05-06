import React from "react";

const Header = (props) => (
  <header>
    <h1>
      <a href="#"></a>
    </h1>
    {/* <!-- Titlebar menu --> */}
    <nav className="nav">
      <ul>
        <li>
          {/* <!-- 1depth --> */}
          <a href="#">File</a>
          <ul>
            <li>
              {/* <!-- 2depth --> */}
              <a href="">
                New <span>Ctrl+N</span>
              </a>
            </li>
            <li>
              <a href="">
                New Templete<span className="viewsub"></span>
              </a>
              <ul>
                <li>
                  {/* <!-- 3depth --> */}
                  <a href="">Object Recognation</a>
                </li>
                <li>
                  <a href="">Grid Detection</a>
                </li>
                <li>
                  <a href="">Face Recognation</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="">
                Open<span>Ctrl+O</span>
              </a>
            </li>
            <li>
              <a href="">
                Open Recently<span className="viewsub"></span>
              </a>
              <ul>
                <li>
                  {/* <!-- 3depth --> */}
                  <a href="">fimename.dpl</a>
                </li>
                <li>
                  <a href="">filename2.dpl</a>
                </li>
              </ul>
            </li>
            <hr />
            <li>
              <a href="">
                Save<span>Ctrl+S</span>
              </a>
            </li>
            <li>
              <a href="">
                Save As<span>Ctrl+Alt+Save</span>
              </a>
            </li>
            <li>
              <hr />
            </li>
            <li>
              <a href="">
                Quite<span>Ctrl+Q</span>
              </a>
            </li>
          </ul>
        </li>
        <li>
          <a href="">Tools</a>
          <ul>
            <li>
              {/* <!-- 2depth --> */}
              <a href="">
                Knowledge Model Analysis <span></span>
              </a>
            </li>
            <hr />
            <li>
              <a href="">
                Add UI Templates <span></span>
              </a>
            </li>
            <hr />
            <li>
              <a href="">
                Export Data Pipeline <span></span>
              </a>
            </li>
          </ul>
        </li>
        <li>
          <a href="">Help</a>
          <ul>
            <li>
              {/* <!-- 2depth --> */}
              <a href="">
                About Knowledge Studio <span> </span>
              </a>
            </li>
            <li>
              <a href="">
                Documentation... <span> </span>
              </a>
            </li>
            <li>
              <a href="">
                Report Bug and Enhancement... <span> </span>
              </a>
            </li>
            <hr />
            <li>
              <a href="">
                Check for Updates <span> </span>
              </a>
            </li>
            <li>
              <a href="">
                Licenses <span></span>
              </a>
            </li>
            <li>
              <a href="">
                Login<span></span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
    <div className="welcome">
      <span>Welcome</span>
    </div>
    <div className="windowsbtn">
      <ul>
        <li>
          <a href="#" onClick={props.minimizeWindow}></a>
        </li>
        <li>
          <a href="#" onClick={props.maximizeWindow}></a>
        </li>
        <li>
          <a href="#" onClick={props.closeWindow}></a>
        </li>
      </ul>
    </div>
  </header>
);

export default Header;
