import axios from 'axios';
import {atom, useAtom} from 'jotai';
import { message } from 'antd';
import {wholesaleLinksAtom} from "../../WholesalePage/atoms/atoms";
import {billsAtom} from "../atom/atoms";
import {authUserAtom} from "../../../auth/authAtoms";

export const fetchBillsAction = atom(null,async (get,set)=>{
  const wholesaleLink = get(wholesaleLinksAtom);
  const user = get(authUserAtom);
  const userId = user.userId;
  for (const link of wholesaleLink) {
    console.log(link.wholesaleLinkId)
    axios.get(`http://localhost:8080/api/bills/getAllBills?userId=${userId}&wholesaleLinkId=${link.wholesaleLinkId}`) // ✅ 주소 수정
      .then(res => set(billsAtom,res.data))
      .catch(err => console.error('Bill 불러오기 실패', err));
  }
});
