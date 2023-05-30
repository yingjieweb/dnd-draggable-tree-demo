import { TestDataArray } from "../../App";
import { arrayMoveImmutable } from "array-move";

export const getInterchangedList = (
  list: TestDataArray,
  activeId: string,
  overId: string
) => {
  const idList = list.map((item) => item.id);
  const oldIndex = idList.indexOf(+activeId);
  const newIndex = idList.indexOf(+overId);
  const newList = arrayMoveImmutable(list, oldIndex, newIndex);
  return newList;
};
