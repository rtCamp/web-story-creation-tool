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
import styled from 'styled-components';
import { useCallback, useRef } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import { trackEvent } from '@googleforcreators/tracking';
import { useEscapeToBlurEffect } from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import TabView from '../tabview';
import useHighlights from '../../app/highlights/useHighlights';
import { useLayout } from '../../app';
import useSidebar from './useSidebar';
import SidebarContent from './sidebarContent';
import { getTabId } from './utils';

const Layout = styled.section.attrs({
  'aria-label': __('Sidebar', 'web-stories'),
})`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.bg.secondary};
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

const SidebarContainer = styled.div`
  height: 100%;
  padding: 0;
  overflow: auto;
  @media (max-width: 480px) {
    display: ${({ opened }) => (!opened ? 'none' : 'contents')};
  }
`;

const UnjustifiedTabView = styled(TabView)`
  justify-content: center;
  @media (max-width: 480px) {
    position: sticky;
  }
`;

function SidebarLayout() {
  const { opened, setOpened } = useLayout(
    ({ state: { opened }, actions: { setOpened } }) => ({
      opened,
      setOpened,
    })
  );
  const { tab, tabRefs, setSidebarContentNode, setTab, sidebar, tabs } =
    useSidebar(
      ({
        state: { tab, tabRefs },
        actions: { setSidebarContentNode, setTab },
        refs: { sidebar },
        data: { tabs },
      }) => ({
        tab,
        tabRefs,
        setSidebarContentNode,
        setTab,
        sidebar,
        tabs,
      })
    );
  const previousTab = useRef('insert');

  const { resetHighlight } = useHighlights((state) => ({
    resetHighlight: state.onFocusOut,
  }));

  const onTabChange = useCallback(
    (id) => {
      setTab(id);
      resetHighlight();
      trackEvent('inspector_tab_change', {
        name: id,
      });
      if (previousTab.current === id) {
        if (opened === false) {
          setOpened(true);
        } else {
          setOpened(false);
        }
      } else if (previousTab.current !== id) {
        if (opened === false) {
          setOpened(true);
          previousTab.current = id;
        } else {
          previousTab.current = id;
        }
      }
    },
    [opened, setOpened, setTab, resetHighlight]
  );

  useEscapeToBlurEffect(sidebar);
  return (
    <Layout ref={sidebar}>
      <UnjustifiedTabView
        label={__('Sidebar Selection', 'web-stories')}
        tabs={tabs}
        tab={tab}
        tabRefs={tabRefs}
        onTabChange={onTabChange}
        getAriaControlsId={getTabId}
        shortcut="mod+option+3"
      />
      <SidebarContainer opened={opened} ref={setSidebarContentNode}>
        <SidebarContent />
      </SidebarContainer>
    </Layout>
  );
}

export default SidebarLayout;
