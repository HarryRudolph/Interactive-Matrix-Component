"use client"

import { useState, useCallback, Fragment, useMemo } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// We'll keep the row & column labels the same:
const rowHeaders = ["A", "B", "C", "D", "E", "F"]
const colHeaders = ["1", "2", "3", "4"]
// Rename the final layer to "Total" (instead of "V"):
const depthLevels = ["I", "II", "III", "IV", "Total"]

// Example: you might import this from a JSON file
// e.g. import baseData from "@/data/matrixValues.json"
// Where matrixValues.json has shape: { "layers": [ [ [0.1, ...], ...], [...], [...], [...] ] }
// For demonstration, we define it inline:
const baseData: number[][][] = [
  // Layer I (6 rows × 4 cols)
  [
    [0.1, 0.3, 0.2, 0.5],
    [0.7, 0.2, 0.5, 0.9],
    [0.0, 0.5, 0.1, 0.3],
    [0.6, 0.7, 0.2, 0.1],
    [0.4, 0.8, 0.3, 0.2],
    [0.9, 0.1, 0.4, 0.3],
  ],
  // Layer II
  [
    [0.2, 0.1, 0.9, 0.4],
    [0.8, 0.6, 0.2, 0.2],
    [0.3, 0.4, 0.2, 0.5],
    [0.1, 0.3, 0.8, 0.7],
    [0.5, 0.2, 0.1, 0.4],
    [0.2, 0.9, 0.5, 0.1],
  ],
  // Layer III
  [
    [0.3, 0.7, 0.6, 0.1],
    [0.6, 0.4, 0.9, 0.3],
    [0.8, 0.1, 0.4, 0.2],
    [0.2, 0.5, 0.3, 0.9],
    [0.1, 0.1, 0.2, 0.4],
    [0.4, 0.5, 0.5, 0.6],
  ],
  // Layer IV
  [
    [0.7, 0.5, 0.1, 0.3],
    [0.4, 0.8, 0.2, 0.1],
    [0.2, 0.6, 0.9, 0.5],
    [0.3, 0.2, 0.4, 0.6],
    [0.8, 0.7, 0.1, 0.1],
    [0.1, 0.2, 0.8, 0.7],
  ],
]

// Simple helper to clamp a value into the [0..1] range:
function clamp(value: number) {
  return Math.max(0, Math.min(1, value))
}

function getColour(value: number): string {
  const v = clamp(value)
  const hue = v * 120
  return `hsl(${Math.round(hue)},100%,50%)`
}



// Compute the average of the first four layers to produce the 5th “Total” layer
function computeTotalLayer(data: number[][][]): number[][] {
  const rows = data[0].length
  const cols = data[0][0].length
  // For each row and column, sum across the first four layers, then / 4
  const total: number[][] = []
  for (let r = 0; r < rows; r++) {
    const rowArr: number[] = []
    for (let c = 0; c < cols; c++) {
      let sum = 0
      for (let layer = 0; layer < 4; layer++) {
        sum += data[layer][r][c]
      }
      rowArr.push(sum / 4)
    }
    total.push(rowArr)
  }
  return total
}

export function InteractiveMatrix3D() {
  const [expandedCell, setExpandedCell] = useState<string | null>(null)

  // Generate our final 5-layer data structure
  // 4 layers come from baseData, then 1 computed
  const matrixData = useMemo(() => {
    const totalLayer = computeTotalLayer(baseData)
    return [...baseData, totalLayer] // 5th layer is the average
  }, [])

  // We'll track the "stack" by their labels:
  const [stack, setStack] = useState(depthLevels)

  const handleCellClick = useCallback((id: string) => {
    setExpandedCell(id)
  }, [])

  const handleClose = useCallback(() => {
    setExpandedCell(null)
  }, [])

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleClose()
      }
    },
    [handleClose],
  )

  const handleNextDepth = useCallback(() => {
    setStack((prev) => {
      const [front, ...rest] = prev
      return [...rest, front]
    })
  }, [])

  const handlePrevDepth = useCallback(() => {
    setStack((prev) => {
      const last = prev[prev.length - 1]
      const initial = prev.slice(0, prev.length - 1)
      return [last, ...initial]
    })
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex flex-col items-center">
        <div className="flex space-x-4 mb-6">
          <Button onClick={handlePrevDepth}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button onClick={handleNextDepth}>
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <div className="relative w-full" style={{ perspective: "1000px" }}>
          {stack.map((depth, index) => {
            const offset = index * 10
            const transform = `translate(${offset}px, ${offset}px)`
            const isTop = index === 0

            // Identify which layer's data we should use
            const layerIndex = depthLevels.indexOf(depth)
            const layerValues = matrixData[layerIndex] // 6 rows × 4 cols

            return (
              <div
                key={depth}
                className="absolute inset-0 transition-transform duration-500"
                style={{
                  transform,
                  zIndex: stack.length - index,
                }}
              >
                <div className="relative w-full bg-white rounded-lg shadow-lg pointer-events-none">
                  <div className="relative grid grid-cols-[60px_repeat(4,1fr)] gap-2 p-4">
                    {/* Label row for columns */}
                    <div className="flex items-center justify-center font-bold text-lg">
                      {depth}
                    </div>
                    {colHeaders.map((header) => (
                      <div
                        key={header}
                        className="flex items-center justify-center font-bold border-b border-gray-300"
                      >
                        {header}
                      </div>
                    ))}

                    {/* Rows */}
                    {rowHeaders.map((rowHeader, rowIdx) => (
                      <Fragment key={rowHeader}>
                        <div className="flex items-center justify-center font-bold border-r border-gray-300">
                          {rowHeader}
                        </div>
                        {colHeaders.map((colHeader, colIdx) => {
                          const cellId = `${depth}${rowHeader}${colHeader}`
                          const value = layerValues[rowIdx][colIdx]
                          return (
                            <div
                              key={cellId}
                              onClick={isTop ? () => handleCellClick(cellId) : undefined}
                              className={`relative border border-gray-300 rounded flex items-center justify-center p-4
                                ${isTop
                                  ? "cursor-pointer hover:shadow-md hover:scale-105 transition"
                                  : "opacity-50"
                                }`}
                              style={{
                                pointerEvents: isTop ? "auto" : "none",
                                backgroundColor: getColour(value),
                              }}
                            >
                              <span className="font-semibold">{value.toFixed(2)}</span>
                            </div>
                          )
                        })}
                      </Fragment>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Expanded overlay */}
      {expandedCell && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
          onClick={handleOverlayClick}
        >
          <div
            className="bg-white rounded shadow-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold">{expandedCell}</h3>
              <Button variant="outline" size="sm" onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-gray-600">
              Detailed content for cell {expandedCell}.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
