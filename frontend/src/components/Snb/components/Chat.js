import React, {useEffect,useState} from "react";
import { X } from "lucide-react";
import axios from 'axios';

const Chat = ({onclose}) => {
  const [position, setPosition] = useState({ x: -1000, y: -500 }); // 컴포넌트 초기 위치
  const [dragging, setDragging] = useState(false); // 드래그 상태
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // 드래그 위치 보정용 오프셋

  // 드래그 이동 처리
  // useEffect(() => {
  //
  // }, []);(() => {
  //   const handleMouseMove = (e) => {
  //     if (!dragging) return;
  //     setPosition({
  //       x: e.clientX - offset.x,
  //       y: e.clientY - offset.y,
  //     });
  //   };
  //
  //   const handleMouseUp = () => setDragging(false);
  //
  //   if (dragging) {
  //     document.body.style.userSelect = 'none';
  //     document.addEventListener('mousemove', handleMouseMove);
  //     document.addEventListener('mouseup', handleMouseUp);
  //   }
  //
  //   return () => {
  //     document.body.style.userSelect = 'auto';
  //     document.removeEventListener('mousemove', handleMouseMove);
  //     document.removeEventListener('mouseup', handleMouseUp);
  //   };
  // }, [dragging, offset]);

  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };


  return(
    <div
      className="chat-container"
      style={{ left: position.x, top: position.y, position: 'absolute' }}>

    </div>
  )
}

export default Chat;
