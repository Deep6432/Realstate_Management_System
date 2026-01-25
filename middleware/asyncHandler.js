/**
 * Async Handler Middleware
 * Wraps async route handlers to automatically catch errors
 * and pass them to the error handler middleware
 */

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
