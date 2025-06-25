export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blood_pressure_records: {
        Row: {
          category:
            | Database["public"]["Enums"]["blood_pressure_category"]
            | null
          created_at: string | null
          diastolic: number
          id: string
          notes: string | null
          recorded_at: string | null
          systolic: number
          user_id: string
        }
        Insert: {
          category?:
            | Database["public"]["Enums"]["blood_pressure_category"]
            | null
          created_at?: string | null
          diastolic: number
          id?: string
          notes?: string | null
          recorded_at?: string | null
          systolic: number
          user_id: string
        }
        Update: {
          category?:
            | Database["public"]["Enums"]["blood_pressure_category"]
            | null
          created_at?: string | null
          diastolic?: number
          id?: string
          notes?: string | null
          recorded_at?: string | null
          systolic?: number
          user_id?: string
        }
        Relationships: []
      }
      health_records: {
        Row: {
          created_at: string | null
          id: string
          metric_type: Database["public"]["Enums"]["health_metric_type"]
          notes: string | null
          recorded_at: string | null
          unit: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          metric_type: Database["public"]["Enums"]["health_metric_type"]
          notes?: string | null
          recorded_at?: string | null
          unit: string
          user_id: string
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          metric_type?: Database["public"]["Enums"]["health_metric_type"]
          notes?: string | null
          recorded_at?: string | null
          unit?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_goals: {
        Row: {
          created_at: string | null
          goal_type: string | null
          id: string
          is_active: boolean | null
          metric_type: Database["public"]["Enums"]["health_metric_type"]
          target_value: number
          unit: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          goal_type?: string | null
          id?: string
          is_active?: boolean | null
          metric_type: Database["public"]["Enums"]["health_metric_type"]
          target_value: number
          unit: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          goal_type?: string | null
          id?: string
          is_active?: boolean | null
          metric_type?: Database["public"]["Enums"]["health_metric_type"]
          target_value?: number
          unit?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_bp_category: {
        Args: { systolic: number; diastolic: number }
        Returns: Database["public"]["Enums"]["blood_pressure_category"]
      }
    }
    Enums: {
      blood_pressure_category: "normal" | "elevated" | "stage_1" | "stage_2"
      health_metric_type:
        | "steps"
        | "weight"
        | "heart_rate"
        | "blood_pressure"
        | "water_intake"
        | "sleep"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      blood_pressure_category: ["normal", "elevated", "stage_1", "stage_2"],
      health_metric_type: [
        "steps",
        "weight",
        "heart_rate",
        "blood_pressure",
        "water_intake",
        "sleep",
      ],
    },
  },
} as const
