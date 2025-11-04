/**
 * Utility functions for working with @tyris/angular-foundation HTTP headers
 */

import { HttpHeaderMap } from '@tyris/angular-foundation';

/**
 * Converts an object with mixed types to HttpHeaderMap format
 * All values are converted to strings or string arrays as required by HttpHeaderMap
 * 
 * @param headers Object with header values (can contain numbers, objects, etc.)
 * @returns HttpHeaderMap compatible object
 * 
 * @example
 * ```typescript
 * const headers = convertToHttpHeaderMap({
 *   limit: 10,
 *   skip: 0,
 *   sort: '-createdAt',
 *   filter: { status: 'active' }
 * });
 * // Result: { limit: '10', skip: '0', sort: '-createdAt', filter: '{"status":"active"}' }
 * ```
 */
export function convertToHttpHeaderMap(headers: any): HttpHeaderMap {
  if (!headers) {
    return {};
  }

  const result: HttpHeaderMap = {};

  for (const key in headers) {
    if (headers.hasOwnProperty(key)) {
      const value = headers[key];

      if (value === null || value === undefined) {
        continue;
      }

      if (typeof value === 'string') {
        result[key] = value;
      } else if (typeof value === 'number') {
        result[key] = String(value);
      } else if (typeof value === 'boolean') {
        result[key] = String(value);
      } else if (Array.isArray(value)) {
        result[key] = value.map(v => String(v));
      } else if (typeof value === 'object') {
        result[key] = JSON.stringify(value);
      } else {
        result[key] = String(value);
      }
    }
  }

  return result;
}
