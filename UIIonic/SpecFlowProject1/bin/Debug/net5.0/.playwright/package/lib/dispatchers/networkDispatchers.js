"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebSocketDispatcher = exports.RouteDispatcher = exports.ResponseDispatcher = exports.RequestDispatcher = void 0;

var _network = require("../server/network");

var _dispatcher = require("./dispatcher");

var _frameDispatcher = require("./frameDispatcher");

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
class RequestDispatcher extends _dispatcher.Dispatcher {
  static from(scope, request) {
    const result = (0, _dispatcher.existingDispatcher)(request);
    return result || new RequestDispatcher(scope, request);
  }

  static fromNullable(scope, request) {
    return request ? RequestDispatcher.from(scope, request) : undefined;
  }

  constructor(scope, request) {
    const postData = request.postDataBuffer();
    super(scope, request, 'Request', {
      frame: _frameDispatcher.FrameDispatcher.from(scope, request.frame()),
      url: request.url(),
      resourceType: request.resourceType(),
      method: request.method(),
      postData: postData === null ? undefined : postData.toString('base64'),
      headers: request.headers(),
      isNavigationRequest: request.isNavigationRequest(),
      redirectedFrom: RequestDispatcher.fromNullable(scope, request.redirectedFrom())
    });
  }

  async response() {
    return {
      response: (0, _dispatcher.lookupNullableDispatcher)(await this._object.response())
    };
  }

}

exports.RequestDispatcher = RequestDispatcher;

class ResponseDispatcher extends _dispatcher.Dispatcher {
  static from(scope, response) {
    const result = (0, _dispatcher.existingDispatcher)(response);
    return result || new ResponseDispatcher(scope, response);
  }

  static fromNullable(scope, response) {
    return response ? ResponseDispatcher.from(scope, response) : undefined;
  }

  constructor(scope, response) {
    super(scope, response, 'Response', {
      // TODO: responses in popups can point to non-reported requests.
      request: RequestDispatcher.from(scope, response.request()),
      url: response.url(),
      status: response.status(),
      statusText: response.statusText(),
      requestHeaders: response.request().headers(),
      headers: response.headers(),
      timing: response.timing()
    });
  }

  async finished() {
    return await this._object._finishedPromise;
  }

  async body() {
    return {
      binary: (await this._object.body()).toString('base64')
    };
  }

  async securityDetails() {
    return {
      value: (await this._object.securityDetails()) || undefined
    };
  }

  async serverAddr() {
    return {
      value: (await this._object.serverAddr()) || undefined
    };
  }

}

exports.ResponseDispatcher = ResponseDispatcher;

class RouteDispatcher extends _dispatcher.Dispatcher {
  static from(scope, route) {
    const result = (0, _dispatcher.existingDispatcher)(route);
    return result || new RouteDispatcher(scope, route);
  }

  constructor(scope, route) {
    super(scope, route, 'Route', {
      // Context route can point to a non-reported request.
      request: RequestDispatcher.from(scope, route.request())
    });
  }

  async responseBody(params, metadata) {
    return {
      binary: (await this._object.responseBody()).toString('base64')
    };
  }

  async continue(params, metadata) {
    const response = await this._object.continue({
      url: params.url,
      method: params.method,
      headers: params.headers,
      postData: params.postData ? Buffer.from(params.postData, 'base64') : undefined,
      interceptResponse: params.interceptResponse
    });
    const result = {};

    if (response) {
      result.response = {
        request: RequestDispatcher.from(this._scope, response.request()),
        status: response.status(),
        statusText: response.statusText(),
        headers: response.headers()
      };
    }

    return result;
  }

  async fulfill(params) {
    await this._object.fulfill(params);
  }

  async abort(params) {
    await this._object.abort(params.errorCode || 'failed');
  }

}

exports.RouteDispatcher = RouteDispatcher;

class WebSocketDispatcher extends _dispatcher.Dispatcher {
  constructor(scope, webSocket) {
    super(scope, webSocket, 'WebSocket', {
      url: webSocket.url()
    });
    webSocket.on(_network.WebSocket.Events.FrameSent, event => this._dispatchEvent('frameSent', event));
    webSocket.on(_network.WebSocket.Events.FrameReceived, event => this._dispatchEvent('frameReceived', event));
    webSocket.on(_network.WebSocket.Events.SocketError, error => this._dispatchEvent('socketError', {
      error
    }));
    webSocket.on(_network.WebSocket.Events.Close, () => this._dispatchEvent('close', {}));
  }

}

exports.WebSocketDispatcher = WebSocketDispatcher;