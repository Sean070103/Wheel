"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const merchItems = [
  { name: "Base T-Shirt", color: "#1E3A8A", textColor: "white" },
  { name: "Sticker", color: "#FFFFFF", textColor: "#1E3A8A" },
  { name: "Bokya", color: "#1E3A8A", textColor: "white" },
  { name: "Base T-Shirt", color: "#FFFFFF", textColor: "#1E3A8A" },
  { name: "Sticker", color: "#1E3A8A", textColor: "white" },
  { name: "Bokya", color: "#FFFFFF", textColor: "#1E3A8A" },
  { name: "Base T-Shirt", color: "#1E3A8A", textColor: "white" },
  { name: "Sticker", color: "#FFFFFF", textColor: "#1E3A8A" },
  { name: "Bokya", color: "#1E3A8A", textColor: "white" },
  { name: "Base T-Shirt", color: "#FFFFFF", textColor: "#1E3A8A" },
  { name: "Sticker", color: "#1E3A8A", textColor: "white" },
  { name: "Bokya", color: "#FFFFFF", textColor: "#1E3A8A" },
]

export default function MerchWheel() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)
  const [spinCount, setSpinCount] = useState(0)
  const wheelRef = useRef<HTMLDivElement>(null)

  const spinWheel = () => {
    if (isSpinning) return

    setIsSpinning(true)
    setSelectedItem(null)

    // Increment spin count
    const newSpinCount = spinCount + 1
    setSpinCount(newSpinCount)

    // Check if this is the 30th spin (guaranteed Base T-Shirt)
    const isGuaranteedWin = newSpinCount % 30 === 0

    let selectedIndex: number
    let targetRotation: number

    if (isGuaranteedWin) {
      // Force Base T-Shirt selection - find all Base T-Shirt indices and pick one randomly
      const tshirtIndices = merchItems
        .map((item, index) => item.name === "Base T-Shirt" ? index : -1)
        .filter(index => index !== -1)
      selectedIndex = tshirtIndices[Math.floor(Math.random() * tshirtIndices.length)]
      console.log(`Spin ${newSpinCount}: GUARANTEED Base T-Shirt at index ${selectedIndex}`)
    } else {
      // Normal random selection - only allow Bokya and Sticker for non-100th spins
      let availableIndices: number[] = []
      merchItems.forEach((item, index) => {
        if (item.name === "Sticker" || item.name === "Bokya") {
          availableIndices.push(index)
        }
      })
      
      // Pick a random Bokya or Sticker
      selectedIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
      console.log(`Spin ${newSpinCount}: Random ${merchItems[selectedIndex].name} at index ${selectedIndex}`)
    }

    // Ensure the wheel lands exactly on the selected segment
    const sectionAngle = 360 / merchItems.length
    const segmentCenterAngle = selectedIndex * sectionAngle + sectionAngle / 2
    
    // The Base logo line points at 45 degrees (diagonal), so we need to rotate the wheel
    // so that the logo's line points to the selected segment
    const logoLineAngle = 45 // The diagonal line in the Base logo
    const targetAngle = 360 - segmentCenterAngle + logoLineAngle // Reverse the calculation for accuracy
    
    // Generate multiple full rotations plus the target angle
    const fullRotations = 8 + Math.random() * 8 // 8-16 full rotations
    targetRotation = rotation + (fullRotations * 360) + targetAngle

    setRotation(targetRotation)

    setTimeout(() => {
      setSelectedItem(merchItems[selectedIndex].name)
      setIsSpinning(false)
    }, 5000)
  }

  const resetWheel = () => {
    setRotation(0)
    setSelectedItem(null)
    setIsSpinning(false)
    setSpinCount(0)
    console.log("Wheel reset - spin count back to 0")
  }

  const sectionAngle = 360 / merchItems.length

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative">
      {/* Base Logo in Upper Left */}
      <div className="absolute top-4 left-4 lg:top-8 lg:left-8">
        <Image 
          src="/Base_Symbol_Blue.png" 
          alt="Base Logo" 
          width={160} 
          height={160}
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32"
        />
      </div>

      {/* Main Container with Wheel and Result */}
      <Card className="w-full max-w-4xl mx-auto shadow-2xl border-2 shadow-blue-500/40 ring-4 ring-blue-500/50 shadow-lg">
        <CardContent className="p-12">

          
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            {/* Debug Info */}
            <div className="absolute top-4 right-4 text-sm text-gray-600">
              Spin: {spinCount}
            </div>
            
          {/* Wheel Container */}
            <div className="relative flex justify-center h-80 lg:h-96 w-80 lg:w-96">
              {/* Arrow Indicator */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 z-10">
                <div className="w-0 h-0 border-l-12 border-r-12 border-t-16 border-l-transparent border-r-transparent border-t-blue-600"></div>
              </div>
              
              {/* Line Indicator */}
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-2 z-10">
                <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-t-transparent border-b-transparent border-l-blue-600 shadow-lg"></div>
              </div>
              

              
            {/* Wheel */}
            <div
              ref={wheelRef}
                className="absolute w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-2xl cursor-pointer"
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

                          // Calculate path for each section using fixed precision
            const startX = (50 + 50 * Math.cos(((startAngle - 90) * Math.PI) / 180)).toFixed(6)
            const startY = (50 + 50 * Math.sin(((startAngle - 90) * Math.PI) / 180)).toFixed(6)
            const endX = (50 + 50 * Math.cos(((endAngle - 90) * Math.PI) / 180)).toFixed(6)
            const endY = (50 + 50 * Math.sin(((endAngle - 90) * Math.PI) / 180)).toFixed(6)

                const largeArcFlag = sectionAngle > 180 ? 1 : 0
                const pathData = `M 50 50 L ${startX} ${startY} A 50 50 0 ${largeArcFlag} 1 ${endX} ${endY} Z`

                return (
                <div key={`${item.name}-${index}`} className="absolute inset-0">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                    <path d={pathData} fill={item.color} />
                      <text
                    x={(50 + 35 * Math.cos(((midAngle - 90) * Math.PI) / 180)).toFixed(6)}
                    y={(50 + 35 * Math.sin(((midAngle - 90) * Math.PI) / 180)).toFixed(6)}
                        fill={item.textColor}
                    fontSize="4"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {item.name}
                      </text>
                    </svg>
                  </div>
                )
              })}

              {/* Center white circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center shadow-lg">
              <Image 
                src="/Base_Symbol_Blue.png" 
                alt="Base Logo" 
                width={24} 
                height={24}
                className="w-6 h-6"
              />
            </div>
          </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
                {selectedItem === "Bokya" ? (
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">😔 Oh no...</h2>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold text-blue-800 mb-2">🎉 Congratulations!</h2>
                    <h3 className="text-2xl font-bold text-blue-600 mb-4">You Won!</h3>
                  </>
                )}
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <div className="text-4xl font-bold text-blue-800 mb-2">{selectedItem}</div>
                <div className="text-gray-600">
                {selectedItem === "Sticker" && "Perfect for laptops, water bottles, and more!"}
                  {selectedItem === "Bokya" && "😔 Oh no... You got Bokya. Better luck next time! 💔"}
                {selectedItem === "Base T-Shirt" && "A classic choice that never goes out of style!"}
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
