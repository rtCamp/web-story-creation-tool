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
import { __ } from '@googleforcreators/i18n';
import {
  Icons,
  Button,
  BUTTON_VARIANTS,
  BUTTON_TYPES,
  BUTTON_SIZES,
} from '@googleforcreators/design-system';
import { useRef, useState } from '@googleforcreators/react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { Pane as SharedPane } from '../shared';
import paneId from './paneId';
import AddOnModal from './addOnModal';

function AddOnIcon() {
  return <Icons.Box4 title={__('Text library', 'web-stories')} />;
}

// Relative position needed for Moveable to update its position properly.
const Pane = styled(SharedPane)`
  overflow-y: scroll;
  max-height: 100%;
  position: relative;
`;

function AddOnPane(props) {
  const paneRef = useRef();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Pane id={paneId} {...props} ref={paneRef}>
      <Button
        variant={BUTTON_VARIANTS.RECTANGLE}
        type={BUTTON_TYPES.PRIMARY}
        size={BUTTON_SIZES.SMALL}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {__('Add New', 'web-stories')}
        <AddOnModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </Button>
    </Pane>
  );
}

export default AddOnPane;

export { AddOnIcon, AddOnPane };
