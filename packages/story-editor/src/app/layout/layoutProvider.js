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
import { useCallback, useEffect, useState } from '@googleforcreators/react';
/**
 * Internal dependencies
 */
import Context from './context';
import useZoomSetting from './useZoomSetting';
import useCarouselDrawer from './useCarouselDrawer';

function LayoutProvider({ children }) {
  const zoomValue = useZoomSetting();
  const carouselDrawer = useCarouselDrawer();
  const [isMobile, setIsMobile] = useState(
    window.matchMedia('(max-width:480px)').matches
  );
  const [opened, setOpened] = useState(false);
  const observeResize = useCallback(() => {
    setIsMobile(window.matchMedia('(max-width:480px)').matches);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', observeResize);
  }, [observeResize]);

  const value = {
    state: {
      ...zoomValue.state,
      ...carouselDrawer.state,
      isMobile,
      opened,
    },
    actions: {
      ...zoomValue.actions,
      ...carouselDrawer.actions,
      setOpened,
    },
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

LayoutProvider.propTypes = {
  children: PropTypes.node,
};

export default LayoutProvider;
