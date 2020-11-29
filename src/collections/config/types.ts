/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeepRequired } from 'ts-essentials';
import { PaginateModel, Document, PassportLocalModel } from 'mongoose';
import { Access } from '../../config/types';
import { Field } from '../../fields/config/types';
import { PayloadRequest } from '../../express/types/payloadRequest';
import { Auth } from '../../auth/types';

interface CollectionModel extends PaginateModel<Document>, PassportLocalModel<Document>{}

export type HookOperationType =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'refresh'
  | 'login'
  | 'forgotPassword';

export type BeforeOperationHook = (args?: {
  args?: any;
  operation: HookOperationType;
}) => any;

export type BeforeValidateHook = (args?: {
  data?: any;
  req?: PayloadRequest;
  operation: 'create' | 'update';
  originalDoc?: any; // undefined on 'create' operation
}) => any;

export type BeforeChangeHook = (args?: {
  data: any;
  req: PayloadRequest;
  operation: 'create' | 'update'
  originalDoc?: any; // undefined on 'create' operation
}) => any;

export type AfterChangeHook = (args?: {
  doc: any;
  req: PayloadRequest;
  operation: 'create' | 'update';
}) => any;

export type BeforeReadHook = (args?: {
  doc: any;
  req: PayloadRequest;
  query: { [key: string]: any };
}) => any;

export type AfterReadHook = (args?: {
  doc: any;
  req: PayloadRequest;
  query: { [key: string]: any };
}) => any;

export type BeforeDeleteHook = (args?: {
  req: PayloadRequest;
  id: string;
}) => any;

export type AfterDeleteHook = (args?: {
  req: PayloadRequest;
  id: string;
  doc: any;
}) => any;

export type BeforeLoginHook = (args?: {
  req: PayloadRequest;
}) => any;

export type AfterLoginHook = (args?: {
  req: PayloadRequest;
  user: any;
  token: string;
}) => any;

export type AfterForgotPasswordHook = (args?: {
  args?: any;
}) => any;

export type ImageSize = {
  name: string,
  width: number,
  height: number,
  crop: string, // comes from sharp package
};

export type Upload = {
  imageSizes?: ImageSize[];
  staticURL?: string;
  staticDir?: string;
  adminThumbnail?: string;
}

export type PayloadCollectionConfig = {
  slug: string;
  labels?: {
    singular?: string;
    plural?: string;
  };
  fields: Field[];
  admin?: {
    useAsTitle?: string;
    defaultColumns?: string[];
    components?: any;
  };
  hooks?: {
    beforeOperation?: BeforeOperationHook[];
    beforeValidate?: BeforeValidateHook[];
    beforeChange?: BeforeChangeHook[];
    afterChange?: AfterChangeHook[];
    beforeRead?: BeforeReadHook[];
    afterRead?: AfterReadHook[];
    beforeDelete?: BeforeDeleteHook[];
    afterDelete?: AfterDeleteHook[];
    beforeLogin?: BeforeLoginHook[];
    afterLogin?: AfterLoginHook[];
    afterForgotPassword?: AfterForgotPasswordHook[];
  };
  access?: {
    create?: Access;
    read?: Access;
    update?: Access;
    delete?: Access;
    admin?: Access;
    unlock?: Access;
  };
  auth?: Auth | boolean;
  upload?: Upload | boolean;
};

export interface CollectionConfig extends DeepRequired<PayloadCollectionConfig> {
  auth: DeepRequired<Auth>
  upload: DeepRequired<Upload>
}

export type Collection = {
  Model: CollectionModel;
  config: CollectionConfig;
};

export type PaginatedDocs = {
  docs: unknown[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}
