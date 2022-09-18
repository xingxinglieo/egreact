import { config } from '../src/index'
import React from 'react'
import { Egreact } from '../src/Components'

import { render } from '@testing-library/react'

describe('config', () => {
  describe('when call config.registerErrorHandler', () => {
    it('shold set registerErrorHandler', () => {
      expect(() =>
        render(
          <Egreact>
            <displayObject a-b-c="1"></displayObject>
          </Egreact>,
        ),
      ).toThrow()
      const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementationOnce(() => {})
      config.registerErrorHandler((e) => console.warn(e))
      render(
        <Egreact>
          <displayObject a-b-c="1"></displayObject>
        </Egreact>,
      )
      expect(consoleWarnMock).toHaveBeenCalledTimes(1)
      consoleWarnMock.mockRestore()
    })
  })
})
