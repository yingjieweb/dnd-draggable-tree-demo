import React, { ReactNode, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
// components
import { DownOutlined, UpOutlined } from "@ant-design/icons";
// types
import { TestDataItem } from "../../App";
// styles
import "./style.css";
import { CSS } from "@dnd-kit/utilities";
import dragIcon from "../../assets/menu.svg";

type IPropsType = {
  id: number | string;
  data: TestDataItem;
  inferiorList?: ReactNode;
  isSortable?: boolean;
  initialCollapse: boolean;
  ifHasCollapseBtn?: boolean;
  activeStyle?: Record<string, string | number>;
  render: (arg0: TestDataItem) => void;
};

const SortableLeaf: React.FC<IPropsType> = (props) => {
  // props
  const {
    id,
    data,
    inferiorList,
    isSortable,
    initialCollapse,
    ifHasCollapseBtn,
    render,
    activeStyle,
  } = props;

  // states
  const [isCollapse, setIsCollapse] = useState(initialCollapse);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id as string,
    data,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...activeStyle, // 拖拽时跟随鼠标一起移动的样式
    ...(isDragging && { opacity: 0, height: "60px" }), // 拖拽目标本身在拖拽时的样式
  };

  // template
  return (
    <div ref={setNodeRef} style={style}>
      <div className="header">
        {Array.isArray(data?.children) && data?.children?.length > 0 ? (
          <span
            style={{
              marginRight: 10,
              cursor: "pointer",
            }}
          >
            {!isCollapse && (
              <DownOutlined
                onClick={() => {
                  setIsCollapse(!isCollapse);
                }}
              />
            )}
            {isCollapse && (
              <UpOutlined
                onClick={() => {
                  setIsCollapse(!isCollapse);
                }}
              />
            )}
          </span>
        ) : (
          <span
            style={{
              width: ifHasCollapseBtn ? "14px" : 0,
              marginRight: 10,
            }}
          ></span>
        )}
        <>
          {isSortable && (
            <img
              className="dragger"
              src={dragIcon}
              {...attributes}
              {...listeners}
              alt="dragger"
            />
          )}
          {render({ ...data })}
        </>
      </div>
      {inferiorList && isCollapse && (
        <div style={{ marginLeft: 25 }}>{inferiorList}</div>
      )}
    </div>
  );
};

export default SortableLeaf;
