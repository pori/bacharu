import test from 'tape'

export default function (afterEach) {
  return function (description, f) {
    test(description, t => {
      f(t)
      afterEach()
    })
  }
}
