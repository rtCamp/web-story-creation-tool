/**
 * External dependencies
 */
import React from "react";
import styled from "styled-components";
import Export from "./export";
import Import from "./import";

/**
 * Internal dependencies
 */
import Preview from "./preview";
import Reset from "./reset";
import Save from "./save";

const ButtonList = styled.nav`
  display: flex;
  justify-content: flex-end;
  padding: 1em;
  height: 100%;
`;

const List = styled.div`
  display: flex;
  align-items: center;
`;

const Space = styled.div`
  width: 8px;
`;

function Buttons() {
  return (
    <ButtonList>
      <List>
        <Space />
        <Import />
        <Space />
        <Export />
        <Space />
        <Reset />
        <Space />
        <Save />
        <Space />
        <Preview />
      </List>
    </ButtonList>
  );
}

export { Buttons };
