const MESSAGE_TYPE = {
  INFORMATION: "information",
  ERROR: "error",
  WARNING: "warning",
};

const MESSAGE = {
    // Error
    INVALID_LINK : "This link is not allowed.",
    NO_SOURCE : "A pipeline must start at Source.",
    LINK_TO_SAME_MODULE : "Cannot make a link with the same modules.",
    LINK_TO_SOURCE : "Source cannot receive data.",
    LINK_ALREADY_EXIST : "The link already exist.",
    SOURCE_STATE_INVALID : "The source state is invalid.",

    // Done
    SUCCESS : "Run is Done!",
    
    // Warinig
    TRY_TO_GET_SOURCE_AGAIN : "The source state is invalid. Get source again."
}

export { MESSAGE_TYPE, MESSAGE }