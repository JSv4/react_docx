// tests/ooxmlParser.test.ts

import { parseXmlFile, parseStyles } from '../ooxmlParser';
import JSZip from 'jszip';
import { StyleMap } from '../types';

describe('OOXML Parser', () => {
  let zip: JSZip;

  beforeAll(async () => {
    zip = new JSZip();
    zip.file(
      'word/document.xml',
      '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body></w:body></w:document>'
    );
    zip.file('word/styles.xml', '<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"></w:styles>');
  });

  test('should parse XML file', async () => {
    const doc = await parseXmlFile(zip, 'word/document.xml');
    expect(doc).toBeDefined();
    const body = doc.getElementsByTagNameNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'body')[0];
    expect(body).toBeDefined();
  });

  test('should parse styles', async () => {
    const styleMap: StyleMap = await parseStyles(zip);
    expect(styleMap).toBeDefined();
    expect(Object.keys(styleMap).length).toBe(0);
  });
});
