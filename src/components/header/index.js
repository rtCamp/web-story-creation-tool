/**
 * External dependencies
 */
import React from "react";
import styled from "styled-components";
import { HeaderTitle } from "@googleforcreators/story-editor";

/**
 * Internal dependencies
 */
import { Buttons } from "./buttons";

const Background = styled.header.attrs({
  role: "group",
  "aria-label": "Story canvas header",
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.bg.primary};
`;

const Head = styled.div`
  flex: 1 1 auto;
  padding: 1em;
`;

const ButtonCell = styled.div`
  grid-area: buttons;
`;

function Header() {
  return (
    <Background>
      <Head>
        <HeaderTitle />
      </Head>
      <ButtonCell>
        <Buttons />
      </ButtonCell>
    </Background>
  );
}

export { Header };
