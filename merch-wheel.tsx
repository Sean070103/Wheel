"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const prizeNames = [
  "Base T-Shirt",
  "Tote Bag",
  "Better Luck Next Time",
  "Base T-Shirt",
  "Cap",
  "Better Luck Next Time",
  "Base T-Shirt",
  "Tote Bag",
  "Better Luck Next Time",
  "Base T-Shirt",
  "Cap",
  "Better Luck Next Time",
]

const palette = [
  { bg: "#1E3A8A", text: "#FFFFFF" },
  { bg: "#F8FAFF", text: "#1E3A8A" },
]

const merchItems = prizeNames.map((name, index) => {
  const paletteColor = palette[index % palette.length]
  return {
    name,
    color: paletteColor.bg,
    textColor: paletteColor.text,
  }
})

type ResultMeta = {
  title: string
  description: string
  accent: string
}

export default function MerchWheel() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)
  const [spinCount, setSpinCount] = useState(0)
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null)
  const [resultMeta, setResultMeta] = useState<ResultMeta | null>(null)
  const wheelRef = useRef<HTMLDivElement>(null)

  const spinWheel = () => {
    if (isSpinning) return

    setIsSpinning(true)
    setSelectedItem(null)
    setHighlightIndex(null)

    // Increment spin count
    const newSpinCount = spinCount + 1
    setSpinCount(newSpinCount)

    const selectRandomIndex = (allowedNames: string[]) => {
      const indices = merchItems
        .map((item, index) => (allowedNames.includes(item.name) ? index : -1))
        .filter(index => index !== -1)
      return indices[Math.floor(Math.random() * indices.length)]
    }

    let selectedIndex: number
    let targetRotation: number
    const spinPosition = newSpinCount % 10

    if (spinPosition === 0) {
      // Every 10th spin (10, 20, 30, ...) guarantees Base T-Shirt or Cap
      selectedIndex = selectRandomIndex(["Base T-Shirt", "Cap"])
      console.log(`Spin ${newSpinCount}: GUARANTEED Cap/T-Shirt at index ${selectedIndex}`)
    } else if (spinPosition === 5) {
      // Every 5th spin (5, 15, 25, ...) guarantees Tote Bag unless captured by 10th spin
      selectedIndex = selectRandomIndex(["Tote Bag"])
      console.log(`Spin ${newSpinCount}: GUARANTEED Tote Bag at index ${selectedIndex}`)
    } else {
      // All other spins result in Better Luck Next Time
      selectedIndex = selectRandomIndex(["Better Luck Next Time"])
      console.log(`Spin ${newSpinCount}: Better Luck Next Time at index ${selectedIndex}`)
    }

    // Ensure the wheel lands exactly on the selected segment (top pointer)
    const sectionAngle = 360 / merchItems.length
    const segmentCenterAngle = selectedIndex * sectionAngle + sectionAngle / 2
    const pointerOffset = 360 - sectionAngle / 2 // empirically calibrated
    const pointerAngle = (-90 + pointerOffset) % 360
    const currentNormalized = ((rotation % 360) + 360) % 360
    const targetNormalized =
      ((pointerAngle - segmentCenterAngle) % 360 + 360) % 360
    const alignmentRotation =
      ((targetNormalized - currentNormalized) % 360 + 360) % 360
    
    // Generate multiple full rotations plus the alignment adjustment
    const fullRotations = 8 + Math.random() * 8 // 8-16 full rotations
    targetRotation = rotation + (fullRotations * 360) + alignmentRotation

    setResultMeta(null)
    setRotation(targetRotation)

    setTimeout(() => {
      setHighlightIndex(selectedIndex)
      setSelectedItem(merchItems[selectedIndex].name)
      setIsSpinning(false)
    }, 5000)
  }

  const resetWheel = () => {
    setRotation(0)
    setSelectedItem(null)
    setIsSpinning(false)
    setSpinCount(0)
    setResultMeta(null)
    setHighlightIndex(null)
    console.log("Wheel reset - spin count back to 0")
  }

  const sectionAngle = 360 / merchItems.length
  const pegPositions = Array.from({ length: merchItems.length }, (_, index) => index)

  const wheelSize = "min(78vw, 26rem)"
  const pegRingSize = `calc(${wheelSize} + 3rem)`

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#cfe9ff] via-[#e8f6ff] to-[#b7e3ff] flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute w-80 h-80 bg-gradient-to-r from-[#8ec5ff] to-[#c1e1ff] rounded-full blur-[120px] top-16 -left-20"></div>
        <div className="absolute w-96 h-96 bg-gradient-to-br from-[#9af2ff] to-[#bfe4ff] rounded-full blur-[160px] bottom-16 right-0"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.6),transparent_45%)]"></div>
      </div>
      <div className="text-center mb-8 sm:mb-10 space-y-2 relative z-10 max-w-2xl px-2">
        <p className="text-[0.65rem] sm:text-xs uppercase tracking-[0.35em] text-slate-500">Base Merch</p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0f172a]">Spin &amp; Win</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Spin counter: <span className="font-semibold text-[#2563eb]">{spinCount}</span>
        </p>
      </div>

      <div className="relative flex flex-col items-center">
        <div className="relative z-10">
          {/* Pegs */}
          <div
            className="absolute rounded-full flex items-center justify-center"
            style={{ width: pegRingSize, height: pegRingSize, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
          >
            <div className="relative w-full h-full">
              {pegPositions.map((index) => {
                const pegAngle = index * sectionAngle
                return (
                  <div
                    key={`peg-${index}`}
                    className="absolute inset-0"
                    style={{ transform: `rotate(${pegAngle}deg)` }}
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border border-gray-200 shadow-sm"></div>
                  </div>
                )
              })}
            </div>
              </div>
              
            {/* Wheel */}
          <div className="relative" style={{ width: wheelSize, height: wheelSize }}>
            <div
              ref={wheelRef}
              className="w-full h-full rounded-full overflow-hidden shadow-[0_25px_60px_rgba(15,23,42,0.3)] cursor-pointer bg-white"
              style={{
                transform: `rotate(${rotation}deg)`,
                  transition: isSpinning ? "transform 5s cubic-bezier(0.23, 1, 0.32, 1)" : "none",
              }}
              onClick={spinWheel}
            >
              {/* Wheel Sections */}
              {merchItems.map((item, index) => {
                const startAngle = index * sectionAngle
                const endAngle = (index + 1) * sectionAngle
                const midAngle = startAngle + sectionAngle / 2
                const textAngle = midAngle - 90 // Convert to SVG coordinates (SVG uses 0 degrees at the top)

                          // Calculate path for each section using fixed precision
            const startX = (50 + 50 * Math.cos(((startAngle - 90) * Math.PI) / 180)).toFixed(6)
            const startY = (50 + 50 * Math.sin(((startAngle - 90) * Math.PI) / 180)).toFixed(6)
            const endX = (50 + 50 * Math.cos(((endAngle - 90) * Math.PI) / 180)).toFixed(6)
            const endY = (50 + 50 * Math.sin(((endAngle - 90) * Math.PI) / 180)).toFixed(6)

                const largeArcFlag = sectionAngle > 180 ? 1 : 0
                const pathData = `M 50 50 L ${startX} ${startY} A 50 50 0 ${largeArcFlag} 1 ${endX} ${endY} Z`

                // Positions
                const textRadius = 35
                const textX = (50 + textRadius * Math.cos((textAngle * Math.PI) / 180)).toFixed(6)
                const textY = (50 + textRadius * Math.sin((textAngle * Math.PI) / 180)).toFixed(6)
                const tangentAngle = textAngle + 180
                const normalizedAngle = ((tangentAngle % 360) + 360) % 360
                const readableAngle = normalizedAngle > 90 && normalizedAngle < 270 ? tangentAngle - 180 : tangentAngle

                const isLongText = item.name === "Better Luck Next Time"
                const textFill = item.textColor
                const dropShadow =
                  textFill === "white"
                    ? "drop-shadow(0 1px 2px rgba(0,0,0,0.45))"
                    : "drop-shadow(0 1px 1px rgba(255,255,255,0.8))"
                const isHighlighted = highlightIndex === index && !isSpinning

                return (
                <div key={`${item.name}-${index}`} className="absolute inset-0">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <path
                        d={pathData}
                        fill={item.color}
                        stroke="rgba(0,0,0,0.08)"
                        strokeWidth="0.25"
                        style={{
                          filter: isHighlighted ? "drop-shadow(0 0 12px rgba(59,130,246,0.6))" : "none",
                        }}
                      />
                      {isHighlighted && (
                        <path
                          d={pathData}
                          fill="none"
                          stroke="#60a5fa"
                          strokeWidth="1.5"
                        />
                      )}
                      <g transform={`translate(${textX}, ${textY}) rotate(${readableAngle})`}>
                        {isLongText ? (
                          <text
                            x="0"
                            y="0"
                            fill={textFill}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize="3.2"
                            fontWeight="600"
                            style={{
                              letterSpacing: "0.08em",
                              filter: dropShadow,
                              fontFamily: "Inter, 'Helvetica Neue', sans-serif",
                              textTransform: "uppercase",
                            }}
                          >
                            <tspan x="0" dy="-1.5">Better Luck</tspan>
                            <tspan x="0" dy="3.5">Next Time</tspan>
                          </text>
                        ) : (
                          <text
                            x="0"
                            y="0"
                            fill={textFill}
                        textAnchor="middle"
                        dominantBaseline="middle"
                            fontSize="3.8"
                            fontWeight="600"
                            style={{
                              letterSpacing: "0.08em",
                              filter: dropShadow,
                              fontFamily: "Inter, 'Helvetica Neue', sans-serif",
                              textTransform: "uppercase",
                            }}
                      >
                        {item.name}
                      </text>
                        )}
                      </g>
                    </svg>
                  </div>
                )
              })}

              {/* Center Button */}
              <button
                onClick={spinWheel}
                disabled={isSpinning}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-[6px] border-white font-semibold text-white tracking-wide shadow-[0_12px_35px_rgba(37,99,235,0.55)] transition-all ${
                  isSpinning
                    ? "bg-gradient-to-br from-[#6a93ff] to-[#4977f5] cursor-not-allowed"
                    : "bg-gradient-to-br from-[#5b8dff] to-[#3c5bff] hover:scale-105 active:scale-95"
                }`}
              >
                {isSpinning ? "Spinning..." : "Spin"}
              </button>
            </div>
          </div>
            </div>
          </div>

      <div className="mt-8 flex flex-col items-center gap-4 relative z-10 w-full max-w-xl text-center">
        <p className="text-sm sm:text-base text-gray-500">Tap the wheel or the center button to spin for a prize.</p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
          <Button
            onClick={resetWheel}
            variant="outline"
            className="w-full sm:w-auto border-2 border-[#c7d2fe] text-[#3c5bff] hover:bg-[#eef0ff]"
          >
            Reset Wheel
          </Button>
        </div>
        {resultMeta && (
          <div
            className="rounded-2xl px-5 py-3 text-sm text-[#1e1e2f] shadow-md border"
            style={{ backgroundColor: resultMeta.accent, borderColor: `${resultMeta.accent}55` }}
          >
            <p className="font-semibold text-[#0f172a]">{resultMeta.title}</p>
            <p>{resultMeta.description}</p>
          </div>
        )}
      </div>

      {/* Winner Popup Modal */}
          {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md mx-4 relative">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
            
            {/* Content */}
            <div className="text-center">
              <div className="mb-6">
                <Image 
                  src="/Base_Symbol_Blue.png" 
                  alt="Base Logo" 
                  width={64} 
                  height={64}
                  className="w-16 h-16 mx-auto mb-4"
                />
                {selectedItem === "Better Luck Next Time" ? (
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">😔 Oh no...</h2>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold text-blue-800 mb-2">🎉 Congratulations!</h2>
                    <h3 className="text-2xl font-bold text-blue-600 mb-4">You Won!</h3>
                  </>
                )}
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6 mb-6 space-y-3">
                {resultMeta && (
                  <div
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full"
                    style={{ backgroundColor: `${resultMeta.accent}`, color: "#0f172a" }}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#0f172a] animate-[pulse_1.2s_ease-in-out_infinite]" />
                    {resultMeta.title}
                  </div>
                )}
                <div className="text-4xl font-bold text-blue-800 mb-2">{selectedItem}</div>
                <div className="text-gray-600">
                {selectedItem === "Tote Bag" && "Perfect for carrying your essentials in style!"}
                  {selectedItem === "Cap" && "Show off your Base pride with this stylish cap!"}
                  {selectedItem === "Better Luck Next Time" && "😔 Oh no... Better luck next time! 💔"}
                {selectedItem === "Base T-Shirt" && "A classic choice that never goes out of style!"}
                  {resultMeta?.description && <p className="mt-3 text-xs text-gray-500">{resultMeta.description}</p>}
            </div>
          </div>

              <button 
                onClick={() => setSelectedItem(null)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Continue Spinning
              </button>
              </div>
          </div>
        </div>
      )}
    </div>
  )
}
