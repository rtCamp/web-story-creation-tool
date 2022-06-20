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
import {
  useEffect,
  useState,
  createElement,
  Component,
} from '@googleforcreators/react';
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

// eslint-disable-next-line eslint-comments/disable-enable-pair -- need to enable this for bottom line.
/* eslint-disable no-restricted-imports -- doesnt work without this */
import '@wordpress/components/build-style/style.css';
import '@wordpress/block-editor/build-style/style.css';
import '@wordpress/block-library/build-style/style.css';
import '@wordpress/block-library/build-style/editor.css';
import '@wordpress/block-library/build-style/theme.css';
import '@wordpress/format-library/build-style/style.css';
window.wp = {};
window.wp.element = { createElement, Component };
window._wpDateSettings = {
  l10n: {
    locale: 'fr_FR',
    months: [
      'janvier',
      'février',
      'mars',
      'avril',
      'mai',
      'juin',
      'juillet',
      'août',
      'septembre',
      'octobre',
      'novembre',
      'décembre',
    ],
    monthsShort: [
      'Jan',
      'Fév',
      'Mar',
      'Avr',
      'Mai',
      'Juin',
      'Juil',
      'Août',
      'Sep',
      'Oct',
      'Nov',
      'Déc',
    ],
    weekdays: [
      'dimanche',
      'lundi',
      'mardi',
      'mercredi',
      'jeudi',
      'vendredi',
      'samedi',
    ],
    weekdaysShort: ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'],
    meridiem: { am: ' ', pm: ' ', AM: ' ', PM: ' ' },
    relative: { future: '%s à partir de maintenant', past: 'Il y a %s' },
  },
  formats: {
    time: 'G \\h i \\m\\i\\n',
    date: 'j F Y',
    datetime: 'j F Y G \\h i \\m\\i\\n',
  },
  timezone: { offset: 1, string: 'Europe/Paris' },
};

// User settings used to persist store caches
window.userSettings = { uid: 'dummy' };

// API globals
window.wpApiSettings = {
  schema: {},
};
window.wp.api = {
  getPostTypeRoute() {
    return '/none';
  },
};
window.wp.apiRequest = () => {
  // eslint-disable-next-line prefer-promise-reject-errors -- remove some useless linting
  return Promise.reject('no API support yet');
};
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
