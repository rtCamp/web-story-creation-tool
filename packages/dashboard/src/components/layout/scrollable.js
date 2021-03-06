/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import useLayoutContext from './useLayoutContext';

const ScrollContent = styled.div`
  @media (max-width: 480px) {
    display: flex;
    flex-flow: column;
  }
`;

const Scrollable = ({ children }) => {
  const {
    state: { scrollFrameRef },
  } = useLayoutContext();
  return <ScrollContent ref={scrollFrameRef}>{children}</ScrollContent>;
};

Scrollable.propTypes = {
  children: PropTypes.node,
};

export default Scrollable;
