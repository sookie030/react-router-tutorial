// import constants
import * as GROUPS from '../constants/module/Groups';

// import module classes
import AIModules from './modules/AI';
import DetectorModules from './modules/Detector';
import FeatureModules from './modules/Feature';
import FilterModules from './modules/Filter';
import NotifierModules from './modules/Notifier';
import SourceModules from './modules/Source';
import DispatcherModules from './modules/Dispatcher';

/**
 * Object 객체인 모듈을 이용하여 실제 클래스 객체를 만들어 저장한다.
 * _tmpPipeline 정보: node id, prev node id (Source는 이전 노드가 오지 않으므로 -1), name
 * 추후 ModuleFactory 형태로 만들어주면 더 명쾌하지 않을까...
 * @param {Object} moduleInfo 
 */
const getModule = function (id, name, group) {
    
    switch (group) {
        case GROUPS.SOURCE:
            return new SourceModules[name](id, name, group);

        case GROUPS.FILTER:
            return new FilterModules[name](id, name, group);

        case GROUPS.DETECTOR:
            return new DetectorModules[name](id, name, group);

        case GROUPS.FEATURE:
            return new FeatureModules[name](id, name, group);

        case GROUPS.AI:
            return new AIModules[name](id, name, group);

        case GROUPS.NOTIFIER:
            return new NotifierModules[name](id, name, group);

        case GROUPS.DISPATCHER:
            return new DispatcherModules[name](id, name, group);

        default:
            return null;
    }
}

export default getModule;
