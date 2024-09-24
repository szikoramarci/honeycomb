import { describe, expect, test, vi } from 'vitest'
import { Hex, HexCoordinates } from '../../hex'
import { Grid } from '../../grid'
import { pathFind } from './pathFind'
import { fromCoordinates } from './fromCoordinates'

const createHex = vi.fn((coordinates?: HexCoordinates) => new Hex(coordinates))
const obstacles = new Grid(
  Hex,
  fromCoordinates([0, 1], [1, 0], [2, -1], [-1, 2], [0, -2], [0, -1], [-1, 0], [1, -3], [1, -1], [2, -2], [2, -3]),
)

describe('without obstacles', () => {
  test('returns a traverser from [0, 0] to [0, 4]', () => {
    expect(pathFind([0, 0], [0, 4])(createHex)).toMatchInlineSnapshot(`
      [
        Hex {
          "q": 0,
          "r": 0,
        },
        Hex {
          "q": 0,
          "r": 1,
        },
        Hex {
          "q": 0,
          "r": 2,
        },
        Hex {
          "q": 0,
          "r": 3,
        },
        Hex {
          "q": 0,
          "r": 4,
        },
      ]
    `)
  })

  test('returns a traverser from [0, 0] to [-3, 3]', () => {
    expect(pathFind([0, 0], [-3, 3])(createHex)).toMatchInlineSnapshot(`
      [
        Hex {
          "q": 0,
          "r": 0,
        },
        Hex {
          "q": -1,
          "r": 1,
        },
        Hex {
          "q": -2,
          "r": 2,
        },
        Hex {
          "q": -3,
          "r": 3,
        },
      ]
    `)
  })

  test('returns a traverser from [-2, -1] to [1, 1]', () => {
    expect(pathFind([-2, -1], [1, 1])(createHex)).toMatchInlineSnapshot(`
      [
        Hex {
          "q": -2,
          "r": -1,
        },
        Hex {
          "q": -1,
          "r": -1,
        },
        Hex {
          "q": -1,
          "r": 0,
        },
        Hex {
          "q": 0,
          "r": 0,
        },
        Hex {
          "q": 1,
          "r": 0,
        },
        Hex {
          "q": 1,
          "r": 1,
        },
      ]
    `)
  })

  test('returns a traverser from [-3, 2] to [1, 2]', () => {
    expect(pathFind([-3, 2], [1, 2])(createHex)).toMatchInlineSnapshot(`
      [
        Hex {
          "q": -3,
          "r": 2,
        },
        Hex {
          "q": -2,
          "r": 2,
        },
        Hex {
          "q": -1,
          "r": 2,
        },
        Hex {
          "q": 0,
          "r": 2,
        },
        Hex {
          "q": 1,
          "r": 2,
        },
      ]
    `)
  })

  test('returns a traverser from [0, -3] to [-3, 1]', () => {
    expect(pathFind([0, -3], [-3, 1])(createHex)).toMatchInlineSnapshot(`
      [
        Hex {
          "q": 0,
          "r": -3,
        },
        Hex {
          "q": 0,
          "r": -2,
        },
        Hex {
          "q": -1,
          "r": -1,
        },
        Hex {
          "q": -2,
          "r": 0,
        },
        Hex {
          "q": -3,
          "r": 1,
        },
      ]
    `)
  })
})

describe('with obstacles', () => {
  test('returns a traverser from [0, 0] to [0, 4]', () => {
    expect(pathFind([0, 0], [0, 4], obstacles)(createHex)).toMatchInlineSnapshot(`
      [
        Hex {
          "q": 0,
          "r": 0,
        },
        Hex {
          "q": -1,
          "r": 1,
        },
        Hex {
          "q": -2,
          "r": 2,
        },
        Hex {
          "q": -2,
          "r": 3,
        },
        Hex {
          "q": -1,
          "r": 3,
        },
        Hex {
          "q": -1,
          "r": 4,
        },
        Hex {
          "q": 0,
          "r": 4,
        },
      ]
    `)
  })

  test('returns a traverser from [0, 0] to [-3, 3]', () => {
    expect(pathFind([0, 0], [-3, 3], obstacles)(createHex)).toMatchInlineSnapshot(`
      [
        Hex {
          "q": 0,
          "r": 0,
        },
        Hex {
          "q": -1,
          "r": 1,
        },
        Hex {
          "q": -2,
          "r": 2,
        },
        Hex {
          "q": -3,
          "r": 3,
        },
      ]
    `)
  })

  test('returns a traverser from [-2, -1] to [1, 1]', () => {
    expect(pathFind([-2, -1], [1, 1], obstacles)(createHex)).toMatchInlineSnapshot(`
      [
        Hex {
          "q": -2,
          "r": -1,
        },
        Hex {
          "q": -2,
          "r": 0,
        },
        Hex {
          "q": -2,
          "r": 1,
        },
        Hex {
          "q": -2,
          "r": 2,
        },
        Hex {
          "q": -2,
          "r": 3,
        },
        Hex {
          "q": -1,
          "r": 3,
        },
        Hex {
          "q": 0,
          "r": 2,
        },
        Hex {
          "q": 1,
          "r": 1,
        },
      ]
    `)
  })

  test('returns a traverser from [-3, 2] to [1, 2]', () => {
    expect(pathFind([-3, 2], [1, 2], obstacles)(createHex)).toMatchInlineSnapshot(`
      [
        Hex {
          "q": -3,
          "r": 2,
        },
        Hex {
          "q": -2,
          "r": 2,
        },
        Hex {
          "q": -2,
          "r": 3,
        },
        Hex {
          "q": -1,
          "r": 3,
        },
        Hex {
          "q": 0,
          "r": 2,
        },
        Hex {
          "q": 1,
          "r": 2,
        },
      ]
    `)
  })

  test('returns a traverser from [0, -3] to [0, 0]', () => {
    expect(pathFind([0, -3], [0, 0], obstacles)(createHex)).toMatchInlineSnapshot(`
      [
        Hex {
          "q": 0,
          "r": -3,
        },
        Hex {
          "q": -1,
          "r": -2,
        },
        Hex {
          "q": -1,
          "r": -1,
        },
        Hex {
          "q": -2,
          "r": 0,
        },
        Hex {
          "q": -2,
          "r": 1,
        },
        Hex {
          "q": -1,
          "r": 1,
        },
        Hex {
          "q": 0,
          "r": 0,
        },
      ]
    `)
  })

  test('returns a traverser from [1, -2] to [0, 0]', () => {
    expect(pathFind([1, -2], [0, 0], obstacles)(createHex)).toMatchInlineSnapshot(`
      []
    `)
  })

  test('returns a traverser from [0, 0] to [1, -2]', () => {
    expect(pathFind([0, 0], [1, -2], obstacles)(createHex)).toMatchInlineSnapshot(`
      []
    `)
  })
})
