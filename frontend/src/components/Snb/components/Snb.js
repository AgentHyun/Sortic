import React, { useState } from 'react';
import { PanelRightOpen, PanelRightClose } from 'lucide-react';
import '../css/snb.css';
import { Calculator, NotebookPen, Percent, Truck, MessageCircleMore} from 'lucide-react';
import NormalCalculator from './NormalCalculator.js';
import NoteCalculator from "./NoteCalculator";
import PercentCalculator from "./PercentCalculator";
import DeliveryTracking from "./DeliveryTracking";
import Chat from "./Chat";

const Snb = () => {
  const [isOpen, setIsOpen] = useState(false); // 전체 버튼 열림 상태
  const [isCalcOpen, setIsCalcOpen] = useState(false); // 계산기 바 열림 상태

  // 각 툴팝업 표시 여부
  const [isNormalCalculatorVisible, setIsNormalCalculatorVisible] = useState(false);
  const [isNoteCalculatorVisible, setIsNoteCalculatorVisible] = useState(false);
  const [isPercentCalculatorVisible, setIsPercentCalculatorVisible] = useState(false);
  const [isDeliveryTrackingVisible, setIsDeliveryTrackingVisible] = useState(false);
  const [isChatVisible,setIsChatVisible] = useState(false);

  // 강제 리렌더용 키값 (다시 누르면 재생성되게)
  const [normalKey, setNormalKey] = useState(0);
  const [noteKey, setNoteKey] = useState(0);
  const [percentKey, setPercentKey] = useState(0);
  const [deliveryKey, setDeliveryKey] = useState(0);
  const [chatKey,setChatKey]=useState(0);

  const handleOpenNormalCalc = () => {
    setIsNormalCalculatorVisible(false);
    setTimeout(() => {
      setNormalKey(prev => prev + 1);
      setIsNormalCalculatorVisible(true);
    }, 0);
  };

  const handleOpenNoteCalc = () => {
    setIsNoteCalculatorVisible(false);
    setTimeout(() => {
      setNoteKey(prev => prev + 1);
      setIsNoteCalculatorVisible(true);
    }, 0);
  };

  const handleOpenPercentCalc = () => {
    setIsPercentCalculatorVisible(false);
    setTimeout(() => {
      setPercentKey(prev => prev + 1);
      setIsPercentCalculatorVisible(true);
    }, 0);
  };

  const handleOpenDeliveryTracking = () => {
    setIsDeliveryTrackingVisible(false);
    setTimeout(() => {
      setDeliveryKey(prev => prev + 1);
      setIsDeliveryTrackingVisible(true);
    }, 0);
  };
  const handleOpenChat = () => {
    setIsChatVisible(false);
    setTimeout(()=>{
      setChatKey(prev=>prev+1);
      setIsChatVisible(true);
    },0)
  }

  return (
    <div className="snb-container">
      {/* 사이드 버튼 전체 래퍼 */}
      <div className={`snb-buttons-wrapper ${isOpen ? 'open' : ''}`}>
        <div className="snb-buttons">

          {/* 계산기 버튼 그룹 */}
          <div className="snb-calc-wrapper">
            {isCalcOpen && (
              <div className="calc-bar">
                <div className="calc-item" onClick={handleOpenNormalCalc}>
                  <Calculator />
                </div>
                <div className="calc-item" onClick={handleOpenPercentCalc}><Percent /></div>
                <div className="calc-item"></div>
              </div>
            )}
            <button className="snb-btn" onClick={() => setIsCalcOpen(!isCalcOpen)}>
              C
            </button>
          </div>

          {/* 각 툴 버튼 */}
          <button className="snb-btn" onClick={handleOpenNoteCalc}><NotebookPen /></button>
          <button className="snb-btn" onClick={handleOpenDeliveryTracking}><Truck /></button>
          <button className="snb-btn" onClick={handleOpenChat}><MessageCircleMore/></button>
        </div>
      </div>

      {/* 토글 버튼 */}
      <div className="snb-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <PanelRightClose /> : <PanelRightOpen />}
      </div>

      {/* 팝업 툴 컴포넌트 */}
      <div className="snb-Normal-calc-container">
        {isNormalCalculatorVisible && (
          <NormalCalculator key={normalKey} onClose={() => setIsNormalCalculatorVisible(false)} />
        )}
      </div>

      <div className="snb-percent-calc-container">
        {isPercentCalculatorVisible && (
          <PercentCalculator key={percentKey} onClose={() => setIsPercentCalculatorVisible(false)} />
        )}
      </div>

      <div className="snb-note-calc-container">
        {isNoteCalculatorVisible && (
          <NoteCalculator key={noteKey} onClose={() => setIsNoteCalculatorVisible(false)} />
        )}
      </div>

      <div className="snb-delivery-tracking-container">
        {isDeliveryTrackingVisible && (
          <DeliveryTracking key={deliveryKey} onClose={() => setIsDeliveryTrackingVisible(false)} />
        )}
      </div>
      <div className="snb-chat-container">
        {isChatVisible && (
          <Chat key={chatKey} onClose={()=>setIsChatVisible(false)}/>
        )}
      </div>
    </div>
  );
};

export default Snb;
