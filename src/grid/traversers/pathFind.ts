import PriorityQueue from 'priority-queue-typescript'
import { defaultHexSettings, equals, Hex, HexCoordinates, OffsetCoordinates } from '../../hex'
import { Grid } from '../grid'
import { Traverser } from '../types'
import { distance } from '../functions'
import { ring } from './ring'

interface HexPriority {
  hex: Hex
  priority: number
}

export function pathFind<T extends Hex>(
  start: HexCoordinates,
  target: HexCoordinates,
  obstacles?: Grid<T>,
): Traverser<T> {
  return function reachableTraverser(createHex, cursor) {
    const startHex = createHex(start ?? cursor ?? [0, 0])
    const targetHex = createHex(target)
    const path: Map<string, string | null> = new Map<string, string | null>()
    const costOfPath: Map<string, number> = new Map<string, number>()
    const queue = new PriorityQueue<HexPriority>(1, (a: HexPriority, b: HexPriority) => {
      return a.priority - b.priority
    })

    if (obstacles) {
        console.log('OBSTACLE')
    }

    queue.add({ hex: startHex, priority: 0 })
    costOfPath.set(startHex.toString(), 0)

    while (!queue.empty()) {
      const currentHexPriority: HexPriority | null = queue.poll()

      if (currentHexPriority?.hex == null) {
        break
      }
      const currentHex: Hex = currentHexPriority?.hex

      if (equals(currentHex, targetHex)) {
        break
      }

      const neighbors = new Grid(Hex, ring({ center: currentHex, radius: 1 }))
      neighbors.forEach((neighborHex) => {
        const costOfStep = (costOfPath.get(currentHex.toString()) || 0) + 1 // TODO CHECK NEIGHBOR IS OBSTACLE
        if (!costOfPath.has(neighborHex.toString()) || costOfStep < (costOfPath.get(neighborHex.toString()) || 99999)) {
          costOfPath.set(neighborHex.toString(), costOfStep)
          const priority = costOfStep + calculateDistance(neighborHex, targetHex)
          queue.add({ hex: neighborHex, priority })
          path.set(neighborHex.toString(), currentHex.toString())
        }
      })
    }

    let current: string | null = targetHex.toString()
    const fullPath: string[] = []

    // Backtrack from target to start
    while (current && current !== startHex.toString()) {
      fullPath.unshift(current) // Add to the front of the path
      current = path.get(current) || null
    }

    // Add the start hex at the beginning
    fullPath.unshift(startHex.toString())

    return []
  }

  function calculateDistance(a: Hex, b: Hex): number {
    const aCoordinates: OffsetCoordinates = { col: a.col, row: a.row }
    const bCoordinates: OffsetCoordinates = { col: b.col, row: b.row }
    return distance(defaultHexSettings, aCoordinates, bCoordinates)
  }
}
