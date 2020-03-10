import { plain2immutable } from '../../utils/plain2immutable';

// import constants
import * as MERGE_TYPE from '../../constants/MergeType';

export default class ModuleBase {
  constructor(id, name, group) {
    let _id = id;
    let _name = name;
    let _group = group;
    let _mergeType = MERGE_TYPE.NONE;
    let _properties = [];
    let _parentIds = [];
    let _size = {
      width: 200,
      height: 100,
    };
    let _position = {
      x: undefined,
      y: undefined,
    };

    // test
    let _output = null;

    // ============================================

    this.setID = id => {
      _id = id;
    };

    this.getID = () => {
      return _id;
    };

    this.setName = name => {
      _name = name;
    };

    this.getName = () => {
      return _name;
    };

    this.setGroup = group => {
      _group = group;
    };

    this.getGroup = () => {
      return _group;
    };

    this.setMergeType = mergeType => {
      _mergeType = mergeType;
    };

    this.getMergeType = () => {
      return _mergeType;
    };

    this.setProperties = properties => {
      // _properties = plain2immutable(properties);
      _properties = properties;
    };

    this.getProperties = () => {
      return _properties;
    };

    this.setParentIds = parentIds => {
      _parentIds = parentIds;
    };

    this.getParentIds = () => {
      return _parentIds;
    };

    this.addParentId = parentId => {
      _parentIds.push(parentId);
    };

    this.setSize = size => {
      _size = size;
    };

    this.getSize = () => {
      return _size;
    };

    this.setPosition = position => {
      _position = position;
    };

    this.getPosition = () => {
      return _position;
    };

    // test
    this.setOutput = output => {
      _output = output;
    };

    this.getOutput = () => {
      return _output;
    };

    // ============================================

    this.initialize = properties => {
      this.setProperties(plain2immutable(properties));
    };
  }
}
