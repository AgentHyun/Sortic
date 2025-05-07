import React, { useState, useEffect, useRef } from 'react';
import { X,ScrollText } from 'lucide-react';
import { message } from 'antd';
import '../css/calculator.css';
import {useAtom} from "jotai";
import {historyAtom} from "../Atom/atoms";

const NormalCalculator = ({ onClose }) => {
  const calculatorRef = useRef(); //  계산기 컨테이너 ref

  const [position, setPosition] = useState({ x: -800, y: -500 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [input, setInput] = useState('');
  const [previousValue, setPreviousValue] = useState('');
  const [operator, setOperator] = useState('');
  //기록 관련 상태
  const [history, setHistory] = useAtom(historyAtom);
  const historyRef = useRef(null);
  //숫자 앞에 불필요한 0 제거
    const sanitizeExpression = (expr) => {
      return expr.replace(/\b0+(\d)/g, '$1'); // ex: "01" → "1", "002" → "2"
    };

  // history 바뀔 때 마다 맨 아래로
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);
  // 마우스 드래그 이동
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging) return;
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    };

    const handleMouseUp = () => {
      setDragging(false);
    };

    if (dragging) {
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.body.style.userSelect = 'auto';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, offset]);

  // 키보드 입력 - 계산기 포커스 중일 때만 허용
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isFocusInsideCalculator =
        calculatorRef.current?.contains(document.activeElement);

      if (!isFocusInsideCalculator) return;

      const key = e.key;


      if (!isNaN(key)) {
        if (input.length >= 10) return;
        setInput((prev) => prev + key);
      } else if (key === '.' && !input.includes('.') && input.length < 10) {
        setInput((prev) => prev + key);
      } else if (key === 'Enter') {
        handleButtonClick('=');
      } else if (key === 'Backspace') {
        handleButtonClick('DEL');
      } else if (key === 'Escape') {
        handleButtonClick('C');
      } else if (['+', '-', '*', '/'].includes(key)) {
        const mapped = key === '*' ? '×' : key === '/' ? '÷' : key;
        handleButtonClick(mapped);
      } else if (key === '%') {
        handleButtonClick('%');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, previousValue, operator]);

  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  //  버튼 클릭 처리
  const handleButtonClick = (value) => {
    if (input.length > 10 && !["C", "DEL", "=", "%"].includes(value)) return;
    if (value === 'C') {
      setInput('');
      setPreviousValue('');
      setOperator('');
    } else if (value === 'DEL') {
      setInput((prev) => prev.slice(0, -1));
    } else if (["+", "-", "×", "÷"].includes(value)) {
      // 연산자를 연속으로 눌렀을 때 예외처리
      if (!input && previousValue && operator) {
        setOperator(value); // 연산자만 바꾼다
        return;
      }
      if (previousValue && operator && input) {
        try {
          const rawExpr = `${previousValue}${operator}${input}`;
          const expression = sanitizeExpression(rawExpr); // 불필요한 0 제거
          const result = eval(expression.replace(/÷/g, '/').replace(/×/g, '*'));
          const cleaned = result.toString().includes('.') ? parseFloat(result.toString()) : result;
          setHistory((prev) => [...prev, `${previousValue}${operator}${input}=${cleaned}`]);
          setPreviousValue(cleaned.toString());
          setOperator(value);
          setInput('');
        } catch {
          message.error('잘못된 계산');
          setInput('');
          setPreviousValue('');
          setOperator('');
        }
      } else {
        if (!input) return;
        setPreviousValue(input);
        setOperator(value);
        setInput('');
      }
    } else if (value === '%') {
      if (!previousValue || !operator || !input) return;
      const percentBase = parseFloat(previousValue);
      const percent = percentBase * (parseFloat(input) / 100);
      setInput(percent.toString());
    } else if (value === '=') {
      if (!previousValue || !operator || input === '') {
        message.warning('불완전한 식입니다.');
        return;
      }
      try {
        const rawExpr = `${previousValue}${operator}${input}`;
        const expression = sanitizeExpression(rawExpr); // ✅ 여기서도 0 제거
        const result = eval(expression.replace(/÷/g, '/').replace(/×/g, '*'));
        const cleaned = result.toString().includes('.') ? parseFloat(result.toString()) : result;
        setHistory((prev) => [...prev, `${previousValue}${operator}${input}=${cleaned}`]);
        setInput(cleaned.toString());
        setPreviousValue('');
        setOperator('');
      } catch (error) {
        message.error('잘못된 입력');
        setInput('');
        setPreviousValue('');
        setOperator('');
      }
    } else {
      setInput((prev) => prev + value);
    }
  };

  return (
    <div
      ref={calculatorRef} //  ref 적용
      className="calculator-container"
      style={{ left: position.x, top: position.y, position: 'absolute' }}
    >
      <div className="calculator-header" onMouseDown={handleMouseDown}>
        <span>일반 계산기</span>
        <X onClick={onClose} className="close-btn" />
      </div>
      <div className="calculator-body">
        <div className="input-display-wrapper">
          {operator && (
            <span className="operator-hint">{previousValue} {operator}</span>
          )}
          <input
            type="text"
            className="calculator-display"
            value={input}
            readOnly
          />
        </div>
        <div className="calculator-buttons">
          {["C", "DEL", "%", "÷"].map((op) => (
            <button
              key={op}
              className={`calculator-button ${
                op === 'C' ? 'clear' : op === 'DEL' ? 'del' : 'operator'
              }`}
              onClick={() => handleButtonClick(op)}
            >
              {op}
            </button>
          ))}
          {[7, 8, 9, "×", 4, 5, 6, "-", 1, 2, 3, "+"].map((btn) => (
            <button
              key={btn}
              className={`calculator-button ${isNaN(btn) ? 'operator' : ''}`}
              onClick={() => handleButtonClick(btn)}
            >
              {btn}
            </button>
          ))}
          <button
            className="calculator-button"
            onClick={() => handleButtonClick(0)}
          >
            0
          </button>
          <button
            className="calculator-button"
            onClick={() => handleButtonClick('.')}
          >
            .
          </button>
          <button
            className="calculator-button equal"
            onClick={() => handleButtonClick('=')}
          >
            =
          </button>
        </div>
        <ScrollText/>
        {history.length > 0 && (
          <div className="history-wrapper" ref={historyRef}>
            {history.map((entry, idx) => (
              <div key={idx} className="history-entry">
                {entry}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NormalCalculator;
