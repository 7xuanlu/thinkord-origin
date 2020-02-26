import React, { Component } from 'react';
const { ipcRenderer } = require('electron');

// Third-party packages
// Notification
import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/mint.css';
import 'noty/lib/themes/relax.css';

// Class for all frontend errors
class FrontendError extends Error {
    constructor(message, errorName) {
        super(message);

        this.name = errorName;
    }

    // Error for development
    devError = () => {
        console.log(`Unexpected ${this.name}`);
        console.log(this.stack);
    }

    // Error to alert users
    userError = () => {
        return new Noty({
            type: 'error',
            theme: 'relax',
            layout: 'topRight',
            text: this.message
        }).show();
    }
}

// Front-end exception handler
export default class FrontendException {
    constructor() {
        this.errorTypes = {};
        this.noti = null;
    }

    register = (message, errorName) => {
        const NewError = new FrontendError(message, errorName);
        this.errorTypes[errorName] = NewError;
    }

    raiseException = (errorName) => {
        // throw this.errorTypes[errorName];
        this.errorTypes[errorName].devError();
        this.noti = this.errorTypes[errorName].userError();
    }

    // Handle a given condition
    handleCondition = (condition, successMsg, errorName) => {
        if (condition) {
            this.handleSuccessNoti(successMsg);
        } else {
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
        } else {
            this.noti.close();
            this.noti = new Noty({
                type: 'success',
                theme: 'relax',
                layout: 'topRight',
                text: msg
            });
            setTimeout(() => { this.noti.show(); }, 500);  // Show notification after previous notification is closed.
        }
    }
}
