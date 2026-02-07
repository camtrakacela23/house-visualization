import { useState, useRef } from 'react'
import './SwingBarOption2.css'
import './SwingBarLegend.css'

const SwingBarOption2 = () => {
  const [currentValue, setCurrentValue] = useState(6) // default to 2026 projection
  const [isDragging, setIsDragging] = useState(false)
  const gaugeRef = useRef(null)
  const [preselectionOpen, setPreselectionOpen] = useState(true)

  // SHAVE estimates from Split Ticket
  // Source: https://split-ticket.org/house-generic-ballot-estimates-2008-2022-shave/
  const midtermResults = [
    { year: 2010, margin: -5.1 }, // R+5.1
    { year: 2014, margin: -5.1 }, // R+5.1
    { year: 2018, margin: 7.3 },  // D+7.3
    { year: 2022, margin: -1.6 }, // R+1.6
    // 2026 is now the default projected value (moved out of past results)
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

  const presLabelOffset = 7; // move some pres labels that are close x degrees for clarity
  const houseLabelOffset = 2; //move some house labels taht are close x degrees for clarity
  const bounds = 10; //whats the left and right most bound
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
    // -90 degrees = R+10, +90 degrees = D+bounds
    let margin = (angle / 90) * bounds

    // Clamp between -bounds and bounds
    margin = Math.max(-bounds, Math.min(bounds, margin))

    // Round to nearest 0.1
    margin = Math.round(margin * 10) / 10

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
    // Convert margin (-bounds to +bounds) to rotation (-90 to +90 degrees)
    return (margin / bounds) * 90
  }

  const getColor = (margin, isMidterm = true) => {
    if (margin > 0) {
      return isMidterm ? '#4A90E2' : '#85B8FF' // Bright blue for midterms, lighter for pres years
    }
    if (margin < 0) {
      return isMidterm ? '#E24A4A' : '#FF8585' // Bright red for midterms, lighter for pres years
    }
    return '#999'
  }

  const formatMargin = (value) => {
    if (value > 0) return `D+${value.toFixed(1)}`
    if (value < 0) return `R+${Math.abs(value).toFixed(1)}`
    return 'EVEN'
  }

  const getSelectionColor = (margin) => {
    // Prefer presidential-style colors if the selected margin matches a presidential result
    const almostEqual = (a, b) => Math.abs(a - b) < 0.0001
    if (presResults.some(r => almostEqual(r.margin, margin))) return getColor(margin, false)
    if (housePresidentialResults.some(r => almostEqual(r.margin, margin))) return getColor(margin, false)
    if (midtermResults.some(r => almostEqual(r.margin, margin))) return getColor(margin, true)

    // Fallback: color by sign (midterm palette)
    if (margin > 0) return getColor(margin, true)
    if (margin < 0) return getColor(margin, true)
    return '#666'
  }

  const getArcPosition = (margin) => {
    // Map margin to angle on semicircle
    // margin -bounds (R+bounds) should be at angle 180° (left)
    // margin 0 (EVEN) should be at angle 90° (top)
    // margin +bounds (D+bounds) should be at angle 0° (right)

    // Normalize margin from [-bounds, bounds] to [0, 1]
    const normalized = (margin + bounds) / (bounds * 2)

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
        {/* Preselection: collapsible group containing the three preselect rows */}
        <div className="preselection-panel">
          <button
            type="button"
            className="preselection-header"
            onClick={() => setPreselectionOpen(v => !v)}
            aria-expanded={preselectionOpen}
          >
            <span className="preselection-title">Past Results</span>
            <span className={`preselection-chevron ${preselectionOpen ? 'open' : ''}`}>▾</span>
          </button>

          <div className={`preselection-content ${preselectionOpen ? 'open' : 'collapsed'}`}>
            {/* Midterm House Results */}
            <div className="results-section house-section">
              <div className="section-label">HOUSE - MIDTERM ELECTIONS</div>
              <div className="results-bands">
                {midtermResults.map((result) => (
                  <div
                    key={`midterm-${result.year}`}
                    className="result-band"
                    style={{
                      backgroundColor: getColor(result.margin, true),
                      opacity: 1,
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
                      backgroundColor: getColor(result.margin, false),
                      opacity: 1,
                    }}
                    onClick={() => setCurrentValue(result.margin)}
                  >
                    <span className="band-year">{result.year}</span>
                    <span className="band-value">{formatMargin(result.margin)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Presidential Results (also included in preselection) */}
            <div className="results-section pres-section">
              <div className="section-label">PRESIDENTIAL ELECTIONS</div>
              <div className="results-bands">
                {presResults.map((result) => (
                  <div
                    key={`pres-${result.year}`}
                    className="result-band"
                    style={{
                      backgroundColor: getColor(result.margin),
                      opacity: 1,
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
        {/* Legend moved under Past Results */}
        <div className="gauge-legend">
          <div className="legend-item">
            <div className="legend-marker house-marker">
              <span className="legend-hash" style={{ backgroundColor: '#E24A4A' }}></span>
              <span className="legend-hash" style={{ backgroundColor: '#4A90E2' }}></span>
              <span className="legend-text">HOUSE</span>
            </div>
          </div>
          <div className="legend-item">
            <div className="legend-marker pres-marker">
              <span className="legend-hash" style={{ backgroundColor: '#FFD700' }}></span>
              <span className="legend-text">PRESIDENTIAL</span>
            </div>
          </div>
        </div>

        {/* Gauge SVG */}
        <div className="gauge-with-legend">
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

            {/* Tick marks at 0 and ±bounds only */}
            {[-bounds, 0, bounds].map((tick) => {
              // Use same angle calculation as dots
              const normalized = (tick + bounds) / (bounds * 2)
              const angleDegrees = 180 - (normalized * 180)
              const radians = (angleDegrees * Math.PI) / 180

              const innerR = 105
              const outerR = 125
              const strokeWidth = 2
              return (
                <line
                  key={tick}
                  x1={150 + innerR * Math.cos(radians)}
                  y1={150 - innerR * Math.sin(radians)}
                  x2={150 + outerR * Math.cos(radians)}
                  y2={150 - outerR * Math.sin(radians)}
                  stroke="#333"
                  strokeWidth={strokeWidth}
                />
              )
            })}

            {/* Labels */}
            <text x="60" y="160" fontSize="14" fontWeight="bold" fill="#E24A4A">
              R+10
            </text>
            <text x="150" y="80" fontSize="14" fontWeight="bold" fill="#666" textAnchor="middle">
              EVEN
            </text>
            <text x="240" y="160" fontSize="14" fontWeight="bold" fill="#4A90E2" textAnchor="end">
              D+10
            </text>

            {/* Presidential election markers (gold, inside arc) */}
            {presResults.map((result, idx) => {
              const normalized = (result.margin + bounds) / (bounds * 2)
              let angleDegrees = 180 - (normalized * 180)

              // Add offset for 2020/2012 so they don't clash
              let textAngleDegrees = angleDegrees
              if (result.year === 2020) {
                textAngleDegrees += presLabelOffset // Move label left
              } else if (result.year === 2012) {
                textAngleDegrees -= presLabelOffset // Move label right
              }

              const angleRadians = (angleDegrees * Math.PI) / 180
              const textAngleRadians = (textAngleDegrees * Math.PI) / 180

              // Hash mark extends inward from arc
              const outerRadius = 120
              const innerRadius = 105
              const textRadius = 95

              const innerX = 150 + innerRadius * Math.cos(angleRadians)
              const innerY = 150 - innerRadius * Math.sin(angleRadians)
              const outerX = 150 + outerRadius * Math.cos(angleRadians)
              const outerY = 150 - outerRadius * Math.sin(angleRadians)
              const textX = 150 + textRadius * Math.cos(textAngleRadians)
              const textY = 150 - textRadius * Math.sin(textAngleRadians)

              return (
                <g key={`pres-${idx}`} style={{ pointerEvents: 'none' }}>
                  <line
                    x1={innerX}
                    y1={innerY}
                    x2={outerX}
                    y2={outerY}
                    stroke="#FFD700"
                    strokeWidth="4"
                  />
                  <text
                    x={textX}
                    y={textY}
                    fontSize="11"
                    fontWeight="700"
                    fill="#FFD700"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    '{String(result.year).slice(-2)}
                  </text>
                </g>
              )
            })}

            {/* Midterm and House presidential year markers (colored, outside arc) */}
            {(() => {
              // Group duplicates and near-duplicates
              const allHouseResults = [
                ...midtermResults.map(r => ({ ...r, isMidterm: true })),
                ...housePresidentialResults.map(r => ({ ...r, isMidterm: false }))
              ]

              // Find duplicates and group them
              const grouped = []
              const processed = new Set()

              allHouseResults.forEach((result, idx) => {
                if (processed.has(idx)) return

                // Find all results with same margin
                const duplicates = allHouseResults
                  .map((r, i) => ({ ...r, originalIdx: i }))
                  .filter(r => r.margin === result.margin && !processed.has(r.originalIdx))

                duplicates.forEach(d => processed.add(d.originalIdx))

                if (duplicates.length > 1) {
                  // Combine labels
                  grouped.push({
                    margin: result.margin,
                    label: duplicates.map(d => `'${String(d.year).slice(-2)}`).join('/'),
                    isMidterm: duplicates[0].isMidterm,
                    offset: 0
                  })
                } else {
                  grouped.push({
                    margin: result.margin,
                    label: `'${String(result.year).slice(-2)}`,
                    isMidterm: result.isMidterm,
                    offset: 0
                  })
                }
              })

              return grouped.map((item, idx) => { 
                const normalized = (item.margin + bounds) / (bounds * 2)
                let angleDegrees = 180 - (normalized * 180)

                // Add offset for specific labels to prevent overlap
                let textAngleDegrees = angleDegrees
                if (item.label.includes('22')) {
                  textAngleDegrees -= houseLabelOffset // Move label right
                } else if (item.label === "'24") {
                  textAngleDegrees += houseLabelOffset // Move label left
                } else if (item.label === "'20") {
                  textAngleDegrees += houseLabelOffset // Move label left
                } else if (item.label === "'12") {
                  textAngleDegrees -= houseLabelOffset // Move label right
                }

                const angleRadians = (angleDegrees * Math.PI) / 180
                const textAngleRadians = (textAngleDegrees * Math.PI) / 180

                // Hash mark extends outward from arc
                const innerRadius = 120
                const outerRadius = 135
                const textRadius = 145

                const innerX = 150 + innerRadius * Math.cos(angleRadians)
                const innerY = 150 - innerRadius * Math.sin(angleRadians)
                const outerX = 150 + outerRadius * Math.cos(angleRadians)
                const outerY = 150 - outerRadius * Math.sin(angleRadians)
                const textX = 150 + textRadius * Math.cos(textAngleRadians)
                const textY = 150 - textRadius * Math.sin(textAngleRadians)

                // Use presidential-year colors for '18 to match '08
                const useMidtermColors = item.label === "'18" ? false : item.isMidterm
                const color = getColor(item.margin, useMidtermColors)

                return (
                  <g key={`house-${idx}`} style={{ pointerEvents: 'none' }}>
                    <line
                      x1={innerX}
                      y1={innerY}
                      x2={outerX}
                      y2={outerY}
                      stroke={color}
                      strokeWidth="4"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fontSize="10"
                      fontWeight="700"
                      fill={color}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {item.label}
                    </text>
                  </g>
                )
              })
            })()}

              {/* Projected 2026 marker (default) - dashed hash across the colored arc only */}
              {(() => {
                const margin = 6
                const normalized = (margin + bounds) / (bounds * 2)
                const angleDegrees = 180 - (normalized * 180)
                const angleRadians = (angleDegrees * Math.PI) / 180

                // hashed mark spans the colored arc thickness (inner -> outer radius)
                const innerRadius = 105
                const outerRadius = 135
                const textRadius = 150

                const innerX = 150 + innerRadius * Math.cos(angleRadians)
                const innerY = 150 - innerRadius * Math.sin(angleRadians)
                const outerX = 150 + outerRadius * Math.cos(angleRadians)
                const outerY = 150 - outerRadius * Math.sin(angleRadians)
                const textX = 150 + textRadius * Math.cos(angleRadians)
                const textY = 150 - textRadius * Math.sin(angleRadians)

                const projColor = '#0b3d91' // dark blue for projected marker

                return (
                  <g key="proj-26" style={{ pointerEvents: 'none' }}>
                    <line
                      x1={innerX}
                      y1={innerY}
                      x2={outerX}
                      y2={outerY}
                      stroke={projColor}
                      strokeWidth={3}
                      strokeDasharray="4 3"
                      strokeLinecap="round"
                      opacity={0.98}
                    />
                    <text
                      x={textX}
                      y={textY}
                      fontSize="11"
                      fontWeight="700"
                      fill={projColor}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      26 (proj)
                    </text>
                  </g>
                )
              })()}

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

          <div className="gauge-value" style={{ color: getSelectionColor(currentValue) }}>{formatMargin(currentValue)}</div>
          <div className="gauge-instruction" style={{ color: getSelectionColor(currentValue) }}>Click and drag the gauge to adjust</div>
        </div>
        </div>

        {/* (Presidential selection removed here — moved into the collapsible preselection above) */}
      </div>
    </div>
  )
}

export default SwingBarOption2
