import * as MODULES from '../../constants/module/Modules';

var property = {};

property[MODULES.SOUND] = node => {
    return [
        `Alarm ${node.getProperties().getIn(['Alarm', 'value'])}`
    ]
}

property[MODULES.VIBRATION] = node => {
    return [
        `Vibration lenegth ${node.getProperties().getIn(['Vibration length', 'value'])}ms`
    ]
}

property[MODULES.DISPLAY] = node => {
    return [
        `Display Time ${node.getProperties().getIn(['Display time', 'value'])}ms`
    ]
}

export default property;