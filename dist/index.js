'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.h = h;
exports.createElement = createElement;
exports.changed = changed;
exports.updateElement = updateElement;
exports.setProp = setProp;
exports.setProps = setProps;
exports.removeProp = removeProp;
exports.updateProp = updateProp;
exports.updateProps = updateProps;
exports.isEventProp = isEventProp;
exports.extractEventName = extractEventName;
exports.addEventListeners = addEventListeners;
function h(type, props) {
  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return { type: type, props: props || {}, children: children };
}

function createElement(node) {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }

  var $el = document.createElement(node.type);

  setProps($el, node.props);
  addEventListeners($el, node.props);

  node.children.map(createElement).forEach($el.appendChild.bind($el));

  return $el;
}

function changed(a, b) {
  return (typeof a === 'undefined' ? 'undefined' : _typeof(a)) !== (typeof b === 'undefined' ? 'undefined' : _typeof(b)) || typeof a === 'string' && a !== b || a.type !== b.type;
}

function updateElement($parent, newNode, oldNode) {
  var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

  if (!oldNode) {
    $parent.appendChild(createElement(newNode));
  } else if (!newNode) {
    $parent.removeChild($parent.childNodes[index]);
  } else if (changed(newNode, oldNode)) {
    $parent.replaceChild(createElement(newNode), $parent.childNodes[index]);
  } else if (newNode.type) {

    updateProps($parent.children[index], newNode.props, oldNode.props);

    var newLength = newNode.children.length;
    var oldLength = oldNode.children.length;

    for (var i = 0; i < newLength || i < oldLength; i++) {
      updateElement($parent.children[index], newNode.children[i], oldNode.children[i], i);
    }
  }
}

function setProp($target, name, value) {
  if (name === 'className') {
    $target.setAttribute('class', value);
  }

  $target.setAttribute(name, value);
}

function setProps($target, props) {
  Object.keys(props).forEach(function (name) {
    setProp($target, name, props[name]);
  });
}

function removeProp($target, name) {
  if (name === 'className') {
    $target.removeAttribute('class');
  }

  $target.removeAttribute(name);
}

function updateProp($target, name, newVal, oldVal) {
  if (!newVal) {
    removeProp($target, name, oldVal);
  } else if (!oldVal || newVal !== oldVal) {
    setProp($target, name, newVal);
  }
}

function updateProps($target, newProps) {
  var oldProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var props = Object.assign({}, newProps, oldProps);

  Object.keys(props).forEach(function (name) {
    updateProp($target, name, newProps[name], oldProps[name]);
  });
}

function isEventProp(name) {
  return (/^on/.test(name)
  );
}

function extractEventName(name) {
  return name.slice(2).toLowerCase();
}

function addEventListeners($target, props) {
  Object.keys(props).forEach(function (name) {
    if (isEventProp(name)) {
      $target.addEventListener(extractEventName(name), props[name]);
    }
  });
}
