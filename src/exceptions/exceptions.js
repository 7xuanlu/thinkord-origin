const { dialog } = require('electron');

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
  // Error for development
  devError(){
    console.error(this.message);
    console.log(`An unexpected ${this.name} occurred!`);
    console.error(this.stack);
  }

  // Error to alert users
  userError(){
    console.log('Inside user error');
    return noti_rename;
  }
}

class exceptionHandler {
  constructor(){
    this.errorTypes = {};
  }

  register(message, errorName){
    let NewError = new BaseError(message, errorName);
    this.errorTypes[errorName] = NewError;
  }

  raiseException(errorName){
    // throw this.errorTypes[errorName];
    this.errorTypes[errorName].devError();
  }
}
exports.test = () => {
  try {
	  throw new BaseError("Whoops!", "baseError");
	} catch(err) {
	  // console.error(err.stack); // a list of nested calls with line numbers for each
    err.devError();
    err.userError();
	}
}
module.exports.exceptionHandler = exceptionHandler;
