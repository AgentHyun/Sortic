// Snb.js
import React, { useState } from 'react';
import { PanelRightOpen, PanelRightClose } from 'lucide-react';
import '../css/snb.css';
import {Calculator} from 'lucide-react';
import NormalCalculator from './NormalCalculator.js';
const Snb = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [isNormalCalculatorVisible, setIsNormalCalculatorVisible] = useState(false);
  return (
    <div className="snb-container">
      <div className={`snb-buttons-wrapper ${isOpen ? 'open' : ''}`}>
        <div className="snb-buttons">
          <div className="snb-calc-wrapper">
            {isCalcOpen && (
              <div className="calc-bar">
                <div className="calc-item" onClick={()=>setIsNormalCalculatorVisible(true)}>
                  일반
                </div>
                <div className="calc-item">2</div>
                <div className="calc-item"></div>
              </div>
            )}
            <button className="snb-btn" onClick={() => setIsCalcOpen(!isCalcOpen)}>
              <Calculator />
            </button>
          </div>
          <button className="snb-btn">2</button>
          <button className="snb-btn">3</button>
          <button className="snb-btn">4</button>
        </div>
      </div>
      <div className="snb-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <PanelRightClose /> : <PanelRightOpen />}
      </div>

      {isNormalCalculatorVisible && (
        <NormalCalculator onClose ={() => setIsNormalCalculatorVisible(false)} />
      )}
    </div>
  );
};

export default Snb;
