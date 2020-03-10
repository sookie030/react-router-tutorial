import React from 'react';
import '../assets/styles/file-navigator.css';

// redux module
import { connect } from 'react-redux';

// 20.02.13 test
import fs from 'browserify-fs';

class FileNavigatorContainer extends React.Component {
  state = {
    files: {},
  };

  setFiles = (err, files) => {
    if (err) {
      console.log(err);
    }

    console.log(files);
    this.setState(
      {
        files: files,
      },
      () => {
        let fileList = [];
        for (let i = 0; i < this.state.files.length; i++) {
          fileList.push(<li>{files[i].name}</li>);
        }
      },
    );
  };

  test = () => {
    if (!this.props.isShowing) return;
    // window.fs.readdir(
    //   this.props.selectedNode.getProperties().getIn(['Directory', 'value']),
    //   this.setFiles,
    // );
    // window.requestFileSystem = window.webkitRequestFileSystem;
    fs.readdir('.', function(err, data) {
      console.log(data);
  });
    fs.readdir('/', function(err, data) {
      console.log(data);
  });
    fs.readdir('/home', function(err, data) {
      console.log(data);
  });

    fs.mkdir('/home', function() {
      fs.writeFile('/home/hello-world-0213.txt', 'Hello world!\n', function() {
          fs.readFile('/home/hello-world-0213.txt', 'utf-8', function(err, data) {
              console.log(data);
          });
      });
  });
  };

  render() {
    const onTest = this.test();
    return this.props.isShowing ? (
      <div id="file-navigator">
        <div className="file-navigator-title">
          <p>{`${this.props.selectedNode.getName()} Directory`}</p>
        </div>
        <div className="file-navigator-content" style={{ height: '30px' }}>
          <p>
            {this.props.selectedNode
              .getProperties()
              .getIn(['Directory', 'value'])}
          </p>
        </div>
        {/* <div className="file-navigator-title">
          <p>Preview</p>
        </div>
        <div
          className="file-navigator-content"
          style={{ height: '180px' }}
        ></div> */}
        <div className="file-navigator-title">
          <p>List</p>
        </div>
        <div className="file-navigator-content">
          <ul>
            {/* <li>Image01.jpg</li>
            <li>Image02.jpg</li>
            <li>Image03.jpg</li>
            <li>Image04.jpg</li> */}
            {onTest}
          </ul>
        </div>
      </div>
    ) : null;
  }
}

let mapStateToProps = state => {
  return {
    isShowing: state.fileNavigatorManager.get('isShowing'),
    selectedNode: state.fileNavigatorManager.get('selectedNode'),
  };
};

let mapDispatchToProps = dispatch => {
  return {};
};

FileNavigatorContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FileNavigatorContainer);
export default FileNavigatorContainer;
