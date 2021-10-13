import React from "react";
import Content from "./Content";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout({
  headerLeftButton,
  headerRightButton,
  children,
}) {
  return (
    <>
      <Header leftButton={headerLeftButton} rightButton={headerRightButton} />
      <Content>{children}</Content>
      <Footer />
    </>
  );
}
