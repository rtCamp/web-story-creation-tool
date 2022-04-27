/**
 * External dependencies
 */
import { createGlobalStyle } from "styled-components";
import { themeHelpers } from "@googleforcreators/design-system";

export const GlobalStyle = createGlobalStyle`
  body.web-story_page_stories-dashboard #wpbody {
    ${themeHelpers.scrollbarCSS};
  }
`;
