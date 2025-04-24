// Snb.js
import React, { useState } from 'react';
import { PanelRightOpen, PanelRightClose } from 'lucide-react';
import '../css/snb.css';
import {Calculator,NotebookPen} from 'lucide-react';
import NormalCalculator from './NormalCalculator.js';
import NoteCalculator from "./NoteCalculator";
const Snb = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [isNormalCalculatorVisible, setIsNormalCalculatorVisible] = useState(false);
  const [isNoteCalculatorVisible,setIsNoteCalculatorVisible] = useState(false);
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
          <button className="snb-btn" onClick={()=>setIsNoteCalculatorVisible(true)}><NotebookPen/></button>
          <button className="snb-btn">3</button>
          <button className="snb-btn">4</button>
        </div>
      </div>
      <div className="snb-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <PanelRightClose /> : <PanelRightOpen />}
      </div>
      <div className="Normal-calc-container">
       {isNormalCalculatorVisible && (
          <NormalCalculator onClose ={() => setIsNormalCalculatorVisible(false)} />
       )}
      </div>
      <div className="note-calc-container">
        {isNoteCalculatorVisible&&(
          <NoteCalculator onClose={()=>setIsNoteCalculatorVisible(false)}/>
        )}
      </div>
    </div>
  );
};

export default Snb;





















