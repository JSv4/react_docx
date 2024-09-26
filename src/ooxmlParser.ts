// src/ooxmlParser.ts

import JSZip from 'jszip';
import { StyleDefinition, StyleMap } from './types';

export async function readOOXMLFile(file: File): Promise<JSZip> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  return zip;
}

export async function parseXmlFile(zip: JSZip, filePath: string): Promise<Document> {
  const xmlString = await zip.file(filePath)?.async('string');
  if (!xmlString) throw new Error(`${filePath} not found`);
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
  const parserError = xmlDoc.getElementsByTagName('parsererror');
  if (parserError.length > 0) {
    throw new Error(`Error parsing ${filePath}: ${parserError[0].textContent}`);
  }
  return xmlDoc;
}

export async function parseStyles(zip: JSZip): Promise<StyleMap> {
  const stylesXml = await zip.file('word/styles.xml')?.async('string');
  const styleMap: StyleMap = {};
  if (stylesXml) {
    const parser = new DOMParser();
    const stylesDoc = parser.parseFromString(stylesXml, 'application/xml');
    const styleElements = stylesDoc.getElementsByTagNameNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'style');
    for (let i = 0; i < styleElements.length; i++) {
      const styleElement = styleElements[i];
      const styleId = styleElement.getAttribute('w:styleId') || '';
      const type = styleElement.getAttribute('w:type') as 'paragraph' | 'character' | 'table' | 'numbering';

      const styleDef: StyleDefinition = {
        id: styleId,
        type: type,
        properties: {},
      };

      // Extract style name
      const nameElement = styleElement.getElementsByTagNameNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'name')[0];
      if (nameElement) {
        styleDef.name = nameElement.getAttribute('w:val') || '';
      }

      // Extract style properties (simplified)
      const rPr = styleElement.getElementsByTagNameNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'rPr')[0];
      if (rPr) {
        const colorEl = rPr.getElementsByTagNameNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'color')[0];
        if (colorEl) {
          const colorVal = colorEl.getAttribute('w:val');
          if (colorVal && colorVal !== 'auto') {
            styleDef.properties.color = `#${colorVal}`;
          }
        }
        const szEl = rPr.getElementsByTagNameNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'sz')[0];
        if (szEl) {
          const szVal = szEl.getAttribute('w:val');
          if (szVal) {
            const fontSize = parseInt(szVal, 10) / 2; // Word stores font size in half-points
            styleDef.properties.fontSize = `${fontSize}pt`;
          }
        }
      }

      styleMap[styleId] = styleDef;
    }
  }
  return styleMap;
}
