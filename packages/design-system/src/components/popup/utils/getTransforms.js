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
 * Internal dependencies
 */
import { PLACEMENT } from '../constants';

export function getXTransforms(placement, isRTL) {
  // left & right
  let mobilePlacement;
  if (
    window.matchMedia('(max-width:480px)').matches &&
    (placement === 'right' || placement === 'left')
  ) {
    mobilePlacement = PLACEMENT.BOTTOM;
  } else {
    mobilePlacement = placement;
  }
  if (mobilePlacement.startsWith('left')) {
    return isRTL ? 0 : -1;
  } else if (mobilePlacement.startsWith('right')) {
    return isRTL ? -1 : 0;
  }
  // top & bottom
  if (mobilePlacement.endsWith('-start')) {
    return isRTL ? -1 : 0;
  } else if (mobilePlacement.endsWith('-end')) {
    return isRTL ? 0 : -1;
  }
  return -0.5;
}

export function getYTransforms(placement) {
  let mobilePlacement;
  if (
    window.matchMedia('(max-width:480px)').matches &&
    (placement === 'right' || placement === 'left')
  ) {
    mobilePlacement = PLACEMENT.BOTTOM;
  } else {
    mobilePlacement = placement;
  }
  if (
    mobilePlacement.startsWith('top') ||
    mobilePlacement === PLACEMENT.RIGHT_END ||
    mobilePlacement === PLACEMENT.LEFT_END
  ) {
    return -1;
  }
  if (
    mobilePlacement === PLACEMENT.RIGHT ||
    mobilePlacement === PLACEMENT.LEFT
  ) {
    return -0.5;
  }
  return null;
}

// note that we cannot use percentage values for transforms, which
// do not work correctly for rotated elements
export function getTransforms(placement, isRTL) {
  let mobilePlacement;
  if (
    window.matchMedia('(max-width:480px)').matches &&
    (placement === 'right' || placement === 'left')
  ) {
    mobilePlacement = PLACEMENT.BOTTOM;
  } else {
    mobilePlacement = placement;
  }
  const xTransforms = getXTransforms(mobilePlacement, isRTL);
  const yTransforms = getYTransforms(mobilePlacement);
  if (!xTransforms && !yTransforms) {
    return '';
  }
  const translateX = (xTransforms || 0) * 100;
  const translateY = (yTransforms || 0) * 100;
  return `translate(${translateX}%, ${translateY}%)`;
}
