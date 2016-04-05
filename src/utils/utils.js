import property from 'lodash/property';

export function bindListeners(props) {
  // Replace serialized functions with real functions
  return Object.keys(props).reduce((acum, key) => {
    let value = props[key];
    if(value.type && value.type === 'listener') {
      acum[key] = props.context[value.name];
    } else {
      acum[key] = value;
    }
    return acum;
  }, {});
}

export function getProp(key, object) {
  return Object.assign({}, property(key)(object))
}

export function makeKey(len)
{
	  let length = len || 5;
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < len; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
