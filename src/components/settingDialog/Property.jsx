import React from 'react';

const PropertyComponent = props => {
  const propComponent = props.propComponent;
  return (
    <React.Fragment>
      <div id="navigator-content" className="navigator-content">
        {propComponent}
      </div>
    </React.Fragment>
  );
};

export default PropertyComponent;
