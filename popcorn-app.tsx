"use client"

import { useState, useEffect } from "react"

const PopcornApp = () => {
  const [currentPage, setCurrentPage] = useState("landing")
  const [selectedFlavors, setSelectedFlavors] = useState([])
  const [quantities, setQuantities] = useState({})
  const [queueNumber, setQueueNumber] = useState(null)
  const [countdown, setCountdown] = useState(30)
  const [isScanning, setIsScanning] = useState(false)
  const [activeButton, setActiveButton] = useState(null)

  // CSS class for animations
  const addAnimationClass = () => {
    const styleTag = document.createElement("style")
    styleTag.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      @keyframes wiggle {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(5deg); }
        75% { transform: rotate(-5deg); }
      }
      
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
      
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-2px); }
        75% { transform: translateX(2px); }
      }
      
      @keyframes scan {
        0% { top: 0; height: 0; }
        100% { top: 0; height: 100%; }
      }
      
      .float-animation { animation: float 3s infinite ease-in-out; }
      .pulse-animation { animation: pulse 2s infinite ease-in-out; }
      .wiggle-animation { animation: wiggle 3s infinite ease-in-out; }
      .bounce-animation { animation: bounce 1.5s infinite ease-in-out; }
      .shake-animation { animation: shake 0.8s infinite ease-in-out; }
      
      .scan-animation { 
        position: absolute;
        left: 0;
        width: 100%;
        background-color: rgba(0, 255, 0, 0.3);
        animation: scan 2s forwards linear;
      }
      
      .button-press {
        transform: scale(0.95);
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      }
      
      .page-transition {
        opacity: 0;
        transform: translateY(20px);
        animation: fadeIn 0.5s forwards;
      }
      
      @keyframes fadeIn {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .hover-pop {
        transition: all 0.2s ease;
      }
      
      .hover-pop:hover {
        transform: scale(1.05);
      }
      
      .hover-pop:active {
        transform: scale(0.95);
      }
    `
    document.head.appendChild(styleTag)
  }

  useEffect(() => {
    addAnimationClass()
  }, [])

  // Data
  const flavors = [
    { id: 1, name: "Original Butter", price: 20, color: "#F5DEB3" },
    { id: 2, name: "Sweet Caramel", price: 20, color: "#C19A6B" },
    { id: 3, name: "Cheesy Delight", price: 20, color: "#FFD700" },
  ]

  // Calculate total price
  const calculateTotalPrice = () => {
    let total = 0
    selectedFlavors.forEach((flavor) => {
      total += flavor.price * (quantities[flavor.id] || 1)
    })
    return total
  }

  const totalPrice = calculateTotalPrice()

  // Countdown timer for QR code
  useEffect(() => {
    if (currentPage === "payment" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown, currentPage])

  // Button animations
  const handleButtonPress = (id) => {
    setActiveButton(id)
    setTimeout(() => setActiveButton(null), 300)
  }

  // Handlers
  const handleStartOrder = () => {
    handleButtonPress("start")
    setTimeout(() => setCurrentPage("flavors"), 300)
  }

  const handleSelectFlavor = (flavor) => {
    handleButtonPress(`flavor-${flavor.id}`)
    const isSelected = selectedFlavors.some((f) => f.id === flavor.id)

    if (isSelected) {
      setSelectedFlavors((prev) => prev.filter((f) => f.id !== flavor.id))
      setQuantities((prev) => {
        const newQuantities = { ...prev }
        delete newQuantities[flavor.id]
        return newQuantities
      })
    } else {
      setSelectedFlavors((prev) => [...prev, flavor])
      setQuantities((prev) => ({ ...prev, [flavor.id]: 1 }))
    }
  }

  const handleQuantityChange = (flavorId, delta) => {
    handleButtonPress(`${delta > 0 ? "inc" : "dec"}-${flavorId}`)
    setQuantities((prev) => ({
      ...prev,
      [flavorId]: Math.max(1, (prev[flavorId] || 1) + delta),
    }))
  }

  const handleContinueToConfirm = () => {
    if (selectedFlavors.length > 0) {
      handleButtonPress("continue")
      setTimeout(() => setCurrentPage("confirm"), 300)
    }
  }

  const handleGoToPage = (page) => {
    handleButtonPress(`goto-${page}`)
    setTimeout(() => setCurrentPage(page), 300)
  }

  const handlePayment = () => {
    handleButtonPress("payment")
    setTimeout(() => {
      setCurrentPage("payment")
      setCountdown(30)
    }, 300)
  }

  const handleScanStart = () => {
    handleButtonPress("scan")
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      setQueueNumber(Math.floor(Math.random() * 99) + 1)
      setCurrentPage("queue")
    }, 2000)
  }

  const handleBackToLanding = () => {
    handleButtonPress("back-to-landing")
    setTimeout(() => {
      setCurrentPage("landing")
      setSelectedFlavors([])
      setQuantities({})
      setQueueNumber(null)
    }, 300)
  }

  // Landing Page
  const renderLandingPage = () => (
    <div className="flex flex-col items-center justify-center h-screen w-full px-6 page-transition">
      <div className="w-40 h-40 mb-8 float-animation">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M50,20 C60,5 80,15 70,30 C85,25 90,50 75,45 C90,60 70,80 60,65 C55,80 40,75 45,60 C30,70 15,50 30,45 C15,30 35,15 50,20"
            fill="#FFEB3B"
            stroke="#FFC107"
            strokeWidth="2"
          />
          <path
            d="M42,40 C45,30 55,30 58,40 C65,35 70,45 63,50 C70,55 65,65 58,60 C55,70 45,70 42,60 C35,65 30,55 37,50 C30,45 35,35 42,40"
            fill="#FFF"
            strokeWidth="1"
          />
        </svg>
      </div>

      <button
        className={`bg-white text-red-600 rounded-full px-10 py-4 font-bold text-xl shadow-lg hover-pop ${activeButton === "start" ? "button-press" : ""}`}
        onClick={handleStartOrder}
      >
        Popcorn!
      </button>
    </div>
  )

  // Flavors Page
  const renderFlavorsPage = () => (
    <div className="flex flex-col min-h-screen w-full page-transition">
      <div className="flex-1 p-4 pt-8 flex flex-col items-center">
        <h1
          className="text-white text-3xl font-bold mb-6 text-center hover-pop"
          style={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
        >
          Choose Your Flavors
        </h1>

        <div className="w-full max-w-md space-y-4 mb-6">
          {flavors.map((flavor, index) => {
            const isSelected = selectedFlavors.some((f) => f.id === flavor.id)

            return (
              <div
                key={flavor.id}
                className={`${isSelected ? "border-2 border-white" : ""} 
                  bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer 
                  transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl 
                  ${activeButton === `flavor-${flavor.id}` ? "button-press" : ""}`}
                onClick={() => handleSelectFlavor(flavor)}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="p-5 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 mr-4 ${isSelected ? "wiggle-animation" : ""}`}>
                      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M50,20 C60,5 80,15 70,30 C85,25 90,50 75,45 C90,60 70,80 60,65 C55,80 40,75 45,60 C30,70 15,50 30,45 C15,30 35,15 50,20"
                          fill={flavor.color}
                          stroke="#FFC107"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <span className="font-bold text-lg text-red-600">{flavor.name}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-lg font-bold mr-3">฿{flavor.price}</div>
                    {isSelected && (
                      <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center pulse-animation">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M5 12L10 17L20 7"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Selected Flavors Summary */}
        {selectedFlavors.length > 0 && (
          <div className="w-full max-w-md bg-white rounded-xl p-4 mb-4 shadow-lg transform transition-all duration-300 hover:shadow-2xl">
            <h3 className="font-bold text-red-600 mb-2">Selected Flavors: {selectedFlavors.length}</h3>
            {selectedFlavors.map((flavor, index) => (
              <div
                key={flavor.id}
                className="text-sm text-gray-700"
                style={{
                  animation: "fadeIn 0.5s forwards",
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                • {flavor.name}
              </div>
            ))}
          </div>
        )}

        <button
          className={`w-full max-w-md ${selectedFlavors.length > 0 ? "bg-white text-red-600 hover-pop" : "bg-gray-300 text-gray-600"} 
            rounded-full py-3 font-bold text-lg shadow-lg ${activeButton === "continue" ? "button-press" : ""}`}
          onClick={handleContinueToConfirm}
          disabled={selectedFlavors.length === 0}
        >
          {selectedFlavors.length > 0 ? "Continue" : "Select at least one flavor"}
        </button>
      </div>
    </div>
  )

  // Confirm Order Page
  const renderConfirmPage = () => (
    <div className="flex flex-col min-h-screen w-full page-transition">
      <div className="w-full bg-red-700 px-6 py-4 shadow-md">
        <div className="flex justify-between items-center">
          <button
            className={`text-white hover-pop ${activeButton === "goto-flavors" ? "button-press" : ""}`}
            onClick={() => handleGoToPage("flavors")}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 19L8 12L15 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="text-white font-bold text-xl">Confirm Order</h1>
          <div className="w-6"></div>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl p-6 mb-6 shadow-lg transform transition-all duration-300 hover:shadow-2xl">
            <h2 className="font-bold text-xl text-red-600 mb-4">Your Order</h2>

            {selectedFlavors.map((flavor, index) => (
              <div
                key={flavor.id}
                className="mb-6 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                style={{
                  animation: "fadeIn 0.5s forwards",
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 mr-3 wiggle-animation">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M50,20 C60,5 80,15 70,30 C85,25 90,50 75,45 C90,60 70,80 60,65 C55,80 40,75 45,60 C30,70 15,50 30,45 C15,30 35,15 50,20"
                        fill={flavor.color}
                        stroke="#FFC107"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{flavor.name}</h3>
                    <p className="text-gray-500 text-sm">฿{flavor.price} per unit</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-semibold">Quantity:</span>
                  <div className="flex items-center">
                    <button
                      className={`w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center transition-transform transform hover:scale-110 active:scale-95 ${activeButton === `dec-${flavor.id}` ? "scale-95" : ""}`}
                      onClick={() => handleQuantityChange(flavor.id, -1)}
                    >
                      -
                    </button>
                    <span className="mx-3 text-xl font-bold w-6 text-center">{quantities[flavor.id] || 1}</span>
                    <button
                      className={`w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center transition-transform transform hover:scale-110 active:scale-95 ${activeButton === `inc-${flavor.id}` ? "scale-95" : ""}`}
                      onClick={() => handleQuantityChange(flavor.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <span>Subtotal:</span>
                  <span className="font-bold">฿{flavor.price * (quantities[flavor.id] || 1)}</span>
                </div>
              </div>
            ))}

            <div className="h-px bg-gray-200 w-full my-4"></div>

            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-lg">Total Price:</span>
              <span className="text-2xl font-bold text-red-600 pulse-animation">฿{totalPrice}</span>
            </div>
          </div>

          <button
            className={`w-full bg-white text-red-600 rounded-full py-4 font-bold text-lg shadow-lg mb-4 hover-pop ${activeButton === "payment" ? "button-press" : ""}`}
            onClick={handlePayment}
          >
            Confirm and Pay
          </button>

          <button
            className={`w-full bg-transparent border border-white text-white rounded-full py-3 font-medium hover:bg-white hover:bg-opacity-10 transition-colors hover-pop ${activeButton === "goto-flavors2" ? "button-press" : ""}`}
            onClick={() => handleGoToPage("flavors")}
          >
            Change Flavors
          </button>
        </div>
      </div>
    </div>
  )

  // Payment Page
  const renderPaymentPage = () => (
    <div className="flex flex-col min-h-screen w-full page-transition">
      <div className="w-full bg-red-700 px-6 py-4 shadow-md">
        <div className="flex justify-between items-center">
          <button
            className={`text-white hover-pop ${activeButton === "goto-confirm" ? "button-press" : ""}`}
            onClick={() => handleGoToPage("confirm")}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 19L8 12L15 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="text-white font-bold text-xl">Payment</h1>
          <div className="w-6"></div>
        </div>
      </div>

      <div className="flex-1 w-full px-6 py-8 flex flex-col items-center justify-center">
        <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl transform transition-all duration-300 hover:shadow-2xl">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="font-bold text-gray-800 text-lg mb-1">Order Summary</h2>
            <p className="text-gray-500 text-sm">
              {selectedFlavors.length} flavors •{" "}
              {selectedFlavors.reduce((sum, flavor) => sum + (quantities[flavor.id] || 1), 0)} items
            </p>
          </div>

          <div className="px-6 py-6 flex flex-col items-center">
            <div className="mb-4 text-center">
              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-gray-800">฿{totalPrice}.00</p>
            </div>

            <div className="relative mb-4">
              <div className="border-4 border-red-600 rounded-lg p-4 bg-white">
                <div className="relative">
                  <svg viewBox="0 0 200 200" width="200" height="200">
                    <rect x="0" y="0" width="200" height="200" fill="white" />
                    <g fill="black">
                      <rect x="20" y="20" width="40" height="40" />
                      <rect x="140" y="20" width="40" height="40" />
                      <rect x="20" y="140" width="40" height="40" />
                      <rect x="70" y="20" width="10" height="10" />
                      <rect x="90" y="20" width="10" height="10" />
                      <rect x="110" y="20" width="10" height="10" />
                      <rect x="70" y="40" width="10" height="10" />
                      <rect x="90" y="40" width="10" height="10" />
                      <rect x="20" y="70" width="10" height="10" />
                      <rect x="40" y="70" width="10" height="10" />
                      <rect x="70" y="70" width="30" height="10" />
                      <rect x="110" y="70" width="30" height="10" />
                      <rect x="150" y="70" width="10" height="10" />
                      <rect x="170" y="70" width="10" height="10" />
                    </g>

                    <g>
                      <rect x="80" y="80" width="40" height="40" fill="white" />
                      <circle cx="100" cy="100" r="15" fill="#FFEB3B" />
                      <path
                        d="M100,90 C105,85 110,90 105,95 C110,93 112,100 107,97 C112,102 105,107 102,102 C100,107 95,105 97,100 C92,102 88,95 93,92 C88,90 95,85 100,90"
                        fill="#FFC107"
                      />
                    </g>
                  </svg>

                  {isScanning && <div className="scan-animation" />}
                </div>
              </div>

              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                Expires in {countdown}s
              </div>
            </div>

            <p className="text-sm text-gray-600 text-center mb-4">
              Scan this QR code with your banking app
              <br />
              to complete the payment
            </p>

            <div className="flex justify-center space-x-3 mb-4">
              <div className="w-10 h-7 bg-blue-600 rounded opacity-70 hover-pop"></div>
              <div className="w-10 h-7 bg-orange-500 rounded opacity-70 hover-pop"></div>
              <div className="w-10 h-7 bg-green-600 rounded opacity-70 hover-pop"></div>
              <div className="w-10 h-7 bg-purple-600 rounded opacity-70 hover-pop"></div>
            </div>
          </div>

          <div className="px-6 pb-6">
            <button
              className={`w-full bg-red-600 text-white font-bold py-3 rounded-xl mb-3 hover:bg-red-500 transition-colors hover-pop ${activeButton === "scan" ? "button-press" : ""}`}
              onClick={handleScanStart}
            >
              {isScanning ? "Scanning..." : "Scan QR Code"}
            </button>

            <button
              className={`w-full bg-gray-100 text-gray-800 font-medium py-3 rounded-xl hover:bg-gray-200 transition-colors hover-pop ${activeButton === "goto-confirm2" ? "button-press" : ""}`}
              onClick={() => handleGoToPage("confirm")}
            >
              Cancel Order
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center text-white text-xs">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M12 16V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 8H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Secured by Popcorn Payment System
        </div>
      </div>
    </div>
  )

  // Queue Page
  const renderQueuePage = () => (
    <div className="flex flex-col min-h-screen w-full page-transition">
      <div className="flex-1 p-6 pt-12 flex flex-col items-center justify-center">
        <div className="bg-white rounded-full w-32 h-32 flex items-center justify-center mb-6 shadow-lg pulse-animation">
          <span className="text-red-600 text-6xl font-bold">{queueNumber}</span>
        </div>

        <h3 className="text-white font-bold text-xl mb-2 bounce-animation">Queue Number</h3>
        <p className="text-white mb-3 text-center max-w-xs">We'll call your number when your popcorn is ready!</p>

        {/* Order summary */}
        <div className="bg-white bg-opacity-20 rounded-xl p-4 mb-6 max-w-xs w-full transform transition-all duration-300 hover:bg-opacity-30">
          {selectedFlavors.map((flavor, index) => (
            <div
              key={flavor.id}
              className="flex justify-between text-white mb-1"
              style={{
                animation: "fadeIn 0.5s forwards",
                animationDelay: `${index * 0.1 + 0.5}s`,
              }}
            >
              <span>{flavor.name}</span>
              <span>x{quantities[flavor.id] || 1}</span>
            </div>
          ))}
          <div className="h-px bg-white bg-opacity-30 my-2"></div>
          <div className="flex justify-between text-white font-bold">
            <span>Total:</span>
            <span>฿{totalPrice}</span>
          </div>
        </div>

        <div className="w-20 h-20 mb-8 float-animation">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M50,20 C60,5 80,15 70,30 C85,25 90,50 75,45 C90,60 70,80 60,65 C55,80 40,75 45,60 C30,70 15,50 30,45 C15,30 35,15 50,20"
              fill="#FFEB3B"
              stroke="#FFC107"
              strokeWidth="2"
            />
          </svg>
        </div>

        <button
          className={`bg-white text-red-600 rounded-full px-8 py-3 font-bold shadow-lg hover-pop ${activeButton === "back-to-landing" ? "button-press" : ""}`}
          onClick={handleBackToLanding}
        >
          Order More Popcorn
        </button>
      </div>
    </div>
  )

  return (
    <div className="bg-red-600 min-h-screen flex flex-col">
      {currentPage === "landing" && renderLandingPage()}
      {currentPage === "flavors" && renderFlavorsPage()}
      {currentPage === "confirm" && renderConfirmPage()}
      {currentPage === "payment" && renderPaymentPage()}
      {currentPage === "queue" && renderQueuePage()}
    </div>
  )
}

export default PopcornApp

