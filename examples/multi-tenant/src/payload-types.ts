/* tslint:disable */
/**
 * This file was automatically generated by Payload CMS.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {
  collections: {
    users: User
    tenants: Tenant
    pages: Page
  }
  globals: {}
}
export interface User {
  id: string
  firstName?: string
  lastName?: string
  roles: Array<'super-admin' | 'user'>
  tenants?: Array<{
    tenant: string | Tenant
    roles: Array<'admin' | 'user'>
    id?: string
  }>
  lastLoggedInTenant?: string | Tenant
  updatedAt: string
  createdAt: string
  email?: string
  resetPasswordToken?: string
  resetPasswordExpiration?: string
  loginAttempts?: number
  lockUntil?: string
  password?: string
}
export interface Tenant {
  id: string
  name: string
  domains: Array<{
    domain: string
    id?: string
  }>
  updatedAt: string
  createdAt: string
}
export interface Page {
  id: string
  title: string
  slug?: string
  tenant?: string | Tenant
  richText: Array<{
    [k: string]: unknown
  }>
  updatedAt: string
  createdAt: string
}
