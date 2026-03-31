export interface LivePreviewConfig {
  headings?: boolean;
  bold?: boolean;
  italic?: boolean;
  tables?: boolean;
}

export const defaultLivePreviewConfig: Required<LivePreviewConfig> = {
  headings: true,
  bold: true,
  italic: true,
  tables: true,
};
