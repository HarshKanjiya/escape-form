// import { TeamRole, ProjectRole } from './db';

// export interface Permission {
//   id: string;
//   name: string;
//   description: string;
//   resource: PermissionResource;
//   action: PermissionAction;
// }

// export type PermissionResource = 
//   | 'team'
//   | 'project' 
//   | 'form'
//   | 'member'
//   | 'settings';

// export type PermissionAction = 
//   | 'create'
//   | 'read'
//   | 'update'
//   | 'delete'
//   | 'invite'
//   | 'manage_roles'
//   | 'publish'
//   | 'view_analytics';

// export interface RolePermissions {
//   role: TeamRole | ProjectRole;
//   permissions: Permission[];
// }

// // Default permissions for team roles
// export const TEAM_ROLE_PERMISSIONS: Record<TeamRole, PermissionAction[]> = {
//   owner: ['create', 'read', 'update', 'delete', 'invite', 'manage_roles', 'publish', 'view_analytics'],
//   admin: ['create', 'read', 'update', 'delete', 'invite', 'publish', 'view_analytics'],
//   editor: ['create', 'read', 'update', 'publish'],
//   viewer: ['read']
// };

// // Default permissions for project roles
// export const PROJECT_ROLE_PERMISSIONS: Record<ProjectRole, PermissionAction[]> = {
//   owner: ['create', 'read', 'update', 'delete', 'invite', 'manage_roles', 'publish', 'view_analytics'],
//   admin: ['create', 'read', 'update', 'delete', 'invite', 'publish', 'view_analytics'],
//   editor: ['create', 'read', 'update', 'publish'],
//   viewer: ['read']
// };

// export interface UserPermissions {
//   teamPermissions: Record<string, TeamRole>; // teamId -> role
//   projectPermissions: Record<string, ProjectRole>; // projectId -> role
// }

// export function hasPermission(
//   userRole: TeamRole | ProjectRole,
//   resource: PermissionResource,
//   action: PermissionAction,
//   context: 'team' | 'project'
// ): boolean {
//   const rolePermissions = context === 'team' 
//     ? TEAM_ROLE_PERMISSIONS[userRole as TeamRole]
//     : PROJECT_ROLE_PERMISSIONS[userRole as ProjectRole];
  
//   return rolePermissions.includes(action);
// }

// export function canAccessResource(
//   userPermissions: UserPermissions,
//   resourceId: string,
//   resourceType: 'team' | 'project',
//   action: PermissionAction
// ): boolean {
//   const permissions = resourceType === 'team' 
//     ? userPermissions.teamPermissions 
//     : userPermissions.projectPermissions;
  
//   const userRole = permissions[resourceId];
//   if (!userRole) return false;
  
//   return hasPermission(userRole, resourceType as PermissionResource, action, resourceType);
// }
