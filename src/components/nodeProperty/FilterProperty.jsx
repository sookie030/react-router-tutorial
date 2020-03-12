import * as MODULES from '../../constants/module/Modules';

var property = {};

property[MODULES.ROI] = node => {
  return [
    `Area ${node
      .getProperties()
      .getIn(['Area', 'properties', 'x', 'value'])}, ${
      node.getProperties().getIn(['Area', 'properties', 'y', 'value'])
    } (${
      node.getProperties().getIn(['Area', 'properties', 'Width', 'value'])
    }x${
      node.getProperties().getIn(['Area', 'properties', 'Height', 'value'])
    })`,
  ];
};

/* Blur Filter는 속성값이 없음 */

property[MODULES.EDGE_SOBEL] = node => {
  return [
    `Threshold ${node.getProperties().getIn(['Threshold Ratio', 'value'])}`,
  ];
};

property[MODULES.EDGE_PREWITT] = node => {
  return [
    `Threshold ${node.getProperties().getIn(['Threshold Ratio', 'value'])}`,
  ];
};

property[MODULES.EDGE_ROBERTS] = node => {
  return [
    `Threshold ${node.getProperties().getIn(['Threshold Ratio', 'value'])}`,
  ];
};

property[MODULES.EDGE_CANNY] = node => {
  return [
    `Edge ${node.getProperties().getIn(['Edge Type', 'value'])}`,

    `High ${
      node.getProperties().getIn([
        'Threshold Ratio', 'properties', 'High', 'value'
      ])
    }`,

    `Low ${
      node.getProperties().getIn([
        'Threshold Ratio', 'properties', 'Low', 'value'
      ])
    }`,
  ];
};

property[MODULES.EDGE_HOUGH] = node => {
  return [`Search ${node.getProperties().getIn(['Search Target', 'value'])}`];
};

property[MODULES.GRAYSCALE] = node => {
  return [
    `Area ${
      node.getProperties().getIn(['Area', 'properties', 'x', 'value'])
    }, ${node.getProperties().getIn(['Area', 'properties', 'y', 'value'])} (${
      node.getProperties().getIn(['Area', 'properties', 'Width', 'value'])
    }x${
      node.getProperties().getIn(['Area', 'properties', 'Height', 'value'])
    })`,
  ];
};

property[MODULES.RESIZE] = node => {
  return [
    `Size ${
      node.getProperties().getIn(['Size', 'properties', 'Width', 'value'])
    }x${node.getProperties().getIn(['Size', 'properties', 'Height', 'value'])}`,
    `Type ${node.getProperties().getIn(['Resize Type', 'value'])}`,
  ];
};

property[MODULES.CROP] = node => {
  return [
    `Size ${
      node.getProperties().getIn(['Size', 'properties', 'x', 'value'])
    }, ${node.getProperties().getIn(['Size', 'properties', 'y', 'value'])} (${
      node.getProperties().getIn(['Size', 'properties', 'Width', 'value'])
    }x${
      node.getProperties().getIn(['Size', 'properties', 'Height', 'value'])
    })`,
  ];
};

property[MODULES.GRID] = node => {
  return [
    `Size ${
      node.getProperties().getIn(['Size', 'properties', 'Size Width', 'value'])
    }x${
      node.getProperties().getIn(['Size', 'properties', 'Size Height', 'value'])
    }`,
  ];
};

export default property;
