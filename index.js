export function h (type, props, ...children) {
  return { type, props: props || {}, children }
}

export function createElement (node) {
  if (typeof node === 'string') {
    return document.createTextNode(node)
  }

  let $el = document.createElement(node.type)

  setProps($el, node.props)
  addEventListeners($el, node.props)

  node.children
    .map(createElement)
    .forEach($el.appendChild.bind($el))

  return $el
}

export function changed (a, b) {
  return typeof a !== typeof b ||
    typeof a === 'string' && a !== b ||
    a.type !== b.type
}

export function updateElement ($parent, newNode, oldNode, index = 0) {
  if (!oldNode) {
    $parent.appendChild (
      createElement(newNode)
    )
  }
  else if (!newNode) {
    $parent.removeChild (
      $parent.childNodes[index]
    )
  }
  else if (changed(newNode, oldNode)) {
    $parent.replaceChild (
      createElement(newNode),
      $parent.childNodes[index]
    )
  }
  else if (newNode.type) {

    updateProps (
      $parent.children[index],
      newNode.props,
      oldNode.props
    )

    let newLength = newNode.children.length
    let oldLength = oldNode.children.length

    for (let i = 0; i < newLength || i < oldLength; i++) {
      updateElement (
        $parent.children[index],
        newNode.children[i],
        oldNode.children[i],
        i
      )
    }
  }
}

export function setProp ($target, name, value) {
  if (name === 'className') {
    $target.setAttribute('class', value)
  }

  $target.setAttribute(name, value)
}

export function setProps ($target, props) {
  Object.keys(props).forEach(name => {
    setProp($target, name, props[name])
  })
}

export function removeProp ($target, name) {
  if (name === 'className') {
    $target.removeAttribute('class')
  }

  $target.removeAttribute(name)
}

export function updateProp ($target, name, newVal, oldVal) {
  if (!newVal) {
    removeProp($target, name, oldVal)
  }
  else if (!oldVal || newVal !== oldVal) {
    setProp($target, name, newVal)
  }
}

export function updateProps ($target, newProps, oldProps = {}) {
  let props = Object.assign({}, newProps, oldProps)

  Object.keys(props).forEach(name => {
    updateProp($target, name, newProps[name], oldProps[name])
  })
}

export function isEventProp (name) {
  return /^on/.test(name)
}

export function extractEventName (name) {
  return name.slice(2).toLowerCase()
}

export function addEventListeners ($target, props) {
  Object.keys(props).forEach(name => {
    if (isEventProp(name)) {
      $target.addEventListener (
        extractEventName(name),
        props[name]
      )
    }
  })
}
