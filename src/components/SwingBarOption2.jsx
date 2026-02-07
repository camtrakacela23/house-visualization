import { useState } from 'react'
import './SwingBarOption2.css'

const SwingBarOption2 = () => {
  const [currentValue, setCurrentValue] = useState(0)

  const houseResults = [
    { year: 2008, margin: 10.6 },
    { year: 2010, margin: -6.8 },
    { year: 2012, margin: 1.2 },
    { year: 2014, margin: -5.7 },
    { year: 2016, margin: 1.1 },
    { year: 2018, margin: 8.6 },
    { year: 2020, margin: 3.1 },
    { year: 2022, margin: -2.8 },
    { year: 2024, margin: 0.5 },
  ]

  const presResults = [
    { year: 2008, margin: 7.2 },
    { year: 2012, margin: 3.9 },
    { year: 2016, margin: 2.1 },
    { year: 2020, margin: 4.5 },
    { year: 2024, margin: -1.5 },
  ]

  const handleSliderChange = (e) => {
    setCurrentValue(parseFloat(e.target.value))
  }

  const getNeedleRotation = (margin) => {
    // Convert margin (-10 to +10) to rotation (-90 to +90 degrees)
    return (margin / 10) * 90
  }

  const getColor = (margin) => {
    if (margin > 0) return '#4A90E2'
    if (margin < 0) return '#E24A4A'
    return '#999'
  }

  const formatMargin = (value) => {
    if (value > 0) return `D+${value.toFixed(1)}`
    if (value < 0) return `R+${Math.abs(value).toFixed(1)}`
    return 'EVEN'
  }

  const getArcPosition = (margin) => {
    // Position along the semicircle (0 to 180 degrees)
    const angle = ((margin + 10) / 20) * 180
    const radians = (angle - 90) * (Math.PI / 180)
    const radius = 120
    return {
      x: 150 + radius * Math.cos(radians),
      y: 150 + radius * Math.sin(radians),
    }
  }

  return (
    <div className="swing-bar-option2">
      <h3>Option 2: Gauge/Dial Interface</h3>

      <div className="gauge-container">
        {/* House Results Section */}
        <div className="results-section house-section">
          <div className="section-label">HOUSE ELECTIONS</div>
          <div className="results-bands">
            {houseResults.map((result) => (
              <div
                key={`house-${result.year}`}
                className="result-band"
                style={{
                  backgroundColor: getColor(result.margin),
                  opacity: 0.7,
                }}
              >
                <span className="band-year">{result.year}</span>
                <span className="band-value">{formatMargin(result.margin)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gauge SVG */}
        <div className="gauge-wrapper">
          <svg viewBox="0 0 300 200" className="gauge-svg">
            {/* Background arc */}
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E24A4A" />
                <stop offset="50%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#4A90E2" />
              </linearGradient>
            </defs>

            {/* Outer arc */}
            <path
              d="M 30 150 A 120 120 0 0 1 270 150"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="30"
              strokeLinecap="round"
            />

            {/* Tick marks */}
            {[-10, -5, 0, 5, 10].map((tick) => {
              const angle = ((tick + 10) / 20) * 180 - 90
              const radians = angle * (Math.PI / 180)
              const innerR = 105
              const outerR = 125
              return (
                <line
                  key={tick}
                  x1={150 + innerR * Math.cos(radians)}
                  y1={150 + innerR * Math.sin(radians)}
                  x2={150 + outerR * Math.cos(radians)}
                  y2={150 + outerR * Math.sin(radians)}
                  stroke="#333"
                  strokeWidth="2"
                />
              )
            })}

            {/* Labels */}
            <text x="30" y="160" fontSize="14" fontWeight="bold" fill="#E24A4A">
              R+10
            </text>
            <text x="140" y="180" fontSize="14" fontWeight="bold" fill="#666" textAnchor="middle">
              EVEN
            </text>
            <text x="270" y="160" fontSize="14" fontWeight="bold" fill="#4A90E2" textAnchor="end">
              D+10
            </text>

            {/* Historical markers on arc */}
            {[...houseResults, ...presResults].map((result, idx) => {
              const pos = getArcPosition(result.margin)
              return (
                <circle
                  key={`marker-${idx}`}
                  cx={pos.x}
                  cy={pos.y}
                  r="4"
                  fill={getColor(result.margin)}
                  opacity="0.6"
                />
              )
            })}

            {/* Needle */}
            <g transform={`rotate(${getNeedleRotation(currentValue)}, 150, 150)`}>
              <line
                x1="150"
                y1="150"
                x2="150"
                y2="50"
                stroke="#333"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="150" cy="150" r="8" fill="#333" />
            </g>
          </svg>

          <div className="gauge-value">{formatMargin(currentValue)}</div>
        </div>

        {/* Control Slider */}
        <div className="control-section">
          <input
            type="range"
            min="-10"
            max="10"
            step="0.5"
            value={currentValue}
            onChange={handleSliderChange}
            className="control-slider"
          />
        </div>

        {/* Presidential Results Section */}
        <div className="results-section pres-section">
          <div className="section-label">PRESIDENTIAL ELECTIONS</div>
          <div className="results-bands">
            {presResults.map((result) => (
              <div
                key={`pres-${result.year}`}
                className="result-band"
                style={{
                  backgroundColor: getColor(result.margin),
                  opacity: 0.7,
                }}
              >
                <span className="band-year">{result.year}</span>
                <span className="band-value">{formatMargin(result.margin)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SwingBarOption2
