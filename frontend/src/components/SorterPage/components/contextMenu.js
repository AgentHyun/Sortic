import { useAtom } from "jotai";
import { contextMenuAtom, isExternalUserAtom} from "../atoms/atoms"
import {closeContextMenuAction} from "../actions/elementAction"
import { useEffect } from "react";
import { Trash2, Inspect } from 'lucide-react';
import { openElementDetailAction, closeElementDetailAction } from "../actions/elementsDataAction";
import {handleDeleteElementAction} from "../actions/elementAction"
import "../css/SorterPage/ContextMenu.css";
const ContextMenu = () => {
    const [contextMenu] = useAtom(contextMenuAtom);
    const [, closeContextMenu] = useAtom(closeContextMenuAction);
    const [, deleteElement] = useAtom(handleDeleteElementAction);
    const [, openModal] = useAtom(openElementDetailAction);
    const [isExternalUser] = useAtom(isExternalUserAtom);
    useEffect(() => {
        const handleClickOutside = () => {
            closeContextMenu();
        };

        const handleEsc = (e) => {
            if (e.key === "Escape") closeContextMenu();
        };

        window.addEventListener("click", handleClickOutside);
        window.addEventListener("keydown", handleEsc);

        return () => {
            window.removeEventListener("click", handleClickOutside);
            window.removeEventListener("keydown", handleEsc);
        };
    }, [closeContextMenu]);

    if (!contextMenu.visible) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: contextMenu.y,
                left: contextMenu.x,
                border: "1px solid #ddd",
                borderRadius: 4,
                padding: 8,
                zIndex: 1000,
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()} // 내부 클릭시 안 닫힘
            className='context-menu-section'
        >
            <div
                onClick={() => {
                    openModal(contextMenu.target);
                    closeContextMenu();
                }}
                className = "detail-section"
                style={{ padding: 4, cursor: "pointer" }}
            >
                상세 정보 <Inspect size={15} color="black" />
            </div>
          {isExternalUser && (
            <div className = 'context-delete'
                onClick={() => {
                    deleteElement();
                    closeContextMenu();
                }}
                style={{ padding: 4, cursor: "pointer" }}
            >
                삭제  <Trash2 size={15} color="red" />
            </div>
            )}
        </div>
    );
};

export default ContextMenu;
