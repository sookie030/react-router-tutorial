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
 * Constant value definition for the Neuromem API library package for Python.
 * 
 * Copyright (C) 2018-2019 by nepes Corp. All Rights Reserved
 * 
 * To use, simply 'import nmengine'
 */

module.exports = Object.freeze({
    
    // The registers of the NeuroMem chip.
    NCR: 0x00,
    COMP: 0x01,
    LCOMP: 0x02,
    DIST: 0x03,
    INDEXCOMP: 0x03,
    CAT: 0x04,
    AIF: 0x05,
    MINIF: 0x06,
    MAXIF: 0x07,
    TESTCOMP: 0x08,
    TESTCAT: 0x09,
    NID: 0x0A,
    GCR: 0x0B,
    RSTCHAIN: 0x0C,
    NSR: 0x0D,
    POWERSAVE: 0x0E,
    NCOUNT: 0x0F,
    FORGET: 0x0F,

    // The memory size of the neuron.
    NEURON_MEMORY: 256,

    // The maximum number of results returned.
    CLASSIFY_MAX_K: 9,

    // The network Types
    RBF: 0,
    KNN: 1,

    // The norm type of network
    L1: 0,
    Lsup: 1,

    // The result code of library
    SUCCESS: 0,
    ERROR_UNKNOWN: 100,
    ERROR_DEVICE_NOT_FOUND: 101,
    ERROR_DEVICE_INFO_FETCH_FAILED: 102,
    ERROR_DEVICE_OPEN_FAILED: 103,
    ERROR_INIT_FAILED: 104,
    ERROR_INVALID_PARAMETER: 105,
    ERROR_NOT_SUPPORT: 106,
    ERROR_IO_TIMEOUT: 107,
    ERROR_IO_FAILED: 108,

    // The result code for learning
    LEARN_ALREADY_KNOWN: 0,
    LEARN_SUCCESS: 1,
    LEARN_ADJUSTED: 2,
    LEARN_DEGENERATED: 3,

    // The result code for classifying
    CLASSIFY_UNKNOWN: 0,
    CLASSIFY_UNCERTAIN: 4,
    CLASSIFY_IDENTIFIED: 8,
});