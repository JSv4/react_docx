// src/styles.ts

import { StyleMap, StyleDefinition } from './types';

export function applyStyle(element: HTMLElement, styleId: string, styleMap: StyleMap): void {
  const style = styleMap[styleId];
  if (style) {
    const { properties } = style;

    if (properties.fontSize) {
      element.style.fontSize = properties.fontSize as string;
    }
    if (properties.color) {
      element.style.color = properties.color as string;
    }
    // Add more style properties as needed
  }
}
