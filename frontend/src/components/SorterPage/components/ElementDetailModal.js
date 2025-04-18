import { useAtom, useSetAtom } from "jotai";
import { Modal, Divider, Input, Button } from "antd";
import { SquarePen, X, Plus } from "lucide-react";  // 아이콘 변경
import { useState, useEffect } from "react";

import { RotateCcw } from "lucide-react"
import {
    elementDetailModalAtom,
    elementDetailDataAtom,
    elementAttributesAtom,
    isEditingAtom,
    attributeModalVisibleAtom,
    newElementNameAtom,
    newElementPriceAtom,
    currentElementNameAtom,
    editingElementIndexAtom,
    tempValueAtom,
    editingElementIdAtom,
    elementsDataAtom
} from "../atoms/atoms";
import {handleElementNameSaveAction, handleElementPriceSaveAction} from "../actions/elementAction";
import { closeElementDetailAction, handleKeyNameSaveAction, handleValueNameSaveAction } from "../actions/elementsDataAction";
import "../css/SorterPage/ElementDetailModal.css";

const ElementDetailModal = () => {
    const [open, setOpen] = useAtom(elementDetailModalAtom);
    const [data, setData] = useAtom(elementDetailDataAtom);
    const [attributes, setAttributes] = useAtom(elementAttributesAtom);
    const [isEditing, setIsEditing] = useAtom(isEditingAtom);
    const closeElementDetail = useSetAtom(closeElementDetailAction);
    const [attributeModalVisible, setAttributeModalVisible] = useAtom(attributeModalVisibleAtom);
    const [editingField, setEditingField] = useState(null);

    const [newElementName, setNewElementName] = useAtom(newElementNameAtom);
    const [newElementPrice, setNewElementPrice] = useAtom(newElementPriceAtom);
    const [handleElementNameSave, setHandleElementNameSave] = useAtom(handleElementNameSaveAction);
    const [handleELmentPriceSave, setHandleElementPriceSave] = useAtom(handleElementPriceSaveAction);
    const [editingElementIndex, seteditingElementIndex] = useAtom(editingElementIndexAtom);
    const [currentElementName, setCurrentElementName] = useAtom(currentElementNameAtom);
    const [tempValue, setTempValue] = useAtom(tempValueAtom);
    const [editingElementId, setEditingElementId] = useAtom(editingElementIdAtom);
    const [elementsData, setElementsData] = useAtom(elementsDataAtom);
    const [, setHandleKeyNameSave] = useAtom(handleKeyNameSaveAction);
    const [, setHandleValueNameSave] = useAtom(handleValueNameSaveAction);

    const handleSaveField = () => {
        if (editingField === "name") {
            setData({ ...data, elements_name: tempValue });
        } else if (editingField === "price") {
            setData({ ...data, elements_price: Number(tempValue) });
        } else if (editingField?.startsWith("key-")) {
            const idx = Number(editingField.split("-")[1]);
            const newAttr = [...attributes];
            newAttr[idx].key_name = tempValue;
            setAttributes(newAttr);
        } else if (editingField?.startsWith("value-")) {
            const idx = Number(editingField.split("-")[1]);
            const newAttr = [...attributes];
            newAttr[idx].value_name = tempValue;
            setAttributes(newAttr);
        }
        setEditingField(null);
    };


    const handleCompleteEdit = () => {
        handleSaveField();
        setOpen(false);
        setIsEditing(false);
    };

    const handleClose = () => {
        setIsEditing(false);
        setEditingField(null);
        closeElementDetail();
    };
    const handleElementSaveName = () => {
        setHandleElementNameSave(); // 서버 반영
        setData({ ...data, elements_name: newElementName }); // 👉 바로 UI에 반영
    };

    const handleElementSavePrice = () => {
        setHandleElementPriceSave(); // 서버 반영
        setData({ ...data, elements_price: Number(newElementPrice) }); // 👉 바로 UI에 반영
    };


  useEffect(() => {

    if (data && data.elements_name && data.elements_price !== undefined) {
      setNewElementName(data.elements_name);
      setNewElementPrice(data.elements_price);

    }
  }, [data]);


    return (
        <Modal
            title={null}
            open={open}
            onCancel={handleClose}
            footer={null}
            centered
            className="detail-modal"
        >
            {data ? (
                <div className="detail-container">

                   <div className="detail-btn-section">
                    {/* 편집 모드 토글 버튼 */}
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        style={{ background: "none", border: "none", cursor: "pointer" }}
                        className="Element-Detail-Modal-edit-btn"
                    >
                        {isEditing ? <RotateCcw size={35} color="#f5222d" /> : <SquarePen size={35} />}
                    </button>

                    <button
                        onClick={() => {
                            setAttributeModalVisible(true);
                            setOpen(false); // 모달 닫기
                        }}
                            style={{ background: "none", border: "none", cursor: "pointer" }}
                            className="Element-Detail-Modal-add-btn"
                        >
                            <Plus size={45} />
                    </button>

                   </div>

                    <div className="detail-header-section">
                        <img
                            src={data?.elements_img_url || process.env.PUBLIC_URL + "/default-img.png"}
                            alt="element"
                            className="detail-img"
                        />

                        <div className="detail-header">
                            <div className="detail-top">
                                {editingField === "name" ? (
                                    <input

                                        size="small"
                                        value={newElementName}
                                        onChange={(e) => setNewElementName(e.target.value)}
                                        onBlur={
                                            handleElementSaveName}
                                        className = "custom-input-header-title"
                                        autoFocus
                                    />
                                ) : (
                                    <div
                                        className="detail-title"
                                        onClick={() => {
                                            if (isEditing) {
                                                setEditingField("name");
                                                seteditingElementIndex(data.elements_name_id);
                                            }
                                        }}

                                    >
                                        {newElementName}
                                    </div>
                                )}
                            </div>

                            {editingField === "price" ? (

                                <input
                                    size="small"
                                    value={newElementPrice}
                                    onChange={(e) => setNewElementPrice(e.target.value)}
                                    onBlur={handleElementSavePrice}
                                    className = "custom-input-header-price"
                                    autoFocus
                                />

                            ) : (
                                <div
                                    className="detail-price"
                                    onClick={() => {
                                        if (isEditing) {
                                            setEditingField("price");

                                            seteditingElementIndex(data.elements_name_id);
                                        }
                                    }}
                                >
                                    {newElementPrice}원
                                </div>
                            )}
                        </div>
                    </div>

                    <Divider className="detail-divider" />

                    <div className="detail-attributes">
                        {attributes.length ? (
                            attributes.map((attr, idx) => (
                                <div className="detail-attribute" key={idx}>
                                    {editingField === `key-${idx}` ? (
                                        <input
                                            value={tempValue}
                                            onChange={(e) => setTempValue(e.target.value)}
                                            onBlur={() => {
                                                const value = tempValue;
                                                setTimeout(() => {
                                                    setHandleKeyNameSave({ id: attr.elements_id, value });
                                                    const updated = [...attributes];
                                                    updated[idx].key_name = value;
                                                    setAttributes(updated); // 👉 UI에 바로 반영
                                                    setEditingField(null);
                                                }, 0);
                                            }}


                                            className="custom-input-key"
                                            autoFocus
                                        />
                                    ) : (
                                        <div
                                            className="attribute-key"
                                            onClick={() => {
                                                if (isEditing) {
                                                    setEditingField(`key-${idx}`);
                                                    setTempValue(attr.key_name); // ⭐
                                                }
                                            }}
                                        >
                                            {attr.key_name}
                                        </div>
                                    )}

                                    {editingField === `value-${idx}` ? (
                                        <input
                                            value={tempValue}
                                            onChange={(e) => setTempValue(e.target.value)}
                                            onBlur={() => {
                                                const value = tempValue;
                                                setTimeout(() => {
                                                    setHandleValueNameSave({ id: attr.elements_id, value });
                                                    const updated = [...attributes];
                                                    updated[idx].value_name = value;
                                                    setAttributes(updated); // 👉 UI에 바로 반영
                                                    setEditingField(null);
                                                }, 0);
                                            }}


                                            className="custom-input-value"
                                            autoFocus
                                        />
                                    ) : (
                                        <div
                                            className="attribute-value"
                                            onClick={() => {
                                                if (isEditing) {
                                                    setEditingField(`value-${idx}`);
                                                    setTempValue(attr.value_name); // ⭐
                                                }
                                            }}
                                        >
                                            {attr.value_name}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="detail-empty">속성 없음</div>
                        )}
                    </div>


                    {/* 완료 버튼 (하단) */}
                    {isEditing && (
                        <Button
                            type="default"
                            block
                            className="element-detail-complete-btn"
                            onClick={handleCompleteEdit}
                        >
                            완료
                        </Button>

                    )}
                </div>
            ) : (
                <div className="detail-empty">데이터가 없습니다.</div>
            )}
        </Modal>

    );
};

export default ElementDetailModal;
