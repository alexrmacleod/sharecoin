import React, { useState, useEffect, useContext } from "react";
import { Context } from "./Context";
import Header from "./Header.js";
import { Container } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

const Layout = (props) => {
  return (
    <Container>
      <Header />
      {props.children}
    </Container>
  );
};

export default Layout;
