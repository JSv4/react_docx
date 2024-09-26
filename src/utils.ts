// src/utils.ts

export function nsResolver(prefix: string): string | null {
    const ns: { [key: string]: string } = {
      w: 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
      r: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    };
    return ns[prefix] || null;
  }
  