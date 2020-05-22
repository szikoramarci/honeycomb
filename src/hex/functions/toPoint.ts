import { AxialCoordinates, Ellipse, HexSettings, Orientation, Point } from '../types'

// todo: benchmark if currying the higher order functions has significant performance impact

export const createToPointPointy = ({ xRadius, yRadius }: Ellipse) => ({ q, r }: AxialCoordinates) =>
  ({
    x: xRadius * Math.sqrt(3) * (q + r / 2),
    y: ((yRadius * 3) / 2) * r,
  } as Point)

export const createToPointFlat = ({ xRadius, yRadius }: Ellipse) => ({ q, r }: AxialCoordinates) =>
  ({
    x: ((xRadius * 3) / 2) * q,
    y: yRadius * Math.sqrt(3) * (r + q / 2),
  } as Point)

// todo: improve name? toPointFor()?
export const createToPoint = ({ orientation, dimensions }: HexSettings) => {
  return orientation === Orientation.POINTY ? createToPointPointy(dimensions) : createToPointFlat(dimensions)
}
