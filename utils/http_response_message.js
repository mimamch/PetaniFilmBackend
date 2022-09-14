exports.successWithData = (data) => ({ status: true, data: data });
exports.successWithMessage = (message) => ({ status: true, message: message });
exports.errorWithMessage = (message) => ({ status: false, message: message });
exports.errorWithData = (data) => ({ status: false, data: data });
