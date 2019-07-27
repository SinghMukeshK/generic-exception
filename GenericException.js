/* eslint-disable no-console */
require('node-i18n-util');
const find = require('find');
const appRoot = require('app-root-path');

let messagesBundle = require('./defaultMessages.properties');

const exceptionConstants = require('./exceptionConstants');

console.log("Root path " + appRoot.path);

let files = find.fileSync(/\messages.properties$/, appRoot.path)

if (files) {
    if (files && files.length > 0) {
        messagesBundle = require(files[0])
    } else {
        console.log('messages.properties file not found')
    }
}

let _projectName, _timastamp, _code, _reason, _locale, _description, _httpStatusCode, _message,
    _exceptionType, _exceptionCategory, _inspectionFields, _messageBundle, _substitutionArgs, _wrappedException;


class GenericException extends Error {
    constructor(builder) {
        super(builder._message);

        if (!(builder.exceptionType && builder.exceptionType.trim())) {
            throw new Error(exceptionConstants.MISSING_EXCEPTION_TYPE);
        }

        if (!(builder.messageBundle)) {
            throw new Error(exceptionConstants.MISSING_EXCEPTION_RESOURCE_BUNDLE);
        }

        _timastamp = new Date();
        _exceptionType = builder.exceptionType;
        _message = builder.message;
        _reason = builder.reason;
        _locale = builder.locale;
        _exceptionCategory = builder.exceptionCategory;
        _inspectionFields = builder.inspectionFields;
        _wrappedException = builder.wrappedException;
        _messageBundle = builder.messageBundle;
        _substitutionArgs = builder.substitutionArgs;

        _projectName = this.getFormattedMessage(exceptionConstants.PROJECT_NAME);

        let staticMessage = JSON.parse(this.getFormattedMessage(_exceptionType));

        // fail if not json format

        _code = this.getFieldFromJson(staticMessage, 'code');
        _description = this.getFieldFromJson(staticMessage, 'description');
        _httpStatusCode = this.getFieldFromJson(staticMessage, 'httpStatusCode');

        if (_wrappedException && _wrappedException instanceof Error) {
            super.stack = _wrappedException.stack;
        }
    }

    getFieldFromJson(message, type) {
        let value = message[type];
        if (value && value.trim()) {
            return value;
        } else {
            throw new Error(`${type} : ${exceptionConstants.MISSING_VALUE}`);
        }
    }

    getFormattedMessage(key) {
        try {
            return _messageBundle.get(key, _substitutionArgs, _locale) || `${key} : ${exceptionConstants.MISSING_VALUE}`;
        } catch (e) {
            console.log('Missing messages.properties file in the project')
            throw new Error(`${key} : ${exceptionConstants.MISSING_KEY}`);
        }
    }

    static get Builder() {
        let _code, _description, _httpStatusCode, _messageBundle, _exceptionType,
            _message, _wrappedException, _inspectionFields, _exceptionCategory, _locale, _reason, _substitutionArgs;

        class Builder {
            constructor(exceptionType) {
                _exceptionType = exceptionType;
                _messageBundle = messagesBundle;
            }

            get code() {
                return _code;
            }
            get message() {
                return _message;
            }
            get description() {
                return _description;
            }
            get exceptionCategory() {
                return _exceptionCategory;
            }
            get inspectionFields() {
                return _inspectionFields;
            }
            get wrappedException() {
                return _wrappedException;
            }
            get httpStatusCode() {
                return _httpStatusCode;
            }
            get locale() {
                return _locale;
            }
            get reason() {
                return _reason;
            }

            get exceptionType() {
                return _exceptionType;
            }
            get messageBundle() {
                return _messageBundle;
            }

            get substitutionArgs() {
                return _substitutionArgs;
            }

            /**
             * Builds error with specified message 
             * @param {*} message 
             * @description Specify error message 
             */
            withMessage(message) {
                _message = message;
                return this;
            }

            /**
             * Exception Categpry
             * @param {String} exceptionCategory 
             * @description Specify exception category
             */
            withExceptionCategory(exceptionCategory) {
                _exceptionCategory = exceptionCategory;
                return this;
            }

            withInspectionFields(inspectionFields) {
                _inspectionFields = inspectionFields;
                return this;
            }

            /**
             * Returns Wrapped Exception
             * @param {*} wrappedException 
             * @description Builds wrapped exception i.e. actual error
             */
            withWrappedException(wrappedException) {
                _wrappedException = wrappedException;
                return this;
            }

            /**
             * Builds object with Reason
             * @param {*} reason 
             * @description Specify reason for the erro to be passed to caller
             */
            withReason(reason) {
                _reason = reason;
                return this;
            }
            /**
             * Locale
             * @param {*} locale 
             */
            withLocale(locale) {
                _locale = locale;
                return this;
            }

            /**
             * Builds with Substitution argument passed
             * @param  {...any} args 
             */
            withSubstitutionArgs(...args) {
                _substitutionArgs = args;
                return this;
            }

            /**
             * GenericException builder
             * @description Builds Builder object and returns GenericException * 
             */
            build() {
                if (!(this.message && this.message.trim())) {
                    if (this.wrappedException) {
                        let tempMessage = this.wrappedException.message;

                        if (tempMessage && tempMessage.trim()) {
                            this.withMessage(tempMessage.toString());
                        } else {
                            throw new Error(exceptionConstants.DEFAULT_EXCEPTION_MESSAGE);
                        }
                    } else {
                        throw new Error(exceptionConstants.DEFAULT_EXCEPTION_MESSAGE);
                    }
                }
                return new GenericException(this);
            }
        }
        return Builder;
    }
    get message() {
        return _message;
    }
    get code() {
        return _code;
    }

    get description() {
        return _description;
    }

    get httpStatusCode() {
        return _httpStatusCode;
    }

    get wrappedException() {
        return _wrappedException;
    }

    /**
     * Pass custom json object
     */
    get inspectionFields() {
        return _inspectionFields;
    }

    /** 
     * Locale
    */
    get locale() {
        return _locale;
    }

    /**
     * Error reason
     */
    get reason() {
        return _reason;
    }

    /**
     * Exception Category
     */
    get exceptionCategory() {
        return _exceptionCategory;
    }

    /**
     * 
     */
    get exceptionType() {
        return _exceptionType;
    }
    /**
     * Timestamp
     */
    get timestamp() {
        return _timastamp;
    }

    get projectName() {
        return _projectName;
    }
    toString() {
        return JSON.stringify({
            projectName: this.projectName,
            timestamp: this.timestamp,
            exceptionType: this.exceptionType,
            exceptionCategory: this.exceptionCategory,
            message: this.message,
            httpStatusCode: this.httpStatusCode,
            code: this.code,
            description: this.description,
            wrappedException: this.wrappedException,
            reason: this.reason,
            inspectionFields: this.inspectionFields,
            locale: this.locale,
            stack: this.stack
        });
    }
}

module.exports = GenericException;

