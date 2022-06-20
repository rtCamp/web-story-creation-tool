/*
 * Copyright 2022 Google LLC
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
import { useEffect, useState } from '@googleforcreators/react';
/**
 * WordPress dependencies
 */
import {
  BlockEditorKeyboardShortcuts,
  BlockEditorProvider,
  BlockList,
  BlockTools,
  BlockInspector,
  WritingFlow,
  ObserveTyping,
} from '@wordpress/block-editor';
import { Popover, SlotFillProvider } from '@wordpress/components';
import { registerCoreBlocks } from '@wordpress/block-library';
import { ShortcutProvider } from '@wordpress/keyboard-shortcuts';
import '@wordpress/format-library';

function Editor() {
  const [blocks, updateBlocks] = useState([]);

  useEffect(() => {
    registerCoreBlocks();
  }, []);

  return (
    <div className="playground">
      <ShortcutProvider>
        <SlotFillProvider>
          <BlockEditorProvider
            value={blocks}
            onInput={updateBlocks}
            onChange={updateBlocks}
          >
            <div className="playground__sidebar">
              <BlockInspector />
            </div>
            <div className="playground__content">
              <BlockTools>
                <div className="editor-styles-wrapper">
                  <BlockEditorKeyboardShortcuts.Register />
                  <WritingFlow>
                    <ObserveTyping>
                      <BlockList />
                    </ObserveTyping>
                  </WritingFlow>
                </div>
              </BlockTools>
            </div>
            <Popover.Slot />
          </BlockEditorProvider>
        </SlotFillProvider>
      </ShortcutProvider>
    </div>
  );
}

export default Editor;