import React from "react";
import { Select } from "antd";
import { ForkOutlined } from '@ant-design/icons';
import "antd/dist/antd.css";

const SelectOption = Select.Option;
const LayoutSelector = props => {
  const { apis, value, onChange } = props;
  // 包裹在graphin内部的组件，将获得graphin提供的额外props
  const { layouts } = apis.getInfo();
  return (
    <div style={{ position: "absolute", top: 10, left: 10 }}>
      <Select style={{ width: "120px" }} value={value} onChange={onChange}>
        {layouts.map(item => {
          const { name, disabled, desc } = item;
          return (
            <SelectOption key={name} value={name} disabled={disabled}>
              <ForkOutlined/> {desc}
            </SelectOption>
          );
        })}
      </Select>
    </div>
  );
};
export default LayoutSelector;
