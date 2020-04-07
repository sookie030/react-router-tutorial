/* Copyright (C) 2018-2019 by nepes Corp. All Rights Reserved
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * 
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 * 
 * 3. Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * Data structure and types for the Neuromem API library package for Python.
 * 
 * Copyright (C) 2018-2019 by nepes Corp. All Rights Reserved
 * 
 * To use, simply 'import nmengine'
 */

const constants = require('./constants');
const ref = require('ref');
const ArrayType = require('ref-array');
const StructType = require('ref-struct');

/**
 * Definition of data type for device connection
 */
exports.Device = StructType({
    dev: 'void *',
    handle: 'void *',
    lock: 'void *',
    type: 'uint16',
    id: 'uint16',
    vid: 'uint16',
    pid: 'uint16',
    is_open: 'uint8'
});

/**
 * Definition of data type for device network information
 * neuron_size: number of neurons
 * neuron_memory_size: memory size of each neuron.
 * version: version of device firmware
 */
exports.NetworkInfo = StructType({
    neuron_count: 'uint32',
    neuron_memory_size: 'uint16',
    version: 'uint16'
});

/**
 * Definition of data type for network status
 * network_used: number of used/committed neurons
 * network_type: RBF or KNN
 * context: current/global context
 * norm: current norm type
 */
exports.NetworkStatus = StructType({
    network_used: 'uint32',
    context: 'uint16',
    network_type: 'uint8',
    norm: 'uint8'
});

/**
 * Definition of data type for context
 * context: context id
 * norm: norm type
 * minif: minimum influence field
 * maxif: maximum influence field
 */
exports.Context = StructType({
    context: 'uint16',
    norm: 'uint16',
    minif: 'uint16',
    maxif: 'uint16'
});

/**
 * Definition of data type for neuron
 * nid: neuron id
 * size: vector length used in neuron memory (vector size)
 * ncr: neuron context (context id, norm)
 * aif: active influence field (threshold of activation function)
 * minif: minimum influence field
 * model: prototype (stored weight memory)
 */
const Neuron = StructType({
    nid: 'uint32',
    size: 'uint16',
    ncr: 'uint16',
    aif: 'uint16',
    minif: 'uint16',
    cat: 'uint16',
    model: ArrayType('uint8', 256)
});
exports.Neuron = Neuron;

/**
 * Definition of data type for classifing request/response
 * <<input>>
 * @param {number} sizeinput data size
 * @param {!Array<uint8>} vector input data
 * @param {number} k number of returns matched
 * 
 * <<output>>
 * @return status: network status of classifying
 * @return matched_count: number(n) of matched
 * @return nid[n]: id of neuron matched
 * @return category[n]: category of neuron matched
 * @return degenerated[n]: degenerated flag of neuron matched (1: degenerated)
 * @return distance[n]: distance between input data and prototype of neuron matched
 */
exports.ClassifyReq = StructType({
    status: 'uint32',
    size: 'uint16',
    k: 'uint16',
    matched_count: 'uint16',
    nid: ArrayType('uint32', constants.CLASSIFY_MAX_K),
    degenerated: ArrayType('uint16', constants.CLASSIFY_MAX_K),
    distance: ArrayType('uint16', constants.CLASSIFY_MAX_K),
    category: ArrayType('uint16', constants.CLASSIFY_MAX_K),
    vector: ArrayType('uint8', 256)
});

/**
 * Definition of data type for learning request/response
 * <<input>>
 * @param {number} query_affected flag for whether to retrieve affected neuron information 
 *   generally flagging is not required.
 * @param {number} category category of input data(vector)
 * @param {number} size input data size
 * @param {!Array<number>} vector input data
 * 
 * <<output>>
 * @return status: network status of learning
 * @return affected_count: number of affected neurons
 * @return affected_neurons[affected_count]: list of affected neurons
 */
exports.LearnReq = StructType({
    status: 'uint32',
    affected_neurons: ArrayType(Neuron, 10),
    affected_count: 'uint16',
    category: 'uint16',
    size: 'uint16',
    vector: ArrayType('uint8', 256),
    query_affected: 'uint8'
});

/**
 * Definition of data type for batch learning request/response
 * <<input>>
 * @param {number} iterable flag for whether to iterate batch learning
 * @param {number} iter_count number of iteration (epoch)
 * @param {number} vector_count number of vectors
 * @param {number} vector_size input data size
 * @param {!Array<number>} vectors list of input data
 * @param {!Array<number>} categories list of category of input data(vector)
 * 
 * <<output>>
 */
exports.LearnBatchReq = StructType({
    vector_count: 'uint32',
    iter_result: ref.refType('uint32'),
    iter_count: 'uint16',
    iterable: 'uint16',
    vector_size: 'uint16',
    categories: ref.refType('uint16'),
    vectors: ref.refType('uint8')
});

/**
 * Definition of data type for clusterize request/response
 * <<input>>
 * @param {number} initial_category initial category id (it must be greater than 0)
 * @param {number} incrementof unit of increasement of category id
 * @param {number} vector_count number of vectors
 * @param {number} vector_size input data size
 * @param {!Array<uint8>} vectors list of input data
 * 
 * <<output>>
 */
exports.ClusterizeReq = StructType({
    vector_count: 'uint32',
    vector_size: 'uint16',
    initial_category: 'uint16',
    incrementof: 'uint16',
    vectors: 'uint8*'

});

/**
 * Definition of data type for knowledge(or trained) model
 * count: number of neurons used/committed
 * max_context: the largest context id (1~127)
 * max_category: the largest category id (1~32766)
 */
exports.ModelInfo = StructType({
    count: 'uint32',
    max_context: 'uint16',
    max_category: 'uint16'
});

/**
 * Definition of data type for knowledge(or trained) model analysis
 * it shows distribution of neuron per category
 * <<input>>
 * @param {number} context target context id for analysis
 * 
 * <<output>>
 * @return count: number of neurons used/committed in given context
 * @return histo_cat[the largest category id + 1]: number of neurons per cateogory
 * @return histo_deg[the largest category id + 1]: nember of degenerated neuron per category
 */
exports.ModelStat = StructType({
    context: 'uint16',
    count: 'uint32',
    histo_cat: ref.refType('uint16'),
    histo_deg: ref.refType('uint16')
});