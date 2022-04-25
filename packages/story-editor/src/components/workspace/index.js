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
import { RichTextProvider } from '@googleforcreators/rich-text';
import { useState, useCallback } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import Sidebar from '../sidebar';
import useSidebar from '../sidebar/useSidebar';
import Canvas from '../canvas';
import { VideoTrimProvider } from '../videoTrim';
import ErrorBoundary from '../errorBoundary';
import { useCanvas } from '../../app';
import { CanvasArea, SidebarArea } from './layout';

function Workspace({ header, footer }) {
  const { editingElementState } = useCanvas((state) => ({
    editingElementState: state.state.editingElementState,
  }));
  const [opened, setOpened] = useState(false);

  const handleClicked = useCallback(() => {
    setOpened(!opened);
  }, [opened]);

  const {
    state: { tab },
  } = useSidebar();

  return (
    <VideoTrimProvider>
      <RichTextProvider editingState={editingElementState}>
        <SidebarArea opened={opened} isMediaTab={Boolean(tab === 'insert')}>
          <ErrorBoundary>
            <Sidebar setOpened={handleClicked} opened={opened} />
          </ErrorBoundary>
        </SidebarArea>
        <CanvasArea opened={opened} isMediaTab={Boolean(tab === 'insert')}>
          <ErrorBoundary>
            <Canvas header={header} footer={footer} />
          </ErrorBoundary>
        </CanvasArea>
      </RichTextProvider>
    </VideoTrimProvider>
  );
}

Workspace.propTypes = {
  header: PropTypes.node,
  footer: PropTypes.object,
};

export default Workspace;
