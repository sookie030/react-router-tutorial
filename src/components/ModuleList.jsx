import React from "react";

const ModuleList = (props) => (
  <div className="modulelist">
    <div className="title">Data Pipeline</div>
    {/* <ul className="list" style="clear: both;"> */}
    <ul className="list" style={{ clear: "both" }}>
      <li>
        <input id="group-1" type="checkbox" hidden />
        <label htmlFor="group-1">
          <span className="tri"></span>Source
        </label>
        <ul className="group-list">
          <li>
            <a href="#">
              Camera<span>Set region of interest</span>
            </a>
          </li>
          <li>
            <a href="#">
              FaceCamera<span>Convert to gray color</span>
            </a>
          </li>
        </ul>
      </li>
      <li>
        <input id="group-2" type="checkbox" hidden />
        <label htmlFor="group-2">
          <span className="tri"></span>Filter
        </label>
        <ul className="group-list">
          <li>
            <a href="#">
              ROI<span>Set region of interest</span>
            </a>
          </li>
          <li>
            <a href="#">
              Average Blur<span>Set region of interest</span>
            </a>
          </li>
          <li>
            <a href="#">
              Median Blur<span>Set region of interest</span>
            </a>
          </li>
          <li>
            <a href="#">
              Bilateral Bkur<span>Set region of interest</span>
            </a>
          </li>
          <li>
            <a href="#">
              Prewitt<span>Set region of interest</span>
            </a>
          </li>
          <li>
            <a href="#">
              Roberts<span>Set region of interest</span>
            </a>
          </li>
          <li>
            <a href="#">
              Canny<span>Set region of interest</span>
            </a>
          </li>
          <li>
            <a href="#">
              Hough<span>Set region of interest</span>
            </a>
          </li>
          <li>
            <a href="#">
              Grayscale<span>Set region of interest</span>
            </a>
          </li>
          <li>
            <a href="#">
              Resize<span>Set region of interest</span>
            </a>
          </li>
          <li>
            <a href="#">
              Crop<span>Set region of interest</span>
            </a>
          </li>
          <li>
            <a href="#">
              Grid<span>Set region of interest</span>
            </a>
          </li>
        </ul>
      </li>
      <li>
        <input id="group-3" type="checkbox" hidden />
        <label htmlFor="group-3">
          <span className="tri"></span>Detector
        </label>
        <ul className="group-list">
          <li>
            <a href="#">
              Haar<span>Set region of interest</span>
            </a>
          </li>
        </ul>
      </li>
      <li>
        <input id="group-4" type="checkbox" hidden />
        <label htmlFor="group-4">
          <span className="tri"></span>Feature
        </label>
        <ul className="group-list">
          <li>
            <a href="#">
              Subsample<span>Set region of interest</span>
            </a>
          </li>
          <li>
            <a href="#">
              HOG<span>Set region of interest</span>
            </a>
          </li>
          <li>
            <a href="#">
              LBP<span>Set region of interest</span>
            </a>
          </li>
        </ul>
      </li>
      <li>
        <input id="group-5" type="checkbox" hidden />
        <label htmlFor="group-5">
          <span className="tri"></span>AI
        </label>
        <ul className="group-list">
          <li>
            <a href="#">
              NM500<span>Set region of interest</span>
            </a>
          </li>
          <li>
            <a href="#">
              Decision Maker<span>Set region of interest</span>
            </a>
          </li>
        </ul>
      </li>
      <li>
        <input id="group-6" type="checkbox" hidden />
        <label htmlFor="group-6">
          <span className="tri"></span>Notifier
        </label>
        <ul className="group-list">
          <li>
            <a href="#">
              Sound<span>Set region of interest</span>
            </a>
          </li>
          <li>
            <a href="#">
              Vibration<span>Set region of interest</span>
            </a>
          </li>
          <li>
            <a href="#">
              Display<span>Set region of interest</span>
            </a>
          </li>
          <li>
            <a href="#">
              HttpPost<span>Set region of interest</span>
            </a>
          </li>
          <li>
            <a href="#">
              Grid Marker<span>Set region of interest</span>
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
);

export default ModuleList;
