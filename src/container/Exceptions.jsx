import React, { Component } from 'react';
const { ipcRenderer } = require('electron');

// Third-party packages
// Notification
import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/mint.css';
import 'noty/lib/themes/relax.css';

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
    return this.handleErrorNoti();
  }

    // Handle erroroneous notification
    handleErrorNoti = () => {
    	noti = new Noty({
                    type: 'error',
                    theme: 'relax',
                    layout: 'topRight',
                    text: this.message
                }).show();
    	return noti;
    }
}

// Front-end exception handler
class ExceptionFront {
   constructor(){
    this.errorTypes = {};
    this.noti = null;
    console.log("Constructed exception front");
  }

  register(message, errorName){
    let NewError = new BaseError(message, errorName);
    this.errorTypes[errorName] = NewError;
  }

  raiseException(errorName){
    // throw this.errorTypes[errorName];
    this.errorTypes[errorName].devError();
    this.noti = this.errorTypes[errorName].userError();
    return
  }

  // Function to handle a given condition
  handleCondition = (condition, successMsg, errorName) => {
  	if (condition){
  		this.noti = this.handleSuccessNoti(successMsg);
  	}else{
  		this.raiseException(errorName);
  	}
  }


    // Handle successful notification
    handleSuccessNoti = (msg) => {
        if (this.noti === null || this.noti === undefined) {
            this.noti = new Noty({
                type: 'success',
                theme: 'relax',
                layout: 'topRight',
                text: msg
            }).show();
            return this.noti;
        } else {
            this.noti.close();
            this.noti = new Noty({
                type: 'success',
                theme: 'relax',
                layout: 'topRight',
                text: msg
            });
            setTimeout(() => { this.noti.show(); }, 500);  // Show notification after previous notification is closed.
            return this.noti;
        }
    }
}
module.exports.exFront = ExceptionFront;