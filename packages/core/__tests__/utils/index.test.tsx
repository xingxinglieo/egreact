import {
  hyphenate,
  isEvent,
  isDiffSet,
  attachInfo,
  reduceKeysToTarget,
  getActualInstance,
  splitEventKeyToInfo,
  collectContextsFromDom,
  getRenderInfo,
  getCurrentEventPriority,
} from '../../src/index'
import sinon from 'sinon'

import { DiscreteEventPriority } from 'react-reconciler/constants'
afterAll(() => {
  sinon.restore()
})

describe('isDiffSet', () => {
  expect(isDiffSet({ memoized: {}, changes: [] })).toBeTruthy()
})

describe('Handle Egreat Component Props Key', () => {
  it('should hyphenate a camel case string', () => {
    expect(hyphenate('orientation')).toBe('orientation')
    expect(hyphenate('showFpsStyle')).toBe('show-fps-style')
    expect(hyphenate('scaleMode')).toBe('scale-mode')
  })
})

describe('Confirm prop name if it is a event key', () => {
  it('should return true if the prop name is a event key', () => {
    expect(isEvent('onTouchMove')).toBeTruthy()
    expect(isEvent('onTouchMove1')).toBeTruthy()
    expect(isEvent('onTouchMoveOnce')).toBeTruthy()
    expect(isEvent('onTouchMoveOnce32')).toBeTruthy()
    expect(isEvent('onTouchMoveCapture')).toBeTruthy()
    expect(isEvent('onTouchMoveCapture01')).toBeTruthy()
    expect(isEvent('onTouchMoveOnceCapture')).toBeTruthy()
    expect(isEvent('onTouchMoveOnceCapture12')).toBeTruthy()

    expect(isEvent('on')).toBeFalsy()
    expect(isEvent('on13')).toBeFalsy()
    expect(isEvent('onientation')).toBeFalsy()
  })
})

describe('Get `__target` if exited as action instance', () => {
  const obj = { __target: 'test' }
  it('should return instance.__target if exited,else return instance', () => {
    expect(getActualInstance(obj)).toBe('test')
    delete obj.__target
    expect(getActualInstance(obj)).toBe(obj)
  })
})

// reduceKeysToTarget,
describe('Reduce keys to target', () => {
  const o1 = { a: { b: { c: 1 } } }
  it('should return target,target key,prefix keys', () => {
    expect(reduceKeysToTarget(o1, 'a-b-c')).toEqual([o1.a.b, 'c', ['a', 'b']])
    expect(reduceKeysToTarget(o1, 'a.b.c', '.')).toEqual([o1.a.b, 'c', ['a', 'b']])
  })
  it('should be null if target is not exited', () => {
    expect(reduceKeysToTarget(o1, 'a-b-c-d')[0]).toBeNull()
  })
})
describe('Get event info from key', () => {
  expect(splitEventKeyToInfo('onTouchMove')).toEqual({
    type: 'touchMove',
    capture: false,
    once: false,
    priority: 0,
    keys: ['Touch', 'Move'],
    name: 'onTouchMove',
  })
  expect(splitEventKeyToInfo('onTouchMove1')).toEqual({
    type: 'touchMove',
    capture: false,
    once: false,
    priority: 1,
    keys: ['Touch', 'Move', '1'],
    name: 'onTouchMove',
  })
  expect(splitEventKeyToInfo('onTouchMoveOnce')).toEqual({
    type: 'touchMove',
    capture: false,
    once: true,
    priority: 0,
    keys: ['Touch', 'Move', 'Once'],
    name: 'onTouchMove',
  })
  expect(splitEventKeyToInfo('onTouchMoveOnce32')).toEqual({
    type: 'touchMove',
    capture: false,
    once: true,
    priority: 32,
    keys: ['Touch', 'Move', 'Once', '32'],
    name: 'onTouchMove',
  })
  expect(splitEventKeyToInfo('onTouchMoveCapture')).toEqual({
    type: 'touchMove',
    capture: true,
    once: false,
    priority: 0,
    keys: ['Touch', 'Move', 'Capture'],
    name: 'onTouchMove',
  })
  expect(splitEventKeyToInfo('onTouchMoveCapture01')).toEqual({
    type: 'touchMove',
    capture: true,
    once: false,
    priority: 1,
    keys: ['Touch', 'Move', 'Capture', '01'],
    name: 'onTouchMove',
  })
  expect(splitEventKeyToInfo('onTouchMoveOnceCapture')).toEqual({
    type: 'touchMove',
    capture: true,
    once: true,
    priority: 0,
    keys: ['Touch', 'Move', 'Once', 'Capture'],
    name: 'onTouchMove',
  })
  expect(splitEventKeyToInfo('onTouchMoveOnceCapture12')).toEqual({
    type: 'touchMove',
    capture: true,
    once: true,
    priority: 12,
    keys: ['Touch', 'Move', 'Once', 'Capture', '12'],
    name: 'onTouchMove',
  })
  expect(splitEventKeyToInfo('onTouchMoveCaptureOnce12')).toEqual({
    type: undefined,
    capture: false,
    once: true,
    priority: 12,
    keys: ['Touch', 'Move', 'Capture', 'Once', '12'],
    name: 'onTouchMoveCapture',
  })
  expect(splitEventKeyToInfo('onUiResize')).toEqual({
    type: 'resize',
    capture: false,
    once: false,
    priority: 0,
    keys: ['Ui', 'Resize'],
    name: 'onUiResize',
  })
  expect(splitEventKeyToInfo('onAdded')).toEqual({
    type: 'added',
    capture: false,
    once: false,
    priority: 0,
    keys: ['Added'],
    name: 'onAdded',
  })

  sinon.stub(window, 'event').get(() => ({
    type: 'click',
  }))
  expect(getCurrentEventPriority()).toEqual(DiscreteEventPriority)
})

import React, { createContext } from 'react'
import { render, screen } from '@testing-library/react'
import { Egreact } from '../../src/Components/Egreact'
describe('Get Contexts from Dom which is created by react-dom', () => {
  const myContext = createContext(1)
  it('should return contexts', () => {
    render(
      <myContext.Provider value={1}>
        <div data-testid="test">
          <Egreact container={new egret.DisplayObjectContainer()} />
        </div>
      </myContext.Provider>,
    )
    expect(collectContextsFromDom(screen.getByTestId('test'))).toEqual([myContext])

    expect(collectContextsFromDom(null)).toEqual([])
    expect(collectContextsFromDom(document.createElement('div'))).toEqual([])
  })
})

describe('Attach RenderInfo', () => {
  it('should have __renderInfo', () => {
    expect(getRenderInfo(attachInfo({}))).toBeTruthy()
    expect(() => attachInfo(null)).toThrow()
  })
})
