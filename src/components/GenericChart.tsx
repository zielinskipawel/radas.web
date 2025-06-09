import React, { useState } from 'react'
import { Stage, Layer, Line, Circle, Text } from 'react-konva'

const width = 800
const height = 300
const margin = 60

interface DataPoint {
  year: number
  value: number
}

interface Series {
  id: string
  name: string
  color: string
  editable?: boolean
  data: DataPoint[]
}

interface GenericChartProps {
  series: Series[]
  onChange: (updatedSeries: Series[]) => void
  minYear: number
  maxYear: number
  minValue?: number
  maxValue?: number
  disabled?: boolean
}

const formatValue = (val: number) => {
  if (Math.abs(val) >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`
  if (Math.abs(val) >= 1_000) return `${(val / 1_000).toFixed(1)}k`
  return val.toFixed(1)
}

const GenericChart = ({
  series,
  onChange,
  minYear,
  maxYear,
  minValue = -100,
  maxValue = 200,
  disabled = false
}: GenericChartProps) => {
  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i
  )

  const scaleX = (year: number) =>
    margin + ((year - minYear) / (maxYear - minYear)) * (width - 2 * margin)

  const scaleY = (value: number) =>
    height -
    margin -
    ((value - minValue) / (maxValue - minValue)) * (height - 2 * margin)

  const invertScaleY = (py: number) =>
    minValue +
    ((height - margin - py) / (height - 2 * margin)) * (maxValue - minValue)

  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number
    y: number
    text: string
  } | null>(null)

  const handleDragMove = (seriesIndex: number, pointIndex: number, e: any) => {
    if (disabled) return
    const updated = [...series]
    const newY = invertScaleY(e.target.y())
    updated[seriesIndex].data[pointIndex].value = newY
    onChange(updated)
  }

  return (
    <Stage width={width} height={height + 40}>
      <Layer>
        {/* Osie */}
        <Line
          points={[scaleX(minYear), margin, scaleX(minYear), height - margin]}
          stroke="#aaa"
        />
        <Line
          points={[margin, scaleY(0), width - margin, scaleY(0)]}
          stroke="#aaa"
        />

        {/* Siatka i etykiety lat */}
        {years.map((year) => (
          <React.Fragment key={year}>
            <Line
              points={[scaleX(year), margin, scaleX(year), height - margin]}
              stroke="#eee"
              strokeWidth={1}
            />
            <Text
              text={year.toString()}
              x={scaleX(year) - 14}
              y={height - margin + 8}
              fontSize={10}
              fill="#333"
            />
          </React.Fragment>
        ))}

        {/* Siatka i etykiety wartości */}
        {Array.from(
          { length: 7 },
          (_, i) => minValue + (i * (maxValue - minValue)) / 6
        ).map((v) => (
          <React.Fragment key={`v${v}`}>
            <Line
              points={[margin, scaleY(v), width - margin, scaleY(v)]}
              stroke="#eee"
              strokeWidth={1}
            />
            <Text
              text={formatValue(v)}
              x={margin - 40}
              y={scaleY(v) - 6}
              fontSize={10}
              fill="#333"
            />
          </React.Fragment>
        ))}

        {/* Serie danych */}
        {series.map((s, si) => (
          <React.Fragment key={s.id}>
            <Line
              points={s.data.flatMap((p) => [scaleX(p.year), scaleY(p.value)])}
              stroke={s.color}
              strokeWidth={2}
              tension={0.3}
            />
            {s.data.map((p, pi) => {
              const x = scaleX(p.year)
              const y = scaleY(p.value)
              const pointKey = `${s.id}-${p.year}`

              return (
                <React.Fragment key={pointKey}>
                  <Circle
                    x={x}
                    y={y}
                    radius={
                      hoveredPoint?.text ===
                      `${s.name}: ${formatValue(p.value)}`
                        ? 6
                        : 3
                    }
                    fill="transparent"
                    stroke={s.color}
                    strokeWidth={2}
                    draggable={s.editable && disabled !== true}
                    onDragMove={(e) => s.editable && handleDragMove(si, pi, e)}
                    dragBoundFunc={(pos) => ({ x, y: pos.y })}
                    onMouseEnter={() =>
                      setHoveredPoint({
                        x,
                        y,
                        text: `${s.name}: ${formatValue(p.value)}`
                      })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </React.Fragment>
              )
            })}
          </React.Fragment>
        ))}

        {/* Tooltip */}
        {hoveredPoint && (
          <Text
            text={hoveredPoint.text}
            x={hoveredPoint.x + 10}
            y={hoveredPoint.y - 25}
            fontSize={12}
            fill="#000"
            fontStyle="bold"
            listening={false}
          />
        )}

        {/* Legenda */}
        {series.map((s, i) => (
          <Text
            key={s.id}
            text={s.name}
            x={margin + i * 80}
            y={height + 10}
            fontSize={12}
            fill={s.color}
          />
        ))}
      </Layer>
    </Stage>
  )
}

export default GenericChart
