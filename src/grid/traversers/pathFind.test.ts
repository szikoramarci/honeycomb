import { describe, expect, test, vi } from 'vitest'
import { Hex, HexCoordinates } from '../../hex'
import { Grid } from '../../grid'
import { pathFind } from './pathFind'
import { fromCoordinates } from './fromCoordinates'

const start: HexCoordinates = [0, 0]
const target: HexCoordinates = [-4, 3]
const createHex = vi.fn((coordinates?: HexCoordinates) => new Hex(coordinates))
const obstacles = new Grid(Hex, fromCoordinates([1, 3], [2, 2], [3, 1], [2, 0], [1, 0], [0, 1], [-1, 2], [-1, 3]))

describe('without obstacles', () => {
  test('returns a traverser that returns the same hex as was added as start parameter because the distance is 0', () => {
    expect(pathFind(start, target, obstacles)(createHex)).toMatchInlineSnapshot('[]')
  })
})
