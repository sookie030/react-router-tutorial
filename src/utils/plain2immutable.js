import { Map } from 'immutable';

export function plain2immutable(object) {
  var newObject = {};
  Object.entries(object).forEach(([key, value]) => {
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        // Array도 object로 분류되므로 따로 분기해준다.
        newObject[key] = value;
      } else {
        newObject[key] = plain2immutable(value);
      }
    } else {
      newObject[key] = value;
    }
  });
  return Map(newObject);
}
