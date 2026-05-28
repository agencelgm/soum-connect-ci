export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      chariow_payments: {
        Row: {
          amount_label: string | null
          credits_granted: number
          email: string
          error_message: string | null
          id: string
          license_code: string
          partner_id: string | null
          processed_at: string | null
          product_id: string
          raw_payload: Json
          received_at: string
          status: string
        }
        Insert: {
          amount_label?: string | null
          credits_granted?: number
          email: string
          error_message?: string | null
          id?: string
          license_code: string
          partner_id?: string | null
          processed_at?: string | null
          product_id: string
          raw_payload?: Json
          received_at?: string
          status?: string
        }
        Update: {
          amount_label?: string | null
          credits_granted?: number
          email?: string
          error_message?: string | null
          id?: string
          license_code?: string
          partner_id?: string | null
          processed_at?: string | null
          product_id?: string
          raw_payload?: Json
          received_at?: string
          status?: string
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          created_by: string | null
          id: string
          note: string | null
          partner_id: string
          reference_id: string | null
          tx_type: Database["public"]["Enums"]["credit_tx_type"]
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          partner_id: string
          reference_id?: string | null
          tx_type: Database["public"]["Enums"]["credit_tx_type"]
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string | null
          partner_id?: string
          reference_id?: string | null
          tx_type?: Database["public"]["Enums"]["credit_tx_type"]
        }
        Relationships: [
          {
            foreignKeyName: "credit_transactions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_publications: {
        Row: {
          audience: Database["public"]["Enums"]["audience_type"]
          budget: string | null
          city: string | null
          created_at: string
          id: string
          is_active: boolean
          legal_form: string | null
          max_unlocks: number
          prospect_id: string
          published_at: string
          published_by: string
          service: string | null
          summary: string | null
          unlock_count: number
          updated_at: string
        }
        Insert: {
          audience?: Database["public"]["Enums"]["audience_type"]
          budget?: string | null
          city?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          legal_form?: string | null
          max_unlocks?: number
          prospect_id: string
          published_at?: string
          published_by: string
          service?: string | null
          summary?: string | null
          unlock_count?: number
          updated_at?: string
        }
        Update: {
          audience?: Database["public"]["Enums"]["audience_type"]
          budget?: string | null
          city?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          legal_form?: string | null
          max_unlocks?: number
          prospect_id?: string
          published_at?: string
          published_by?: string
          service?: string | null
          summary?: string | null
          unlock_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_publications_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: true
            referencedRelation: "prospects"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_unlocks: {
        Row: {
          credits_spent: number
          id: string
          partner_id: string
          publication_id: string
          unlocked_at: string
        }
        Insert: {
          credits_spent?: number
          id?: string
          partner_id: string
          publication_id: string
          unlocked_at?: string
        }
        Update: {
          credits_spent?: number
          id?: string
          partner_id?: string
          publication_id?: string
          unlocked_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_unlocks_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_unlocks_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "lead_publications"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          cabinet_name: string
          city: string
          contact_first_name: string
          contact_last_name: string
          created_at: string
          credits_balance: number
          deleted_at: string | null
          email: string
          facebook_url: string | null
          id: string
          pause_reason: string | null
          paused_at: string | null
          paused_by: string | null
          phone: string
          profile_id: string
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          services: string[]
          status: Database["public"]["Enums"]["partner_status"]
          updated_at: string
          website: string | null
          zones: string[]
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          cabinet_name: string
          city: string
          contact_first_name: string
          contact_last_name: string
          created_at?: string
          credits_balance?: number
          deleted_at?: string | null
          email: string
          facebook_url?: string | null
          id?: string
          pause_reason?: string | null
          paused_at?: string | null
          paused_by?: string | null
          phone: string
          profile_id: string
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          services?: string[]
          status?: Database["public"]["Enums"]["partner_status"]
          updated_at?: string
          website?: string | null
          zones?: string[]
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          cabinet_name?: string
          city?: string
          contact_first_name?: string
          contact_last_name?: string
          created_at?: string
          credits_balance?: number
          deleted_at?: string | null
          email?: string
          facebook_url?: string | null
          id?: string
          pause_reason?: string | null
          paused_at?: string | null
          paused_by?: string | null
          phone?: string
          profile_id?: string
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          services?: string[]
          status?: Database["public"]["Enums"]["partner_status"]
          updated_at?: string
          website?: string | null
          zones?: string[]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          must_change_password: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          must_change_password?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          must_change_password?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      prospects: {
        Row: {
          audience: Database["public"]["Enums"]["audience_type"]
          audience_hint: string | null
          budget: string | null
          city: string | null
          company_name: string | null
          created_at: string
          email: string | null
          form_type: string
          full_name: string | null
          id: string
          legal_form: string | null
          message: string | null
          page_url: string | null
          phone: string | null
          qualification_notes: string | null
          qualified_at: string | null
          qualified_by: string | null
          raw_payload: Json
          referrer: string | null
          service: string | null
          source: string | null
          status: Database["public"]["Enums"]["prospect_status"]
          statut: string | null
          submitted_at: string | null
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          audience?: Database["public"]["Enums"]["audience_type"]
          audience_hint?: string | null
          budget?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          form_type?: string
          full_name?: string | null
          id?: string
          legal_form?: string | null
          message?: string | null
          page_url?: string | null
          phone?: string | null
          qualification_notes?: string | null
          qualified_at?: string | null
          qualified_by?: string | null
          raw_payload?: Json
          referrer?: string | null
          service?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["prospect_status"]
          statut?: string | null
          submitted_at?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          audience?: Database["public"]["Enums"]["audience_type"]
          audience_hint?: string | null
          budget?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string
          email?: string | null
          form_type?: string
          full_name?: string | null
          id?: string
          legal_form?: string | null
          message?: string | null
          page_url?: string | null
          phone?: string | null
          qualification_notes?: string | null
          qualified_at?: string | null
          qualified_by?: string | null
          raw_payload?: Json
          referrer?: string | null
          service?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["prospect_status"]
          statut?: string | null
          submitted_at?: string | null
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      publish_prospect_as_lead: {
        Args: { _max_unlocks?: number; _prospect_id: string; _summary?: string }
        Returns: string
      }
      unlock_lead: { Args: { _publication_id: string }; Returns: Json }
    }
    Enums: {
      app_role: "admin" | "agent" | "partner"
      audience_type: "creation" | "gestion" | "unknown"
      credit_tx_type:
        | "signup_bonus"
        | "manual_creation_bonus"
        | "admin_grant"
        | "admin_revoke"
        | "unlock_spend"
        | "recharge"
        | "chariow_purchase"
      partner_status: "pending_review" | "approved" | "paused" | "rejected"
      prospect_status:
        | "pending_qualification"
        | "qualified"
        | "rejected"
        | "published"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "agent", "partner"],
      audience_type: ["creation", "gestion", "unknown"],
      credit_tx_type: [
        "signup_bonus",
        "manual_creation_bonus",
        "admin_grant",
        "admin_revoke",
        "unlock_spend",
        "recharge",
        "chariow_purchase",
      ],
      partner_status: ["pending_review", "approved", "paused", "rejected"],
      prospect_status: [
        "pending_qualification",
        "qualified",
        "rejected",
        "published",
      ],
    },
  },
} as const
