import React, { ReactNode, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
// components
import { DownOutlined } from "@ant-design/icons";
// types
import { TestDataItem } from "../../App";
// styles
import "./style.scss";
import { CSS } from "@dnd-kit/utilities";
import dragIcon from "../../assets/menu.svg";

type IPropsType = {
  id: number | string;
  data: TestDataItem;
  inferiorList?: ReactNode;
  isSortable?: boolean;
  initialCollapse: boolean;
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
        <div className="collapseBtn">
          {Array.isArray(data?.children) && data?.children?.length > 0 && (
            <DownOutlined
              rotate={isCollapse ? 180 : 0}
              onClick={() => {
                setIsCollapse(!isCollapse);
              }}
            />
          )}
        </div>
        <div className="dragBtn">
          {isSortable && (
            <img
              className="dragImg"
              src={dragIcon}
              {...attributes}
              {...listeners}
              alt="dragHandler"
            />
          )}
        </div>
        <>{render({ ...data })}</>
      </div>
      {inferiorList && isCollapse && (
        <div style={{ marginLeft: 25 }}>{inferiorList}</div>
      )}
    </div>
  );
};

export default SortableLeaf;
