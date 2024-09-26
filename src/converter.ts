// src/converter.ts

import { StyleMap } from './types';
import { applyStyle } from './styles';

export function convertParagraph(pElement: Element, styleMap: StyleMap): HTMLElement {
  const p = document.createElement('p');
  try {
    const pPr = pElement.getElementsByTagNameNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'pPr')[0];
    if (pPr) {
      const pStyle = pPr.getElementsByTagNameNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'pStyle')[0];
      if (pStyle) {
        const styleId = pStyle.getAttribute('w:val');
        if (styleId) applyStyle(p, styleId, styleMap);
      }
    }
    const runs = pElement.getElementsByTagNameNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'r');
    for (let i = 0; i < runs.length; i++) {
      const rElement = runs[i];
      const span = convertRun(rElement, styleMap);
      p.appendChild(span);
    }
  } catch (error) {
    console.error('Error converting paragraph:', error);
  }
  return p;
}

export function convertRun(rElement: Element, styleMap: StyleMap): HTMLElement {
  const span = document.createElement('span');
  try {
    const rPr = rElement.getElementsByTagNameNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'rPr')[0];
    if (rPr) {
      if (rPr.getElementsByTagNameNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'b').length > 0) {
        span.style.fontWeight = 'bold';
      }
      if (rPr.getElementsByTagNameNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'i').length > 0) {
        span.style.fontStyle = 'italic';
      }
      const colorEl = rPr.getElementsByTagNameNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'color')[0];
      if (colorEl) {
        const colorVal = colorEl.getAttribute('w:val');
        if (colorVal && colorVal !== 'auto') {
          span.style.color = `#${colorVal}`;
        }
      }
      const szEl = rPr.getElementsByTagNameNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'sz')[0];
      if (szEl) {
        const szVal = szEl.getAttribute('w:val');
        if (szVal) {
          const fontSize = parseInt(szVal, 10) / 2;
          span.style.fontSize = `${fontSize}pt`;
        }
      }
    }
    const textElements = rElement.getElementsByTagNameNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 't');
    for (let i = 0; i < textElements.length; i++) {
      const textContent = textElements[i].textContent || '';
      span.appendChild(document.createTextNode(textContent));
    }
  } catch (error) {
    console.error('Error converting run:', error);
  }
  return span;
}

export function convertTable(tblElement: Element, styleMap: StyleMap): HTMLElement {
  const table = document.createElement('table');
  try {
    const trElements = tblElement.getElementsByTagNameNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'tr');
    for (let i = 0; i < trElements.length; i++) {
      const trElement = trElements[i];
      const tr = document.createElement('tr');
      const tcElements = trElement.getElementsByTagNameNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'tc');
      for (let j = 0; j < tcElements.length; j++) {
        const tcElement = tcElements[j];
        const td = document.createElement('td');
        const pElements = tcElement.getElementsByTagNameNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'p');
        for (let k = 0; k < pElements.length; k++) {
          const pElement = pElements[k];
          const p = convertParagraph(pElement, styleMap);
          td.appendChild(p);
        }
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
  } catch (error) {
    console.error('Error converting table:', error);
  }
  return table;
}
