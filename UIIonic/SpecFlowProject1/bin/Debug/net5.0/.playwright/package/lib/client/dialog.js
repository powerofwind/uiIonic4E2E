"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Dialog = void 0;

var _channelOwner = require("./channelOwner");

/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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
class Dialog extends _channelOwner.ChannelOwner {
  static from(dialog) {
    return dialog._object;
  }

  constructor(parent, type, guid, initializer) {
    super(parent, type, guid, initializer);
  }

  type() {
    return this._initializer.type;
  }

  message() {
    return this._initializer.message;
  }

  defaultValue() {
    return this._initializer.defaultValue;
  }

  async accept(promptText) {
    return this._wrapApiCall(async channel => {
      await channel.accept({
        promptText
      });
    });
  }

  async dismiss() {
    return this._wrapApiCall(async channel => {
      await channel.dismiss();
    });
  }

}

exports.Dialog = Dialog;