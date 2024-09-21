import { describe, expect, test, vi } from 'vitest'
import { Hex, HexCoordinates } from '../../hex'
import { Grid } from '../../grid'
import { reachable } from './reachable'
import { fromCoordinates } from './fromCoordinates'

const cursor: HexCoordinates = [1, 2]
const createHex = vi.fn((coordinates?: HexCoordinates) => new Hex(coordinates))
const obstacles = new Grid(Hex, fromCoordinates([1, 3], [2, 2], [3, 1], [2, 0], [1, 0], [0, 1], [-1, 2], [-1, 3]))

describe('without obstacles', () => {
  test('returns a traverser that returns the same hex as was added as start parameter because the distance is 0', () => {
    expect(reachable(cursor, 0)(createHex)).toMatchInlineSnapshot(`
          [
            Hex {
              "q": 1,
              "r": 2,
            },
          ]
        `)
  })

  test('returns a traverser that returns a one radius spiral because the distance is 1', () => {
    expect(reachable(cursor, 1)(createHex)).toMatchInlineSnapshot(`
          [
            Hex {
              "q": 1,
              "r": 2,
            },
            Hex {
              "q": 2,
              "r": 1,
            },
            Hex {
              "q": 2,
              "r": 2,
            },
            Hex {
              "q": 1,
              "r": 3,
            },
            Hex {
              "q": 0,
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

  test('returns a traverser that returns a two radius spiral because the distance is 2', () => {
    expect(reachable(cursor, 2)(createHex)).toMatchInlineSnapshot(`
          [
            Hex {
              "q": 1,
              "r": 2,
            },
            Hex {
              "q": 2,
              "r": 1,
            },
            Hex {
              "q": 2,
              "r": 2,
            },
            Hex {
              "q": 1,
              "r": 3,
            },
            Hex {
              "q": 0,
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
            Hex {
              "q": 2,
              "r": 0,
            },
            Hex {
              "q": 3,
              "r": 0,
            },
            Hex {
              "q": 3,
              "r": 1,
            },
            Hex {
              "q": 3,
              "r": 2,
            },
            Hex {
              "q": 2,
              "r": 3,
            },
            Hex {
              "q": 1,
              "r": 4,
            },
            Hex {
              "q": 0,
              "r": 4,
            },
            Hex {
              "q": -1,
              "r": 4,
            },
            Hex {
              "q": -1,
              "r": 3,
            },
            Hex {
              "q": -1,
              "r": 2,
            },
            Hex {
              "q": 0,
              "r": 1,
            },
            Hex {
              "q": 1,
              "r": 0,
            },
          ]
        `)
  })
})

describe('with obstacles', () => {
  test('returns a traverser that returns the same hex as was added as start parameter because the distance is 0 and the obstacels are out of disance', () => {
    expect(reachable(cursor, 0, obstacles)(createHex)).toMatchInlineSnapshot(`
        [
          Hex {
            "q": 1,
            "r": 2,
          },
        ]
      `)
  })

  test('returns a traverser that returns a one radius spiral without the obstacles', () => {
    expect(reachable(cursor, 1, obstacles)(createHex)).toMatchInlineSnapshot(`
      [
        Hex {
          "q": 1,
          "r": 2,
        },
        Hex {
          "q": 2,
          "r": 1,
        },
        Hex {
          "q": 0,
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

  test('returns a traverser that returns a two radius spiral avoiding obstacles', () => {
    expect(reachable(cursor, 2, obstacles)(createHex)).toMatchInlineSnapshot(`
      [
        Hex {
          "q": 1,
          "r": 2,
        },
        Hex {
          "q": 2,
          "r": 1,
        },
        Hex {
          "q": 0,
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
        Hex {
          "q": 3,
          "r": 0,
        },
        Hex {
          "q": 0,
          "r": 4,
        },
        Hex {
          "q": -1,
          "r": 4,
        },
      ]
    `)
  })

  test('returns a traverser that returns a three radius spiral avoiding obstacles', () => {
    expect(reachable(cursor, 3, obstacles)(createHex)).toMatchInlineSnapshot(`
      [
        Hex {
          "q": 1,
          "r": 2,
        },
        Hex {
          "q": 2,
          "r": 1,
        },
        Hex {
          "q": 0,
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
        Hex {
          "q": 3,
          "r": 0,
        },
        Hex {
          "q": 0,
          "r": 4,
        },
        Hex {
          "q": -1,
          "r": 4,
        },
        Hex {
          "q": 4,
          "r": -1,
        },
        Hex {
          "q": 4,
          "r": 0,
        },
        Hex {
          "q": 3,
          "r": -1,
        },
        Hex {
          "q": 1,
          "r": 4,
        },
        Hex {
          "q": 0,
          "r": 5,
        },
        Hex {
          "q": -1,
          "r": 5,
        },
        Hex {
          "q": -2,
          "r": 5,
        },
        Hex {
          "q": -2,
          "r": 4,
        },
      ]
    `)
  })
})
