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
import { rgba } from 'polished';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ReactComponent as AlignBottom } from '../../icons/align_bottom.svg';
import { ReactComponent as AlignTop } from '../../icons/align_top.svg';
import { ReactComponent as AlignCenter } from '../../icons/align_center.svg';
import { ReactComponent as AlignMiddle } from '../../icons/align_middle.svg';
import { ReactComponent as AlignLeft } from '../../icons/align_left.svg';
import { ReactComponent as AlignRight } from '../../icons/align_right.svg';
import { ReactComponent as HorizontalDistribute } from '../../icons/horizontal_distribute.svg';
import { ReactComponent as VerticalDistribute } from '../../icons/vertical_distribute.svg';
import { dataPixels } from '../../units/dimensions';
import getCommonValue from './utils/getCommonValue';
import getBoundRect, {
  calcRotatedObjectPositionAndSize,
} from './utils/getBoundRect';

const ElementRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.bg.v9};
`;

const IconButton = styled.button`
  display: flex;
  width: 28px;
  height: 28px;
  justify-content: center;
  align-items: center;
  background-color: unset;
  cursor: pointer;
  padding: 0;
  border: 0;
  border-radius: 4px;

  &:hover {
    background-color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.1)};
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.2;
  }

  svg {
    color: ${({ theme }) => theme.colors.mg.v2};
    width: 28px;
    height: 28px;
  }
`;

const SeparateBorder = styled.div`
  border-left: 1px dashed ${({ theme }) => rgba(theme.colors.bg.v0, 0.3)};
  height: 12px;
  margin-left: 4px;
  margin-right: 4px;
`;

function ElementAlignmentPanel({ selectedElements, onSetProperties }) {
  const boundRect = getBoundRect(selectedElements);
  const isFill = getCommonValue(selectedElements, 'isFill');

  const isJustifyEnabled = isFill || selectedElements.length < 2;
  const isDistributionEnabled = isFill || selectedElements.length < 3;

  const handleAlignLeft = () => {
    onSetProperties((properties) => {
      const { x, y, width, height, rotationAngle } = properties;
      let offSetX = 0;
      if (rotationAngle) {
        const { width: frameWidth } = calcRotatedObjectPositionAndSize(
          rotationAngle,
          x,
          y,
          width,
          height
        );
        offSetX = (frameWidth - width) / 2;
      }
      return {
        x: boundRect.startX + offSetX,
      };
    });
  };

  const handleAlignCenter = () => {
    const centerX = (boundRect.endX + boundRect.startX) / 2;
    onSetProperties((properties) => {
      const { width } = properties;
      return {
        x: centerX - width / 2,
      };
    });
  };

  const handleAlignRight = () => {
    onSetProperties((properties) => {
      const { x, y, width, height, rotationAngle } = properties;
      let offSetX = 0;
      if (rotationAngle) {
        const { width: frameWidth } = calcRotatedObjectPositionAndSize(
          rotationAngle,
          x,
          y,
          width,
          height
        );
        offSetX = (frameWidth - width) / 2;
      }
      return {
        x: boundRect.endX - width - offSetX,
      };
    });
  };

  const handleAlignTop = () => {
    onSetProperties((properties) => {
      const { x, y, width, height, rotationAngle } = properties;
      let offSetY = 0;
      if (rotationAngle) {
        const { height: frameHeight } = calcRotatedObjectPositionAndSize(
          rotationAngle,
          x,
          y,
          width,
          height
        );
        offSetY = (frameHeight - height) / 2;
      }
      return {
        y: boundRect.startY + offSetY,
      };
    });
  };

  const handleAlignMiddle = () => {
    const centerY = (boundRect.endY + boundRect.startY) / 2;
    onSetProperties((properties) => {
      const { height } = properties;
      return {
        y: centerY - height / 2,
      };
    });
  };

  const handleAlignBottom = () => {
    onSetProperties((properties) => {
      const { x, y, width, height, rotationAngle } = properties;
      let offSetY = 0;
      if (rotationAngle) {
        const { height: frameHeight } = calcRotatedObjectPositionAndSize(
          rotationAngle,
          x,
          y,
          width,
          height
        );
        offSetY = (frameHeight - height) / 2;
      }
      return {
        y: boundRect.endY - height - offSetY,
      };
    });
  };

  const handleHorizontalDistribution = () => {
    const offsetWidth = dataPixels(
      (boundRect.endX - boundRect.startX) / (selectedElements.length - 1)
    );
    onSetProperties((properties) => {
      const { id, x, y, width, height, rotationAngle } = properties;
      const elementIndex = selectedElements.findIndex((item) => item.id === id);
      if (elementIndex === 0 || elementIndex === selectedElements.length - 1) {
        let offSetX = 0;
        if (rotationAngle) {
          const { width: frameWidth } = calcRotatedObjectPositionAndSize(
            rotationAngle,
            x,
            y,
            width,
            height
          );
          offSetX = (frameWidth - width) / 2;
        }
        return {
          x:
            elementIndex === 0
              ? boundRect.startX + offSetX
              : boundRect.endX - width - offSetX,
        };
      }
      const centerX = boundRect.startX + offsetWidth * elementIndex;
      return {
        x: centerX - width / 2,
      };
    });
  };

  const handleVerticalDistribution = () => {
    const offsetHeight = dataPixels(
      (boundRect.endY - boundRect.startY) / (selectedElements.length - 1)
    );
    onSetProperties((properties) => {
      const { id, x, y, width, height, rotationAngle } = properties;
      const elementIndex = selectedElements.findIndex((item) => item.id === id);
      if (elementIndex === 0 || elementIndex === selectedElements.length - 1) {
        let offSetY = 0;
        if (rotationAngle) {
          const { height: frameHeight } = calcRotatedObjectPositionAndSize(
            rotationAngle,
            x,
            y,
            width,
            height
          );
          offSetY = (frameHeight - height) / 2;
        }
        return {
          y:
            elementIndex === 0
              ? boundRect.startY + offSetY
              : boundRect.endY - height - offSetY,
        };
      }
      const centerY = boundRect.startY + offsetHeight * elementIndex;
      return {
        y: centerY - height / 2,
      };
    });
  };

  return (
    <ElementRow>
      <IconButton
        disabled={isDistributionEnabled}
        onClick={handleHorizontalDistribution}
        aria-label={__('Horizontal Distribution', 'web-stories')}
      >
        <HorizontalDistribute />
      </IconButton>
      <IconButton
        disabled={isDistributionEnabled}
        onClick={handleVerticalDistribution}
        aria-label={__('Vertical Distribution', 'web-stories')}
      >
        <VerticalDistribute />
      </IconButton>
      <SeparateBorder />
      <IconButton
        disabled={isJustifyEnabled}
        onClick={handleAlignLeft}
        aria-label={__('Justify Left', 'web-stories')}
      >
        <AlignLeft />
      </IconButton>
      <IconButton
        disabled={isJustifyEnabled}
        onClick={handleAlignCenter}
        aria-label={__('Justify Center', 'web-stories')}
      >
        <AlignCenter />
      </IconButton>
      <IconButton
        disabled={isJustifyEnabled}
        onClick={handleAlignRight}
        aria-label={__('Justify Right', 'web-stories')}
      >
        <AlignRight />
      </IconButton>
      <IconButton
        disabled={isJustifyEnabled}
        onClick={handleAlignTop}
        aria-label={__('Justify Top', 'web-stories')}
      >
        <AlignTop />
      </IconButton>
      <IconButton
        disabled={isJustifyEnabled}
        onClick={handleAlignMiddle}
        aria-label={__('Justify Middle', 'web-stories')}
      >
        <AlignMiddle />
      </IconButton>
      <IconButton
        disabled={isJustifyEnabled}
        onClick={handleAlignBottom}
        aria-label={__('Justify Bottom', 'web-stories')}
      >
        <AlignBottom />
      </IconButton>
    </ElementRow>
  );
}

ElementAlignmentPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default ElementAlignmentPanel;
