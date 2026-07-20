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
      chariow_payment_intents: {
        Row: {
          chariow_payment_id: string | null
          consumed_at: string | null
          created_at: string
          id: string
          partner_id: string
          product_id: string
          profile_id: string
        }
        Insert: {
          chariow_payment_id?: string | null
          consumed_at?: string | null
          created_at?: string
          id?: string
          partner_id: string
          product_id: string
          profile_id: string
        }
        Update: {
          chariow_payment_id?: string | null
          consumed_at?: string | null
          created_at?: string
          id?: string
          partner_id?: string
          product_id?: string
          profile_id?: string
        }
        Relationships: []
      }
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
      email_alert_state: {
        Row: {
          last_alert_at: string
          last_rate: number | null
          last_volume: number | null
          metric: string
          scope: string
        }
        Insert: {
          last_alert_at?: string
          last_rate?: number | null
          last_volume?: number | null
          metric: string
          scope: string
        }
        Update: {
          last_alert_at?: string
          last_rate?: number | null
          last_volume?: number | null
          metric?: string
          scope?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
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
          premium_until: string | null
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
          premium_until?: string | null
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
          premium_until?: string | null
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
      partner_members: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          invited_by: string | null
          last_name: string
          partner_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          invited_by?: string | null
          last_name: string
          partner_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          invited_by?: string | null
          last_name?: string
          partner_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      partner_video_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          max_progress: number
          partner_id: string
          updated_at: string
          video_slug: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          max_progress?: number
          partner_id: string
          updated_at?: string
          video_slug: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          max_progress?: number
          partner_id?: string
          updated_at?: string
          video_slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_video_progress_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          academy_drip_index: number
          academy_drip_last_sent_at: string | null
          approved_at: string | null
          approved_by: string | null
          cabinet_name: string
          city: string
          contact_first_name: string
          contact_last_name: string
          contact_role: string | null
          created_at: string
          credits_balance: number
          deleted_at: string | null
          docs_received_at: string | null
          docs_reminder_last_sent_at: string | null
          email: string
          email_bounce_reason: string | null
          email_bounced_at: string | null
          facebook_url: string | null
          id: string
          last_login_at: string | null
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
          tier: string
          tutorial_max_progress: number
          tutorial_watched_at: string | null
          unlimited_until: string | null
          updated_at: string
          wants_logo: boolean | null
          wants_website: boolean | null
          website: string | null
          zones: string[]
        }
        Insert: {
          academy_drip_index?: number
          academy_drip_last_sent_at?: string | null
          approved_at?: string | null
          approved_by?: string | null
          cabinet_name: string
          city: string
          contact_first_name: string
          contact_last_name: string
          contact_role?: string | null
          created_at?: string
          credits_balance?: number
          deleted_at?: string | null
          docs_received_at?: string | null
          docs_reminder_last_sent_at?: string | null
          email: string
          email_bounce_reason?: string | null
          email_bounced_at?: string | null
          facebook_url?: string | null
          id?: string
          last_login_at?: string | null
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
          tier?: string
          tutorial_max_progress?: number
          tutorial_watched_at?: string | null
          unlimited_until?: string | null
          updated_at?: string
          wants_logo?: boolean | null
          wants_website?: boolean | null
          website?: string | null
          zones?: string[]
        }
        Update: {
          academy_drip_index?: number
          academy_drip_last_sent_at?: string | null
          approved_at?: string | null
          approved_by?: string | null
          cabinet_name?: string
          city?: string
          contact_first_name?: string
          contact_last_name?: string
          contact_role?: string | null
          created_at?: string
          credits_balance?: number
          deleted_at?: string | null
          docs_received_at?: string | null
          docs_reminder_last_sent_at?: string | null
          email?: string
          email_bounce_reason?: string | null
          email_bounced_at?: string | null
          facebook_url?: string | null
          id?: string
          last_login_at?: string | null
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
          tier?: string
          tutorial_max_progress?: number
          tutorial_watched_at?: string | null
          unlimited_until?: string | null
          updated_at?: string
          wants_logo?: boolean | null
          wants_website?: boolean | null
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
          edited_at: string | null
          edited_by: string | null
          email: string | null
          external_notes: string | null
          form_type: string
          full_name: string | null
          id: string
          internal_notes: string | null
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
          edited_at?: string | null
          edited_by?: string | null
          email?: string | null
          external_notes?: string | null
          form_type?: string
          full_name?: string | null
          id?: string
          internal_notes?: string | null
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
          edited_at?: string | null
          edited_by?: string | null
          email?: string | null
          external_notes?: string | null
          form_type?: string
          full_name?: string | null
          id?: string
          internal_notes?: string | null
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
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
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
      auto_pause_inactive_partners: { Args: never; Returns: number }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_partner_team: {
        Args: { _partner_id: string; _user_id: string }
        Returns: boolean
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      partner_id_for_user: { Args: { _user_id: string }; Returns: string }
      publish_prospect_as_lead: {
        Args: { _max_unlocks?: number; _prospect_id: string; _summary?: string }
        Returns: string
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
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
        | "chariow_unlimited"
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
        "chariow_unlimited",
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
