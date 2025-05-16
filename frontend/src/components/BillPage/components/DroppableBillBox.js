// DroppableBillBox.js
import React, {useEffect, useState} from 'react';
import { useDroppable } from '@dnd-kit/core';
import {Button, Input, message, Select,} from 'antd';
import {Trash, X, Plus, Minus, Copy ,ScanText} from 'lucide-react';
import {useAtom} from "jotai";
import axios from "axios";
import {
  billsAtom, commissionModalVisibleAtom,
  detailModalVisibleAtom,
  selectedBillDetailsAtom, selectedBillForCommissionAtom, selectedBillIdAtom,
  selectedBillTitleAtom
} from "../atom/atoms";
import {authUserAtom} from "../../../auth/authAtoms";
import html2canvas from "html2canvas";
import {wholesaleLinksAtom} from "../../WholesalePage/atoms/atoms";
import {fetchBillsAction} from "../actions/billActions";
const DroppableBillBox = ({
                            bill,

                          }) => {
  const {setNodeRef, isOver} = useDroppable({id: `bill-${bill.billId}`,});
  const [editingBillId, setEditingBillId] = useState(false);
  const [editedBillName, setEditedBillName] = useState('');
  const [detailModalVisible, setDetailModalVisible] = useAtom(detailModalVisibleAtom);
  const [selectedBillDetails, setSelectedBillDetails] = useAtom(selectedBillDetailsAtom);
  const [selectedBillTitle, setSelectedBillTitle] = useAtom(selectedBillTitleAtom);
  const [commissionModalVisible, setCommissionModalVisible] = useAtom(commissionModalVisibleAtom);
  const [selectedBillId, setSelectedBillId] = useAtom(selectedBillIdAtom);
  const [selectedBillForCommission, setSelectedBillForCommission] = useAtom(selectedBillForCommissionAtom);
  const boxRef = React.useRef(null);
  const { Option } = Select;
  const [,fetchBills] = useAtom(fetchBillsAction);


  /** ✅ Bill 추가 처리 */

  const handleDeleteBill = async (billId) => {
    try {
      await axios.delete(`http://localhost:8080/api/bills/deleteBill`, { // ✅ 주소 수정
        params: {billId}
      });
      message.success("삭제 완료!");
      fetchBills(); // 전체 새로고침
    } catch (err) {
      message.error("삭제 실패");
    }
  };

  const handleUpdateBillName = async (billId) => {
      try {
        await axios.put(`/api/bills/updateBillName`, {
          billId: billId,
          billName: editedBillName,
        });
        message.success("Bill 이름 수정 성공");
        setEditingBillId(null);
        fetchBills();
      } catch (err) {
        message.error("Bill 이름 수정 실패");
      }
    };

    const handleIncrease = async (billId, elementsNameId) => {
      await axios.put(`/api/bills/increaseCount`, null, {
        params: {billId, elementsNameId},
      });
      fetchBills();
    };

    const handleDecrease = async (billId, elementsNameId, currentCount) => {
      if (currentCount <= 1) {
        await axios.delete(`/api/bills/deleteElement`, {
          params: {billId, elementsNameId},
        });
      } else {
        await axios.put(`/api/bills/decreaseCount`, null, {
          params: {billId, elementsNameId},
        });
      }
      fetchBills();
    };

    const handleBillDoubleClick = async (bill) => {
      try {
        const allData = await Promise.all(
          bill.elements.map((el) => {
            const id = el.elementsNameId || el.elements_name_id || el.elements_nameId;
            if (!id) {
              console.warn("⚠️ 요소 ID 없음:", el);
              return Promise.resolve({data: []});
            }
            return axios.get(
              `/api/bills/getElementsdata?elementsNameId=${id}`
            );
          })
        );

        const mapped = bill.elements.map((el, idx) => ({
          ...el,
          details: allData[idx]?.data || [],
        }));

        setSelectedBillTitle(bill.billName);
        setSelectedBillDetails(mapped);
        setDetailModalVisible(true);
      } catch (err) {
        message.error("요소 세부 데이터 조회 실패");
      }
    };
  const handleTextCopy = () => {
    let text = `🧾 [${bill.billName}]\n`;

    // 요소 정리
    text += `\n📦 상품 목록 (${bill.elements.length}개)\n`;
    bill.elements.forEach(el => {
      text += `- ${el.elementsName} (${el.elementCount}개) : ${el.elementsPrice}원\n`;
    });
    text += `총 상품 금액: ${bill.totalElementPrice}원\n`;

    navigator.clipboard.writeText(text)
      .then(() => message.success("텍스트가 복사되었습니다"))
      .catch(() => message.error("복사 실패"));
  };
  const handleImageCopy = async () => {
    if (!boxRef.current) return;
    try {
      // 폰트 렌더링이 완료될 때까지 대기
      await document.fonts.ready;

      // 캡처를 살짝 지연시켜 스타일 적용 시간 확보
      setTimeout(() => {
        html2canvas(boxRef.current, {
          useCORS: true,
          backgroundColor: '#ffffff', // 혹시 투명 배경이면 흰 배경 지정
          scale: 2, // 고해상도
        }).then(canvas => {
          canvas.toBlob(blob => {
            if (!blob) return message.error("이미지 캡쳐 실패");
            const item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item])
              .then(() => message.success("이미지가 복사되었습니다"))
              .catch(() => message.error("클립보드 복사 실패"));
          });
        }).catch((err) => {
          console.error(err);
          message.error("이미지 캡처 실패");
        });
      }, 2000); // 0.3초 지연
    } catch (err) {
      console.error(err);
      message.error("이미지 복사 중 오류 발생");
    }
  };
  const [sortedElements, setSortedElements] = useState(bill.elements);

  useEffect(() => {
    setSortedElements(bill.elements);
  }, [bill.elements]);

  const handleSortChange = (value) => {
    if (value === 'default') return;

    const sorted = [...sortedElements]; // 기존 상태 기준 정렬

    switch (value) {
      case 'name-asc':
        sorted.sort((a, b) => a.elementsName.localeCompare(b.elementsName));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.elementsName.localeCompare(a.elementsName));
        break;
      case 'price-asc':
        sorted.sort((a, b) => a.elementsPrice - b.elementsPrice);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.elementsPrice - a.elementsPrice);
        break;
      case 'count-asc':
        sorted.sort((a, b) => a.elementCount - b.elementCount);
        break;
      case 'count-desc':
        sorted.sort((a, b) => b.elementCount - a.elementCount);
        break;
      case 'total-asc':
        sorted.sort((a, b) => (a.elementsPrice * a.elementCount) - (b.elementsPrice * b.elementCount));
        break;
      case 'total-desc':
        sorted.sort((a, b) => (b.elementsPrice * b.elementCount) - (a.elementsPrice * a.elementCount));
        break;
      default:
        break;
    }

    setSortedElements(sorted);
  };

  return (
      <div
        key={bill.billId}
        className="bill-box"
        onDoubleClick={() => handleBillDoubleClick(bill)}
        ref={(node) => {
          setNodeRef(node);
          boxRef.current = node; // 캡쳐용 ref
        }}
      >
        <ScanText
          size={24}
          className="text-icon"
          onClick={(e) => {
            e.stopPropagation();
            handleTextCopy();
          }}
          onDoubleClick={(e)=>{e.stopPropagation();}}
        />
        <Copy
          size={24}
          className="copy-icon"
          onClick={(e) => {
            e.stopPropagation();
            handleImageCopy();
          }}
          onDoubleClick={(e)=>{e.stopPropagation();}}
        />
        <X
          size={28}
          className="delete-icon"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteBill(bill.billId);
          }}
        />
        <div className="bill-title">
          {editingBillId === bill.billId ? (
            <Input
              value={editedBillName}
              onChange={(e) => setEditedBillName(e.target.value)}
              onBlur={() => handleUpdateBillName(bill.billId)}
              onPressEnter={() => handleUpdateBillName(bill.billId)}
              autoFocus
              style={{width:' 170px',textAlign: 'center'}}
            />
          ) : (
            <div
              onDoubleClick={(e) => {
                e.stopPropagation();
                setEditingBillId(bill.billId);
                setEditedBillName(bill.billName);
              }}
            >
              {bill.billName}
            </div>
          )}
        </div>

        <div >
          <h4 className="product-title">
            <span>📦 상품 ({bill.elements.length}개)</span>
            <span className="select-box">
              <Select
                className="my-custom-select"
                popupClassName="my-select-dropdown"
                style={{ width: 150 }}
                defaultValue="default"
                onChange={handleSortChange}
                onDoubleClick={(e)=>{e.stopPropagation();}}
              >
                <Option value="default" disabled>정렬 방식 선택</Option>
                <Option value="name-asc">ㄱ-ㄴ-ㄷ 순</Option>
                <Option value="name-desc">ㄱ-ㄴ-ㄷ 역순</Option>
                <Option value="price-asc">가격 낮은순</Option>
                <Option value="price-desc">가격 높은순</Option>
                <Option value="count-asc">수량 적은순</Option>
                <Option value="count-desc">수량 많은순</Option>
                <Option value="total-asc">총액 낮은순</Option>
                <Option value="total-desc">총액 높은순</Option>
              </Select>
  </span>
          </h4>


          <table className="element-container">
            <colgroup>
              <col style={{ width: '35%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '20%' }} />
              <col style={{ width: '25%' }} />
            </colgroup>
            <thead className="bill-element-head">
            <tr>
              <th>상품명</th>
              <th>가격</th>
              <th>수량</th>
              <th>총액</th>
            </tr>
            </thead>
            <tbody>
            {Array.isArray(sortedElements) &&
              sortedElements.map((el, idx) => (
                <tr key={idx} className="bill-element-row">
                  <td>{el.elementsName}</td>
                  <td>{el.elementsPrice.toLocaleString()}</td>
                  <td className="count-td">
                    <div className="count-controls">
                      <Minus
                        className="count-minus"
                        size={18}
                        onClick={() => handleDecrease(bill.billId, el.elementsNameId, el.elementCount)}
                        onDoubleClick={(e) => e.stopPropagation()}
                      />
                      <span>{el.elementCount}</span>
                      <Plus
                        className="count-plus"
                        size={18}
                        onClick={() => handleIncrease(bill.billId, el.elementsNameId)}
                        onDoubleClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </td>
                  <td>
                    {(el.elementsPrice * el.elementCount).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="total-product">
            <strong >상품 금액:</strong> {bill.totalElementPrice}원
          </p>
        </div>

        <div>
          <div className="commission-header"
               onDoubleClick={(e) => e.stopPropagation()}
               onClick={(e) => {
                 e.stopPropagation();
                 setSelectedBillId(bill.billId);
                 setSelectedBillForCommission(bill);
                 setCommissionModalVisible(true);
               }}
          >🧾 수수료
          </div>
          <ul className="bill-commission-box">
            {Array.isArray(bill.commissions) &&
              bill.commissions.map((c, idx) => (
                <li key={idx} className="bill-commission-map">
                  {c.commissionName}
                </li>
              ))}
          </ul>
          <p className="total-commission">
            <strong >수수료:</strong> {bill.totalCommission}원
          </p>
        </div>

        <div className="total-section">
          <span className="total-label">총합 :</span>
          <span className="total-amount">{bill.grandTotal}원</span>
        </div>
        <div className="order-container">
          <Button className="order-btn"
                  onDoubleClick={(e) => e.stopPropagation()}
            // onClick={}
          >주문하기
          </Button>
        </div>
      </div>
    )
  };

export default DroppableBillBox;
