import React from "react";
import { Menu, Container } from "semantic-ui-react";
import { Link } from "../routes";

const Header = (props) => {
  return (
    <Menu style={{ marginTop: "35px" }}>
      <Link route="/">
        <a className="item">ProjectList</a>
      </Link>
      <Menu.Menu position="right">
        <Link route="/">
          <a className="item">Projects</a>
        </Link>
        <Link route="/campaigns/new">
            <Menu.Item icon="add" />
        </Link>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;
