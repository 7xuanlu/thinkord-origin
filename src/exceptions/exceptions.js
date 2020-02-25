// Defining errors and error handler for backend

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
  // Return json object to the client side
  toJSON() {
    return {
      error: {
        name: this.name,
        message: this.message,
        stacktrace: this.stack
      }
    }
  }

  // Error for development
  devError(){
    console.log("Inside dev error");
    console.log(this.message);
    console.log(`An unexpected ${this.name} occurred!`);
    console.log(this.stack);
    return;
  }

  // Error to alert users
  userError(){
    console.log('Inside user error');
    return JSON.stringify(this);
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
    return this.errorTypes[errorName].userError();
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
