import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";
import React from "react";
import clasess from "./loader.module.scss";

export default function Loader() {
  return (
    <>
      <Spin
        className={clasess.loader}
        indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
      />
    </>
  );
}
