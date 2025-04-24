// 라이브러리 임포트 및 초기 설정
import React, { useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { X } from 'lucide-react';
import '../css/note.css';
import { linesAtom } from '../Atom/atoms';

let lastCursorX = 0;

const isRenderable = (val) => val === null || ['string', 'number', 'boolean'].includes(typeof val);

const NoteCalculator = ({ onClose }) => {
  const [lines, setLines] = useAtom(linesAtom);
  const [results, setResults] = React.useState([]);
  const [variables, setVariables] = React.useState({});
  const [position, setPosition] = React.useState({ x: -800, y: -500 });
  const [dragging, setDragging] = React.useState(false);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });

  const inputRefs = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging) return;
      setPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
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

  useEffect(() => {
    lines.forEach((_, i) => {
      const el = inputRefs.current[i];
      if (el) {
        el.style.width = '1ch';
        el.style.width = `${el.scrollWidth}px`;
      }
    });
  }, [lines]);

  const parseAllLines = () => {
    const newResults = [];
    const scope = {};

    for (let raw of lines) {
      const line = raw.trim();
      if (!line) {
        newResults.push('');
        continue;
      }

      try {
        if (line.includes('=')) {
          const eqIdx = line.indexOf('=');
          const left = line.slice(0, eqIdx).trim();
          const right = line.slice(eqIdx + 1).trim();

          const variables = Object.keys(scope).sort((a, b) => b.length - a.length);
          let cleanRight = right;
          variables.forEach((key) => {
            const escapedKey = key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
            cleanRight = cleanRight.replace(new RegExp(`(?<![\w\d_\"])(?<!\")${escapedKey}(?![\w\d_\"])(?!\")`, 'g'), `scope["${key}"]`);
          });

          const val = eval(cleanRight);
          scope[left] = val;
          newResults.push(val);
        } else {
          if (scope[line] !== undefined) {
            newResults.push(scope[line]);
          } else {
            const variables = Object.keys(scope).sort((a, b) => b.length - a.length);
            let cleanLine = line;
            variables.forEach((key) => {
              const escapedKey = key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
              cleanLine = cleanLine.replace(new RegExp(`(?<![\w\d_\"])(?<!\")${escapedKey}(?![\w\d_\"])(?!\")`, 'g'), `scope["${key}"]`);
            });

            const val = eval(cleanLine);
            newResults.push(val);
          }
        }
      } catch (err) {
        newResults.push('');
      }
    }

    setVariables(scope);
    setResults(newResults);
  };

  useEffect(() => {
    try {
      parseAllLines();
    } catch (err) {
      console.error('계산 오류:', err);
    }
  }, [lines]);

  const handleLineChange = (index, value) => {
    const updated = [...lines];
    updated[index] = value;
    setLines(updated);
  };

  const handleKeyDown = (e, index) => {
    const currentInput = inputRefs.current[index];
    if (!currentInput) return;
    lastCursorX = currentInput.selectionStart;

    const cursorPos = e.target.selectionStart;
    const currentLine = lines[index];
    const before = currentLine.slice(0, cursorPos);
    const after = currentLine.slice(cursorPos);

    if (e.key === 'Enter') {
      e.preventDefault();
      const updated = [...lines];
      updated[index] = before;
      updated.splice(index + 1, 0, after);
      setLines(updated);
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
        inputRefs.current[index + 1]?.setSelectionRange(0, 0);
      }, 0);
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const targetIndex = index > 0 ? index - 1 : 0;
      const targetInput = inputRefs.current[targetIndex];
      if (targetInput) {
        const pos = Math.min(lastCursorX, targetInput.value.length);
        targetInput.focus();
        targetInput.setSelectionRange(pos, pos);
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const targetIndex = Math.min(index + 1, lines.length - 1);
      const targetInput = inputRefs.current[targetIndex];
      if (targetInput) {
        const pos = Math.min(lastCursorX, targetInput.value.length);
        targetInput.focus();
        targetInput.setSelectionRange(pos, pos);
      }
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const updated = [...lines];
      const indent = '    ';
      updated[index] = before + indent + after;
      setLines(updated);
      setTimeout(() => {
        const pos = (before + indent).length;
        inputRefs.current[index]?.focus();
        inputRefs.current[index]?.setSelectionRange(pos, pos);
      }, 0);
    }

    if (e.key === 'Backspace' && cursorPos === 0 && index > 0) {
      e.preventDefault();
      const updated = [...lines];
      const merged = lines[index - 1] + lines[index];
      updated[index - 1] = merged;
      updated.splice(index, 1);
      setLines(updated);
      setTimeout(() => {
        const len = merged.length;
        inputRefs.current[index - 1]?.focus();
        inputRefs.current[index - 1]?.setSelectionRange(len, len);
      }, 0);
    }
  };

  return (
    <div
      ref={containerRef}
      className="note-calculator-container"
      style={{ left: position.x, top: position.y, position: 'absolute' }}
    >
      <div className="note-calculator-header" onMouseDown={(e) => {
        setDragging(true);
        setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
      }}>
        <span>계산노트</span>
        <X onClick={onClose} className="close-btn" />
      </div>
      <div className="note-field-memo-wrapper" >
        {lines.map((line, i) => (
          <div className="memo-line" key={i}>
            <input
              type="text"
              spellCheck={false}
              ref={el => inputRefs.current[i] = el}
              className="memo-input"
              style={{ whiteSpace: 'nowrap', overflowX: 'hidden', width: 'auto', minWidth: '1ch' }}
              value={line}
              onChange={(e) => handleLineChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, i)}
            />
            <div className="memo-result">
              {isRenderable(results[i]) ? results[i] : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteCalculator;
