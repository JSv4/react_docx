// tests/converter.test.ts

import { convertParagraph, convertRun, convertTable } from '../converter';
import { StyleMap } from '../types';

describe('Converter', () => {
  let styleMap: StyleMap;

  beforeAll(() => {
    styleMap = {};
  });

  test('should convert paragraph', () => {
    const parser = new DOMParser();
    const pXml = `<w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
      <w:r><w:t>Hello, World!</w:t></w:r>
    </w:p>`;
    const pElement = parser.parseFromString(pXml, 'application/xml').documentElement;
    const p = convertParagraph(pElement, styleMap);
    expect(p).toBeInstanceOf(HTMLParagraphElement);
    expect(p.textContent).toBe('Hello, World!');
  });

  test('should convert run', () => {
    const parser = new DOMParser();
    const rXml = `<w:r xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
      <w:rPr><w:b/></w:rPr><w:t>Bold Text</w:t>
    </w:r>`;
    const rElement = parser.parseFromString(rXml, 'application/xml').documentElement;
    const span = convertRun(rElement, styleMap);
    expect(span).toBeInstanceOf(HTMLSpanElement);
    expect(span.style.fontWeight).toBe('bold');
    expect(span.textContent).toBe('Bold Text');
  });

  test('should convert table', () => {
    const parser = new DOMParser();
    const tblXml = `<w:tbl xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
      <w:tr>
        <w:tc><w:p><w:r><w:t>Cell 1</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>Cell 2</w:t></w:r></w:p></w:tc>
      </w:tr>
    </w:tbl>`;
    const tblElement = parser.parseFromString(tblXml, 'application/xml').documentElement;
    const table = convertTable(tblElement, styleMap);
    expect(table).toBeInstanceOf(HTMLTableElement);
    expect(table.querySelectorAll('tr').length).toBe(1);
    expect(table.querySelectorAll('td').length).toBe(2);
    expect(table.querySelector('td')?.textContent).toBe('Cell 1');
  });
});
