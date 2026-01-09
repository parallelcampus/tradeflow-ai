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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_suggested_questions: {
        Row: {
          category: string
          click_count: number | null
          created_at: string
          icon: string | null
          id: string
          is_active: boolean | null
          priority: number | null
          question: string
          target_industries: string[] | null
          target_roles: string[] | null
          updated_at: string
        }
        Insert: {
          category?: string
          click_count?: number | null
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          question: string
          target_industries?: string[] | null
          target_roles?: string[] | null
          updated_at?: string
        }
        Update: {
          category?: string
          click_count?: number | null
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          question?: string
          target_industries?: string[] | null
          target_roles?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      consultant_availability: {
        Row: {
          consultant_id: string
          created_at: string | null
          day_of_week: number | null
          end_time: string
          id: string
          is_recurring: boolean | null
          specific_date: string | null
          start_time: string
        }
        Insert: {
          consultant_id: string
          created_at?: string | null
          day_of_week?: number | null
          end_time: string
          id?: string
          is_recurring?: boolean | null
          specific_date?: string | null
          start_time: string
        }
        Update: {
          consultant_id?: string
          created_at?: string | null
          day_of_week?: number | null
          end_time?: string
          id?: string
          is_recurring?: boolean | null
          specific_date?: string | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultant_availability_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["id"]
          },
        ]
      }
      consultant_industries: {
        Row: {
          consultant_id: string
          expertise_level: string | null
          id: string
          industry_id: string
        }
        Insert: {
          consultant_id: string
          expertise_level?: string | null
          id?: string
          industry_id: string
        }
        Update: {
          consultant_id?: string
          expertise_level?: string | null
          id?: string
          industry_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultant_industries_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultant_industries_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
        ]
      }
      consultant_meetings: {
        Row: {
          client_company: string | null
          client_email: string
          client_id: string | null
          client_name: string
          consultant_id: string
          created_at: string | null
          duration_minutes: number | null
          end_time: string
          id: string
          meeting_date: string
          meeting_link: string | null
          meeting_type: string | null
          notes: string | null
          service_id: string | null
          start_time: string
          status: string | null
          total_cost: number | null
          updated_at: string | null
        }
        Insert: {
          client_company?: string | null
          client_email: string
          client_id?: string | null
          client_name: string
          consultant_id: string
          created_at?: string | null
          duration_minutes?: number | null
          end_time: string
          id?: string
          meeting_date: string
          meeting_link?: string | null
          meeting_type?: string | null
          notes?: string | null
          service_id?: string | null
          start_time: string
          status?: string | null
          total_cost?: number | null
          updated_at?: string | null
        }
        Update: {
          client_company?: string | null
          client_email?: string
          client_id?: string | null
          client_name?: string
          consultant_id?: string
          created_at?: string | null
          duration_minutes?: number | null
          end_time?: string
          id?: string
          meeting_date?: string
          meeting_link?: string | null
          meeting_type?: string | null
          notes?: string | null
          service_id?: string | null
          start_time?: string
          status?: string | null
          total_cost?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultant_meetings_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultant_meetings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "consultant_services"
            referencedColumns: ["id"]
          },
        ]
      }
      consultant_reviews: {
        Row: {
          consultant_id: string
          created_at: string | null
          id: string
          is_verified: boolean | null
          rating: number
          review_text: string | null
          reviewer_company: string | null
          reviewer_id: string | null
          reviewer_name: string
          title: string | null
        }
        Insert: {
          consultant_id: string
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          rating: number
          review_text?: string | null
          reviewer_company?: string | null
          reviewer_id?: string | null
          reviewer_name: string
          title?: string | null
        }
        Update: {
          consultant_id?: string
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          rating?: number
          review_text?: string | null
          reviewer_company?: string | null
          reviewer_id?: string | null
          reviewer_name?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultant_reviews_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["id"]
          },
        ]
      }
      consultant_services: {
        Row: {
          consultant_id: string
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          price: number | null
          service_name: string
        }
        Insert: {
          consultant_id: string
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          price?: number | null
          service_name: string
        }
        Update: {
          consultant_id?: string
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          price?: number | null
          service_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultant_services_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["id"]
          },
        ]
      }
      consultant_success_stories: {
        Row: {
          challenge: string | null
          client_company: string | null
          client_name: string | null
          consultant_id: string
          created_at: string | null
          id: string
          industry: string | null
          is_featured: boolean | null
          metrics: Json | null
          results: string | null
          solution: string | null
          testimonial_quote: string | null
          title: string
        }
        Insert: {
          challenge?: string | null
          client_company?: string | null
          client_name?: string | null
          consultant_id: string
          created_at?: string | null
          id?: string
          industry?: string | null
          is_featured?: boolean | null
          metrics?: Json | null
          results?: string | null
          solution?: string | null
          testimonial_quote?: string | null
          title: string
        }
        Update: {
          challenge?: string | null
          client_company?: string | null
          client_name?: string | null
          consultant_id?: string
          created_at?: string | null
          id?: string
          industry?: string | null
          is_featured?: boolean | null
          metrics?: Json | null
          results?: string | null
          solution?: string | null
          testimonial_quote?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultant_success_stories_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["id"]
          },
        ]
      }
      consultants: {
        Row: {
          avatar_url: string | null
          average_rating: number | null
          bio: string | null
          certifications: string[] | null
          country: string | null
          created_at: string | null
          currency: string | null
          education: string[] | null
          email: string
          full_name: string
          headline: string | null
          hourly_rate: number | null
          id: string
          is_available: boolean | null
          is_verified: boolean | null
          languages: string[] | null
          linkedin_url: string | null
          location: string | null
          phone: string | null
          timezone: string | null
          total_consultations: number | null
          updated_at: string | null
          user_id: string | null
          website_url: string | null
          years_experience: number | null
        }
        Insert: {
          avatar_url?: string | null
          average_rating?: number | null
          bio?: string | null
          certifications?: string[] | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          education?: string[] | null
          email: string
          full_name: string
          headline?: string | null
          hourly_rate?: number | null
          id?: string
          is_available?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          timezone?: string | null
          total_consultations?: number | null
          updated_at?: string | null
          user_id?: string | null
          website_url?: string | null
          years_experience?: number | null
        }
        Update: {
          avatar_url?: string | null
          average_rating?: number | null
          bio?: string | null
          certifications?: string[] | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          education?: string[] | null
          email?: string
          full_name?: string
          headline?: string | null
          hourly_rate?: number | null
          id?: string
          is_available?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          timezone?: string | null
          total_consultations?: number | null
          updated_at?: string | null
          user_id?: string | null
          website_url?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      industries: {
        Row: {
          created_at: string | null
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          country: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          language_preference: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          language_preference?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          language_preference?: string | null
          phone?: string | null
          updated_at?: string
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
    }
    Enums: {
      app_role:
        | "super_admin"
        | "regional_admin"
        | "consultant"
        | "exporter"
        | "importer"
        | "buyer"
        | "seller"
        | "event_organizer"
        | "delegation_manager"
        | "trainer"
        | "corporate_member"
        | "govt_liaison"
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
      app_role: [
        "super_admin",
        "regional_admin",
        "consultant",
        "exporter",
        "importer",
        "buyer",
        "seller",
        "event_organizer",
        "delegation_manager",
        "trainer",
        "corporate_member",
        "govt_liaison",
      ],
    },
  },
} as const
