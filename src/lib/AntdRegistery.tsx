"use client";

import React from "react";
import { StyleProvider, createCache, extractStyle } from "@ant-design/cssinjs";

export default function AntdRegistry({ children }: { children: React.ReactNode }) {
  const cache = createCache();

  return (
    <StyleProvider cache={cache}>
      {children}
    </StyleProvider>
  );
}
