interface ImportMetaEnv {
  /** Base URL of the Storybook build; defaults to <docs base>/storybook/. */
  readonly PUBLIC_STORYBOOK_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
