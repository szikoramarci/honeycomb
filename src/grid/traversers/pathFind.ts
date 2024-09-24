import { PriorityQueue, Dictionary } from 'typescript-collections'
import { defaultHexSettings, equals, Hex, HexCoordinates, OffsetCoordinates } from '../../hex'
import { Grid } from '../grid'
import { Direction, Traverser } from '../types'
import { distance, neighborOf } from '../functions'

export function pathFind<T extends Hex>(
  startCoordinates: HexCoordinates,
  targetCoordinates: HexCoordinates,
  obstacles?: Grid<T>,
  maxQueueSize: number = 100,
  basicCostOfStep: number = 1,
): Traverser<T> {
  const directions: Direction[] = Object.values(Direction).filter((value) => typeof value === 'number')
  const steps = new Dictionary<T, T>()
  const costOfSteps = new Dictionary<T, number>()
  const queue = new PriorityQueue<PriorityObject>((a, b) => b.priority - a.priority)

  interface PriorityObject {
    element: T
    priority: number
  }

  return function reachableTraverser(createHex, cursor) {
    const { start, target } = initializeTraversal(createHex, startCoordinates, targetCoordinates, cursor)

    while (!queue.isEmpty()) {
      if (queue.size() > maxQueueSize) return []

      const currentPriorityObject = queue.dequeue()
      if (!currentPriorityObject) break

      const current = currentPriorityObject.element
      if (equals(current, target)) break

      calculatePaths(current, target)
    }

    return buildFullPath(start, target)
  }

  function initializeTraversal(
    createHex: (coordinates?: HexCoordinates) => T,
    startCoordinates: HexCoordinates,
    targetCoordinates: HexCoordinates,
    cursor: HexCoordinates | undefined,
  ) {
    const start = createHex(startCoordinates ?? cursor ?? [0, 0])
    const target = createHex(targetCoordinates)

    queue.add({ element: start, priority: 0 })
    costOfSteps.setValue(start, 0)

    return { start, target }
  }

  function calculatePaths(current: T, target: T) {
    directions.forEach((direction) => {
      const neighbor = neighborOf(current, direction)
      const costOfStep = (costOfSteps.getValue(current) || 0) + basicCostOfStep
      if (isValidNeighbor(neighbor, costOfStep)) {
        updateTraversalState(neighbor, current, costOfStep, target)
      }
    })
  }

  function isValidNeighbor(neighbor: T, costOfStep: number) {
    return (
      !isObstacle(neighbor) &&
      (!costOfSteps.containsKey(neighbor) || costOfStep < (costOfSteps.getValue(neighbor) || Number.MAX_VALUE))
    )
  }

  function updateTraversalState(neighbor: T, current: T, costOfStep: number, target: T) {
    costOfSteps.setValue(neighbor, costOfStep)
    const priority = costOfStep + calculateDistance(neighbor, target)
    queue.add({ element: neighbor, priority })
    steps.setValue(neighbor, current)
  }

  function buildFullPath(start: T, target: T): T[] {
    if (steps.size() === 0) return []

    const fullPath: T[] = []
    let current: T | null = target

    while (current && current !== start) {
      fullPath.unshift(current)
      current = steps.getValue(current) || null
    }

    fullPath.unshift(start)
    return fullPath
  }

  function isObstacle(t: T) {
    return obstacles?.hasHex(t) || false
  }

  function calculateDistance(a: T, b: T): number {
    const aCoordinates: OffsetCoordinates = { col: a.col, row: a.row }
    const bCoordinates: OffsetCoordinates = { col: b.col, row: b.row }
    return distance(defaultHexSettings, aCoordinates, bCoordinates)
  }
}
