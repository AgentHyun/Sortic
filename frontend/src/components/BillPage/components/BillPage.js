import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { Button, Input, message, Modal } from "antd";
import axios from "axios";
import "../css/billPage.css";
import { billsAtom } from "../atom/atoms";
import { X, Plus, Minus } from "lucide-react";

const BillPage = () => {
  const [bills, setBills] = useAtom(billsAtom);
  const userId = "user123";
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newBillName, setNewBillName] = useState("");
  const [editingBillId, setEditingBillId] = useState(false);
  const [editedBillName, setEditedBillName] = useState("");
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedBillDetails, setSelectedBillDetails] = useState([]);
  const [selectedBillTitle, setSelectedBillTitle] = useState("");
  const [commissionModalVisible, setCommissionModalVisible] = useState(false);
  const [commissionAddModalVisible,setCommissionAddModalVisible] = useState(false);
  const [commissionName,setCommissionName] = useState("");
  const [commissionValue,setCommissionValue] = useState(0);
  const [selectedBillId, setSelectedBillId] = useState(null);

  const fetchBills = () => {
    axios
      .get(`http://localhost:8080/api/bills/getAllBills?userId=${userId}`)
      .then((res) => setBills(res.data))
      .catch((err) => console.error("Bill 불러오기 실패", err));
  };

  useEffect(() => {
    fetchBills();
  }, [userId]);

  const handleAddBill = async () => {
    try {
      await axios.post(`http://localhost:8080/api/bills/addBill`, {
        billName: newBillName,
        userId: userId,
      });
      fetchBills();
      setNewBillName("");
      setIsModalVisible(false);
      message.success("Bill이 추가되었습니다!");
    } catch (error) {
      console.error("Bill 추가 실패");
    }
  };

  const handleDeleteBill = async (billId) => {
    try {
      await axios.delete(`http://localhost:8080/api/bills/deleteBill`, {
        params: { billId },
      });
      message.success("삭제 완료!");
      fetchBills();
    } catch (err) {
      message.error("삭제 실패");
    }
  };

  const handleUpdateBillName = async (billId) => {
    try {
      await axios.put(`http://localhost:8080/api/bills/updateBillName`, {
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
    await axios.put(`http://localhost:8080/api/bills/increaseCount`, null, {
      params: { billId, elementsNameId },
    });
    fetchBills();
  };

  const handleDecrease = async (billId, elementsNameId, currentCount) => {
    if (currentCount <= 1) {
      await axios.delete(`http://localhost:8080/api/bills/deleteElement`, {
        params: { billId, elementsNameId },
      });
    } else {
      await axios.put(`http://localhost:8080/api/bills/decreaseCount`, null, {
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
          return axios.get(
            `http://localhost:8080/api/bills/getElementsdata?elementsNameId=${id}`
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
      await axios.post(`http://localhost:8080/api/bills/addCommission`, {
        billId: selectedBillId, // 해당 bill의 ID
        commissionName: commissionName,
        commission: Number(commissionValue)
      });
      message.success('수수료 추가 완료!');
      setCommissionAddModalVisible(false);
      setCommissionName('');
      setCommissionValue('');
      fetchBills(); // 최신화
    } catch (err) {
      console.error('수수료 추가 실패', err);
      message.error('수수료 추가 실패');
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
                   setCommissionModalVisible(true);

                 }}
            >🧾 수수료</div>
            <ul>
              {Array.isArray(bill.commissions) &&
                bill.commissions.map((c, idx) => (
                  <li key={idx}>
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
        onCancel={() => setCommissionModalVisible(false)}
        footer={null}
        className="commission-modal"
      >
        <Button className="commission-modal-add-btn"
          onClick={()=>{
            setCommissionModalVisible(false);
            setCommissionAddModalVisible(true);
          }}
        ><Plus/></Button>

      </Modal>
      <Modal
        title="수수료 추가"
        open={commissionAddModalVisible}
        onCancel={()=>setCommissionAddModalVisible(false)}
        onOk={handleAddCommission}
        okText="추가"
      >
        <Input placeholder="수수료 이름" onChange={(e)=>setCommissionName(e.target.value)}></Input>
        <Input type="number" placeholder="값" onChange={(e)=>setCommissionValue(e.target.value)}></Input>

      </Modal>
    </div>
  );
};

export default BillPage;
