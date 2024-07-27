"use client"

// components/Calculator.tsx
import React, { useState } from 'react';

const Calculator: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(0);

  const handleButtonClick = (value: string) => {
    if (value === '=') {
      try {
        setResult(eval(input));
        setInput('');
      } catch (error) {
        setResult(NaN);
      }
    } else if (value === 'C') {
      setInput('');
      setResult(0);
    } else {
      setInput(input + value);
    }
  };

  return (
    <div className="p-4 z-50 bg-white rounded-lg shadow-lg">
      <div className="mb-4 text-right text-xl font-semibold">{input || result}</div>
      <div className="grid grid-cols-4 gap-2">
        {['7', '8', '9', '/'].map((value) => (
          <button key={value} className="p-2 bg-gray-200 rounded" onClick={() => handleButtonClick(value)}>
            {value}
          </button>
        ))}
        {['4', '5', '6', '*'].map((value) => (
          <button key={value} className="p-2 bg-gray-200 rounded" onClick={() => handleButtonClick(value)}>
            {value}
          </button>
        ))}
        {['1', '2', '3', '-'].map((value) => (
          <button key={value} className="p-2 bg-gray-200 rounded" onClick={() => handleButtonClick(value)}>
            {value}
          </button>
        ))}
        {['0', 'C', '=', '+'].map((value) => (
          <button key={value} className="p-2 bg-gray-200 rounded" onClick={() => handleButtonClick(value)}>
            {value}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
