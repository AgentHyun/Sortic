import React, { useState, useEffect } from "react";
import { useAtom } from 'jotai';
import { Button, Input, message, Modal } from 'antd';
import axios from 'axios'; // 임시 apiAxios로 변경해야함
import apiAxios from '../../../Api/apiAxios'; // ✅ 주소 수정 axios -> authAxios
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'; // useSortable import 제거
import {
  billsAtom, commissionAddModalVisibleAtom, commissionModalVisibleAtom, commissionNameAtom, commissionValueAtom,
  detailModalVisibleAtom,
  isModalVisibleAtom,
  selectedBillDetailsAtom, selectedBillForCommissionAtom, selectedBillIdAtom,
  selectedBillTitleAtom, selectedCommissionIdsAtom
} from "../atom/atoms";
import '../css/billPage.css';
import DroppableBillBox from './DroppableBillBox';  // DroppableBillBox import

import { X, Plus, Minus } from "lucide-react";
import {authUserAtom} from "../../../auth/authAtoms";
import {wholesaleLinksAtom} from "../../WholesalePage/atoms/atoms";
import {fetchBillsAction} from "../actions/billActions";
import {fetchWholesaleLinksAction} from "../../WholesalePage/action/wholesaleAction";
import {selectedUserWholesaleLinkIdAtom} from "../../SorterPage/atoms/atoms";



const BillPage = () => {
  const [bills, setBills] = useAtom(billsAtom);
  const [isModalVisible, setIsModalVisible] = useAtom(isModalVisibleAtom);
  const [newBillName, setNewBillName] = useState('');
  const [user,] = useAtom(authUserAtom)
  const userId = user.userId
  /** 💡 모든 Bill 목록 가져오기 */
  const [detailModalVisible, setDetailModalVisible] = useAtom(detailModalVisibleAtom);
  const [selectedBillDetails, setSelectedBillDetails] = useAtom(selectedBillDetailsAtom);
  const [selectedBillTitle, setSelectedBillTitle] = useAtom(selectedBillTitleAtom);
  const [commissionModalVisible, setCommissionModalVisible] = useAtom(commissionModalVisibleAtom);
  const [commissionAddModalVisible, setCommissionAddModalVisible] = useAtom(commissionAddModalVisibleAtom);
  const [commissionName, setCommissionName] = useAtom(commissionNameAtom);
  const [commissionValue, setCommissionValue] = useAtom(commissionValueAtom);
  const [selectedBillId, setSelectedBillId] = useAtom(selectedBillIdAtom);
  const [selectedBillForCommission, setSelectedBillForCommission] = useAtom(selectedBillForCommissionAtom);
  const [selectedCommissionIds, setSelectedCommissionIds] = useAtom(selectedCommissionIdsAtom);
  const [wholesaleLink] = useAtom(selectedUserWholesaleLinkIdAtom);
  const [,fetchBills] = useAtom(fetchBillsAction);
  useEffect(() => {
    fetchBills();
  }, []);

  const handleAddBill = async () => {
    try {
      console.log("🔥 wholesaleLink 상태:", wholesaleLink);
      await axios.post(`/api/bills/addBill`, {
        billName: newBillName,
        userId: userId,
        wholesaleLinkId: wholesaleLink,
      });

      fetchBills();
      setNewBillName('');
      setIsModalVisible(false);
      message.success("Bill이 추가되었습니다!");
    } catch (error) {
      console.error("Bill 추가 실패", error);
    }
  };


    const handleAddCommission = async () => {
      try {
        await axios.post(`/api/bills/addCommission`, {
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
        await axios.delete('/api/bills/deleteSelectedCommissions', {
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

            className="sorter-effect-btn"
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
            />
          ))}
        </SortableContext>

        <Modal
          title="새로운 Bill 추가"
          open={isModalVisible}
          onOk={handleAddBill}
          onCancel={() => setIsModalVisible(false)}
          okText="추가"
          cancelText="취소"
          closable={false}
          okButtonProps={{
            className: "category-ok-button",
            style: {
              backgroundColor: '#929e6e', // 원하는 색상으로 변경
              border : 'none',
            }
          }}
          cancelButtonProps={{
            className: "custom-cancel-button", // ✅ 클래스 이름 부여
            style: {
              backgroundColor: '#ffffff',         // ✅ 예시 색상
              color: '#333',
              border: '1px solid #ccc',
            }}}
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
