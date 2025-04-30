// DroppableBillBox.js
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Input,  } from 'antd';
import {Trash,X,Plus} from 'lucide-react';
const DroppableBillBox = ({
                            bill,
                            onDelete,
                            isEditing,
                            onEditStart,
                            onEditSubmit,
                            editedName,
                            onEditNameChange
                          }) => {
  const { setNodeRef, isOver } = useDroppable({   id: `bill-${bill.billId}`,   });

  return (
    <div
      ref={setNodeRef}
      className="bill-box"
      style={{
        backgroundColor: isOver ? '#f0f9ff' : 'white',
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* 삭제 아이콘 */}
      <X
        className="delete-icon"
        onDoubleClick={() => onDelete(bill.billId)}
      />

      {/* Bill 제목, 편집 상태 유지 */}
      <div className="bill-title">
        {isEditing ? (
          <Input
            value={editedName}
            onChange={onEditNameChange}
            onBlur={() => onEditSubmit(bill.billId)}
            onPressEnter={() => onEditSubmit(bill.billId)}
            autoFocus
          />
        ) : (
          <div onDoubleClick={() => onEditStart(bill.billId, bill.billName)}>
            {bill.billName}
          </div>
        )}
      </div>

      {/* 항목 리스트 */}
      <div>
        <h4>📦 항목 </h4>
        <ul>
          {bill.elements?.map((el, idx) => (
            <li key={idx}>{el.elementsName} - {el.elementsPrice}원</li>
          ))}
        </ul>
        <p><strong>총 요소 금액:</strong> {bill.totalElementPrice}원</p>
      </div>

      {/* 수수료 리스트 */}
      <div>
        <div>🧾 수수료</div>
        <ul>
          {bill.commissions?.map((c, idx) => (
            <li key={idx}>{c.commissionName} - {c.commission}원</li>
          ))}
        </ul>
        <p><strong>총 수수료:</strong> {bill.totalCommission}원</p>
      </div>

      {/* 총합 */}
      <div>
        <p><strong>총합:</strong> {bill.grandTotal}원</p>
      </div>
    </div>
  );
};

export default DroppableBillBox;
