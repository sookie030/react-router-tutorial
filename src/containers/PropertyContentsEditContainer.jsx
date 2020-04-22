import React from "react";
// import { Grid, Divider, Dropdown, Input } from 'semantic-ui-react';
import { Map } from "immutable";

// import presentational comps
import PropertyComponent from "../components/settingDialog/Property";

// import constants
import * as PROP_TYPE from "../constants/PropertyType";
import { MODULES } from "../constants/ModuleInfo";

const fs = window.fs;
const dialog = window.dialog;
const nativeImage = window.nativeImage;
const path = require("path");

class PropertyContentsEditContainer extends React.Component {
  state = {
    properties: Map({}),
    error: {
      id: null,
      message: null,
    },
    // test
    node: null,
  };

  inputOpenFileRef = React.createRef();

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log("getDerivedStateFromProps");
    if (prevState.node === null && nextProps.node !== null) {
      return {
        node: nextProps.node,
        properties: nextProps.properties,
      };
    } else if (prevState.node.getID() !== nextProps.node.getID()) {
      return {
        node: nextProps.node,
        properties: nextProps.properties,
      };
    } else {
      return null;
    }
  }

  /**
   * 변경된 속성값을 임시로 저장한다.
   * @param {*} group
   * @param {*} key
   * @param {*} value
   */
  setProperties(group, key, value) {
    let newProperties = this.state.properties;

    switch (true) {
      // 디렉토리 경로 변경 - File List 변경
      case this.props.node.getName() === MODULES.FILE_LOADER &&
        key === "Directory":
        fs.exists(value, (isExist) => {
          if (isExist) {
            fs.readdir(value, (err, files) => {
              if (err) {
                newProperties = newProperties.setIn(["File List", "value"], []);
              } else {
                let fileObjList = [];

                // 우선 이미지 파일만 받아온다.
                files.forEach((file) => {
                  let ext = file
                    .substring(file.lastIndexOf(".") + 1, file.length)
                    .toLowerCase();

                  if (ext === "jpg" || ext === "jpeg" || ext === "png") {
                    fileObjList.push({
                      name: file,
                      thumbnail: nativeImage
                        .createFromPath(path.join(value, "/", file))
                        .toDataURL(),
                      selected: true,
                    });
                  }
                });

                newProperties = newProperties
                  .setIn(["File List", "value"], fileObjList)
                  .setIn(["Directory", "value"], value);
              }

              // property값 변경
              this.setState({
                properties: newProperties,
              });
            });
          } else {
            newProperties = newProperties
              .setIn(["File List", "value"], [])
              .setIn(["Directory", "value"], value);

            // property값 변경
            this.setState({
              properties: newProperties,
            });
          }
        });
        break;

      // File Click - 선택/선택 해제
      case this.props.node.getName() === MODULES.FILE_LOADER &&
        key === "File List":
        newProperties = newProperties
          // .setIn(['Option', 'value'], option)
          .setIn(["File List", "value"], value);

        // property값 변경
        this.setState({
          properties: newProperties,
        });
        break;

      // Option 변경 - All로 변경하면 모든 파일 selected === true
      case this.props.node.getName() === MODULES.FILE_LOADER &&
        key === "Option" &&
        value === "All":
        console.log("hello, option all");
        newProperties = newProperties.setIn(["Option", "value"], value);

        this.setState(
          {
            properties: newProperties,
          },
          () => {
            let fileList =
              group === undefined
                ? newProperties.getIn(["File List", "value"])
                : newProperties.getIn([group, "File List", "value"]);

            fileList = fileList.forEach((file) => {
              file.selected = true;
            });

            this.setProperties(group, key, fileList);
          }
        );

        break;

      case this.props.node.getName() === MODULES.FILE_LOADER &&
        key === "Option" &&
        value === "Selected Only":
        console.log("hello, option Selected Only");
        newProperties = newProperties.setIn(["Option", "value"], value);

        console.log(newProperties);

        // property값 변경
        this.setState({
          properties: newProperties,
        });

        break;

      default:
        if (group !== null && group !== undefined) {
          newProperties = newProperties.setIn(
            [group, "properties", key, "value"],
            value
          );

          // property값 변경
          this.setState({
            properties: newProperties,
          });
        } else {
          newProperties = newProperties.setIn([key, "value"], value);

          // property값 변경
          this.setState({
            properties: newProperties,
          });
        }
        break;
    }
  }

  /**
   * property 변경 시 발생하는 이벤트
   */
  handleOnChange = (group, key, e) => {
    this.setProperties(group, key, e.target.value);
  };

  /**
   * Web - file directory property 변경 시 발생하는 이벤트
   */
  handleOnChangeFile = (group, key, e) => {
    console.log(e.target.files);
    let first = e.target.files[0];
    let path = URL.createObjectURL(first);
    console.log(path);
  };

  // 20.02.12 test

  handleOpenDirectoryDialog = (group, key, e) => {
    var userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf(" electron/") > -1) {
      console.log("running on electron!");
      dialog.showOpenDialog({ properties: ["openDirectory"] }, (result) => {
        console.log(result);
        // 선택한 디렉토리 경로
        let path = result[0];

        // 선택한 디렉토리 경로를 받아와 Directory Property에 설정한다.
        this.setProperties(group, key, path);
      });
    } else {
      console.log("no electron environment");
      this.inputOpenFileRef.click();
    }
  };

  /**
   * 20.03.04 File Loader - Selected File Only test
   */
  handleOnClickFile = (group, key, file, e) => {
    let option =
      group === undefined
        ? this.state.properties.getIn(["Option", "value"])
        : this.state.properties.getIn([group, "Option", "value"]);

    let fileList =
      group === undefined
        ? this.state.properties.getIn([key, "value"])
        : this.state.properties.getIn([group, key, "value"]);

    let index = fileList.findIndex((f) => f === file);
    fileList[index].selected = !fileList[index].selected;

    let selectedFileCount = 0;
    fileList.forEach(
      (f) =>
        (selectedFileCount =
          f.selected === true ? selectedFileCount + 1 : selectedFileCount)
    );

    if (fileList.length === selectedFileCount) {
      console.log("all!");
      this.setProperties(group, "Option", "All");
    } else {
      console.log("all -> selected");
      this.setProperties(group, "Option", "Selected Only");
      // this.setProperties(group, key, fileList);
    }
  };

  /**
   * 속성 값들에 따른 컴포넌트를 만들어 리스트에 추가한다.
   */
  getPropertyComponents(properties, propertyList, group) {
    var index = 0;
    var valueComp;

    if (!properties.size > 0) {
      return null;
    }

    properties.entrySeq().forEach(([key, value]) => {
      console.log(key, value);
      switch (value.get("type")) {
        case PROP_TYPE.GROUP:
          // Group Title
          propertyList.push(
            <React.Fragment key={`group-${key}`}>
              <div className="navigator-header">{key}</div>
            </React.Fragment>
          );

          // 하위 Property 탐색
          this.getPropertyComponents(
            value.get("properties"),
            propertyList,
            key
          );

          // 구분선 추가
          // if (index !== Object.keys(properties).length - 1) {
          //   propertyList.push(
          //     <React.Fragment key={`divider-${key}`}>
          //       <Divider />
          //     </React.Fragment>,
          //   );
          // }
          break;

        case PROP_TYPE.DROPDOWN:
          // option값 가져오기
          try {
            let options = value.get("options").map((option) => {
              return (
                <option key={option.key} value={option.value}>
                  {option.value}
                </option>
              );
            });

            propertyList.push(
              <React.Fragment
                key={group !== undefined ? `prop-${group}-${key}` : key}
              >
                <div className="navigator-item">
                  <div className="navigator-item-name">
                    <input
                      type="text"
                      value={key}
                      title={key}
                      readOnly={true}
                    />
                  </div>
                  <div className="navigator-item-value-list">
                    <div className="navigator-item-value editable">
                      <div
                        className="navigator-item-value-line editable"
                        style={{ paddingLeft: 0 }}
                      >
                        <select
                          className="one"
                          value={value.get("value")}
                          onChange={(e) => this.handleOnChange(group, key, e)}
                        >
                          {options}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          } catch (e) {
            console.log(
              "https 혹은 localhost가 아닌 경우, Media 옵션 변경 불가능."
            );
          }
          break;

        case PROP_TYPE.TEXT_EDIT:
          // Dropdown width에 맞추어 키워놓았다. 나중엔 Dropdown의 width를 줄이고싶다..
          // valueComp = (
          //   <Input
          //     style={{ width: '196px' }}
          //     id={group !== undefined ? `${group}-${key}` : key}
          //     className={'navigator-item-value-list text-edit'}
          //     defaultValue={value.get('value')}
          //     maxLength="5"
          //     onChange={this.handleOnChange}
          //   />
          // );
          // console.log(`prop-${key}`);
          propertyList.push(
            <React.Fragment
              key={group !== undefined ? `prop-${group}-${key}` : key}
            >
              <div className="navigator-item">
                <div className="navigator-item-name">
                  <input type="text" value={key} title={key} readOnly={true} />
                </div>
                <div className="navigator-item-value-list">
                  <div className="navigator-item-value editable">
                    <div className="navigator-item-value-line editable">
                      <input
                        className="one"
                        type="text"
                        value={value.get("value")}
                        title={key}
                        onChange={(e) => this.handleOnChange(group, key, e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
          break;
        case PROP_TYPE.NUMBER_EDIT:
          let id = group !== undefined ? `${group}-${key}` : key;
          // 숫자값을 입력한 경우
          // if (!Number.isNaN(Number(value.get('value')))) {
          // valueComp = (
          //   <Input
          //     style={{ width: '196px' }}
          //     id={id}
          //     defaultValue={value.get('value')}
          //     maxLength="5"
          //     onChange={this.handleOnChange}
          //   />
          // );
          if (this.state.error.id === id) {
            console.log("error hi");
            this.setState({
              error: {
                id: null,
                message: null,
              },
            });
          }
          // 숫자값이 아닌 유효하지 않은 값을 입력한 경우
          // } else {
          // valueComp = (
          //   <Input
          //     style={{ width: '196px' }}
          //     error
          //     id={id}
          //     className={'number-edit'}
          //     defaultValue={value.get('value')}
          //     onChange={this.handleOnChange}
          //   />
          // );

          // if (this.state.error.id === null) {
          //   console.log('error hi 2');
          //   this.setState({
          //     error: {
          //       id: id,
          //       message: `${
          //         group !== undefined ? `${group}-${key}` : key
          //       } accepts only number.`,
          //     },
          //   });
          // }
          // }

          propertyList.push(
            <React.Fragment
              key={group !== undefined ? `prop-${group}-${key}` : key}
            >
              <div className="navigator-item">
                <div className="navigator-item-name">
                  <input type="text" value={key} title={key} readOnly={true} />
                </div>
                <div className="navigator-item-value-list">
                  <div className="navigator-item-value editable">
                    <div className="navigator-item-value-line editable">
                      <input
                        className="one"
                        type="text"
                        value={value.get("value")}
                        title={key}
                        onChange={(e) => this.handleOnChange(group, key, e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
          break;

        case PROP_TYPE.SELECT_DIRECTORY:
          // File Loader, File Saver에만 적용
          let directoryPath = value.get("value");

          propertyList.push(
            <React.Fragment
              key={group !== undefined ? `prop-${group}-${key}` : key}
            >
              <div className="navigator-item">
                <div className="navigator-item-name">
                  <input type="text" value={key} title={key} readOnly={true} />
                </div>
                <div className="navigator-item-value-list">
                  <div className="navigator-item-value editable">
                    <div className="navigator-item-value-line editable">
                      <input
                        className="input-directory"
                        type="text"
                        value={value.get("value")}
                        onChange={(e) => this.handleOnChange(group, key, e)}
                      />

                      <input
                        type="file"
                        webkitdirectory=""
                        ref={(r) => (this.inputOpenFileRef = r)}
                        style={{ display: "none" }}
                        onChange={(e) => this.handleOnChangeFile(group, key, e)}
                      />

                      <button
                        className="button-directory"
                        type="button"
                        onClick={(e) =>
                          this.handleOpenDirectoryDialog(group, key, e)
                        }
                      >
                        ...
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
          break;

        case PROP_TYPE.LIST:
          let list = value.get("value");

          propertyList.push(
            <React.Fragment key="prop-files">
              <div className="navigator-item">
                <div className="navigator-item-name">
                  <input
                    type="text"
                    value="File list"
                    title={key}
                    readOnly={true}
                  />
                </div>
                <div className="navigator-item-value-list">
                  <div className="navigator-item-value">
                    <div className="navigator-item-value-line">
                      <ul style={{ listStyleType: "none" }}>
                        {list.map((file, index) => {
                          return (
                            <li
                              key={index}
                              className={`navigator-file-list${
                                file.selected ? " selected" : ""
                              }`}
                              onClick={(e) =>
                                this.handleOnClickFile(group, key, file, e)
                              }
                            >
                              <div>
                                <div className="navigator-file-image">
                                  <img src={file.thumbnail} alt="img" />
                                </div>
                                <div className="navigator-file-name">
                                  {file.name}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
          break;

        default:
          // valueComp = <span>{value.value}</span>;
          // propertyList.push(
          //   <React.Fragment key={`prop-${key}`}>
          //     <Grid.Row verticalAlign={'middle'}>
          //       <Grid.Column width={3}>
          //         <span>{key}</span>
          //       </Grid.Column>
          //       <Grid.Column>{valueComp}</Grid.Column>
          //     </Grid.Row>
          //   </React.Fragment>,
          // );
          break;
      }
      index++;
    });

    return propertyList;
  }

  /**
   * 속성 값들에 따른 컴포넌트를 만들어 리스트에 추가한다.
   */
  getPropertyComponentsList = () => {
    var propertyList = [];
    this.getPropertyComponents(this.state.properties, propertyList);

    return propertyList;
  };

  render() {
    const onGetPropertyComponentsList = this.getPropertyComponentsList();
    return (
      <PropertyComponent
        propComponent={onGetPropertyComponentsList}
        message={this.state.error.message}
      />
    );
  }
}

export default PropertyContentsEditContainer;
