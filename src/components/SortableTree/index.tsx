import React, { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
// components
import SortableLeaf from "../SortableLeaf";
import { message } from "antd";
// utils
import { find } from "lodash";
import { getInterchangedList } from "./utils";
// types
import { TestDataArray, TestDataItem } from "../../App";

type IPropsType = {
  data: TestDataArray;
  isSortable: boolean;
  render: (arg0: TestDataItem) => void;
  sortRole: (arg0: number, arg1: number[]) => void;
};

const SortableTree: React.FC<IPropsType> = (props) => {
  // props
  const { data, isSortable, render, sortRole } = props;

  // states
  const [list, setList] = useState<TestDataArray>([]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const [activeId, setActiveId] = useState<number | null>(null);
  const activeData = find(list, (item) => item.id === activeId) as TestDataItem;
  const activeStyle = {
    padding: "0 24px",
    margin: "0 -24px",
    background: "rgba(256,256,256,0.9)",
    boxShadow: "0 0 10px #aaa",
    zIndex: 9,
  };

  // computed
  const ifHasCollapseBtn = useMemo(() => {
    if (list.length) {
      const res = list.filter((item: TestDataItem) => item.children.length);
      return res.length > 0;
    }
    return false;
  }, [list]);

  // watch
  useEffect(() => {
    if (data) {
      setList(data);
    }
  }, [data]);

  // methods
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(Number(active.id));
  };
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over?.id && active.id !== over.id) {
      const newList = getInterchangedList(
        list,
        String(active.id),
        String(over.id)
      );
      setList(newList);
      sortRole(
        newList[0].parentId,
        newList.map((item: TestDataItem) => item.id)
      );
      message.success("排序成功");
    }
  };

  // template
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={list} strategy={verticalListSortingStrategy}>
        {list?.map((item: TestDataItem) => (
          <SortableLeaf
            key={item.id}
            id={item.id}
            data={item}
            isSortable={isSortable}
            initialCollapse
            ifHasCollapseBtn={ifHasCollapseBtn}
            render={render}
            inferiorList={
              item.children ? (
                <SortableTree
                  data={item.children}
                  isSortable={isSortable}
                  render={render}
                  sortRole={sortRole}
                ></SortableTree>
              ) : null
            }
          />
        ))}
      </SortableContext>
      <DragOverlay>
        {activeId ? (
          <SortableLeaf
            id={activeId}
            data={activeData}
            initialCollapse={false}
            activeStyle={activeStyle}
            render={render}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default SortableTree;
