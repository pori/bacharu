/** @jsx h */

import wrapper from './_utils/wrapper.js'
import { h, createElement, changed, updateElement, setProp, setProps,
  removeProp, updateProp, updateProps, isEventProp, extractEventName,
  addEventListeners, } from '../index.js'

const test = wrapper(function() {
  if (document.body.children.length) {
    let child = document.body.children[0]

    document.body.removeChild(child)
  }
})

test('Makes DOM object representaion.', t => {
  t.plan(3)

  t.deepEqual (
    <br />,
    { type: 'br', props: {}, children: [] }
  )

  t.deepEqual (
    <a href="#">Super secret link.</a>,
    { type: 'a', props: { href: '#' }, children: [ 'Super secret link.' ] }
  )

  let expect = (
    { type: 'div', props: { className: 'link' }, children: [
        { type: 'a', props: { href: '#' }, children: [ 'Super secret link.' ] }
    ] }
  )

  let actual = (
    <div className="link">
      <a href="#">Super secret link.</a>
    </div>
  )

  t.deepEqual(actual, expect)
})

test('Add elements to Document.', t => {
  t.plan(5)

  let list = (
    <ul className="list">
      <li>item 1</li>
      <li>item 2</li>
    </ul>
  )

  let app = createElement(list)

  let $root = document.body

  $root.appendChild(app)

  t.equal($root.children.length, 1)
  t.equal($root.children[0].className, 'list')
  t.equal($root.children[0].children.length, 2)
  t.equal($root.children[0].children[0].textContent, 'item 1')
  t.equal($root.children[0].children[1].textContent, 'item 2')
})

test('Evaluate changes between to nodes.', t => {
  t.plan(5)

  t.true(changed('a', {}))
  t.true(changed('a', 'b'))
  t.true(changed({ type: 'div' }, { type: 'section' }))

  t.false(changed({ type: 'div' }, { type: 'div' }))
  t.false(changed('a', 'a'))
})

test('Replace nodes in a tree based on changes.', t => {
  const a = (
    <ul>
      <li>item 1</li>
      <li>item 2</li>
    </ul>
  )

  const b = (
    <ul>
      <li>item 1</li>
    </ul>
  )

  const c = (
    <ul>
      <li>item 1</li>
      <li>hello!</li>
    </ul>
  )

  const $root = document.body

  updateElement($root, a)

  t.equal($root.children.length, 1)
  t.equal($root.children[0].children[1].textContent, 'item 2')

  updateElement($root, b, a)

  t.equal($root.children[0].children.length, 1)

  updateElement($root, a, b)

  t.equal($root.children[0].children[1].textContent, 'item 2')

  updateElement($root, c, a)

  t.equal($root.children[0].children[1].textContent, 'hello!')

  t.end()
})

test('Set a property.', t => {
  t.plan(1)

  let $target = document.createElement('a')

  setProp($target, 'href', 'https://google.com/')

  t.equal($target.href, 'https://google.com/')
})

test('Set multiple properties.', t => {
  t.plan(3)

  let $target = document.createElement('a')

  setProps($target, {
    href: 'https://google.com/',
    className: 'pretty-link',
    id: 'home'
  })

  t.equal($target.href, 'https://google.com/')
  t.equal($target.className, 'pretty-link')
  t.equal($target.id, 'home')
})

test('Remove a property.', t => {
  t.plan(2)

  let $target = document.createElement('a')

  $target.className = 'external'
  $target.href = 'https://google.com/'

  removeProp($target, 'className')
  removeProp($target, 'href')

  t.equal($target.className, '')
  t.equal($target.href, '')
})

test('Update a property based on different values.', t => {
  t.plan(3)

  let $target = document.createElement('a')

  let href = 'https://google.com/'

  $target.href = href

  document.body.appendChild($target)

  updateProp($target, 'href', href)

  t.equal($target.href, href)

  updateProp($target, 'href', '#', href)

  t.equal($target.href, 'about:blank#')

  updateProp($target, 'href', null, '#')

  t.equal($target.href, '')
})

test('Update a bunch of properties.', t => {
  t.plan(2)

  let $target = document.createElement('a')

  $target.href = '#'

  updateProps($target, {
    href: 'about:blank#'
  }, {
    href: 'about:blank#'
  })

  t.equal($target.href, 'about:blank#')

  updateProps($target, {
    href: 'https://google.com/'
  }, {
    href: 'about:blank#'
  })

  t.equal($target.href, 'https://google.com/')
})

test('Check is a property name is actually an event.', t => {
  t.plan(2)

  let a = isEventProp('onClick')

  t.true(a)

  let b = isEventProp('click')

  t.false(b)
})

test('Get an event name.', t => {
  t.plan(1)

  let actual = extractEventName('onClick')

  t.equal(actual, 'click')
})

test('Add event listener to a node.', t => {
  t.plan(1)

  let $target = document.createElement('a')

  addEventListeners($target, {
    onClick() {
      t.pass()
    }
  })

  $target.click()
})
