import * as DATA_TYPE from '../../constants/DataType';

export default class ModuleData {

    constructor(type, data) {
        this._type = type;
        this._data = data;
    }

    /**
     * ModuleData 초기화
     */
    init() {
        this._type = DATA_TYPE.IMAGE;
        this._data = [];
    }

    getType() {
        return this._type;
    }

    setType(type) {
        this._type = type;
    }

    getData() {
        return this._data;
    }

    setData(data) {
        this._data = data;
    }

    // 191029 test
    test(moduleName) {
        this._moduleName = moduleName
    }

    testPrint() {
        console.log(this._moduleName);
    }
}
