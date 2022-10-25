exports.successWithData = (data) => ({ status: true, data: data });
exports.successWithMessage = (message) => ({ status: true, message: message });
exports.errorWithMessage = (message) => ({ status: false, message: message });
exports.errorWithDefaultMessage = () => ({
  status: false,
  message: "Terjadi Kesalahan",
});
exports.errorWithData = (data) => ({ status: false, data: data });
