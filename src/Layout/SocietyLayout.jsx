import Navbar from "../Components/Navbar";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
const { Header, Sider, Content, Footer } = Layout;

import { useState } from "react";

function SocietyLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <Sider
        className="md:block hidden"
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
      </Sider>
      <Header style={{ background: "#fff", padding: 0 }}>
        <div className="logo" />
      </Header>
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
}

export default SocietyLayout;
