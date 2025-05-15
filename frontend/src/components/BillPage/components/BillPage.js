import React, { useState, useEffect } from "react";
import { useAtom } from 'jotai';
import { Button, Input, message, Modal } from 'antd';
import axios from 'axios'; // 임시 publicAxios로 변경해야함
import publicAxios from '../../../api/publicAxios'; // ✅ 주소 수정 axios -> authAxios
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'; // useSortable import 제거
import { billsAtom } from "../atom/atoms";
import '../css/billPage.css';
import DroppableBillBox from './DroppableBillBox';  // DroppableBillBox import

import { jwtDecode } from 'jwt-decode'; // ✅ JWT 디코딩을 위해 추가 설치 필요 (npm install jwt-decode)
import { authUserAtom } from '../../../auth/authAtoms';
import { fetchBillsAction } from '../actions/billAction';

import {selectedUserIdAtom} from "../../SorterPage/atoms/atoms"; // ✅ JWT 디코딩을 위해 추가 설치 필요 (npm install jwt-decode)
import { X, Plus, Minus } from "lucide-react";

const BillPage = () => {
  const [bills, setBills] = useAtom(billsAtom);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newBillName, setNewBillName] = useState('');
  const [editingBillId, setEditingBillId] = useState(null);
  const [editedBillName, setEditedBillName] = useState('');

  const [authUser] = useAtom(authUserAtom);
  const [, setFetchBills] = useAtom(fetchBillsAction);

  const [selectedUserId, setSelectedUserId] = useAtom(selectedUserIdAtom);

  /** ✅ JWT에서 userId 추출 */
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const decoded = jwtDecode(token); // { userId: 'test', sub: ..., iat: ..., exp: ... }
      return decoded.userId;
    } catch (err) {
      message.error('로그인 정보가 유효하지 않습니다.');
      return null;
    }
  };

  const user_id = selectedUserId; // ✅ 실제 로그인된 사용자 ID

  /** 💡 모든 Bill 목록 가져오기 */

  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedBillDetails, setSelectedBillDetails] = useState([]);
  const [selectedBillTitle, setSelectedBillTitle] = useState("");
  const [commissionModalVisible, setCommissionModalVisible] = useState(false);
  const [commissionAddModalVisible,setCommissionAddModalVisible] = useState(false);
  const [commissionName,setCommissionName] = useState("");
  const [commissionValue,setCommissionValue] = useState('');
  const [selectedBillId, setSelectedBillId] = useState(null);
  const [selectedBillForCommission, setSelectedBillForCommission] = useState(null);
  const [selectedCommissionIds, setSelectedCommissionIds] = useState([]);
  const fetchBills = () => {
    publicAxios.get(`/bills/getAllBills?user_id=${user_id}`) // ✅ 주소 수정
      .then(res => setBills(res.data))
      .catch(err => console.error('Bill 불러오기 실패', err));
  };

  useEffect(() => {
    const loadBills = async () => {
      if (!authUser?.userId) {
        message.warning('로그인이 필요합니다.');
        return;
      }
      try {
        await setFetchBills(authUser.userId);
      } catch (error) {
        console.error('Bill 불러오기 실패', error);
        message.error('Bill을 불러오는데 실패했습니다.');
      }
    };
    loadBills();
  }, [authUser, setFetchBills]);

  /** ✅ Bill 추가 처리 */
  const handleAddBill = async () => {
    if (!newBillName.trim()) {
      message.warning('Bill 이름을 입력해주세요.');
      return;
    }
    if (!authUser?.userId) {
      message.warning('로그인이 필요합니다.');
      return;
    }
    try {


      await publicAxios.post(`/bills/addBill`,{ // ✅ 주소 수정
        billName : newBillName,
        user_id  : user_id
      });
      // 전체 Bill 다시 불러오기
      await setFetchBills(authUser.userId);
      setNewBillName('');
      setIsModalVisible(false);
      message.success("Bill이 추가되었습니다!");
    } catch (error) {
      console.error("Bill 추가 실패", error);
      message.error("Bill 추가에 실패했습니다.");
    }

  };
  const handleDeleteBill = async (billId) => {
    try {
      await publicAxios.delete(`/bills/deleteBill`, { // ✅ 주소 수정
        params: { billId }
      });
      message.success("삭제 완료!");
      await setFetchBills(authUser.userId);
    } catch (error) {
      console.error('Bill 삭제 실패', error);
      message.error('Bill 삭제에 실패했습니다.');
    }
  };

  const handleUpdateBillName = async (billId) => {
    try {
      await publicAxios.put(`/bills/updateBillName`, {
        billId: billId,
        billName: editedBillName,
      });
      message.success("Bill 이름 수정 성공");
      setEditingBillId(null);
      setEditedBillName('');
      await setFetchBills(authUser.userId);
    } catch (error) {
      console.error('Bill 이름 업데이트 실패', error);
      message.error('Bill 이름 업데이트에 실패했습니다.');
    }
  };

  const handleIncrease = async (billId, elementsNameId) => {
    await publicAxios.put(`/bills/increaseCount`, null, {
      params: { billId, elementsNameId },
    });
    fetchBills();
  };

  const handleDecrease = async (billId, elementsNameId, currentCount) => {
    if (currentCount <= 1) {
      await publicAxios.delete(`/bills/deleteElement`, {
        params: { billId, elementsNameId },
      });
    } else {
      await publicAxios.put(`/bills/decreaseCount`, null, {
        params: { billId, elementsNameId },
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
            return Promise.resolve({ data: [] });
          }
          return publicAxios.get(
            `/bills/getElementsdata?elementsNameId=${id}`
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
  const handleAddCommission = async () => {
    try {
      await publicAxios.post(`/bills/addCommission`, {
        billId: selectedBillId, // 해당 bill의 ID
        commissionName: commissionName,
        commission: Number(commissionValue)
      });
      message.success('수수료 추가 완료!');
      setSelectedBillId('')
      setCommissionAddModalVisible(false);
      setCommissionName('');
      setCommissionValue('');
      fetchBills(); // 최신화
    } catch (err) {
      console.error('수수료 추가 실패', err);
      message.error('수수료 추가 실패');
    }
  };
  const handleDeleteSelectedCommissions = async () => {
    try {
      await publicAxios.delete('/bills/deleteSelectedCommissions', {
        data: {
          billId: selectedBillId,
          commissionIds: selectedCommissionIds,
        },
      });
      message.success("선택 수수료 삭제 완료!");
      setCommissionModalVisible(false);
      setSelectedCommissionIds([]);
      fetchBills();
    } catch (err) {
      console.error("수수료 삭제 실패", err);
      message.error("삭제 실패");
    }
  };

  return (

    <div className="bill-container">
      <div className="bill-add">
        <Button
          type="primary"
          className="add-bill-btn"
          onClick={() => setIsModalVisible(true)}
        >
          + Bill
        </Button>
      </div>

      <SortableContext
        items={bills.map(bill => bill.billId)} // bills의 ID로 SortableContext 구성
        strategy={rectSortingStrategy}
      >
        {bills.map((bill) => (
          <DroppableBillBox
            key={bill.billId}
            bill={bill}
            onDelete={handleDeleteBill}
            isEditing={editingBillId === bill.billId}
            onEditStart={(id, name) => {
              setEditingBillId(id);
              setEditedBillName(name);
            }}
            onEditSubmit={handleUpdateBillName}
            editedName={editedBillName}
            onEditNameChange={(e) => setEditedBillName(e.target.value)}
          />
        ))}
      </SortableContext>


      {bills.map((bill) => (
        <div
          key={bill.billId}
          className="bill-box"
          onDoubleClick={() => handleBillDoubleClick(bill)}
        >
          <X
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

          <div>
            <h4>📦 항목  {`(${bill.elements.length}개)`}</h4>
            <ul>
              {Array.isArray(bill.elements) &&
                bill.elements.map((el, idx) => (
                  <li key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} className="bill-element-map">
                    <span>
                      {el.elementsName} - {el.elementsPrice}원
                    </span>
                    <span className="count-controls">
                      <Minus
                        size={14}
                        className="count-minus"
                        onClick={() => handleDecrease(bill.billId, el.elementsNameId, el.elementCount)}
                        onDoubleClick={(e) => e.stopPropagation()}
                      />
                      {el.elementCount}
                      <Plus
                        size={14}
                        className="count-plus"
                        onClick={() => handleIncrease(bill.billId, el.elementsNameId)}
                        onDoubleClick={(e) => e.stopPropagation()}
                      />
                    </span>

                  </li>

                ))}
            </ul>
            <p>
              <strong>총 요소 금액:</strong> {bill.totalElementPrice}원
            </p>
          </div>

          <div>
            <div className="commission-header"
                 onDoubleClick={(e) => e.stopPropagation()}
                 onClick={(e)=>{
                   e.stopPropagation();
                   setSelectedBillId(bill.billId);
                   setSelectedBillForCommission(bill);
                   setCommissionModalVisible(true);
                 }}
            >🧾 수수료</div>
            <ul>
              {Array.isArray(bill.commissions) &&
                bill.commissions.map((c, idx) => (
                  <li key={idx} className="bill-commission-map">
                    {c.commissionName} - {c.commission}원
                  </li>
                ))}
            </ul>
            <p>
              <strong>총 수수료:</strong> {bill.totalCommission}원
            </p>
          </div>

          <div className="total-section">
            <span className="total-label">총합 :</span>
            <span className="total-amount">{bill.grandTotal}원</span>
          </div>
        </div>
      ))}

      <Modal
        title="새로운 Bill 추가"
        open={isModalVisible}
        onOk={handleAddBill}
        onCancel={() => setIsModalVisible(false)}
        okText="추가"
        cancelText="취소"
        closable={false}
      >
        <Input
          placeholder="Bill 이름을 입력하세요"
          value={newBillName}
          onChange={(e) => setNewBillName(e.target.value)}
        />
      </Modal>
      <Modal
        title={`${selectedBillTitle}의 세부 정보`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        closable={false}
        className="custom-detail-modal"
      >
        {selectedBillDetails.map((el, idx) => (
          <div key={idx} className="element-detail-box">
            <strong>{el.elementsName}</strong>
            <ul>
              {Array.isArray(el.details) && el.details.length > 0 ? (
                el.details.map((d, i) => (
                  <li key={i}>
                    {d?.keyName || "(키 없음)"} : {d?.valueName || "(값 없음)"}
                  </li>
                ))
              ) : (
                <li>자세한 정보가 없습니다</li>
              )}
            </ul>
          </div>
        ))}
      </Modal>
      <Modal
        title="수수료"
        open={commissionModalVisible}
        onCancel={() => {
          setCommissionModalVisible(false);
          setSelectedCommissionIds([]);
          setSelectedBillForCommission(null);
        }}
        closable={false}
        footer={null}
        className="commission-modal"
      >
        {selectedCommissionIds.length > 0 && (
          <Button
            danger
            onClick={handleDeleteSelectedCommissions}
            style={{ position: "absolute", top: 10, right: 10, zIndex: 1 }}
          >
            선택 삭제
          </Button>
        )}

        <div className="commission-card-container">
          {selectedBillForCommission?.commissions?.map((c) => {
            const id = c.billCommissionId; // 진짜 DB에 있는 고유 ID

            return (
              <div
                key={id}
                className={`commission-card ${selectedCommissionIds.includes(id) ? "selected" : ""}`}
                onClick={() => {
                  setSelectedCommissionIds((prev) =>
                    prev.includes(id)
                      ? prev.filter((v) => v !== id) // 선택 해제
                      : [...prev, id]               // 선택 추가
                  );
                }}
              >
                <strong>{c.commissionName}</strong>
                <br />
                {c.commission}원
              </div>
            );
          })}
        </div>


        {/* 추가 버튼 */}
        <Button
          className="commission-modal-add-btn"
          onClick={() => {
            setCommissionModalVisible(false);
            setCommissionAddModalVisible(true);
          }}
          style={{ marginTop: "16px" }}
        >
          <Plus /> 수수료 추가
        </Button>
      </Modal>

      <Modal
        title="수수료 추가"
        open={commissionAddModalVisible}
        onCancel={()=>setCommissionAddModalVisible(false)}
        onOk={() => {
          if (!commissionName || commissionValue === "") {
            message.warning("수수료 이름과 값을 입력해주세요");
            return;
          }
          handleAddCommission();
        }}
        okText="추가"
        closable={false}
      >
        <Input placeholder="수수료 이름" value={commissionName}  onChange={(e)=>setCommissionName(e.target.value)}></Input>
        <Input type="number" placeholder="값" value={commissionValue} onChange={(e)=>setCommissionValue(e.target.value)}></Input>
      </Modal>
    </div>
  );
};

export default BillPage;
