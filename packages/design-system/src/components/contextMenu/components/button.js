/*
 * Copyright 2021 Google LLC
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
import { v4 as uuidv4 } from 'uuid';
import { useMemo } from '@googleforcreators/react';
/**
 * Internal dependencies
 */
import { Button as BaseButton } from '../../button';
import { useContextMenu } from '../contextMenuProvider';
import { menuItemStyles } from './styles';

const StyledButton = styled(BaseButton)`
  ${menuItemStyles};

  width: 100%;
  padding: ${({ $isIconMenu }) => ($isIconMenu ? 0 : '2px 16px')};
  border-radius: ${({ $isIconMenu }) => ($isIconMenu ? 4 : 0)}px;
  background-color: transparent;

  :disabled {
    background-color: transparent;

    span {
      color: ${({ theme }) => theme.colors.fg.disable};
    }
  }

  :hover:not(:disabled) {
    background-color: ${({ theme }) =>
      theme.colors.interactiveBg.secondaryHover};
  }

  :active:not(:disabled) {
    background-color: ${({ theme }) =>
      theme.colors.interactiveBg.secondaryPress};
  }
`;

/**
 * A styled button for use in the context menu.
 *
 * @param {Object} props Attributes to pass to the button.
 * @param {string} props.id id attribute for the element
 * @param {Function} props.onBlur Blur event handler.
 * @param {Function} props.onClick Click event handler.
 * @param {Function} props.onFocus Focus event handler.
 * @return {Node} The react node
 */
function Button({ id, onBlur, onClick, onFocus, ...props }) {
  const { focusedId, isIconMenu, onDismiss, onMenuItemBlur, onMenuItemFocus } =
    useContextMenu(({ state, actions }) => ({
      focusedId: state.focusedId,
      isIconMenu: state.isIconMenu,
      onDismiss: actions.onDismiss,
      onMenuItemBlur: actions.onMenuItemBlur,
      onMenuItemFocus: actions.onMenuItemFocus,
    }));
  const autoGeneratedId = useMemo(uuidv4, []);
  const elementId = id || autoGeneratedId;

  const handleBlur = (evt) => {
    onMenuItemBlur();
    onBlur?.(evt);
  };

  const handleClick = (evt) => {
    onClick(evt);
    onDismiss(evt);
  };

  const handleFocus = (evt) => {
    onMenuItemFocus(elementId);
    onFocus?.(evt);
  };

  return (
    <StyledButton
      id={elementId}
      tabIndex={focusedId === elementId ? 0 : -1}
      role="menuitem"
      $isIconMenu={isIconMenu}
      onBlur={handleBlur}
      onClick={handleClick}
      onFocus={handleFocus}
      {...props}
    />
  );
}

Button.propTypes = {
  id: PropTypes.string,
  onBlur: PropTypes.func,
  onClick: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
};

export default Button;