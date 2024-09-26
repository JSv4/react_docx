// src/types.ts

export interface StyleDefinition {
    id: string;
    name?: string;
    type: 'paragraph' | 'character' | 'table' | 'numbering';
    properties: {
      [key: string]: string | number | boolean;
    };
  }
  
export interface StyleMap {
  [styleId: string]: StyleDefinition;
}
