import axios from 'axios';
import {atom, useAtom} from 'jotai';
import { message } from 'antd';
import {wholesaleCommissionAtom, wholesaleLinksAtom} from "../../WholesalePage/atoms/atoms";
import {billsAtom} from "../atom/atoms";
import {authUserAtom} from "../../../auth/authAtoms";
import {selectedUserWholesaleLinkIdAtom} from "../../SorterPage/atoms/atoms";

export const fetchBillsAction = atom(null,async (get,set)=>{
  const wholesaleLink = get(selectedUserWholesaleLinkIdAtom);
  const user = get(authUserAtom);
  const userId = user.userId;
  try{
    console.log('bill조회')
    console.log(wholesaleLink)
    axios.get(`http://localhost:8080/api/bills/getAllBills?userId=${userId}&wholesaleLinkId=${wholesaleLink}`) // ✅ 주소 수정
      .then(res => set(billsAtom,res.data))
      .catch(err => console.error('Bill 불러오기 실패', err));
  }
  catch (e) {
    console.log(e)
  }
});
export const fetchWholesaleCommissionAction = atom(null, async (get, set) => {
  const wholesaleLinkId = get(selectedUserWholesaleLinkIdAtom);
  if (!wholesaleLinkId) return; // 유효하지 않은 ID 처리
  try {
    const res = await axios.get(`/api/wholesale/getWholesaleCommission?wholesaleLinkId=${wholesaleLinkId}`);
    set(wholesaleCommissionAtom, res.data);
  } catch (err) {
    console.log('commission 불러오기 실패', err);
  }
});

