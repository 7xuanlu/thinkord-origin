// Base class for all custom errors
class BaseError extends Error {
  constructor(message, errorName) {
    super(message);
    this.name = errorName;
    // Maintains proper stack trace for where our error was thrown (only available on V8)
   if (Error.captureStackTrace) {
     Error.captureStackTrace(this, BaseError);
   }
  }
}

exports.test = () => {
  try {
	  throw new BaseError("Whoops!", baseError);
	} catch(err) {
	  alert(err.message);
	  alert(err.name); // ValidationError
	  alert(err.stack); // a list of nested calls with line numbers for each
	}
}

