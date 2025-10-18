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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      about_info: {
        Row: {
          client_satisfaction: string
          created_at: string
          id: string
          projects_completed: string
          summary: string
          technologies_count: string
          updated_at: string
          years_experience: string
        }
        Insert: {
          client_satisfaction?: string
          created_at?: string
          id?: string
          projects_completed?: string
          summary: string
          technologies_count?: string
          updated_at?: string
          years_experience?: string
        }
        Update: {
          client_satisfaction?: string
          created_at?: string
          id?: string
          projects_completed?: string
          summary?: string
          technologies_count?: string
          updated_at?: string
          years_experience?: string
        }
        Relationships: []
      }
      achievements: {
        Row: {
          category: string
          created_at: string
          date: string
          description: string
          icon_type: string
          id: string
          order_index: number | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          date: string
          description: string
          icon_type?: string
          id?: string
          order_index?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          date?: string
          description?: string
          icon_type?: string
          id?: string
          order_index?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          created_at: string
          credential_id: string | null
          date: string
          description: string | null
          id: string
          issuer: string
          order_index: number | null
          title: string
          updated_at: string
          verify_url: string | null
        }
        Insert: {
          created_at?: string
          credential_id?: string | null
          date: string
          description?: string | null
          id?: string
          issuer: string
          order_index?: number | null
          title: string
          updated_at?: string
          verify_url?: string | null
        }
        Update: {
          created_at?: string
          credential_id?: string | null
          date?: string
          description?: string | null
          id?: string
          issuer?: string
          order_index?: number | null
          title?: string
          updated_at?: string
          verify_url?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string
          degree: string
          description: string | null
          duration: string
          grade: string | null
          id: string
          institution: string
          location: string
          order_index: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          degree: string
          description?: string | null
          duration: string
          grade?: string | null
          id?: string
          institution: string
          location: string
          order_index?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          degree?: string
          description?: string | null
          duration?: string
          grade?: string | null
          id?: string
          institution?: string
          location?: string
          order_index?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          company: string
          created_at: string
          description: string[]
          duration: string
          id: string
          location: string
          order_index: number | null
          title: string
          updated_at: string
        }
        Insert: {
          company: string
          created_at?: string
          description?: string[]
          duration: string
          id?: string
          location: string
          order_index?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          company?: string
          created_at?: string
          description?: string[]
          duration?: string
          id?: string
          location?: string
          order_index?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      internships: {
        Row: {
          company: string
          created_at: string
          description: string[]
          duration: string
          id: string
          location: string
          order_index: number | null
          title: string
          updated_at: string
        }
        Insert: {
          company: string
          created_at?: string
          description?: string[]
          duration: string
          id?: string
          location: string
          order_index?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          company?: string
          created_at?: string
          description?: string[]
          duration?: string
          id?: string
          location?: string
          order_index?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      personal_info: {
        Row: {
          created_at: string
          email: string | null
          github_url: string | null
          id: string
          instagram_url: string | null
          linkedin_url: string | null
          location: string | null
          name: string
          phone: string | null
          profile_picture_url: string | null
          subtitle: string | null
          title: string
          twitter_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          github_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          location?: string | null
          name: string
          phone?: string | null
          profile_picture_url?: string | null
          subtitle?: string | null
          title: string
          twitter_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          github_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          location?: string | null
          name?: string
          phone?: string | null
          profile_picture_url?: string | null
          subtitle?: string | null
          title?: string
          twitter_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string
          github_url: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          live_url: string | null
          order_index: number | null
          technologies: string[]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          github_url?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          live_url?: string | null
          order_index?: number | null
          technologies?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          github_url?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          live_url?: string | null
          order_index?: number | null
          technologies?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          client_company: string | null
          client_image_url: string | null
          client_name: string
          client_position: string | null
          created_at: string
          id: string
          is_approved: boolean | null
          is_featured: boolean | null
          order_index: number | null
          project_name: string | null
          rating: number
          review_text: string
          updated_at: string
          work_duration: string | null
        }
        Insert: {
          client_company?: string | null
          client_image_url?: string | null
          client_name: string
          client_position?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          order_index?: number | null
          project_name?: string | null
          rating: number
          review_text: string
          updated_at?: string
          work_duration?: string | null
        }
        Update: {
          client_company?: string | null
          client_image_url?: string | null
          client_name?: string
          client_position?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          order_index?: number | null
          project_name?: string | null
          rating?: number
          review_text?: string
          updated_at?: string
          work_duration?: string | null
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string
          icon_type: string
          id: string
          is_active: boolean
          order_index: number | null
          platform: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          icon_type?: string
          id?: string
          is_active?: boolean
          order_index?: number | null
          platform: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          icon_type?: string
          id?: string
          is_active?: boolean
          order_index?: number | null
          platform?: string
          updated_at?: string
          url?: string
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
    Enums: {},
  },
} as const
