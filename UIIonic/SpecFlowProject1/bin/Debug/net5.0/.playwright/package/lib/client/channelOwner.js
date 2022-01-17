"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChannelOwner = void 0;

var _events = require("events");

var _validator = require("../protocol/validator");

var _debugLogger = require("../utils/debugLogger");

var _stackTrace = require("../utils/stackTrace");

var _utils = require("../utils/utils");

/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ChannelOwner extends _events.EventEmitter {
  constructor(parent, type, guid, initializer) {
    super();
    this._connection = void 0;
    this._parent = void 0;
    this._objects = new Map();
    this._type = void 0;
    this._guid = void 0;
    this._channel = void 0;
    this._initializer = void 0;
    this._logger = void 0;
    this._csi = void 0;
    this.setMaxListeners(0);
    this._connection = parent instanceof ChannelOwner ? parent._connection : parent;
    this._type = type;
    this._guid = guid;
    this._parent = parent instanceof ChannelOwner ? parent : undefined;

    this._connection._objects.set(guid, this);

    if (this._parent) {
      this._parent._objects.set(guid, this);

      this._logger = this._parent._logger;
    }

    this._channel = this._createChannel(new _events.EventEmitter(), null);
    this._initializer = initializer;
  }

  _dispose() {
    // Clean up from parent and connection.
    if (this._parent) this._parent._objects.delete(this._guid);

    this._connection._objects.delete(this._guid); // Dispose all children.


    for (const object of [...this._objects.values()]) object._dispose();

    this._objects.clear();
  }

  _debugScopeState() {
    return {
      _guid: this._guid,
      objects: Array.from(this._objects.values()).map(o => o._debugScopeState())
    };
  }

  _createChannel(base, stackTrace) {
    const channel = new Proxy(base, {
      get: (obj, prop) => {
        if (prop === 'debugScopeState') return params => this._connection.sendMessageToServer(this, prop, params, stackTrace);

        if (typeof prop === 'string') {
          const validator = scheme[paramsName(this._type, prop)];
          if (validator) return params => this._connection.sendMessageToServer(this, prop, validator(params, ''), stackTrace);
        }

        return obj[prop];
      }
    });
    channel._object = this;
    return channel;
  }

  async _wrapApiCall(func, logger) {
    logger = logger || this._logger;
    const stackTrace = (0, _stackTrace.captureStackTrace)();
    const {
      apiName,
      frameTexts
    } = stackTrace;

    const channel = this._createChannel({}, stackTrace);

    let ancestorWithCSI = this;

    while (!ancestorWithCSI._csi && ancestorWithCSI._parent) ancestorWithCSI = ancestorWithCSI._parent;

    let csiCallback;

    try {
      var _ancestorWithCSI$_csi, _csiCallback;

      logApiCall(logger, `=> ${apiName} started`);
      csiCallback = (_ancestorWithCSI$_csi = ancestorWithCSI._csi) === null || _ancestorWithCSI$_csi === void 0 ? void 0 : _ancestorWithCSI$_csi.onApiCall(apiName);
      const result = await func(channel, stackTrace);
      (_csiCallback = csiCallback) === null || _csiCallback === void 0 ? void 0 : _csiCallback();
      logApiCall(logger, `<= ${apiName} succeeded`);
      return result;
    } catch (e) {
      var _csiCallback2;

      const innerError = (process.env.PWDEBUGIMPL || (0, _utils.isUnderTest)()) && e.stack ? '\n<inner error>\n' + e.stack : '';
      e.message = apiName + ': ' + e.message;
      e.stack = e.message + '\n' + frameTexts.join('\n') + innerError;
      (_csiCallback2 = csiCallback) === null || _csiCallback2 === void 0 ? void 0 : _csiCallback2(e);
      logApiCall(logger, `<= ${apiName} failed`);
      throw e;
    }
  }

  toJSON() {
    // Jest's expect library tries to print objects sometimes.
    // RPC objects can contain links to lots of other objects,
    // which can cause jest to crash. Let's help it out
    // by just returning the important values.
    return {
      _type: this._type,
      _guid: this._guid
    };
  }

}

exports.ChannelOwner = ChannelOwner;

function logApiCall(logger, message) {
  if (logger && logger.isEnabled('api', 'info')) logger.log('api', 'info', message, [], {
    color: 'cyan'
  });

  _debugLogger.debugLogger.log('api', message);
}

function paramsName(type, method) {
  return type + method[0].toUpperCase() + method.substring(1) + 'Params';
}

const tChannel = name => {
  return (arg, path) => {
    if (arg._object instanceof ChannelOwner && (name === '*' || arg._object._type === name)) return {
      guid: arg._object._guid
    };
    throw new _validator.ValidationError(`${path}: expected ${name}`);
  };
};

const scheme = (0, _validator.createScheme)(tChannel);