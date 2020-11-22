import { CSSProperties } from 'react';
import { PayloadRequest } from '../../express/types/payloadRequest';
import { Access } from '../../config/types';

// TODO: add generic type and use mongoose types for originalDoc & data
export type FieldHook = (args: {
  value?: any,
  originalDoc?: any,
  data?: any,
  operation?: 'create' | 'update',
  req?: PayloadRequest}) => Promise<any> | any;

export type Field = {
  name: string;
  slug?: string;
  label?: string;
  type:
  | 'number'
  | 'text'
  | 'email'
  | 'textarea'
  | 'richText'
  | 'code'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'upload'
  | 'relationship'
  | 'row'
  | 'array'
  | 'group'
  | 'select'
  | 'blocks';
  localized?: boolean;
  hidden?: boolean;
  required?: boolean;
  defaultValue?: any;
  validate?: (value: any, field: Field) => any;
  access?: {
    create?: Access;
    read?: Access;
    update?: Access;
    delete?: Access;
  };
  blocks: Field[];
  relationTo?: string;
  fields?: Field[];
  hooks?: {
    beforeValidate?: FieldHook[];
    beforeChange?: FieldHook[];
    afterChange?: FieldHook[];
    afterRead?: FieldHook[];
  }
  admin?: {
    position?: string;
    width?: string;
    style?: CSSProperties;
    readOnly?: boolean;
    disabled?: boolean;
    condition?: () => any;
  };
};
