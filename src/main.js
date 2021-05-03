import _ from 'lodash'
import ('./css/base.less')
import printMe from './print'
function component() {
  const element = document.createElement('div')
  element.innerHTML = _.join(['Hello', 'webpack'], ' ')
  const btn = document.createElement('button')
  btn.innerHTML = 'Click me and check the console!'
  btn.onclick = printMe
  element.appendChild(btn)
  return element
}

document.body.appendChild(component())

console.log('sfsfhahah')
console.log(123)