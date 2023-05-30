import React, { useState } from "react";
// components
import { Button, Divider, Modal, message } from "antd";
import SortableTree from "./components/SortableTree";
import AddDrawer from "./components/AddDrawer";
import { ExclamationCircleFilled } from "@ant-design/icons";
// constants
import TEST_DATA from "./db/data.json";
// styles
import "./APP.css";

// types
export type TestDataItem = {
  id: number;
  name: string;
  parentId: number;
  children: TestDataItem[];
};
export type TestDataArray = TestDataItem[];

const App: React.FC = () => {
  // states
  const [roleTree, setRoleTree] = useState<TestDataArray>(TEST_DATA);
  const [curRole, setCurRole] = useState<TestDataItem>({
    id: -1,
    name: "",
    parentId: -1,
    children: [],
  });
  const [operateType, setOperateType] = useState<1 | 2>(1);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // methods
  const render = (data: TestDataItem) => {
    const { id, name } = data;
    return (
      <div className="sortableContent">
        <span className="name">{name}</span>
        <span className="id">ID：{id}</span>
        <div className="btns">
          <Button
            type="link"
            onClick={() => {
              setCurRole(data);
              setOperateType(1);
              setDrawerVisible(true);
            }}
          >
            新增角色
          </Button>
          <Divider type="vertical"></Divider>
          <Button
            type="link"
            onClick={() => {
              setCurRole(data);
              setOperateType(2);
              setDrawerVisible(true);
            }}
          >
            编辑
          </Button>
          <Divider type="vertical"></Divider>
          <Button
            type="link"
            onClick={() => {
              setCurRole(data);
              setModalVisible(true);
            }}
          >
            删除
          </Button>
        </div>
      </div>
    );
  };
  const addRole = (targetId: number, name: string) => {
    const traverse = (
      roleTree: TestDataItem,
      targetId: number,
      name: string
    ): TestDataItem => {
      if (!roleTree) return roleTree;
      if (roleTree.id === targetId) {
        roleTree.children.push({
          id: targetId * 10 + roleTree.children.length + 1,
          name,
          parentId: targetId,
          children: [],
        });
        return roleTree;
      }
      if (roleTree.children && roleTree.children.length) {
        roleTree.children = roleTree.children.map((item) => {
          return traverse(item, targetId, name);
        });
      }
      return roleTree;
    };
    setRoleTree((val: TestDataArray) => {
      return val.map((item) => {
        return traverse(item, targetId, name);
      });
    });
  };
  const editRole = (targetId: number, name: string) => {
    const traverse = (
      roleTree: TestDataItem,
      targetId: number,
      name: string
    ): TestDataItem => {
      if (!roleTree) return roleTree;
      if (roleTree.id === targetId) {
        roleTree.name = name;
        return roleTree;
      }
      if (roleTree.children && roleTree.children.length) {
        roleTree.children = roleTree.children.map((item) => {
          return traverse(item, targetId, name);
        });
      }
      return roleTree;
    };
    setRoleTree((val: TestDataArray) => {
      return val.map((item) => {
        return traverse(item, targetId, name);
      });
    });
  };
  const deleteRole = (targetParentId: number, targetId: number) => {
    const traverse = (
      roleTree: TestDataItem,
      targetId: number
    ): TestDataItem => {
      if (!roleTree) return roleTree;
      if (roleTree.id === targetParentId) {
        roleTree.children = roleTree.children.filter(
          (item) => item.id !== targetId
        );
      }
      if (roleTree.children && roleTree.children.length) {
        roleTree.children = roleTree.children.map((item) => {
          return traverse(item, targetId);
        });
      }
      return roleTree;
    };
    setRoleTree((val: TestDataArray) => {
      return val.map((item) => {
        return traverse(item, targetId);
      });
    });
  };
  const sortRole = (targetParentId: number, rankList: number[]) => {
    const traverse = (
      roleTree: TestDataItem,
      rankList: number[]
    ): TestDataItem => {
      if (!roleTree) return roleTree;
      if (roleTree.id === targetParentId) {
        roleTree.children = rankList.map((item) => {
          return roleTree.children.filter((it) => it.id === item)[0];
        });
      }
      if (roleTree.children && roleTree.children.length) {
        roleTree.children = roleTree.children.map((item) => {
          return traverse(item, rankList);
        });
      }
      return roleTree;
    };
    setRoleTree((val: TestDataArray) => {
      return val.map((item) => {
        return traverse(item, rankList);
      });
    });
  };

  // template
  return (
    <>
      <SortableTree
        data={roleTree}
        isSortable={true}
        render={render}
        sortRole={sortRole}
      />
      <AddDrawer
        curRole={curRole}
        type={operateType}
        visible={drawerVisible}
        setVisible={setDrawerVisible}
        addRole={addRole}
        editRole={editRole}
      />
      <Modal
        title="提示"
        okText="确定"
        cancelText="取消"
        open={modalVisible}
        getContainer={false}
        centered
        onOk={() => {
          deleteRole(curRole.parentId, curRole.id);
          message.success("操作成功");
          setModalVisible(false);
        }}
        onCancel={() => {
          setModalVisible(false);
        }}
      >
        <ExclamationCircleFilled style={{ color: "#FAAD14" }} />
        <span style={{ marginLeft: 8, color: "rgba(0,0,0,.65)" }}>
          是否确认删除该角色及其所有子角色?
        </span>
      </Modal>
    </>
  );
};

export default App;
