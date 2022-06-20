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
import { __ } from '@googleforcreators/i18n';
import { Dialog } from '@googleforcreators/story-editor';

/**
 * Internal dependencies
 */
import AddOnEditor from './addOnEditor';

function AddOnModal({ isOpen, onClose }) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      // Same as item_published post type label.
      title={__('Create an Add on.', 'web-stories')}
      secondaryText={__('Save', 'web-stories')}
    >
      <AddOnEditor />
    </Dialog>
  );
}

export default AddOnModal;
