import React, { useEffect } from "react";
// components
import { Button, Drawer, Form, Input, message } from "antd";
// types
import { TestDataItem } from "../../App";
// styles
import "./style.css";

type IPropsType = {
  curRole: TestDataItem;
  type: 1 | 2;
  visible: boolean;
  setVisible: (arg0: boolean) => void;
  addRole: (arg0: number, arg1: string) => void;
  editRole: (arg0: number, arg1: string) => void;
};

const AddDrawer: React.FC<IPropsType> = (props) => {
  // props
  const { curRole, type, visible, setVisible, addRole, editRole } = props;

  // states
  const [form] = Form.useForm<{ name: string }>();

  // watch
  useEffect(() => {
    if (!visible) return;
    form.resetFields();
    if (type === 2) {
      form.setFieldsValue({ name: curRole.name });
    }
  }, [visible, type, curRole]);

  // template
  return (
    <Drawer
      title={type === 1 ? "新增角色" : "编辑角色"}
      closable={false}
      open={visible}
      getContainer={false}
      onClose={() => {
        setVisible(false);
      }}
      footer={
        <div className="footer-btns">
          <Button onClick={() => setVisible(false)}>取消</Button>
          <Button
            type="primary"
            onClick={() => {
              form
                .validateFields()
                .then(() => {
                  const curName = form.getFieldValue("name");
                  if (type === 1) {
                    addRole(curRole.id, curName);
                    message.success("添加成功");
                  } else {
                    editRole(curRole.id, curName);
                    message.success("编辑成功");
                  }
                  setVisible(false);
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            保存
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        colon={false}
        autoComplete="off"
        labelCol={{
          style: {
            marginRight: 10,
          },
        }}
      >
        <Form.Item
          label="name"
          name="name"
          rules={[{ required: true, message: "Please input your rolename!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddDrawer;
