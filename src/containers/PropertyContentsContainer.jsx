import React from 'react';
// import { Divider } from 'semantic-ui-react';
import { Map } from 'immutable';

// import presentational comps
import PropertyComponent from '../components/settingDialog/Property';

// import constants
import * as PROP_TYPE from '../constants/PropertyType';

const nativeImage = window.nativeImage;
const path = require('path');

class PropertyContentsContainer extends React.Component {
  state = {
    properties: Map({}),
  };

  handleOnClickFile = (nativePath, e) => {};

  handleOnDbClickFile = (nativePath, e) => {
    console.log(e);

    window.open('', '', 'width=600, height=400, left=200, top=200');
  };

  getPropertyComponents = async (properties, propertyList, group) => {
    var index = 0;

    if (!properties.size > 0) {
      return null;
    }

    properties.entrySeq().forEach(([key, value]) => {
      // console.log(`key: ${key}, \nvalue: ${value}`);

      switch (value.get('type')) {
        case PROP_TYPE.GROUP:
          // Group Title
          propertyList.push(
            <React.Fragment key={`group-${key}`}>
              <div className="navigator-header">{key}</div>
            </React.Fragment>,
          );

          // 하위 Property 탐색
          this.getPropertyComponents(
            value.get('properties'),
            propertyList,
            key,
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

        // 20.02.24 Test
        case PROP_TYPE.SELECT_DIRECTORY:
          let directoryPath = value.get('value');
          // let list = value.get('list');

          propertyList.push(
            <React.Fragment
              key={group !== undefined ? `prop-${group}-${key}` : key}
            >
              <div className="navigator-item">
                <div className="navigator-item-name">
                  <input type="text" value={key} title={key} readOnly={true} />
                </div>
                <div className="navigator-item-value-list">
                  <div className="navigator-item-value">
                    <div className="navigator-item-value-line">
                      {directoryPath}
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>,
          );

          break;

        // 20.03.04 Test
        case PROP_TYPE.LIST:
          let list = value.get('value');
          let selectedFileList = list.filter(file => file.selected === true);

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
                      <ul style={{ listStyleType: 'none' }}>
                        {selectedFileList.map((file, index) => {
                          return (
                            <li
                              key={index}
                              className="navigator-file-list"
                              // onClick={e => this.handleOnClickFile(file, e)}
                              // onDoubleClick={e => this.handleOnDbClickFile(file, e)}
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
            </React.Fragment>,
          );
          break;

        default:
          propertyList.push(
            <React.Fragment
              key={group !== undefined ? `prop-${group}-${key}` : key}
            >
              <div className="navigator-item">
                <div className="navigator-item-name">
                  <input type="text" value={key} title={key} readOnly={true} />
                </div>
                <div className="navigator-item-value-list">
                  <div className="navigator-item-value">
                    <div className="navigator-item-value-line">
                      {value.get('value')}
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>,
          );
          break;
      }
      index++;
    });

    return propertyList;
  };

  /**
   * 속성 값들에 따른 컴포넌트를 만들어 리스트에 추가한다.
   */
  getPropertyComponentsList = () => {
    let propertyList = [];
    this.getPropertyComponents(this.props.properties, propertyList);

    return propertyList;
  };

  render() {
    const onGetPropertyComponentsList = this.getPropertyComponentsList();
    return (
      <React.Fragment>
        <PropertyComponent propComponent={onGetPropertyComponentsList} />
      </React.Fragment>
    );
  }
}

export default PropertyContentsContainer;
