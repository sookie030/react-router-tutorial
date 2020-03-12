import React from 'react';
import '../assets/styles/welcome.css';

// import external component
import { Link } from 'react-router-dom';

class WelcomeContainer extends React.Component {
  render() {
    return (
      <div className="content-area">
        <div className="global-content-area">
          <Link to="/linkboard">
            <button id="btn-new-link">Create new link</button>
          </Link>
          <div>
            <div className="welcome-process-area">
              <h1>Welcome</h1>
              <h3>Create your own link</h3>
              <div className="welcome-table">
                <div className="welcome-table-cell welcome-process-oval">
                  <p>1. Make a link</p>
                </div>
                <div className="welcome-table-cell welcome-process-oval">
                  <p>2. Training</p>
                </div>
                <div className="welcome-table-cell welcome-process-oval">
                  <p>3. Classification</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="welcome-title-area">
              <h1>Create New Link</h1>
            </div>

            <div className="welcome-table">
              <div className="welcome-table-cell welcome-border-button">
                <p>New Model</p>
              </div>
              <div className="welcome-table-cell welcome-border-button">
                <p>Face recognition</p>
              </div>
              <div className="welcome-table-cell welcome-border-button">
                <p>Object recognition</p>
              </div>
              <div className="welcome-table-cell welcome-border-button">
                <p>Data processing</p>
              </div>
              <div className="welcome-table-cell welcome-border-button">
                <p>Data processing Pro</p>
              </div>
            </div>
          </div>

          <div>
            <div className="welcome-title-area">
              <h1>Popular Templates</h1>
            </div>
            <div className="welcome-table">
              <div className="welcome-table-cell welcome-border-button">
                <p>Face recognition</p>
              </div>
              <div className="welcome-table-cell welcome-border-button">
                <p>Object recognition</p>
              </div>
              <div className="welcome-table-cell welcome-border-button">
                <p>Data processing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WelcomeContainer;
