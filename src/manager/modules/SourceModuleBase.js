// import parent
import ModuleBase from './ModuleBase';

export default class SourceModuleBase extends ModuleBase {
  constructor(id, name, group) {
    super(id, name, group)

    this._stopPipelineFlag = false;
  }

  setStopPipelineFlag(stopPipelineFlag) {
    this._stopPipelineFlag = stopPipelineFlag;
  }

  getStopPipelineFlag() {
    return this._stopPipelineFlag;
  }
}
