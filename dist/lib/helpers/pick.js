"use strict";
/*!
 * Dsafio
 * Copyright (c) 2017 Joel Wallis Jucá <joelwallis@gmail.com>
 * MIT Licensed
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Implements the `pick` method of lodash, throwing errors when keys are absent.
 * The original package is not used due to lodash custom builds being quite big.
 *
 * @see https://www.npmjs.com/package/lodash.pick
 * @see https://lodash.com/docs/#pick
 */
exports.pick = function (source, keys) {
    return !keys
        ? source
        : keys.reduce(function (subset, key) {
            var _a;
            return (__assign({}, subset, (_a = {}, _a[key] = source[key], _a)));
        }, {});
};
exports.default = exports.pick;
