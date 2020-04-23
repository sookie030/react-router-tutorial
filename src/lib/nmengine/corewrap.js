/*
 Copyright (C) 2018-2019 by nepes Corp. All Rights Reserved
 
 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:
 
 1. Redistributions of source code must retain the above copyright notice,
 this list of conditions and the following disclaimer.
 
 2. Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.
 
 3. Neither the name of the copyright holder nor the names of its contributors
 may be used to endorse or promote products derived from this software without
 specific prior written permission.
 
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * Constant value functioninition for the Neuromem API library package for Python.
 *
 * Copyright (C) 2018-2019 by nepes Corp. All Rights Reserved
 *
 * To use, simply 'import nmengine'
 */

// Load modules about ffi
const ffi = window.ffi;
const ref = window.ref;
const ArrayType = window.ArrayType

// Load data
const constants = require('./constants');
const datatypes = require('./datatypes');

// Declare uint type
const uint8 = ref.types.uint8;
const uint16 = ref.types.uint16;
const uint32 = ref.types.uint32;

// Declare *uint type
const uint8Ptr = ref.refType(ref.types.uint8);
const uint32Ptr = ref.refType(ref.types.uint32);

// Declare neuromem type
const deviceArray = ArrayType(datatypes.Device);
const deviceArrayPtr = ref.refType(deviceArray);
const devicePtr = ref.refType(datatypes.Device);
const networkInfoPtr = ref.refType(datatypes.NetworkInfo);
const networkStatusPtr = ref.refType(datatypes.NetworkStatus);
const contextPtr = ref.refType(datatypes.Context);
const learnReqPtr = ref.refType(datatypes.LearnReq);
const classifyReqPtr = ref.refType(datatypes.ClassifyReq);
const neuronArray = ArrayType(datatypes.Neuron);
const neuronArrayPtr = ref.refType(neuronArray);
const neuronPtr = ref.refType(datatypes.Neuron);

// Check OS
const platform = process.platform;

// Global variable for nmengine library
let libnmengine = null;

// Load appropriate library for the operating platform 
if (platform === 'Windows') {
    libnmengine = './lib/nmengine.dll'
} else if (platform === 'Linux') {
    libnmengine = './lib/libnmengine.so'
} else {
    libnmengine = './src/lib/nmengine/libnmengine.dylib'
}

const nmengine = ffi.Library(libnmengine, {
    "nm_get_devices": [uint16, [deviceArrayPtr, uint8Ptr]],
    "nm_connect": [uint16, [devicePtr]],
    "nm_close": [uint16, [devicePtr]],
    "nm_forget": [uint16, [devicePtr]],
    "nm_reset": [uint16, [devicePtr]],
    "nm_get_network_info": [uint16, [devicePtr, networkInfoPtr]],
    "nm_get_neuron_count": [uint16, [devicePtr, uint32Ptr]],
    "nm_get_network_status": [uint16, [devicePtr, networkStatusPtr]],
    "nm_set_network_type": [uint16, [devicePtr, uint8]],
    "nm_get_network_type": [uint16, [devicePtr, uint8Ptr]],
    "nm_set_context": [uint16, [devicePtr, contextPtr]],
    "nm_get_context": [uint16, [devicePtr, contextPtr]],
    "nm_learn": [uint16, [devicePtr, learnReqPtr]],
    "nm_learn_batch": [uint16, [devicePtr, ref.refType(datatypes.LearnBatchReq)]],
    "nm_clusterize": [uint16, [devicePtr, ref.refType(datatypes.ClusterizeReq)]],
    "nm_classify": [uint16, [devicePtr, classifyReqPtr]],
    "nm_get_model_info": [uint16, [devicePtr, ref.refType(datatypes.ModelInfo)]],
    "nm_get_model_stat": [uint16, [devicePtr, ref.refType(datatypes.ModelStat)]],
    "nm_read_neuron": [uint16, [devicePtr, neuronPtr]],
    "nm_read_neurons": [uint16, [devicePtr, neuronArrayPtr, uint32Ptr]],
    "nm_write_neurons": [uint16, [devicePtr, neuronArrayPtr, uint32Ptr]],
    "nm_save_model": [uint16, [devicePtr, neuronArrayPtr, uint32, 'CString']],
    "nm_load_model": [uint16, [devicePtr, neuronArrayPtr, uint32Ptr, 'CString']],
    "nm_power_save": [uint16, [devicePtr]],
});

let devices;
let targetPtr;

/**
 * @param {number} count how many devices to detect
 * @return {number} resultCode: Result Code
 * @return {!Array<Device>} devices: The array of devices you detect
 * @return {number} detectedCount: The number of detected devices
 */
exports.getDevices = (count) => {

    let devicesPtr = ref.alloc(ArrayType(datatypes.Device, count));
    let countPtr = ref.alloc('uint8', count);
    let r = nmengine.nm_get_devices(devicesPtr, countPtr);

    devices = devicesPtr.deref();

    return {
        resultCode: r
        , devices: devicesPtr.deref()
        , detectedCount: countPtr.deref()
    }
}

/**
 * @param {number} index device index
 * @return {number} resultCode: Result Code
 */
exports.connect = (index) => {

    targetPtr = ref.alloc(datatypes.Device, devices[index]);
    let r = nmengine.nm_connect(targetPtr);

    return {
        resultCode: r
    }
}

/**
 * @return {number} resultCode: Result Code
 */
exports.close = () => {
    let r = nmengine.nm_close(targetPtr);

    return {
        resultCode: r
    }
}

/**
 * @return {number} resultCode: Result Code
 */
exports.forget = () => {

    let r = nmengine.nm_forget(targetPtr);

    return {
        resultCode: r
    }
}

/**
 * @return {number} resultCode: Result Code
 */
exports.reset = () => {

    let r = nmengine.nm_reset(targetPtr);

    return {
        resultCode: r
    }
}

/**
 * @return {number} resultCode: Result Code
 * @return {NetworkStatus} status: The result struct of getNetworkStatus
 */
exports.getNetworkStatus = () => {

    let status = new datatypes.NetworkStatus();
    let r = nmengine.nm_get_network_status(targetPtr, status.ref());

    return {
        resultCode: r
        , status: status
    }
}

/**
 * @return {number} resultCode: Result Code
 * @return {NetworkInfo} info: The result struct of getNetworkInfo
 */
exports.getNetworkInfo = () => {

    let info = new datatypes.NetworkInfo();
    let r = nmengine.nm_get_network_info(targetPtr, info.ref());

    return {
        resultCode: r
        , info: info
    }
}

/**
* @return {number} resultCode: Result Code
* @return {number} networkType: The result struct of getNetworkType
*/
exports.getNetworkType = () => {

    let networkTypePtr = ref.alloc('uint8');
    let r = nmengine.nm_get_network_type(targetPtr, networkTypePtr);

    return {
        resultCode: r
        , networkType: networkTypePtr.deref()
    }
}

/**
 * @param {number} networkType Network Type
* @return {number} resultCode: Result Code
*/
exports.setNetworkType = (networkType) => {

    let r = nmengine.nm_set_network_type(targetPtr, networkType);

    return {
        resultCode: r
    }
}

/**
* @return {number} resultCode: Result Code
* @return {ctx} ctx: Context
*/
exports.getContext = () => {

    let ctx = new datatypes.Context();
    let r = nmengine.nm_get_context(targetPtr, ctx.ref());

    return {
        resultCode: r
        , ctx: ctx
    }
}

/**
 * @param {number} context GCR
 * @param {number} norm A distance evaluation unit (L1, Lsup)
 * @param {number} minif Minimum Influence Field (to control uncertainty domain) 
 * @param {number} maxif Maximum Influence Field  (to adjust conservatism) 
 * @return {number} resultCode: Result Code
 * @return {ctx} ctx: Context
 */
exports.setContext = (context, norm, minif, maxif) => {

    let ctxStr = new datatypes.Context();
    ctxStr.context = context;
    ctxStr.norm = norm;
    ctxStr.minif = minif;
    ctxStr.maxif = maxif;

    let ctxPtr = ref.alloc(datatypes.Context, ctxStr);
    let r = nmengine.nm_set_context(targetPtr, ctxPtr);

    return {
        resultCode: r
        , ctx: ctxPtr.deref()
    }
}

/**
 * @param {!Array<number>} vector Components of input vector
 * @param {number} category The label of input vector
 * @param {number} queryAffected The flag of checking affected neurons
 * @return {number} resultCode: Result Code
 * @return {LearnReq} req: The result struct of Training
 */
exports.learn = (vector, category, queryAffected) => {
    let learnStr = new datatypes.LearnReq();
    learnStr.category = category;
    learnStr.size = constants.NEURON_MEMORY;
    learnStr.vector = vector;
    learnStr.query_affected = queryAffected;

    let learnPtr = ref.alloc(datatypes.LearnReq, learnStr);
    let r = nmengine.nm_learn(targetPtr, learnPtr);

    return {
        resultCode: r
        , req: learnPtr.deref()
    }
}

/**
* @return {number} resultCode: Result Code
* @return {number} ncount: ncount
*/
exports.getNeuronCount = () => {
    let neuronCountPtr = ref.alloc('uint32');
    let r = nmengine.nm_get_neuron_count(targetPtr, neuronCountPtr);

    return {
        resultCode: r
        , ncount: neuronCountPtr.deref()
    }
}

/**
 * @param {!Array<Neuron>} nid A id of neuron to read
 * @return {number} resultCode: Result Code
 * @return {Neuron} neuron: A read neuron
 */
exports.readNeuron = (nid) => {

    let neuron = new datatypes.Neuron();
    neuron.nid = nid;

    let neuronPtr = ref.alloc(datatypes.Neuron, neuron)
    let r = nmengine.nm_read_neuron(targetPtr, neuronPtr);

    return {
        resultCode: r
        , neuron: neuronPtr.deref()
    }
}

/**
 * @param {!Array<Neuron>} neurons An array to store results of readNeurons
 * @param {number} readCount How many neurons you will read
 * @return {number} resultCode: Result Code
 * @return {!Array<Neuron>} neurons: An Array of read neurons
 * @return {number} readCount: The number of read neurons
 */
exports.readNeurons = (neurons, readCount) => {
    let neuronsPtr = ref.alloc(neurons);
    let readCountPtr = ref.alloc('uint32', readCount);
    let r = nmengine.nm_read_neurons(targetPtr, neuronsPtr, readCountPtr);

    return {
        resultCode: r
        , neurons: neuronsPtr.deref()
        , readCount: readCountPtr.deref()
    }
}

/**
 * @param {!Array<Neuron>} neurons An array of neurons to write
 * @param {number} readCount How many neurons you will write
 * @return {number} resultCode: Result Code
 * @return {number} writeCount: The number of write neurons
 */
exports.writeNeurons = (neurons, writeCount) => {
    let writeCountPtr = ref.alloc('uint32', writeCount);
    let r = nmengine.nm_write_neurons(targetPtr, neurons.buffer, writeCountPtr);

    return {
        resultCode: r
        , writeCount: writeCountPtr.deref()
    }
}

/**
 * @return {number} resultCode: Result Code
 * @return {ModelInfo} modelInfo: The result struct of getModelInfo
 */
exports.getModelInfo = () => {
    let mi = new datatypes.ModelInfo();
    let r = nmengine.nm_get_model_info(targetPtr, mi.ref());

    return {
        resultCode: r
        , modelInfo: mi
    }
}

/**
 * @param {number} context context
 * @param {number} maxCategory The maximum category in gcr
 * @return {number} resultCode: Result Code
 * @return {ModelInfo} modelStat: The result struct of getModelStat
 */
exports.getModelStat = (context, maxCategory) => {
    let msStr = new datatypes.ModelStat();
    msStr.context = context;
    msStr.histo_cat = Buffer.from(new Uint16Array(maxCategory + 1).buffer);
    msStr.histo_deg = Buffer.from(new Uint16Array(maxCategory + 1).buffer);

    let msPtr = ref.alloc(datatypes.ModelStat, msStr);
    let r = nmengine.nm_get_model_stat(targetPtr, msPtr);

    return {
        resultCode: r
        , modelStat: msPtr.deref()
    }
}

/**
 * @param {number} iterCount epoch
 * @param {number} iterable 
 * @param {number} vectorCount The size of input vector array
 * @param {!Array<uint8>} vectors Input vector array for batch
 * @param {!Array<uint16>} categories Categories for batch
 * @return {number} resultCode: Result Code
 * @return {LearnBatchReq} req: The result struct of learnBatch
 */
exports.learnBatch = (iterCount, iterable, vectorCount, vectors, categories) => {
    let batchStr = new datatypes.LearnBatchReq();
    batchStr.iter_count = iterCount;
    batchStr.iter_result = Buffer.from(new Uint32Array(iterCount).buffer);
    batchStr.iterable = iterable;
    batchStr.vector_size = constants.NEURON_MEMORY;
    batchStr.vector_count = vectorCount;
    batchStr.vectors = Buffer.from(vectors);
    batchStr.categories = Buffer.from(categories.buffer);

    let batchPtr = ref.alloc(datatypes.LearnBatchReq, batchStr);
    let r = nmengine.nm_learn_batch(targetPtr, batchPtr);

    return {
        resultCode: r
        , req: batchPtr.deref()
    }
}

/**
 * @param {number} vectorCount The size of input vector array
 * @param {!Array<uint8>} vectors Input vector array for batch
 * @param {!Array<uint16>} categories Categories for batch
 * @param {number} batchSize Total number of training examples present in a single batch
 * @return {number} resultCode: Result Code
 * @return {LearnBatchReq} req: The result struct of learnBatch
 */
// exports.learnBatchWithBatchSize = (vectorCount, vectors, categories, batchSize) => {
//     let totalIteration = Math.ceil(vectorCount / batchSize);
//     let batchStr = new datatypes.LearnBatchReq();
//     batchStr.iter_count = 1;
//     batchStr.iterable = 0;
//     batchStr.iter_result = Buffer.from(new Uint32Array(iterCount).buffer);
//     batchStr.vector_size = constants.NEURON_MEMORY;
//     batchStr.vector_count = batchSize;

//     let batchPtr = null;
//     let r = null;

//     for (let i = 0; i < totalIteration; i++) {

//         batchStr.vectors = Buffer.from(vectors.slice(i * batchSize * constants.NEURON_MEMORY, (i+1) * batchSize * constants.NEURON_MEMORY));
//         batchStr.categories = Buffer.from(categories.slice(i * batchSize, (i+1) * batchSize).buffer);
//         batchPtr = ref.alloc(datatypes.LearnBatchReq, batchStr);
//         r = nmengine.nm_learn_batch(targetPtr, batchPtr);

//         if (r !== constants.SUCCESS) {
//             console.log("nm_learn_batch error.. stop batch learning")
//             break;
//         }
//     }

//     return {
//         resultCode: r
//         , req: batchPtr.deref()
//     }
// }

/**
 * @param {number} initialCategory Initial category id (it must be greater than 0)
 * @param {number} incrementOf Unit of increasement of category id 
 * @param {number} vectorCount The size of input vector array
 * @param {!Array<uint8>} vectors Input vector array
 * @return {number} resultCode: Result Code
 * @return {ClusterizeReq} req: The result struct of clusterize
 */
exports.clusterize = (initialCategory, incrementOf, vectorCount, vectors) => {
    let cluStr = new datatypes.ClusterizeReq();

    // The value of initial category must be greater than 0 
    cluStr.initial_category = initialCategory;
    // If incrementof is set to 0, all of vector will be trained with same category
    cluStr.incrementof = incrementOf;
    cluStr.vector_size = constants.NEURON_MEMORY;
    cluStr.vector_count = vectorCount;
    cluStr.vectors = Buffer.from(vectors);

    // Do clusterize
    let cluPtr = ref.alloc(datatypes.ClusterizeReq, cluStr)
    let r = nmengine.nm_clusterize(targetPtr, cluPtr);

    return {
        resultCode: r
        , req: cluPtr.deref()
    }
}

/**
 * @param {number} k mumber of returns matched
 * @param {!Array<uint8>} vector input data
 * @return {number} resultCode: Result Code
 * @return {ClassifyReq} The result struct of classify
 */
exports.classify = (k, vector) => {
    let classifyStr = new datatypes.ClassifyReq();
    classifyStr.size = constants.NEURON_MEMORY;
    classifyStr.k = k;
    classifyStr.vector = vector

    let classifyPtr = ref.alloc(datatypes.ClassifyReq, classifyStr);
    let r = nmengine.nm_classify(targetPtr, classifyPtr);

    return {
        resultCode: r
        , req: classifyPtr.deref()
    }
}

/**
 * @param {!Array<Neuron>} neurons Input vector array for save
 * @param {number} neuronCount How many neurons you will save
 * @param {string} path Where you will save models
 * @return {number} resultCode: Result Code
 */
exports.saveModel = (neurons, neuronCount, path) => {
    let r = nmengine.nm_save_model(targetPtr, neurons.buffer, neuronCount, path);

    return {
        resultCode: r
    }
}

/**
 * @param {!Array<Neuron>} neurons An array to store results of loadModel
 * @param {number} neuronCount How many neurons you will load
 * @param {string} path Where you will load models
 * @return {number} resultCode: Result Code
 * @return {!Array<Neuron>} neurons: An array of neurons you load
 */
exports.loadModel = (neurons, neuronCount, path) => {
    let neuronsPtr = ref.alloc(neurons);
    let neuronCountPtr = ref.alloc('uint32', neuronCount);

    let r = nmengine.nm_load_model(targetPtr, neuronsPtr, neuronCountPtr, path);

    return {
        resultCode: r
        , neurons: neuronsPtr.deref()
    }
}

/**
 * @return {number} resultCode: Result Code
 */
exports.powerSave = () => {
    let r = nmengine.nm_power_save(targetPtr);

    return {
        resultCode: r
    }
}
