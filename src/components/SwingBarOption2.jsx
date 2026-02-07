import { useState, useRef } from 'react'
import './SwingBarOption2.css'

const SwingBarOption2 = () => {
  const [currentValue, setCurrentValue] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const gaugeRef = useRef(null)

  // SHAVE estimates from Split Ticket
  // Source: https://split-ticket.org/house-generic-ballot-estimates-2008-2022-shave/
  const midtermResults = [
    { year: 2010, margin: -5.1 }, // R+5.1
    { year: 2014, margin: -5.1 }, // R+5.1
    { year: 2018, margin: 7.3 },  // D+7.3
    { year: 2022, margin: -1.6 }, // R+1.6
  ]

  const housePresidentialResults = [
    { year: 2008, margin: 8.7 },  // D+8.7
    { year: 2012, margin: 2.4 },  // D+2.4
    { year: 2016, margin: -1.6 }, // R+1.6
    { year: 2020, margin: 2.1 },  // D+2.1
    { year: 2024, margin: -2.1 }, // R+2.1
  ]

  const presResults = [
    { year: 2008, margin: 7.2 },
    { year: 2012, margin: 3.9 },
    { year: 2016, margin: 2.1 },
    { year: 2020, margin: 4.5 },
    { year: 2024, margin: -1.5 },
  ]

  const calculateMarginFromMouse = (e) => {
    if (!gaugeRef.current) return 0

    const rect = gaugeRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height * 0.75 // Adjust for semicircle

    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    // Calculate angle in degrees
    let angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI)

    // Convert angle to margin value
    // -90 degrees = R+10, +90 degrees = D+10
    let margin = (angle / 90) * 10

    // Clamp between -10 and 10
    margin = Math.max(-10, Math.min(10, margin))

    // Round to nearest 0.5
    margin = Math.round(margin * 2) / 2

    return margin
  }

  const handleMouseDown = (e) => {
    setIsDragging(true)
    const margin = calculateMarginFromMouse(e)
    setCurrentValue(margin)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    const margin = calculateMarginFromMouse(e)
    setCurrentValue(margin)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
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
    // Map margin to angle on semicircle
    // margin -10 (R+10) should be at angle 180° (left)
    // margin 0 (EVEN) should be at angle 90° (top)
    // margin +10 (D+10) should be at angle 0° (right)

    // Normalize margin from [-10, 10] to [0, 1]
    const normalized = (margin + 10) / 20

    // Convert to angle (180° on left, 0° on right)
    const angleDegrees = 180 - (normalized * 180)
    const angleRadians = (angleDegrees * Math.PI) / 180

    // Calculate position on arc
    const centerX = 150
    const centerY = 150
    const radius = 120

    return {
      x: centerX + radius * Math.cos(angleRadians),
      y: centerY - radius * Math.sin(angleRadians)
    }
  }

  return (
    <div
      className="swing-bar-option2"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <h3>Generic Ballot</h3>

      <div className="gauge-container">
        {/* Midterm House Results */}
        <div className="results-section house-section">
          <div className="section-label">HOUSE - MIDTERM ELECTIONS</div>
          <div className="results-bands">
            {midtermResults.map((result) => (
              <div
                key={`midterm-${result.year}`}
                className="result-band"
                style={{
                  backgroundColor: getColor(result.margin),
                  opacity: 0.7,
                }}
                onClick={() => setCurrentValue(result.margin)}
              >
                <span className="band-year">{result.year}</span>
                <span className="band-value">{formatMargin(result.margin)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Presidential Year House Results */}
        <div className="results-section house-section">
          <div className="section-label">HOUSE - PRESIDENTIAL YEARS</div>
          <div className="results-bands">
            {housePresidentialResults.map((result) => (
              <div
                key={`house-pres-${result.year}`}
                className="result-band"
                style={{
                  backgroundColor: getColor(result.margin),
                  opacity: 0.7,
                }}
                onClick={() => setCurrentValue(result.margin)}
              >
                <span className="band-year">{result.year}</span>
                <span className="band-value">{formatMargin(result.margin)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gauge SVG */}
        <div className="gauge-wrapper">
          <svg
            viewBox="0 0 300 200"
            className="gauge-svg"
            ref={gaugeRef}
            onMouseDown={handleMouseDown}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
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

            {/* Tick marks every 2.5% */}
            {[-10, -7.5, -5, -2.5, 0, 2.5, 5, 7.5, 10].map((tick) => {
              const angle = ((tick + 10) / 20) * 180 - 90
              const radians = angle * (Math.PI / 180)
              const innerR = 105
              const outerR = tick % 5 === 0 ? 125 : 120 // Longer marks for major ticks
              const strokeWidth = tick % 5 === 0 ? 2 : 1.5
              return (
                <line
                  key={tick}
                  x1={150 + innerR * Math.cos(radians)}
                  y1={150 + innerR * Math.sin(radians)}
                  x2={150 + outerR * Math.cos(radians)}
                  y2={150 + outerR * Math.sin(radians)}
                  stroke="#333"
                  strokeWidth={strokeWidth}
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
            {[...midtermResults, ...housePresidentialResults, ...presResults].map((result, idx) => {
              const pos = getArcPosition(result.margin)
              return (
                <circle
                  key={`marker-${idx}`}
                  cx={pos.x}
                  cy={pos.y}
                  r="4"
                  fill={getColor(result.margin)}
                  opacity="0.6"
                  style={{ pointerEvents: 'none' }}
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
          <div className="gauge-instruction">Click and drag the gauge to adjust</div>
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
                onClick={() => setCurrentValue(result.margin)}
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
