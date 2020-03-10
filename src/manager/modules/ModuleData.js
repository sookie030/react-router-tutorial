import * as DATA_TYPE from '../../constants/DataType';

export default class ModuleData {

    constructor(type, rawData) {
        this._type = type;
        this._rawData = rawData;
    }

    /**
     * ModuleData 초기화
     */
    init() {
        this._type = DATA_TYPE.IMAGE;
        this._rawData = [];
    }

    getType() {
        return this._type;
    }

    setType(type) {
        this._type = type;
    }

    getRawData() {
        return this._rawData;
    }

    setRawData(rawData) {
        this._rawData = rawData;
    }

    // 191029 test
    test(moduleName) {
        this._moduleName = moduleName
    }

    testPrint() {
        console.log(this._moduleName);
    }
}
