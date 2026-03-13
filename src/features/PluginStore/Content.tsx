// import { Segmented } from '@lobehub/ui';
// import { SegmentedOptions } from 'antd/es/segmented';
// import { memo, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { Flexbox } from 'react-layout-kit';

// import { isDesktop } from '@/const/version';
// import { useServerConfigStore } from '@/store/serverConfig';
// import { useToolStore } from '@/store/tool';
// import { PluginStoreTabs } from '@/store/tool/slices/oldStore';

// import AddPluginButton from './AddPluginButton';
// import InstalledList from './InstalledList';
// import McpList from './McpList';
// import PluginList from './PluginList';
// import Search from './Search';

// export const Content = memo(() => {
//   const { t } = useTranslation('plugin');
//   const mobile = useServerConfigStore((s) => s.isMobile);
//   const [listType] = useToolStore((s) => [s.listType]);
//   const [keywords] = useState<string>();

//   const options = [
//     isDesktop ? { label: t('store.tabs.mcp'), value: PluginStoreTabs.MCP } : undefined,
//     { label: t('store.tabs.old'), value: PluginStoreTabs.Plugin },
//     { label: t('store.tabs.installed'), value: PluginStoreTabs.Installed },
//   ].filter(Boolean) as SegmentedOptions;

//   return (
//     <Flexbox
//       gap={8}
//       style={{ maxHeight: mobile ? '-webkit-fill-available' : 'inherit' }}
//       width={'100%'}
//     >
//       <Flexbox gap={8} paddingInline={16}>
//         <Flexbox gap={8} horizontal>
//           <Segmented
//             block
//             onChange={(v) => {
//               useToolStore.setState({ listType: v as PluginStoreTabs });
//             }}
//             options={options}
//             style={{ flex: 1 }}
//             value={listType}
//             variant={'filled'}
//           />
//           <AddPluginButton />
//         </Flexbox>
//         <Search />
//       </Flexbox>
//       {listType === PluginStoreTabs.MCP && <McpList />}
//       {listType === PluginStoreTabs.Plugin && <PluginList />}
//       {listType === PluginStoreTabs.Installed && <InstalledList keywords={keywords} />}
//     </Flexbox>
//   );
// });

// export default Content;


import { Segmented } from '@lobehub/ui';
import { SegmentedOptions } from 'antd/es/segmented';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';
// ✅ 添加 next/dynamic
import dynamic from 'next/dynamic';

import { isDesktop } from '@/const/version';
import { useServerConfigStore } from '@/store/serverConfig';
import { useToolStore } from '@/store/tool';
import { PluginStoreTabs } from '@/store/tool/slices/oldStore';

import AddPluginButton from './AddPluginButton';
// ❌ 删除直接导入
// import InstalledList from './InstalledList';
// import McpList from './McpList';
// import PluginList from './PluginList';
import Search from './Search';

// ✅ 改为动态导入（只在需要时加载）
const McpList = dynamic(() => import('./McpList'), {
  loading: () => <div className="p-4 text-center">Loading...</div>,
  ssr: false,
});

const PluginList = dynamic(() => import('./PluginList'), {
  loading: () => <div className="p-4 text-center">Loading...</div>,
  ssr: false,
});

const InstalledList = dynamic(() => import('./InstalledList'), {
  loading: () => <div className="p-4 text-center">Loading...</div>,
  ssr: false,
});

export const Content = memo(() => {
  const { t } = useTranslation('plugin');
  const mobile = useServerConfigStore((s) => s.isMobile);
  const [listType] = useToolStore((s) => [s.listType]);
  const [keywords] = useState<string>();

  const options = [
    isDesktop ? { label: t('store.tabs.mcp'), value: PluginStoreTabs.MCP } : undefined,
    { label: t('store.tabs.old'), value: PluginStoreTabs.Plugin },
    { label: t('store.tabs.installed'), value: PluginStoreTabs.Installed },
  ].filter(Boolean) as SegmentedOptions;

  return (
    <Flexbox
      gap={8}
      style={{ maxHeight: mobile ? '-webkit-fill-available' : 'inherit' }}
      width={'100%'}
    >
      <Flexbox gap={8} paddingInline={16}>
        <Flexbox gap={8} horizontal>
          <Segmented
            block
            onChange={(v) => {
              useToolStore.setState({ listType: v as PluginStoreTabs });
            }}
            options={options}
            style={{ flex: 1 }}
            value={listType}
            variant={'filled'}
          />
          <AddPluginButton />
        </Flexbox>
        <Search />
      </Flexbox>
      {/* 这里保持不变，动态组件会根据条件自动加载 */}
      {listType === PluginStoreTabs.MCP && <McpList />}
      {listType === PluginStoreTabs.Plugin && <PluginList />}
      {listType === PluginStoreTabs.Installed && <InstalledList keywords={keywords} />}
    </Flexbox>
  );
});

export default Content;