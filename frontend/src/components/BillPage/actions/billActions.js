import axios from 'axios';
import {atom, useAtom} from 'jotai';
import { message } from 'antd';
import {wholesaleLinksAtom} from "../../WholesalePage/atoms/atoms";
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
