export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            forms: {
                Row: {
                    id: string
                    project_id: string
                    name: string
                    description: string | null
                    theme: string | null
                    logo_url: string | null
                    thank_you_screen: Json | null
                    welcome_screen: Json | null
                    max_responses: number | null
                    open_at: string | null
                    close_at: string | null
                    password_hash: string | null
                    unique_subdomain: string | null
                    custom_domain: string | null
                    created_by: string
                    status: string
                    config: Json | null
                    multiple_submissions: boolean
                    password_protected: boolean
                    require_consent: boolean
                    analytics_enabled: boolean
                    created_at: string
                    updated_at: string
                    allow_anonymous: boolean
                    type?: string | 'reach-out' | 'embedded'
                }
                Insert: {
                    id?: string
                    project_id: string
                    name: string
                    description?: string | null
                    theme?: string | null
                    logo_url?: string | null
                    thank_you_screen?: Json | null
                    welcome_screen?: Json | null
                    max_responses?: number | null
                    open_at?: string | null
                    close_at?: string | null
                    password_hash?: string | null
                    unique_subdomain?: string | null
                    custom_domain?: string | null
                    created_by?: string
                    status?: string
                    config?: Json | null
                    multiple_submissions?: boolean
                    password_protected?: boolean
                    require_consent?: boolean
                    analytics_enabled?: boolean
                    created_at?: string
                    updated_at?: string
                    allow_anonymous?: boolean
                    type?: string | 'reach-out' | 'embedded'
                }
                Update: {
                    id?: string
                    project_id?: string
                    name?: string
                    description?: string | null
                    theme?: string | null
                    logo_url?: string | null
                    thank_you_screen?: Json | null
                    welcome_screen?: Json | null
                    max_responses?: number | null
                    open_at?: string | null
                    close_at?: string | null
                    password_hash?: string | null
                    unique_subdomain?: string | null
                    custom_domain?: string | null
                    created_by?: string
                    status?: string
                    config?: Json | null
                    multiple_submissions?: boolean
                    password_protected?: boolean
                    require_consent?: boolean
                    analytics_enabled?: boolean
                    created_at?: string
                    updated_at?: string
                    allow_anonymous?: boolean
                    type?: string | 'reach-out' | 'embedded'
                }
                Relationships: [
                    {
                        foreignKeyName: "forms_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    }
                ]
            }
            projects: {
                Row: {
                    id: string
                    team_id: string
                    name: string
                    description: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    team_id: string
                    name: string
                    description?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    team_id?: string
                    name?: string
                    description?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "projects_team_id_fkey"
                        columns: ["team_id"]
                        isOneToOne: false
                        referencedRelation: "teams"
                        referencedColumns: ["id"]
                    }
                ]
            }
            responses: {
                Row: {
                    id: string
                    form_id: string
                    user_id: string | null
                    response_data: Json
                    submitted_at: string
                    ip_address: string | null
                    user_agent: string | null
                    referrer_url: string | null
                    tags: string | null
                    files: Json | null
                    status: string
                    started_at: string | null
                    updated_at: string | null
                    partial_save: boolean
                    notified: boolean
                }
                Insert: {
                    id?: string
                    form_id: string
                    user_id?: string | null
                    response_data: Json
                    submitted_at?: string
                    ip_address?: string | null
                    user_agent?: string | null
                    referrer_url?: string | null
                    tags?: string | null
                    files?: Json | null
                    status?: string
                    started_at?: string | null
                    updated_at?: string | null
                    partial_save?: boolean
                    notified?: boolean
                }
                Update: {
                    id?: string
                    form_id?: string
                    user_id?: string | null
                    response_data?: Json
                    submitted_at?: string
                    ip_address?: string | null
                    user_agent?: string | null
                    referrer_url?: string | null
                    tags?: string | null
                    files?: Json | null
                    status?: string
                    started_at?: string | null
                    updated_at?: string | null
                    partial_save?: boolean
                    notified?: boolean
                }
                Relationships: [
                    {
                        foreignKeyName: "responses_form_id_fkey"
                        columns: ["form_id"]
                        isOneToOne: false
                        referencedRelation: "forms"
                        referencedColumns: ["id"]
                    }
                ]
            }
            team_member_roles: {
                Row: {
                    member_id: string
                    role_id: string
                    created_at: string
                }
                Insert: {
                    member_id: string
                    role_id: string
                    created_at?: string
                }
                Update: {
                    member_id?: string
                    role_id?: string
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "team_member_roles_team_member_id_fkey"
                        columns: ["team_member_id"]
                        isOneToOne: false
                        referencedRelation: "team_members"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "team_member_roles_team_role_id_fkey"
                        columns: ["team_role_id"]
                        isOneToOne: false
                        referencedRelation: "team_roles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            team_members: {
                Row: {
                    id: string
                    member_id: string
                    created_by: string
                    team_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    member_id: string
                    created_by: string
                    team_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    member_id?: string
                    created_by?: string
                    team_id?: string
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "team_members_team_id_fkey"
                        columns: ["team_id"]
                        isOneToOne: false
                        referencedRelation: "teams"
                        referencedColumns: ["id"]
                    }
                ]
            }
            team_permissions: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            team_role_permissions: {
                Row: {
                    id: string
                    role_id: string
                    permission_id: string
                    scope: string
                    scope_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    role_id: string
                    permission_id: string
                    scope: string
                    scope_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    role_id?: string
                    permission_id?: string
                    scope?: string
                    scope_id?: string
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "team_role_permissions_team_role_id_fkey"
                        columns: ["team_role_id"]
                        isOneToOne: false
                        referencedRelation: "team_roles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "team_role_permissions_team_permission_id_fkey"
                        columns: ["team_permission_id"]
                        isOneToOne: false
                        referencedRelation: "team_permissions"
                        referencedColumns: ["id"]
                    }
                ]
            }
            team_roles: {
                Row: {
                    id: string
                    name: string
                    team_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    team_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    team_id?: string
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "team_roles_team_id_fkey"
                        columns: ["team_id"]
                        isOneToOne: false
                        referencedRelation: "teams"
                        referencedColumns: ["id"]
                    }
                ]
            }
            teams: {
                Row: {
                    id: string
                    name: string
                    owner_id: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    owner_id: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    owner_id?: string
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

// Export convenient type aliases
export type Team = Database['public']['Tables']['teams']['Row']
export type TeamInsert = Database['public']['Tables']['teams']['Insert']
export type TeamUpdate = Database['public']['Tables']['teams']['Update']

export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export type Form = Database['public']['Tables']['forms']['Row']
export type FormInsert = Database['public']['Tables']['forms']['Insert']
export type FormUpdate = Database['public']['Tables']['forms']['Update']

export type Response = Database['public']['Tables']['responses']['Row']
export type ResponseInsert = Database['public']['Tables']['responses']['Insert']
export type ResponseUpdate = Database['public']['Tables']['responses']['Update']

export type TeamMember = Database['public']['Tables']['team_members']['Row']
export type TeamMemberInsert = Database['public']['Tables']['team_members']['Insert']
export type TeamMemberUpdate = Database['public']['Tables']['team_members']['Update']

export type TeamRole = Database['public']['Tables']['team_roles']['Row']
export type TeamRoleInsert = Database['public']['Tables']['team_roles']['Insert']
export type TeamRoleUpdate = Database['public']['Tables']['team_roles']['Update']

export type TeamPermission = Database['public']['Tables']['team_permissions']['Row']
export type TeamPermissionInsert = Database['public']['Tables']['team_permissions']['Insert']
export type TeamPermissionUpdate = Database['public']['Tables']['team_permissions']['Update']

export type TeamMemberRole = Database['public']['Tables']['team_member_roles']['Row']
export type TeamMemberRoleInsert = Database['public']['Tables']['team_member_roles']['Insert']
export type TeamMemberRoleUpdate = Database['public']['Tables']['team_member_roles']['Update']

export type TeamRolePermission = Database['public']['Tables']['team_role_permissions']['Row']
export type TeamRolePermissionInsert = Database['public']['Tables']['team_role_permissions']['Insert']
export type TeamRolePermissionUpdate = Database['public']['Tables']['team_role_permissions']['Update']
