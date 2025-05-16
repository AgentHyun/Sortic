import React, { useState, useEffect, useRef } from 'react';
import { X, ScrollText } from 'lucide-react';
import { message } from 'antd';
import '../css/calculator.css';
import { useAtom } from "jotai";
import { historyAtom } from "../Atom/atoms";

const NormalCalculator = ({ onClose }) => {
  const calculatorRef = useRef(); // 계산기 전체 영역 참조

  const [position, setPosition] = useState({ x: -1000, y: -500 }); // 위치 상태
  const [dragging, setDragging] = useState(false); // 드래그 여부
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // 마우스 클릭 위치 보정

  const [input, setInput] = useState(''); // 현재 입력값
  const [previousValue, setPreviousValue] = useState(''); // 이전 값 (연산자 앞)
  const [operator, setOperator] = useState(''); // 현재 연산자

  const [history, setHistory] = useAtom(historyAtom); // 계산 내역
  const historyRef = useRef(null); // 내역 영역 스크롤용 참조

  // 숫자 앞 불필요한 0 제거 (ex: 012 → 12)
  const sanitizeExpression = (expr) => {
    return expr.replace(/\b0+(\d)/g, '$1');
  };

  // 계산 내역이 바뀔 때마다 맨 아래로 스크롤
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);

  // 드래그 이동 처리
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging) return;
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    };
    const handleMouseUp = () => setDragging(false);
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

  // 키보드 입력 허용 (계산기 내부 포커스 시만)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isFocusInsideCalculator = calculatorRef.current?.contains(document.activeElement);
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

  // 버튼 클릭 처리 로직
  const handleButtonClick = (value) => {
    if (input.length > 10 && !["C", "DEL", "=", "%"].includes(value)) return;

    if (value === 'C') {
      setInput('');
      setPreviousValue('');
      setOperator('');
    } else if (value === 'DEL') {
      setInput((prev) => prev.slice(0, -1));
    } else if (["+", "-", "×", "÷"].includes(value)) {
      // 연산자 중복 입력 처리
      if (!input && previousValue && operator) {
        setOperator(value);
        return;
      }
      if (previousValue && operator && input) {
        try {
          const rawExpr = `${previousValue}${operator}${input}`;
          const expression = sanitizeExpression(rawExpr);
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
        const expression = sanitizeExpression(rawExpr);
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
      ref={calculatorRef}
      className="calculator-container"
      style={{ left: position.x, top: position.y, position: 'absolute' }}
    >
      {/* 헤더 - 드래그 이동 및 닫기 버튼 */}
      <div className="calculator-header" onMouseDown={handleMouseDown}>
        <span>일반 계산기</span>
        <X onClick={onClose} className="close-btn" />
      </div>

      <div className="calculator-body">
        {/* 현재 계산 식 및 결과 */}
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

        {/* 버튼 영역 */}
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

        {/* 계산 기록 */}
        <ScrollText /> {'기록'}
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
