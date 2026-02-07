import { useState } from 'react'
import './SwingBarOption1.css'

const SwingBarOption1 = () => {
  const [currentValue, setCurrentValue] = useState(0)

  // Historical data (approximate two-party vote shares converted to margins)
  const houseResults = [
    { year: 2008, margin: 10.6 }, // D+10.6
    { year: 2010, margin: -6.8 }, // R+6.8
    { year: 2012, margin: 1.2 },  // D+1.2
    { year: 2014, margin: -5.7 }, // R+5.7
    { year: 2016, margin: 1.1 },  // D+1.1
    { year: 2018, margin: 8.6 },  // D+8.6
    { year: 2020, margin: 3.1 },  // D+3.1
    { year: 2022, margin: -2.8 }, // R+2.8
    { year: 2024, margin: 0.5 },  // D+0.5
  ]

  const presResults = [
    { year: 2008, margin: 7.2 },  // D+7.2 (Obama)
    { year: 2012, margin: 3.9 },  // D+3.9 (Obama)
    { year: 2016, margin: 2.1 },  // D+2.1 (Clinton popular vote)
    { year: 2020, margin: 4.5 },  // D+4.5 (Biden)
    { year: 2024, margin: -1.5 }, // R+1.5 (Trump)
  ]

  const handleSliderChange = (e) => {
    setCurrentValue(parseFloat(e.target.value))
  }

  const getPositionPercent = (margin) => {
    // Convert margin (-10 to +10) to percentage (0 to 100)
    return ((margin + 10) / 20) * 100
  }

  const getColor = (margin) => {
    if (margin > 0) return '#4A90E2' // Blue for D
    if (margin < 0) return '#E24A4A' // Red for R
    return '#999'
  }

  const formatMargin = (value) => {
    if (value > 0) return `D+${value.toFixed(1)}`
    if (value < 0) return `R+${Math.abs(value).toFixed(1)}`
    return 'EVEN'
  }

  return (
    <div className="swing-bar-option1">
      <h3>Option 1: Classic Dual-Track Slider</h3>

      <div className="visualization-container">
        {/* House Results (Above) */}
        <div className="markers-row house-markers">
          {houseResults.map((result) => (
            <div
              key={`house-${result.year}`}
              className="marker"
              style={{
                left: `${getPositionPercent(result.margin)}%`,
                color: getColor(result.margin),
              }}
              title={`${result.year}: ${formatMargin(result.margin)}`}
            >
              <div className="marker-label">{result.year}</div>
              <div className="marker-value">{formatMargin(result.margin)}</div>
              <div
                className="marker-dot"
                style={{ backgroundColor: getColor(result.margin) }}
              />
            </div>
          ))}
          <div className="row-label">HOUSE</div>
        </div>

        {/* Main Slider Bar */}
        <div className="slider-container">
          <div className="scale-labels">
            <span className="scale-label left">R+10</span>
            <span className="scale-label center">EVEN</span>
            <span className="scale-label right">D+10</span>
          </div>

          <div className="gradient-bar">
            <div
              className="current-indicator"
              style={{ left: `${getPositionPercent(currentValue)}%` }}
            />
          </div>

          <input
            type="range"
            min="-10"
            max="10"
            step="0.5"
            value={currentValue}
            onChange={handleSliderChange}
            className="slider"
          />

          <div className="current-value">
            {formatMargin(currentValue)}
          </div>
        </div>

        {/* Presidential Results (Below) */}
        <div className="markers-row pres-markers">
          <div className="row-label">PRESIDENT</div>
          {presResults.map((result) => (
            <div
              key={`pres-${result.year}`}
              className="marker"
              style={{
                left: `${getPositionPercent(result.margin)}%`,
                color: getColor(result.margin),
              }}
              title={`${result.year}: ${formatMargin(result.margin)}`}
            >
              <div
                className="marker-dot"
                style={{ backgroundColor: getColor(result.margin) }}
              />
              <div className="marker-value">{formatMargin(result.margin)}</div>
              <div className="marker-label">{result.year}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SwingBarOption1
