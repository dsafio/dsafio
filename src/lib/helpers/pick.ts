/*!
 * Dsafio
 * Copyright (c) 2017 Joel Wallis Jucá <joelwallis@gmail.com>
 * MIT Licensed
 */

/**
 * Implements the `pick` method of lodash, throwing errors when keys are absent.
 * The original package is not used due to lodash custom builds being quite big.
 *
 * @see https://www.npmjs.com/package/lodash.pick
 * @see https://lodash.com/docs/#pick
 */
export const pick = (source: object, keys?: string[]) =>
  !keys
    ? source
    : keys.reduce((subset, key) => ({ ...subset, [key]: source[key] }), {});

export default pick;
