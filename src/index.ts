// src/index.ts

import { readOOXMLFile, parseXmlFile, parseStyles } from './ooxmlParser';
import { StyleMap } from './types';
import { convertParagraph, convertTable } from './converter';

export async function renderDocument(file: File, container: HTMLElement): Promise<void> {
  try {
    const zip = await readOOXMLFile(file);
    const xmlDoc = await parseXmlFile(zip, 'word/document.xml');
    const styleMap = await parseStyles(zip);

    const body = xmlDoc.getElementsByTagNameNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'body')[0];
    if (!body) throw new Error('No body element found in document.xml');

    const childNodes = body.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
      const node = childNodes[i];
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        let htmlElement: HTMLElement | null = null;

        switch (element.localName) {
          case 'p':
            htmlElement = convertParagraph(element, styleMap);
            break;
          case 'tbl':
            htmlElement = convertTable(element, styleMap);
            break;
          case 'sectPr':
            // Handle section properties if needed
            break;
          default:
            console.warn(`Unhandled element: ${element.localName}`);
        }

        if (htmlElement) {
          container.appendChild(htmlElement);
        }
      }
    }
  } catch (error) {
    console.error('Error rendering document:', error);
  }
}
