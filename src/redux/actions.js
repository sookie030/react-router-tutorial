import * as types from './actionTypes';

/**
 * Node
 */
export function setPropertiesOfNode(id, properties) {
    return {
        type: types.SET_PROPERTIES_OF_NODE,
        id, properties
    }
};

export function setCameraOptions(id, options, selectedIndex) {
    return {
        type: types.SET_CAMERA_OPTIONS,
        id, options, selectedIndex
    }
}

export function setNodeSize(id, width, height) {
    return {
        type: types.SET_NODE_SIZE,
        id, width, height
    }
};

/**
 * Link
 */
export function isLinking(isLinking) {
    return {
        type: types.IS_LINKING,
        isLinking
    }
}

export function setLinkingPosition(x, y) {
    return {
        type: types.SET_LINKING_POSITION,
        x, y
    }
}

export function addLink(from, to) {
    return {
        type: types.ADD_LINK,
        from, to
    }
}

export function removeLink(deletedElement, id) {
    return {
        type: types.REMOVE_LINK,
        deletedElement, id
    }
}

export function modifyLink(nodeID, deltaX, deltaY) {
    return {
        type: types.MODIFY_LINK,
        nodeID, deltaX, deltaY
    }
}

export function modifyLinkByNodeResize(nodeID, deltaX, deltaY) {
    return {
        type: types.MODIFY_LINK_BY_NODE_RESIZE,
        nodeID, deltaX, deltaY
    }
}

/**
 * Contextmenu
 */
export function isCtxmenuShowing(isShowing) {
    return {
        type: types.IS_CTXMENU_SHOWING,
        isShowing
    }
}

export function setCtxmenuPosition(x, y) {
    return {
        type: types.SET_CTXMENU_POSITION,
        x, y
    }
}

export function setCtxMenuTarget(targetID, menuType) {
    return {
        type: types.SET_CTXMENU_TYPE,
        targetID, menuType
    }
}

/**
 * Etc
 */
export function isPropsSettingDialogShowing(isShowing, id) {
    return {
        type: types.IS_PROPS_SETTING_SHOWING,
        isShowing, id
    }
}

export function setToast(timeStamp, message, messageType) {
    return {
        type: types.SET_TOAST,
        timeStamp, message, messageType
    }
}

/**
 * Pipeline
 */
export function setPipelineManager(pipelineManager) {
    return {
        type: types.SET_PIPELINE_MANAGER,
        pipelineManager
    }
}

export function isPipelineRunning(isRunning) {
    return {
        type: types.IS_PIPELINE_RUNNING,
        isRunning
    }
}

export function setNodes(nodes) {
    return {
        type: types.SET_NODES,
        nodes
    }
}

export function addNode(name, group, position) {
    return {
        type: types.ADD_NODE,
        name, group, position
    }
};

/**
 * ETC
 */
export function selectModule(module) {
    return {
        type: types.SELECT_MODULE,
        module
    }
};

export function clearLinkboard() {
    return {
        type: types.CLEAR_LINKBOARD
    }
};

// 꼼수용
export function setDummyNumber() {
    return {
        type: types.SET_DUMMY_NUMBER,
    }
}

export function isPipelineDragging(isDragging) {
    return {
        type: types.IS_PIPELINE_DRAGGING,
        isDragging
    }
}

export function isFileNavigatorShowing(node) {
    return {
        type: types.IS_FILE_NAVIGATOR_SHOWING,
        node
    }
}

export function isPropertyNavigatorShowing(isShowing, selectedNode) {
    return {
        type: types.IS_PROPERTY_NAVIGATOR_SHOWING,
        isShowing, selectedNode
    }
}
