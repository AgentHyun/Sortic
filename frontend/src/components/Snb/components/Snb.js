import React, { useState } from 'react';
import { PanelRightOpen, PanelRightClose } from 'lucide-react';
import '../css/snb.css';
import {Calculator,NotebookPen,Percent,Truck} from 'lucide-react';
import NormalCalculator from './NormalCalculator.js';
import NoteCalculator from "./NoteCalculator";
import PercentCalculator from "./PercentCalculator";
import DeliveryTracking from "./DeliveryTracking";
const Snb = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [isNormalCalculatorVisible, setIsNormalCalculatorVisible] = useState(false);
  const [isNoteCalculatorVisible,setIsNoteCalculatorVisible] = useState(false);
  const [isPercentCalculatorVisible,setIsPercentCalculatorVisible] = useState(false);
  const [isDeliveryTrackingVisible,setIsDeliveryTrackingVisible] = useState(false);
  return (
    <div className="snb-container">
      <div className={`snb-buttons-wrapper ${isOpen ? 'open' : ''}`}>
        <div className="snb-buttons">
          <div className="snb-calc-wrapper">
            {isCalcOpen && (
              <div className="calc-bar">
                <div className="calc-item" onClick={()=>setIsNormalCalculatorVisible(true)}>
                  <Calculator/>
                </div>
                <div className="calc-item" onClick={()=> setIsPercentCalculatorVisible(true)}><Percent/></div>
                <div className="calc-item"></div>
              </div>
            )}
            <button className="snb-btn" onClick={() => setIsCalcOpen(!isCalcOpen)}>
              C
            </button>
          </div>
          <button className="snb-btn" onClick={()=>setIsNoteCalculatorVisible(true)}><NotebookPen/></button>
          <button className="snb-btn" onClick={()=>setIsDeliveryTrackingVisible(true)}><Truck/></button>
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
      <div className="percent-calc-container">
        {isPercentCalculatorVisible&&(
          <PercentCalculator onClose={()=>setIsPercentCalculatorVisible(false)}/>
        )}</div>
      <div className="note-calc-container">
        {isNoteCalculatorVisible&&(
          <NoteCalculator onClose={()=>setIsNoteCalculatorVisible(false)}/>
        )}
      </div>
      <div className="delivery-tracking-container">
        {isDeliveryTrackingVisible&&(
          <DeliveryTracking onClose={()=>setIsDeliveryTrackingVisible(false)}/>
        )}
      </div>

    </div>
  );
};

export default Snb;





















