import { ChatModelCard, ModelProviderCard } from '@/types/llm';

// 只保留 QwenProvider 的导入，其他全部删除
import QwenProvider from './qwen';

/**
 * @deprecated
 */
export const LOBE_DEFAULT_MODEL_LIST: ChatModelCard[] = [
  QwenProvider.chatModels,
].flat();

export const DEFAULT_MODEL_PROVIDER_LIST = [
  QwenProvider,
];

export const filterEnabledModels = (provider: ModelProviderCard) => {
  return provider.chatModels.filter((v) => v.enabled).map((m) => m.id);
};

export const isProviderDisableBrowserRequest = (id: string) => {
  const provider = DEFAULT_MODEL_PROVIDER_LIST.find((v) => v.id === id && v.disableBrowserRequest);
  return !!provider;
};

// 只导出 QwenProviderCard
export { default as QwenProviderCard } from './qwen';