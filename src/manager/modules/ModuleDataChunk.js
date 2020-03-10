export default class ModuleDataChunk {

    constructor() {
        this._moduleDataList = [];
    }

    /**
     * process 결과 데이터를 하나의 Chunk에 모은다.
     * @param {ModuleData} moduleData 
     */
    addModuleData(moduleData) {
        this._moduleDataList.push(moduleData);
    }

    /**
     * Chunk 가져오기
     */
    getModuleDataList() {
        return this._moduleDataList;
    }

    /**
     * Test용
     */
    print() {
        this._moduleDataList.forEach(r => {
            console.log(r.getType(), r.getRawData());
        });
    }
}