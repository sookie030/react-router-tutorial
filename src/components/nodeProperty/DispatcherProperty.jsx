import { MODULES } from "../../constants/ModuleInfo";

var property = {};
property[MODULES.FILE_SAVER] = (node) => {

  let lastDirectory = node
    .getProperties()
    .getIn(["Directory", "value"])
    .split("/")
    .pop();
  return [{ Directory: lastDirectory }];
};
export default property;
