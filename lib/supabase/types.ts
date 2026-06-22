export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      agent_content: {
        Row: {
          content: Json
          created_at: string | null
          id: string
          key_insight: string | null
          metadata: Json | null
          published_at: string | null
          pulse_signal: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          run_id: string
          scenario: string | null
          source_query: string | null
          source_title: string | null
          source_url: string | null
          status: string
          type: string
          verdict: string | null
          verdict_sentence: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          id?: string
          key_insight?: string | null
          metadata?: Json | null
          published_at?: string | null
          pulse_signal?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          run_id: string
          scenario?: string | null
          source_query?: string | null
          source_title?: string | null
          source_url?: string | null
          status?: string
          type: string
          verdict?: string | null
          verdict_sentence?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          key_insight?: string | null
          metadata?: Json | null
          published_at?: string | null
          pulse_signal?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          run_id?: string
          scenario?: string | null
          source_query?: string | null
          source_title?: string | null
          source_url?: string | null
          status?: string
          type?: string
          verdict?: string | null
          verdict_sentence?: string | null
        }
        Relationships: []
      }
      alert_events: {
        Row: {
          alert_id: string
          data: Json | null
          fired_at: string | null
          id: string
          message: string
        }
        Insert: {
          alert_id: string
          data?: Json | null
          fired_at?: string | null
          id?: string
          message: string
        }
        Update: {
          alert_id?: string
          data?: Json | null
          fired_at?: string | null
          id?: string
          message?: string
        }
        Relationships: [
          {
            foreignKeyName: "alert_events_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          alert_type: string
          column_name: string | null
          condition: string
          created_at: string | null
          fire_count: number | null
          id: string
          is_active: boolean | null
          last_fired_at: string | null
          name: string
          notify_email: boolean | null
          threshold: number | null
          upload_id: string | null
          user_id: string
        }
        Insert: {
          alert_type: string
          column_name?: string | null
          condition: string
          created_at?: string | null
          fire_count?: number | null
          id?: string
          is_active?: boolean | null
          last_fired_at?: string | null
          name: string
          notify_email?: boolean | null
          threshold?: number | null
          upload_id?: string | null
          user_id: string
        }
        Update: {
          alert_type?: string
          column_name?: string | null
          condition?: string
          created_at?: string | null
          fire_count?: number | null
          id?: string
          is_active?: boolean | null
          last_fired_at?: string | null
          name?: string
          notify_email?: boolean | null
          threshold?: number | null
          upload_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      anomalies: {
        Row: {
          body: string
          created_at: string | null
          id: string
          metric: string | null
          product: string | null
          prompt: string | null
          seen: boolean | null
          severity: string
          threshold: number | null
          title: string
          type: string
          user_id: string
          value: number | null
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          metric?: string | null
          product?: string | null
          prompt?: string | null
          seen?: boolean | null
          severity: string
          threshold?: number | null
          title: string
          type: string
          user_id: string
          value?: number | null
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          metric?: string | null
          product?: string | null
          prompt?: string | null
          seen?: boolean | null
          severity?: string
          threshold?: number | null
          title?: string
          type?: string
          user_id?: string
          value?: number | null
        }
        Relationships: []
      }
      api_usage: {
        Row: {
          cost_usd: number
          created_at: string | null
          id: string
          input_tokens: number
          model: string
          output_tokens: number
          route: string
          user_id: string | null
        }
        Insert: {
          cost_usd?: number
          created_at?: string | null
          id?: string
          input_tokens?: number
          model: string
          output_tokens?: number
          route: string
          user_id?: string | null
        }
        Update: {
          cost_usd?: number
          created_at?: string | null
          id?: string
          input_tokens?: number
          model?: string
          output_tokens?: number
          route?: string
          user_id?: string | null
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          created_at: string | null
          event: string
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      billing_events: {
        Row: {
          amount: number | null
          created_at: string | null
          currency: string | null
          event_type: string
          id: string
          metadata: Json | null
          plan_id: string | null
          stripe_event_id: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          plan_id?: string | null
          stripe_event_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          plan_id?: string | null
          stripe_event_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      business_memory: {
        Row: {
          category: string
          confidence: string | null
          created_at: string | null
          id: string
          key: string
          source: string | null
          updated_at: string | null
          user_id: string
          value: string
        }
        Insert: {
          category: string
          confidence?: string | null
          created_at?: string | null
          id?: string
          key: string
          source?: string | null
          updated_at?: string | null
          user_id: string
          value: string
        }
        Update: {
          category?: string
          confidence?: string | null
          created_at?: string | null
          id?: string
          key?: string
          source?: string | null
          updated_at?: string | null
          user_id?: string
          value?: string
        }
        Relationships: []
      }
      cfo_expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          id: string
          notes: string | null
          receipt_url: string | null
          user_id: string
          vendor: string
        }
        Insert: {
          amount: number
          category?: string
          created_at?: string
          date: string
          id?: string
          notes?: string | null
          receipt_url?: string | null
          user_id: string
          vendor: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          receipt_url?: string | null
          user_id?: string
          vendor?: string
        }
        Relationships: []
      }
      cfo_receivables: {
        Row: {
          amount: number
          counterparty: string
          created_at: string | null
          days_overdue: number | null
          due_date: string
          id: string
          notes: string | null
          status: string | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          counterparty: string
          created_at?: string | null
          days_overdue?: number | null
          due_date: string
          id?: string
          notes?: string | null
          status?: string | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          counterparty?: string
          created_at?: string | null
          days_overdue?: number | null
          due_date?: string
          id?: string
          notes?: string | null
          status?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      connected_sources: {
        Row: {
          config: Json | null
          created_at: string | null
          credentials: Json | null
          error_message: string | null
          id: string
          last_synced_at: string | null
          name: string
          source_type: string
          status: string | null
          sync_interval_minutes: number | null
          user_id: string
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          credentials?: Json | null
          error_message?: string | null
          id?: string
          last_synced_at?: string | null
          name: string
          source_type: string
          status?: string | null
          sync_interval_minutes?: number | null
          user_id: string
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          credentials?: Json | null
          error_message?: string | null
          id?: string
          last_synced_at?: string | null
          name?: string
          source_type?: string
          status?: string | null
          sync_interval_minutes?: number | null
          user_id?: string
        }
        Relationships: []
      }
      consent_log: {
        Row: {
          action: string
          consent_type: string
          created_at: string | null
          id: string
          ip_hash: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          consent_type: string
          created_at?: string | null
          id?: string
          ip_hash?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          consent_type?: string
          created_at?: string | null
          id?: string
          ip_hash?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          project_id: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id?: string | null
          title?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_briefs: {
        Row: {
          action: string | null
          created_at: string | null
          date: string
          health_score: number | null
          id: string
          improved: string | null
          opened_at: string | null
          sent_at: string | null
          user_id: string
          worsened: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          date: string
          health_score?: number | null
          id?: string
          improved?: string | null
          opened_at?: string | null
          sent_at?: string | null
          user_id: string
          worsened?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string | null
          date?: string
          health_score?: number | null
          id?: string
          improved?: string | null
          opened_at?: string | null
          sent_at?: string | null
          user_id?: string
          worsened?: string | null
        }
        Relationships: []
      }
      dashboard_tiles: {
        Row: {
          config: Json
          created_at: string | null
          dashboard_id: string
          id: string
          position: number | null
          tile_type: string
          title: string | null
        }
        Insert: {
          config?: Json
          created_at?: string | null
          dashboard_id: string
          id?: string
          position?: number | null
          tile_type: string
          title?: string | null
        }
        Update: {
          config?: Json
          created_at?: string | null
          dashboard_id?: string
          id?: string
          position?: number | null
          tile_type?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_tiles_dashboard_id_fkey"
            columns: ["dashboard_id"]
            isOneToOne: false
            referencedRelation: "dashboards"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboards: {
        Row: {
          created_at: string | null
          id: string
          is_public: boolean | null
          team_id: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          team_id?: string | null
          title?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          team_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dashboards_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      decisions: {
        Row: {
          after_value: string | null
          before_value: string | null
          context_snapshot: Json | null
          created_at: string | null
          decision_type: string
          description: string | null
          id: string
          product: string | null
          review_at: string | null
          review_result: string | null
          review_verdict: string | null
          reviewed: boolean | null
          title: string
          user_id: string
        }
        Insert: {
          after_value?: string | null
          before_value?: string | null
          context_snapshot?: Json | null
          created_at?: string | null
          decision_type: string
          description?: string | null
          id?: string
          product?: string | null
          review_at?: string | null
          review_result?: string | null
          review_verdict?: string | null
          reviewed?: boolean | null
          title: string
          user_id: string
        }
        Update: {
          after_value?: string | null
          before_value?: string | null
          context_snapshot?: Json | null
          created_at?: string | null
          decision_type?: string
          description?: string | null
          id?: string
          product?: string | null
          review_at?: string | null
          review_result?: string | null
          review_verdict?: string | null
          reviewed?: boolean | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      deletion_requests: {
        Row: {
          cancelled_at: string | null
          id: string
          reason: string | null
          requested_at: string | null
          scheduled_for: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          cancelled_at?: string | null
          id?: string
          reason?: string | null
          requested_at?: string | null
          scheduled_for?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          cancelled_at?: string | null
          id?: string
          reason?: string | null
          requested_at?: string | null
          scheduled_for?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      device_fingerprints: {
        Row: {
          fingerprint: string
          first_seen_at: string | null
          id: string
          is_blocked: boolean | null
          last_seen_at: string | null
          signup_count: number | null
          user_id: string | null
        }
        Insert: {
          fingerprint: string
          first_seen_at?: string | null
          id?: string
          is_blocked?: boolean | null
          last_seen_at?: string | null
          signup_count?: number | null
          user_id?: string | null
        }
        Update: {
          fingerprint?: string
          first_seen_at?: string | null
          id?: string
          is_blocked?: boolean | null
          last_seen_at?: string | null
          signup_count?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      email_domain_registry: {
        Row: {
          domain: string
          id: string
          is_blocked: boolean | null
          notes: string | null
          signup_count: number | null
          updated_at: string | null
        }
        Insert: {
          domain: string
          id?: string
          is_blocked?: boolean | null
          notes?: string | null
          signup_count?: number | null
          updated_at?: string | null
        }
        Update: {
          domain?: string
          id?: string
          is_blocked?: boolean | null
          notes?: string | null
          signup_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      expansion_candidates: {
        Row: {
          candidate_name: string
          candidate_type: string | null
          cannibalization_risk: string | null
          confidence: string | null
          created_at: string | null
          estimated_margin: number | null
          id: string
          opportunity_score: number | null
          raw_data: Json | null
          recommended_launch: string | null
          status: string | null
          user_id: string
          why_it_fits: string | null
        }
        Insert: {
          candidate_name: string
          candidate_type?: string | null
          cannibalization_risk?: string | null
          confidence?: string | null
          created_at?: string | null
          estimated_margin?: number | null
          id?: string
          opportunity_score?: number | null
          raw_data?: Json | null
          recommended_launch?: string | null
          status?: string | null
          user_id: string
          why_it_fits?: string | null
        }
        Update: {
          candidate_name?: string
          candidate_type?: string | null
          cannibalization_risk?: string | null
          confidence?: string | null
          created_at?: string | null
          estimated_margin?: number | null
          id?: string
          opportunity_score?: number | null
          raw_data?: Json | null
          recommended_launch?: string | null
          status?: string | null
          user_id?: string
          why_it_fits?: string | null
        }
        Relationships: []
      }
      exports: {
        Row: {
          created_at: string | null
          export_type: string
          file_url: string | null
          id: string
          source: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          export_type: string
          file_url?: string | null
          id?: string
          source?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          export_type?: string
          file_url?: string | null
          id?: string
          source?: string | null
          user_id?: string
        }
        Relationships: []
      }
      financial_snapshots: {
        Row: {
          avg_margin_pct: number | null
          business_type: string | null
          country: string | null
          created_at: string | null
          data_period: string | null
          id: string
          low_stock_count: number | null
          product_count: number | null
          sector: string | null
          top_categories: string[] | null
          total_revenue: number | null
          upload_id: string | null
          user_id: string | null
        }
        Insert: {
          avg_margin_pct?: number | null
          business_type?: string | null
          country?: string | null
          created_at?: string | null
          data_period?: string | null
          id?: string
          low_stock_count?: number | null
          product_count?: number | null
          sector?: string | null
          top_categories?: string[] | null
          total_revenue?: number | null
          upload_id?: string | null
          user_id?: string | null
        }
        Update: {
          avg_margin_pct?: number | null
          business_type?: string | null
          country?: string | null
          created_at?: string | null
          data_period?: string | null
          id?: string
          low_stock_count?: number | null
          product_count?: number | null
          sector?: string | null
          top_categories?: string[] | null
          total_revenue?: number | null
          upload_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_snapshots_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      forecasts: {
        Row: {
          accuracy: number | null
          created_at: string | null
          date_column: string | null
          horizon_days: number | null
          id: string
          method: string | null
          name: string
          result: Json | null
          target_column: string
          upload_id: string | null
          user_id: string
        }
        Insert: {
          accuracy?: number | null
          created_at?: string | null
          date_column?: string | null
          horizon_days?: number | null
          id?: string
          method?: string | null
          name: string
          result?: Json | null
          target_column: string
          upload_id?: string | null
          user_id: string
        }
        Update: {
          accuracy?: number | null
          created_at?: string | null
          date_column?: string | null
          horizon_days?: number | null
          id?: string
          method?: string | null
          name?: string
          result?: Json | null
          target_column?: string
          upload_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forecasts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      geo_cache: {
        Row: {
          cached_at: string | null
          city: string | null
          country: string | null
          country_code: string | null
          currency: string | null
          ip_hash: string
          sector: string | null
        }
        Insert: {
          cached_at?: string | null
          city?: string | null
          country?: string | null
          country_code?: string | null
          currency?: string | null
          ip_hash: string
          sector?: string | null
        }
        Update: {
          cached_at?: string | null
          city?: string | null
          country?: string | null
          country_code?: string | null
          currency?: string | null
          ip_hash?: string
          sector?: string | null
        }
        Relationships: []
      }
      global_product_catalogue: {
        Row: {
          avg_gross_margin: number | null
          avg_selling_price: number | null
          avg_units_sold: number | null
          category: string | null
          channel: string
          created_at: string | null
          currency: string
          data_points: number
          id: string
          last_updated_at: string | null
          max_selling_price: number | null
          median_selling_price: number | null
          merchant_count: number
          min_selling_price: number | null
          period: string
          product_name: string
          region: string
        }
        Insert: {
          avg_gross_margin?: number | null
          avg_selling_price?: number | null
          avg_units_sold?: number | null
          category?: string | null
          channel: string
          created_at?: string | null
          currency?: string
          data_points: number
          id?: string
          last_updated_at?: string | null
          max_selling_price?: number | null
          median_selling_price?: number | null
          merchant_count: number
          min_selling_price?: number | null
          period: string
          product_name: string
          region: string
        }
        Update: {
          avg_gross_margin?: number | null
          avg_selling_price?: number | null
          avg_units_sold?: number | null
          category?: string | null
          channel?: string
          created_at?: string | null
          currency?: string
          data_points?: number
          id?: string
          last_updated_at?: string | null
          max_selling_price?: number | null
          median_selling_price?: number | null
          merchant_count?: number
          min_selling_price?: number | null
          period?: string
          product_name?: string
          region?: string
        }
        Relationships: []
      }
      global_route_intelligence: {
        Row: {
          avg_delay_days: number | null
          avg_transit_days: number | null
          carrier_code: string
          created_at: string | null
          customs_hold_rate: number | null
          data_points: number
          destination_country: string
          id: string
          last_updated_at: string | null
          merchant_count: number
          on_time_rate: number | null
          origin_country: string
          period: string
        }
        Insert: {
          avg_delay_days?: number | null
          avg_transit_days?: number | null
          carrier_code?: string
          created_at?: string | null
          customs_hold_rate?: number | null
          data_points: number
          destination_country: string
          id?: string
          last_updated_at?: string | null
          merchant_count: number
          on_time_rate?: number | null
          origin_country: string
          period: string
        }
        Update: {
          avg_delay_days?: number | null
          avg_transit_days?: number | null
          carrier_code?: string
          created_at?: string | null
          customs_hold_rate?: number | null
          data_points?: number
          destination_country?: string
          id?: string
          last_updated_at?: string | null
          merchant_count?: number
          on_time_rate?: number | null
          origin_country?: string
          period?: string
        }
        Relationships: []
      }
      health_scores: {
        Row: {
          color: string
          components: Json
          created_at: string | null
          id: string
          label: string
          score: number
          summary: string | null
          user_id: string
        }
        Insert: {
          color: string
          components: Json
          created_at?: string | null
          id?: string
          label: string
          score: number
          summary?: string | null
          user_id: string
        }
        Update: {
          color?: string
          components?: Json
          created_at?: string | null
          id?: string
          label?: string
          score?: number
          summary?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ingredient_price_intel: {
        Row: {
          category: string
          created_at: string
          currency: string
          delivery_date: string
          id: string
          ingredient: string
          owner_id: string
          region: string | null
          supplier_type: string | null
          unit: string
          unit_price: number
        }
        Insert: {
          category?: string
          created_at?: string
          currency?: string
          delivery_date?: string
          id?: string
          ingredient: string
          owner_id: string
          region?: string | null
          supplier_type?: string | null
          unit?: string
          unit_price: number
        }
        Update: {
          category?: string
          created_at?: string
          currency?: string
          delivery_date?: string
          id?: string
          ingredient?: string
          owner_id?: string
          region?: string | null
          supplier_type?: string | null
          unit?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "ingredient_price_intel_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ingredient_price_intel_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "suspicious_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          active: boolean | null
          batch_number: string | null
          brand: string | null
          category: string | null
          cost_price: number | null
          created_at: string | null
          expiry_date: string | null
          id: string
          image_url: string | null
          last_sold_at: string | null
          location_id: string | null
          low_stock_threshold: number | null
          name: string
          owner_id: string
          sale_price: number
          sector: string | null
          sku: string | null
          stock_qty: number
          supplier: string | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          batch_number?: string | null
          brand?: string | null
          category?: string | null
          cost_price?: number | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          last_sold_at?: string | null
          location_id?: string | null
          low_stock_threshold?: number | null
          name: string
          owner_id: string
          sale_price?: number
          sector?: string | null
          sku?: string | null
          stock_qty?: number
          supplier?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          batch_number?: string | null
          brand?: string | null
          category?: string | null
          cost_price?: number | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          image_url?: string | null
          last_sold_at?: string | null
          location_id?: string | null
          low_stock_threshold?: number | null
          name?: string
          owner_id?: string
          sale_price?: number
          sector?: string | null
          sku?: string | null
          stock_qty?: number
          supplier?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_restock: {
        Row: {
          cost_per_unit: number | null
          created_at: string | null
          created_by: string | null
          id: string
          inventory_id: string
          notes: string | null
          owner_id: string
          qty_added: number
          supplier: string | null
        }
        Insert: {
          cost_per_unit?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          inventory_id: string
          notes?: string | null
          owner_id: string
          qty_added: number
          supplier?: string | null
        }
        Update: {
          cost_per_unit?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          inventory_id?: string
          notes?: string | null
          owner_id?: string
          qty_added?: number
          supplier?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_restock_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_restock_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      ip_registry: {
        Row: {
          first_seen_at: string | null
          id: string
          ip_country: string | null
          ip_hash: string
          is_flagged: boolean | null
          last_signup_at: string | null
          notes: string | null
          signup_count: number | null
        }
        Insert: {
          first_seen_at?: string | null
          id?: string
          ip_country?: string | null
          ip_hash: string
          is_flagged?: boolean | null
          last_signup_at?: string | null
          notes?: string | null
          signup_count?: number | null
        }
        Update: {
          first_seen_at?: string | null
          id?: string
          ip_country?: string | null
          ip_hash?: string
          is_flagged?: boolean | null
          last_signup_at?: string | null
          notes?: string | null
          signup_count?: number | null
        }
        Relationships: []
      }
      market_benchmarks: {
        Row: {
          business_size: string
          created_at: string | null
          id: string
          metric: string
          period: string
          region: string
          sample_size: number
          sector: string
          value: number
        }
        Insert: {
          business_size: string
          created_at?: string | null
          id?: string
          metric: string
          period: string
          region: string
          sample_size: number
          sector: string
          value: number
        }
        Update: {
          business_size?: string
          created_at?: string | null
          id?: string
          metric?: string
          period?: string
          region?: string
          sample_size?: number
          sector?: string
          value?: number
        }
        Relationships: []
      }
      market_intelligence_searches: {
        Row: {
          created_at: string | null
          id: string
          product_name: string | null
          query: string
          region: string | null
          results_count: number | null
          tavily_fired: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_name?: string | null
          query: string
          region?: string | null
          results_count?: number | null
          tavily_fired?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_name?: string | null
          query?: string
          region?: string | null
          results_count?: number | null
          tavily_fired?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      merchant_payment_config: {
        Row: {
          country: string
          created_at: string | null
          id: string
          is_active: boolean | null
          owner_id: string
          payment_provider: string
          paystack_business_name: string | null
          paystack_subaccount_id: string | null
          settlement_account: Json | null
          settlement_enabled: boolean | null
          stripe_connected_account_id: string | null
          stripe_onboarding_complete: boolean | null
          stripe_onboarding_url: string | null
          updated_at: string | null
        }
        Insert: {
          country: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          owner_id: string
          payment_provider?: string
          paystack_business_name?: string | null
          paystack_subaccount_id?: string | null
          settlement_account?: Json | null
          settlement_enabled?: boolean | null
          stripe_connected_account_id?: string | null
          stripe_onboarding_complete?: boolean | null
          stripe_onboarding_url?: string | null
          updated_at?: string | null
        }
        Update: {
          country?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          owner_id?: string
          payment_provider?: string
          paystack_business_name?: string | null
          paystack_subaccount_id?: string | null
          settlement_account?: Json | null
          settlement_enabled?: boolean | null
          stripe_connected_account_id?: string | null
          stripe_onboarding_complete?: boolean | null
          stripe_onboarding_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          result_json: Json | null
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          result_json?: Json | null
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          result_json?: Json | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      mpesa_payments: {
        Row: {
          amount: number
          checkout_request_id: string
          completed_at: string | null
          created_at: string | null
          id: string
          merchant_request_id: string | null
          mpesa_receipt: string | null
          phone: string
          plan: string
          result_desc: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          checkout_request_id: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          merchant_request_id?: string | null
          mpesa_receipt?: string | null
          phone: string
          plan: string
          result_desc?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          checkout_request_id?: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          merchant_request_id?: string | null
          mpesa_receipt?: string | null
          phone?: string
          plan?: string
          result_desc?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          created_at: string | null
          id: string
          metadata: Json | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      pending_shopify_installs: {
        Row: {
          access_token: string
          installed_at: string | null
          linked_at: string | null
          shop_domain: string
          shop_name: string | null
          user_id: string | null
        }
        Insert: {
          access_token: string
          installed_at?: string | null
          linked_at?: string | null
          shop_domain: string
          shop_name?: string | null
          user_id?: string | null
        }
        Update: {
          access_token?: string
          installed_at?: string | null
          linked_at?: string | null
          shop_domain?: string
          shop_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      pesapal_payments: {
        Row: {
          amount: number
          completed_at: string | null
          confirmation_code: string | null
          created_at: string | null
          id: string
          merchant_reference: string | null
          order_tracking_id: string
          payment_method: string | null
          plan: string
          status: string | null
          user_id: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          confirmation_code?: string | null
          created_at?: string | null
          id?: string
          merchant_reference?: string | null
          order_tracking_id: string
          payment_method?: string | null
          plan: string
          status?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          confirmation_code?: string | null
          created_at?: string | null
          id?: string
          merchant_reference?: string | null
          order_tracking_id?: string
          payment_method?: string | null
          plan?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          alert_limit: number | null
          api_access: boolean | null
          currency: string | null
          early_adoption: boolean | null
          expansion_intel: boolean | null
          features: string[] | null
          forecast_limit: number | null
          id: string
          is_active: boolean | null
          live_sync: boolean | null
          name: string
          price_monthly: number
          priority_support: boolean | null
          question_limit: number | null
          sort_order: number | null
          source_limit: number | null
          stripe_price_id: string | null
          tagline: string | null
          team_member_limit: number | null
          upload_limit: number | null
        }
        Insert: {
          alert_limit?: number | null
          api_access?: boolean | null
          currency?: string | null
          early_adoption?: boolean | null
          expansion_intel?: boolean | null
          features?: string[] | null
          forecast_limit?: number | null
          id: string
          is_active?: boolean | null
          live_sync?: boolean | null
          name: string
          price_monthly: number
          priority_support?: boolean | null
          question_limit?: number | null
          sort_order?: number | null
          source_limit?: number | null
          stripe_price_id?: string | null
          tagline?: string | null
          team_member_limit?: number | null
          upload_limit?: number | null
        }
        Update: {
          alert_limit?: number | null
          api_access?: boolean | null
          currency?: string | null
          early_adoption?: boolean | null
          expansion_intel?: boolean | null
          features?: string[] | null
          forecast_limit?: number | null
          id?: string
          is_active?: boolean | null
          live_sync?: boolean | null
          name?: string
          price_monthly?: number
          priority_support?: boolean | null
          question_limit?: number | null
          sort_order?: number | null
          source_limit?: number | null
          stripe_price_id?: string | null
          tagline?: string | null
          team_member_limit?: number | null
          upload_limit?: number | null
        }
        Relationships: []
      }
      pos_audit_log: {
        Row: {
          created_at: string
          entity_id: string | null
          entity_type: string | null
          event: string
          from_value: string | null
          id: string
          ip_hint: string | null
          metadata: Json | null
          owner_id: string
          staff_id: string | null
          staff_name: string | null
          staff_role: string | null
          to_value: string | null
        }
        Insert: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          event: string
          from_value?: string | null
          id?: string
          ip_hint?: string | null
          metadata?: Json | null
          owner_id: string
          staff_id?: string | null
          staff_name?: string | null
          staff_role?: string | null
          to_value?: string | null
        }
        Update: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          event?: string
          from_value?: string | null
          id?: string
          ip_hint?: string | null
          metadata?: Json | null
          owner_id?: string
          staff_id?: string | null
          staff_name?: string | null
          staff_role?: string | null
          to_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_audit_log_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_consent_log: {
        Row: {
          consent_type: string
          customer_id: string | null
          id: string
          ip_address: string | null
          notes: string | null
          owner_id: string
          request_source: string | null
          status: string
          timestamp: string | null
          user_agent: string | null
        }
        Insert: {
          consent_type: string
          customer_id?: string | null
          id?: string
          ip_address?: string | null
          notes?: string | null
          owner_id: string
          request_source?: string | null
          status: string
          timestamp?: string | null
          user_agent?: string | null
        }
        Update: {
          consent_type?: string
          customer_id?: string | null
          id?: string
          ip_address?: string | null
          notes?: string | null
          owner_id?: string
          request_source?: string | null
          status?: string
          timestamp?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_consent_log_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "pos_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_consent_log_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_consent_log_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "suspicious_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_customer_preferences: {
        Row: {
          allow_analytics: boolean | null
          allow_email_marketing: boolean | null
          allow_profiling: boolean | null
          allow_sms_marketing: boolean | null
          allow_whatsapp_marketing: boolean | null
          customer_id: string
          data_retention_days: number | null
          id: string
          owner_id: string
          preferred_contact_method: string | null
          updated_at: string | null
        }
        Insert: {
          allow_analytics?: boolean | null
          allow_email_marketing?: boolean | null
          allow_profiling?: boolean | null
          allow_sms_marketing?: boolean | null
          allow_whatsapp_marketing?: boolean | null
          customer_id: string
          data_retention_days?: number | null
          id?: string
          owner_id: string
          preferred_contact_method?: string | null
          updated_at?: string | null
        }
        Update: {
          allow_analytics?: boolean | null
          allow_email_marketing?: boolean | null
          allow_profiling?: boolean | null
          allow_sms_marketing?: boolean | null
          allow_whatsapp_marketing?: boolean | null
          customer_id?: string
          data_retention_days?: number | null
          id?: string
          owner_id?: string
          preferred_contact_method?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_customer_preferences_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "pos_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_customer_preferences_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_customer_preferences_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "suspicious_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_customers: {
        Row: {
          anonymized_at: string | null
          consent_granted_at: string | null
          created_at: string | null
          data_export_requested_at: string | null
          deletion_requested_at: string | null
          first_seen_at: string | null
          id: string
          is_anonymized: boolean | null
          last_gdpr_request_at: string | null
          last_seen_at: string | null
          name: string | null
          owner_id: string
          phone: string
          total_spent: number | null
          visit_count: number | null
        }
        Insert: {
          anonymized_at?: string | null
          consent_granted_at?: string | null
          created_at?: string | null
          data_export_requested_at?: string | null
          deletion_requested_at?: string | null
          first_seen_at?: string | null
          id?: string
          is_anonymized?: boolean | null
          last_gdpr_request_at?: string | null
          last_seen_at?: string | null
          name?: string | null
          owner_id: string
          phone: string
          total_spent?: number | null
          visit_count?: number | null
        }
        Update: {
          anonymized_at?: string | null
          consent_granted_at?: string | null
          created_at?: string | null
          data_export_requested_at?: string | null
          deletion_requested_at?: string | null
          first_seen_at?: string | null
          id?: string
          is_anonymized?: boolean | null
          last_gdpr_request_at?: string | null
          last_seen_at?: string | null
          name?: string | null
          owner_id?: string
          phone?: string
          total_spent?: number | null
          visit_count?: number | null
        }
        Relationships: []
      }
      pos_data_requests: {
        Row: {
          completed_at: string | null
          completion_notes: string | null
          customer_id: string
          data_format: string | null
          exported_to: string | null
          id: string
          owner_id: string
          processed_by: string | null
          request_type: string
          requested_at: string | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          completion_notes?: string | null
          customer_id: string
          data_format?: string | null
          exported_to?: string | null
          id?: string
          owner_id: string
          processed_by?: string | null
          request_type: string
          requested_at?: string | null
          status?: string
        }
        Update: {
          completed_at?: string | null
          completion_notes?: string | null
          customer_id?: string
          data_format?: string | null
          exported_to?: string | null
          id?: string
          owner_id?: string
          processed_by?: string | null
          request_type?: string
          requested_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_data_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "pos_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_data_requests_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_data_requests_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "suspicious_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_data_requests_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_data_requests_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "suspicious_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_engineer_skills: {
        Row: {
          created_at: string | null
          id: string
          preset_id: string
          proficiency: string | null
          staff_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          preset_id: string
          proficiency?: string | null
          staff_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          preset_id?: string
          proficiency?: string | null
          staff_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_engineer_skills_preset_id_fkey"
            columns: ["preset_id"]
            isOneToOne: false
            referencedRelation: "pos_service_presets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_engineer_skills_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_factory_batch_events: {
        Row: {
          batch_id: string
          checkpoint: string
          created_at: string
          id: string
          notes: string | null
          owner_id: string
          photo_url: string
          scanned_by: string | null
          storage: string
        }
        Insert: {
          batch_id: string
          checkpoint: string
          created_at?: string
          id?: string
          notes?: string | null
          owner_id: string
          photo_url: string
          scanned_by?: string | null
          storage?: string
        }
        Update: {
          batch_id?: string
          checkpoint?: string
          created_at?: string
          id?: string
          notes?: string | null
          owner_id?: string
          photo_url?: string
          scanned_by?: string | null
          storage?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_factory_batch_events_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "pos_factory_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_factory_batch_events_scanned_by_fkey"
            columns: ["scanned_by"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_factory_batches: {
        Row: {
          batch_ref: string
          created_at: string
          id: string
          location_id: string | null
          owner_id: string
          product_name: string | null
          status: string
          updated_at: string
        }
        Insert: {
          batch_ref: string
          created_at?: string
          id?: string
          location_id?: string | null
          owner_id: string
          product_name?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          batch_ref?: string
          created_at?: string
          id?: string
          location_id?: string | null
          owner_id?: string
          product_name?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_factory_batches_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_factory_captures: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          batch_ref: string | null
          captured_by: string | null
          created_at: string
          id: string
          location_id: string | null
          notes: string | null
          owner_id: string
          photo_url: string
          product_name: string | null
          quantity: number | null
          rejection_reason: string | null
          shift_id: string | null
          status: string
          storage: string
          type: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          batch_ref?: string | null
          captured_by?: string | null
          created_at?: string
          id?: string
          location_id?: string | null
          notes?: string | null
          owner_id: string
          photo_url: string
          product_name?: string | null
          quantity?: number | null
          rejection_reason?: string | null
          shift_id?: string | null
          status?: string
          storage?: string
          type: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          batch_ref?: string | null
          captured_by?: string | null
          created_at?: string
          id?: string
          location_id?: string | null
          notes?: string | null
          owner_id?: string
          photo_url?: string
          product_name?: string | null
          quantity?: number | null
          rejection_reason?: string | null
          shift_id?: string | null
          status?: string
          storage?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_factory_captures_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_factory_captures_captured_by_fkey"
            columns: ["captured_by"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_factory_captures_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_factory_captures_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "pos_shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_factory_downtime: {
        Row: {
          closed_by: string | null
          created_at: string
          duration_minutes: number | null
          end_photo_url: string | null
          ended_at: string | null
          id: string
          location_id: string | null
          machine_name: string
          notes: string | null
          owner_id: string
          reason: string
          reported_by: string | null
          start_photo_url: string
          started_at: string
          storage: string
          updated_at: string
        }
        Insert: {
          closed_by?: string | null
          created_at?: string
          duration_minutes?: number | null
          end_photo_url?: string | null
          ended_at?: string | null
          id?: string
          location_id?: string | null
          machine_name?: string
          notes?: string | null
          owner_id: string
          reason: string
          reported_by?: string | null
          start_photo_url: string
          started_at?: string
          storage?: string
          updated_at?: string
        }
        Update: {
          closed_by?: string | null
          created_at?: string
          duration_minutes?: number | null
          end_photo_url?: string | null
          ended_at?: string | null
          id?: string
          location_id?: string | null
          machine_name?: string
          notes?: string | null
          owner_id?: string
          reason?: string
          reported_by?: string | null
          start_photo_url?: string
          started_at?: string
          storage?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_factory_downtime_closed_by_fkey"
            columns: ["closed_by"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_factory_downtime_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_factory_downtime_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_factory_quality: {
        Row: {
          batch_ref: string | null
          created_at: string
          defect_type: string
          id: string
          location_id: string | null
          notes: string | null
          owner_id: string
          photo_url: string
          product_name: string | null
          quantity_affected: number | null
          reported_by: string | null
          severity: string
          status: string
          storage: string
          updated_at: string
        }
        Insert: {
          batch_ref?: string | null
          created_at?: string
          defect_type: string
          id?: string
          location_id?: string | null
          notes?: string | null
          owner_id: string
          photo_url: string
          product_name?: string | null
          quantity_affected?: number | null
          reported_by?: string | null
          severity?: string
          status?: string
          storage?: string
          updated_at?: string
        }
        Update: {
          batch_ref?: string | null
          created_at?: string
          defect_type?: string
          id?: string
          location_id?: string | null
          notes?: string | null
          owner_id?: string
          photo_url?: string
          product_name?: string | null
          quantity_affected?: number | null
          reported_by?: string | null
          severity?: string
          status?: string
          storage?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_factory_quality_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_factory_quality_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_factory_shifts: {
        Row: {
          created_at: string
          custom_name: string | null
          duration_minutes: number | null
          end_photo_url: string | null
          ended_at: string | null
          ended_by: string | null
          id: string
          location_id: string | null
          notes: string | null
          owner_id: string
          shift_name: string
          start_photo_url: string
          started_at: string
          started_by: string | null
          status: string
          storage: string
          target_units: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_name?: string | null
          duration_minutes?: number | null
          end_photo_url?: string | null
          ended_at?: string | null
          ended_by?: string | null
          id?: string
          location_id?: string | null
          notes?: string | null
          owner_id: string
          shift_name?: string
          start_photo_url: string
          started_at?: string
          started_by?: string | null
          status?: string
          storage?: string
          target_units?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_name?: string | null
          duration_minutes?: number | null
          end_photo_url?: string | null
          ended_at?: string | null
          ended_by?: string | null
          id?: string
          location_id?: string | null
          notes?: string | null
          owner_id?: string
          shift_name?: string
          start_photo_url?: string
          started_at?: string
          started_by?: string | null
          status?: string
          storage?: string
          target_units?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_factory_shifts_ended_by_fkey"
            columns: ["ended_by"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_factory_shifts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_factory_shifts_started_by_fkey"
            columns: ["started_by"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_factory_waybills: {
        Row: {
          created_at: string
          destination: string
          dispatched_at: string
          dispatched_by: string | null
          id: string
          is_on_time: boolean | null
          location_id: string | null
          notes: string | null
          owner_id: string
          photo_url: string
          product_name: string | null
          quantity: number | null
          scheduled_at: string | null
          status: string
          storage: string
          updated_at: string
          vehicle_ref: string | null
          waybill_ref: string | null
        }
        Insert: {
          created_at?: string
          destination: string
          dispatched_at?: string
          dispatched_by?: string | null
          id?: string
          is_on_time?: boolean | null
          location_id?: string | null
          notes?: string | null
          owner_id: string
          photo_url: string
          product_name?: string | null
          quantity?: number | null
          scheduled_at?: string | null
          status?: string
          storage?: string
          updated_at?: string
          vehicle_ref?: string | null
          waybill_ref?: string | null
        }
        Update: {
          created_at?: string
          destination?: string
          dispatched_at?: string
          dispatched_by?: string | null
          id?: string
          is_on_time?: boolean | null
          location_id?: string | null
          notes?: string | null
          owner_id?: string
          photo_url?: string
          product_name?: string | null
          quantity?: number | null
          scheduled_at?: string | null
          status?: string
          storage?: string
          updated_at?: string
          vehicle_ref?: string | null
          waybill_ref?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_factory_waybills_dispatched_by_fkey"
            columns: ["dispatched_by"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_factory_waybills_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_gdpr_deletion_log: {
        Row: {
          anonymous_transactions_kept_count: number | null
          customer_id: string
          customer_phone: string | null
          deletion_timestamp: string | null
          deletion_type: string | null
          hash: string | null
          id: string
          owner_id: string
          processed_by: string | null
          reason: string | null
          retention_period_years: number | null
        }
        Insert: {
          anonymous_transactions_kept_count?: number | null
          customer_id: string
          customer_phone?: string | null
          deletion_timestamp?: string | null
          deletion_type?: string | null
          hash?: string | null
          id?: string
          owner_id: string
          processed_by?: string | null
          reason?: string | null
          retention_period_years?: number | null
        }
        Update: {
          anonymous_transactions_kept_count?: number | null
          customer_id?: string
          customer_phone?: string | null
          deletion_timestamp?: string | null
          deletion_type?: string | null
          hash?: string | null
          id?: string
          owner_id?: string
          processed_by?: string | null
          reason?: string | null
          retention_period_years?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_gdpr_deletion_log_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_gdpr_deletion_log_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "suspicious_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_gdpr_deletion_log_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_gdpr_deletion_log_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "suspicious_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_image_recognition: {
        Row: {
          created_at: string | null
          id: string
          image_size: number | null
          owner_id: string
          products: Json
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_size?: number | null
          owner_id: string
          products: Json
        }
        Update: {
          created_at?: string | null
          id?: string
          image_size?: number | null
          owner_id?: string
          products?: Json
        }
        Relationships: []
      }
      pos_integration_audit: {
        Row: {
          created_at: string
          endpoint: string | null
          error_message: string | null
          id: string
          integration_id: string
          method: string | null
          operation: string
          owner_id: string
          platform: string
          request_payload: Json | null
          response_payload: Json | null
          status_code: number | null
          success: boolean
        }
        Insert: {
          created_at?: string
          endpoint?: string | null
          error_message?: string | null
          id?: string
          integration_id: string
          method?: string | null
          operation: string
          owner_id: string
          platform: string
          request_payload?: Json | null
          response_payload?: Json | null
          status_code?: number | null
          success: boolean
        }
        Update: {
          created_at?: string
          endpoint?: string | null
          error_message?: string | null
          id?: string
          integration_id?: string
          method?: string | null
          operation?: string
          owner_id?: string
          platform?: string
          request_payload?: Json | null
          response_payload?: Json | null
          status_code?: number | null
          success?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "pos_integration_audit_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "pos_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_integrations: {
        Row: {
          active: boolean | null
          api_key: string | null
          api_secret: string | null
          commission_rate: number | null
          connected_at: string | null
          created_at: string | null
          credentials_json: Json | null
          disconnected_at: string | null
          error_count: number | null
          error_log_json: Json | null
          id: string
          is_active: boolean | null
          last_error: string | null
          last_menu_sync_at: string | null
          last_sync_at: string | null
          last_webhook_received_at: string | null
          location_id: string | null
          metadata: Json | null
          name: string | null
          next_sync_scheduled_at: string | null
          oauth_expires_at: string | null
          oauth_refresh_token: string | null
          oauth_token: string | null
          owner_id: string
          platform: string | null
          provider: string
          sync_enabled: boolean | null
          sync_frequency_minutes: number | null
          updated_at: string | null
          webhook_secret: string | null
          webhook_url: string | null
        }
        Insert: {
          active?: boolean | null
          api_key?: string | null
          api_secret?: string | null
          commission_rate?: number | null
          connected_at?: string | null
          created_at?: string | null
          credentials_json?: Json | null
          disconnected_at?: string | null
          error_count?: number | null
          error_log_json?: Json | null
          id?: string
          is_active?: boolean | null
          last_error?: string | null
          last_menu_sync_at?: string | null
          last_sync_at?: string | null
          last_webhook_received_at?: string | null
          location_id?: string | null
          metadata?: Json | null
          name?: string | null
          next_sync_scheduled_at?: string | null
          oauth_expires_at?: string | null
          oauth_refresh_token?: string | null
          oauth_token?: string | null
          owner_id: string
          platform?: string | null
          provider: string
          sync_enabled?: boolean | null
          sync_frequency_minutes?: number | null
          updated_at?: string | null
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Update: {
          active?: boolean | null
          api_key?: string | null
          api_secret?: string | null
          commission_rate?: number | null
          connected_at?: string | null
          created_at?: string | null
          credentials_json?: Json | null
          disconnected_at?: string | null
          error_count?: number | null
          error_log_json?: Json | null
          id?: string
          is_active?: boolean | null
          last_error?: string | null
          last_menu_sync_at?: string | null
          last_sync_at?: string | null
          last_webhook_received_at?: string | null
          location_id?: string | null
          metadata?: Json | null
          name?: string | null
          next_sync_scheduled_at?: string | null
          oauth_expires_at?: string | null
          oauth_refresh_token?: string | null
          oauth_token?: string | null
          owner_id?: string
          platform?: string | null
          provider?: string
          sync_enabled?: boolean | null
          sync_frequency_minutes?: number | null
          updated_at?: string | null
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_integrations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_intelligence_logs: {
        Row: {
          analysis_data_json: Json | null
          analysis_date: string
          analysis_type: string
          created_at: string | null
          findings_json: Json | null
          id: string
          indexed_at: string | null
          owner_id: string
          period_days: number | null
          raw_analysis: string | null
        }
        Insert: {
          analysis_data_json?: Json | null
          analysis_date: string
          analysis_type: string
          created_at?: string | null
          findings_json?: Json | null
          id?: string
          indexed_at?: string | null
          owner_id: string
          period_days?: number | null
          raw_analysis?: string | null
        }
        Update: {
          analysis_data_json?: Json | null
          analysis_date?: string
          analysis_type?: string
          created_at?: string | null
          findings_json?: Json | null
          id?: string
          indexed_at?: string | null
          owner_id?: string
          period_days?: number | null
          raw_analysis?: string | null
        }
        Relationships: []
      }
      pos_item_tax_codes: {
        Row: {
          category: string
          code: string
          created_at: string | null
          id: string
          is_active: boolean | null
          jurisdiction: string
          label: string | null
          owner_id: string
          rate: number
          updated_at: string | null
        }
        Insert: {
          category: string
          code: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          jurisdiction: string
          label?: string | null
          owner_id: string
          rate: number
          updated_at?: string | null
        }
        Update: {
          category?: string
          code?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          jurisdiction?: string
          label?: string | null
          owner_id?: string
          rate?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_item_tax_codes_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_item_tax_codes_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "suspicious_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_items: {
        Row: {
          cost_price: number | null
          id: string
          image_url: string | null
          inventory_id: string | null
          line_total: number
          name: string
          qty: number
          recognized_by_ai: boolean | null
          refund_reason: string | null
          refunded: boolean | null
          refunded_at: string | null
          tax_amount: number | null
          tax_code: string | null
          tax_rate: number | null
          transaction_id: string
          unit_price: number
        }
        Insert: {
          cost_price?: number | null
          id?: string
          image_url?: string | null
          inventory_id?: string | null
          line_total: number
          name: string
          qty?: number
          recognized_by_ai?: boolean | null
          refund_reason?: string | null
          refunded?: boolean | null
          refunded_at?: string | null
          tax_amount?: number | null
          tax_code?: string | null
          tax_rate?: number | null
          transaction_id: string
          unit_price: number
        }
        Update: {
          cost_price?: number | null
          id?: string
          image_url?: string | null
          inventory_id?: string | null
          line_total?: number
          name?: string
          qty?: number
          recognized_by_ai?: boolean | null
          refund_reason?: string | null
          refunded?: boolean | null
          refunded_at?: string | null
          tax_amount?: number | null
          tax_code?: string | null
          tax_rate?: number | null
          transaction_id?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "pos_items_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_items_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "pos_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_location_tax_settings: {
        Row: {
          business_type: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          jurisdiction_code: string
          local_config_json: Json | null
          location_id: string | null
          owner_id: string
          tax_id: string | null
          updated_at: string | null
        }
        Insert: {
          business_type?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          jurisdiction_code: string
          local_config_json?: Json | null
          location_id?: string | null
          owner_id: string
          tax_id?: string | null
          updated_at?: string | null
        }
        Update: {
          business_type?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          jurisdiction_code?: string
          local_config_json?: Json | null
          location_id?: string | null
          owner_id?: string
          tax_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_location_tax_settings_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_location_tax_settings_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_location_tax_settings_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "suspicious_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_locations: {
        Row: {
          address: string | null
          business_type: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          owner_id: string
          phone: string | null
          tax_id: string | null
          tax_jurisdiction: string | null
          tax_settings_id: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          business_type?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          owner_id: string
          phone?: string | null
          tax_id?: string | null
          tax_jurisdiction?: string | null
          tax_settings_id?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          business_type?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          owner_id?: string
          phone?: string | null
          tax_id?: string | null
          tax_jurisdiction?: string | null
          tax_settings_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pos_logistics_invoices: {
        Row: {
          branch_id: string | null
          captured_by: string | null
          category: string | null
          created_at: string
          currency: string | null
          id: string
          invoice_date: string | null
          invoice_number: string | null
          items: Json | null
          notes: string | null
          owner_id: string
          photo_id: string | null
          total_amount: number
          truck_id: string | null
          updated_at: string
          vendor_name: string | null
        }
        Insert: {
          branch_id?: string | null
          captured_by?: string | null
          category?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          invoice_date?: string | null
          invoice_number?: string | null
          items?: Json | null
          notes?: string | null
          owner_id: string
          photo_id?: string | null
          total_amount?: number
          truck_id?: string | null
          updated_at?: string
          vendor_name?: string | null
        }
        Update: {
          branch_id?: string | null
          captured_by?: string | null
          category?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          invoice_date?: string | null
          invoice_number?: string | null
          items?: Json | null
          notes?: string | null
          owner_id?: string
          photo_id?: string | null
          total_amount?: number
          truck_id?: string | null
          updated_at?: string
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_logistics_invoices_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_logistics_invoices_captured_by_fkey"
            columns: ["captured_by"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_logistics_invoices_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "pos_parcel_photos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_logistics_invoices_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "pos_trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_logistics_payments: {
        Row: {
          amount: number
          branch_id: string | null
          captured_by: string | null
          created_at: string
          currency: string | null
          id: string
          notes: string | null
          owner_id: string
          parcel_id: string | null
          payee_name: string | null
          payer_name: string | null
          payment_date: string | null
          payment_method: string | null
          photo_id: string | null
          receipt_number: string | null
        }
        Insert: {
          amount?: number
          branch_id?: string | null
          captured_by?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          notes?: string | null
          owner_id: string
          parcel_id?: string | null
          payee_name?: string | null
          payer_name?: string | null
          payment_date?: string | null
          payment_method?: string | null
          photo_id?: string | null
          receipt_number?: string | null
        }
        Update: {
          amount?: number
          branch_id?: string | null
          captured_by?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          notes?: string | null
          owner_id?: string
          parcel_id?: string | null
          payee_name?: string | null
          payer_name?: string | null
          payment_date?: string | null
          payment_method?: string | null
          photo_id?: string | null
          receipt_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_logistics_payments_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_logistics_payments_captured_by_fkey"
            columns: ["captured_by"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_logistics_payments_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "pos_parcels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_logistics_payments_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "pos_parcel_photos"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_menu_sync_state: {
        Row: {
          created_at: string
          id: string
          integration_id: string
          items_failed_count: number | null
          items_synced_count: number | null
          last_error: string | null
          last_full_sync_at: string | null
          last_incremental_sync_at: string | null
          location_id: string
          owner_id: string
          platform_catalog_id: string | null
          platform_state: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          integration_id: string
          items_failed_count?: number | null
          items_synced_count?: number | null
          last_error?: string | null
          last_full_sync_at?: string | null
          last_incremental_sync_at?: string | null
          location_id: string
          owner_id: string
          platform_catalog_id?: string | null
          platform_state?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          integration_id?: string
          items_failed_count?: number | null
          items_synced_count?: number | null
          last_error?: string | null
          last_full_sync_at?: string | null
          last_incremental_sync_at?: string | null
          location_id?: string
          owner_id?: string
          platform_catalog_id?: string | null
          platform_state?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_menu_sync_state_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "pos_integrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_menu_sync_state_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_notification_log: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          methods_used_json: Json | null
          notification_type: string
          owner_id: string
          read_at: string | null
          recipient_email: string | null
          recipient_phone: string | null
          sent_at: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          methods_used_json?: Json | null
          notification_type: string
          owner_id: string
          read_at?: string | null
          recipient_email?: string | null
          recipient_phone?: string | null
          sent_at?: string | null
          status: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          methods_used_json?: Json | null
          notification_type?: string
          owner_id?: string
          read_at?: string | null
          recipient_email?: string | null
          recipient_phone?: string | null
          sent_at?: string | null
          status?: string
        }
        Relationships: []
      }
      pos_notification_settings: {
        Row: {
          cash_variance_alerts_enabled: boolean | null
          cash_variance_threshold_amount: number | null
          created_at: string | null
          email_address: string | null
          email_enabled: boolean | null
          email_provider: string | null
          id: string
          inventory_alert_threshold: number | null
          inventory_alerts_enabled: boolean | null
          owner_id: string
          sales_anomaly_alerts_enabled: boolean | null
          sales_anomaly_threshold_percent: number | null
          tax_reminder_alerts_enabled: boolean | null
          tax_reminder_days_before: number | null
          updated_at: string | null
          whatsapp_account_sid: string | null
          whatsapp_enabled: boolean | null
          whatsapp_phone: string | null
        }
        Insert: {
          cash_variance_alerts_enabled?: boolean | null
          cash_variance_threshold_amount?: number | null
          created_at?: string | null
          email_address?: string | null
          email_enabled?: boolean | null
          email_provider?: string | null
          id?: string
          inventory_alert_threshold?: number | null
          inventory_alerts_enabled?: boolean | null
          owner_id: string
          sales_anomaly_alerts_enabled?: boolean | null
          sales_anomaly_threshold_percent?: number | null
          tax_reminder_alerts_enabled?: boolean | null
          tax_reminder_days_before?: number | null
          updated_at?: string | null
          whatsapp_account_sid?: string | null
          whatsapp_enabled?: boolean | null
          whatsapp_phone?: string | null
        }
        Update: {
          cash_variance_alerts_enabled?: boolean | null
          cash_variance_threshold_amount?: number | null
          created_at?: string | null
          email_address?: string | null
          email_enabled?: boolean | null
          email_provider?: string | null
          id?: string
          inventory_alert_threshold?: number | null
          inventory_alerts_enabled?: boolean | null
          owner_id?: string
          sales_anomaly_alerts_enabled?: boolean | null
          sales_anomaly_threshold_percent?: number | null
          tax_reminder_alerts_enabled?: boolean | null
          tax_reminder_days_before?: number | null
          updated_at?: string | null
          whatsapp_account_sid?: string | null
          whatsapp_enabled?: boolean | null
          whatsapp_phone?: string | null
        }
        Relationships: []
      }
      pos_order_financials: {
        Row: {
          commission_amount: number
          commission_percent: number
          created_at: string
          customer_tip: number
          customer_tip_after_fee: number | null
          delivery_fee: number
          gross_total: number
          id: string
          integration_id: string
          location_id: string
          order_id: string
          owner_id: string
          platform: string
          platform_fee: number
          platform_order_id: string
          platform_settlement_id: string | null
          reconciled: boolean
          reconciled_at: string | null
          service_fee: number
          subtotal: number
          tax: number
          updated_at: string
          your_payout: number
        }
        Insert: {
          commission_amount?: number
          commission_percent: number
          created_at?: string
          customer_tip?: number
          customer_tip_after_fee?: number | null
          delivery_fee?: number
          gross_total: number
          id?: string
          integration_id: string
          location_id: string
          order_id: string
          owner_id: string
          platform: string
          platform_fee?: number
          platform_order_id: string
          platform_settlement_id?: string | null
          reconciled?: boolean
          reconciled_at?: string | null
          service_fee?: number
          subtotal: number
          tax?: number
          updated_at?: string
          your_payout?: number
        }
        Update: {
          commission_amount?: number
          commission_percent?: number
          created_at?: string
          customer_tip?: number
          customer_tip_after_fee?: number | null
          delivery_fee?: number
          gross_total?: number
          id?: string
          integration_id?: string
          location_id?: string
          order_id?: string
          owner_id?: string
          platform?: string
          platform_fee?: number
          platform_order_id?: string
          platform_settlement_id?: string | null
          reconciled?: boolean
          reconciled_at?: string | null
          service_fee?: number
          subtotal?: number
          tax?: number
          updated_at?: string
          your_payout?: number
        }
        Relationships: [
          {
            foreignKeyName: "pos_order_financials_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "pos_integrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_order_financials_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_otp: {
        Row: {
          code: string
          created_at: string | null
          expires_at: string
          id: string
          phone: string
          used: boolean | null
        }
        Insert: {
          code: string
          created_at?: string | null
          expires_at: string
          id?: string
          phone: string
          used?: boolean | null
        }
        Update: {
          code?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          phone?: string
          used?: boolean | null
        }
        Relationships: []
      }
      pos_parcel_history: {
        Row: {
          changed_by: string | null
          created_at: string
          from_status: string | null
          id: string
          lat: number | null
          lng: number | null
          metadata: Json | null
          notes: string | null
          parcel_id: string
          photo_id: string | null
          to_status: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          from_status?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          metadata?: Json | null
          notes?: string | null
          parcel_id: string
          photo_id?: string | null
          to_status: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          from_status?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          metadata?: Json | null
          notes?: string | null
          parcel_id?: string
          photo_id?: string | null
          to_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_parcel_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_parcel_history_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "pos_parcels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_parcel_history_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "pos_parcel_photos"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_parcel_photos: {
        Row: {
          branch_id: string | null
          captured_by: string | null
          confidence: number | null
          created_at: string
          document_type: string | null
          extracted_data: Json | null
          id: string
          lat: number | null
          lng: number | null
          notes: string | null
          owner_id: string
          parcel_id: string | null
          photo_type: string
          photo_url: string
          storage: string
        }
        Insert: {
          branch_id?: string | null
          captured_by?: string | null
          confidence?: number | null
          created_at?: string
          document_type?: string | null
          extracted_data?: Json | null
          id?: string
          lat?: number | null
          lng?: number | null
          notes?: string | null
          owner_id: string
          parcel_id?: string | null
          photo_type: string
          photo_url: string
          storage?: string
        }
        Update: {
          branch_id?: string | null
          captured_by?: string | null
          confidence?: number | null
          created_at?: string
          document_type?: string | null
          extracted_data?: Json | null
          id?: string
          lat?: number | null
          lng?: number | null
          notes?: string | null
          owner_id?: string
          parcel_id?: string | null
          photo_type?: string
          photo_url?: string
          storage?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_parcel_photos_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_parcel_photos_captured_by_fkey"
            columns: ["captured_by"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_parcel_photos_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "pos_parcels"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_parcels: {
        Row: {
          assigned_driver_id: string | null
          assigned_truck_id: string | null
          collected_at: string | null
          collected_by_name: string | null
          created_at: string
          current_branch_id: string | null
          current_lat: number | null
          current_lng: number | null
          declared_value: number | null
          delivered_at: string | null
          delivered_by: string | null
          delivery_notes: string | null
          description: string | null
          destination_branch_id: string | null
          destination_city: string | null
          dispatched_at: string | null
          fail_reason: string | null
          fee_charged: number | null
          id: string
          owner_id: string
          payment_method: string | null
          payment_status: string | null
          received_by: string | null
          receiver_name: string | null
          receiver_phone: string | null
          released_by: string | null
          return_reason: string | null
          route_id: string | null
          sender_branch_id: string | null
          sender_name: string | null
          sender_phone: string | null
          status: string
          tracking_number: string
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          assigned_driver_id?: string | null
          assigned_truck_id?: string | null
          collected_at?: string | null
          collected_by_name?: string | null
          created_at?: string
          current_branch_id?: string | null
          current_lat?: number | null
          current_lng?: number | null
          declared_value?: number | null
          delivered_at?: string | null
          delivered_by?: string | null
          delivery_notes?: string | null
          description?: string | null
          destination_branch_id?: string | null
          destination_city?: string | null
          dispatched_at?: string | null
          fail_reason?: string | null
          fee_charged?: number | null
          id?: string
          owner_id: string
          payment_method?: string | null
          payment_status?: string | null
          received_by?: string | null
          receiver_name?: string | null
          receiver_phone?: string | null
          released_by?: string | null
          return_reason?: string | null
          route_id?: string | null
          sender_branch_id?: string | null
          sender_name?: string | null
          sender_phone?: string | null
          status?: string
          tracking_number: string
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          assigned_driver_id?: string | null
          assigned_truck_id?: string | null
          collected_at?: string | null
          collected_by_name?: string | null
          created_at?: string
          current_branch_id?: string | null
          current_lat?: number | null
          current_lng?: number | null
          declared_value?: number | null
          delivered_at?: string | null
          delivered_by?: string | null
          delivery_notes?: string | null
          description?: string | null
          destination_branch_id?: string | null
          destination_city?: string | null
          dispatched_at?: string | null
          fail_reason?: string | null
          fee_charged?: number | null
          id?: string
          owner_id?: string
          payment_method?: string | null
          payment_status?: string | null
          received_by?: string | null
          receiver_name?: string | null
          receiver_phone?: string | null
          released_by?: string | null
          return_reason?: string | null
          route_id?: string | null
          sender_branch_id?: string | null
          sender_name?: string | null
          sender_phone?: string | null
          status?: string
          tracking_number?: string
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_parcels_assigned_driver_id_fkey"
            columns: ["assigned_driver_id"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_parcels_assigned_truck_id_fkey"
            columns: ["assigned_truck_id"]
            isOneToOne: false
            referencedRelation: "pos_trucks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_parcels_current_branch_id_fkey"
            columns: ["current_branch_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_parcels_delivered_by_fkey"
            columns: ["delivered_by"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_parcels_destination_branch_id_fkey"
            columns: ["destination_branch_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_parcels_received_by_fkey"
            columns: ["received_by"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_parcels_released_by_fkey"
            columns: ["released_by"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_parcels_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "pos_routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_parcels_sender_branch_id_fkey"
            columns: ["sender_branch_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_payment_disputes: {
        Row: {
          amount_disputed: number | null
          created_at: string | null
          currency: string | null
          dispute_created_at: string | null
          dispute_id: string
          dispute_resolved_at: string | null
          disputed_by_customer_reason: string | null
          evidence_due_at: string | null
          evidence_json: Json | null
          id: string
          owner_id: string
          reason: string
          resolution_notes: string | null
          status: string | null
          transaction_id: string
          updated_at: string | null
        }
        Insert: {
          amount_disputed?: number | null
          created_at?: string | null
          currency?: string | null
          dispute_created_at?: string | null
          dispute_id: string
          dispute_resolved_at?: string | null
          disputed_by_customer_reason?: string | null
          evidence_due_at?: string | null
          evidence_json?: Json | null
          id?: string
          owner_id: string
          reason: string
          resolution_notes?: string | null
          status?: string | null
          transaction_id: string
          updated_at?: string | null
        }
        Update: {
          amount_disputed?: number | null
          created_at?: string | null
          currency?: string | null
          dispute_created_at?: string | null
          dispute_id?: string
          dispute_resolved_at?: string | null
          disputed_by_customer_reason?: string | null
          evidence_due_at?: string | null
          evidence_json?: Json | null
          id?: string
          owner_id?: string
          reason?: string
          resolution_notes?: string | null
          status?: string | null
          transaction_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_payment_disputes_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "pos_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_payments: {
        Row: {
          amount: number
          cashier_id: string | null
          completed_at: string | null
          created_at: string | null
          customer_phone: string | null
          error_message: string | null
          external_receipt: string | null
          external_reference: string | null
          id: string
          initiated_at: string | null
          owner_id: string
          payment_method: string
          provider: string
          status: string
          transaction_id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          cashier_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_phone?: string | null
          error_message?: string | null
          external_receipt?: string | null
          external_reference?: string | null
          id?: string
          initiated_at?: string | null
          owner_id: string
          payment_method?: string
          provider?: string
          status?: string
          transaction_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          cashier_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_phone?: string | null
          error_message?: string | null
          external_receipt?: string | null
          external_reference?: string | null
          id?: string
          initiated_at?: string | null
          owner_id?: string
          payment_method?: string
          provider?: string
          status?: string
          transaction_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_payments_cashier_id_fkey"
            columns: ["cashier_id"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_payments_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "pos_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_routes: {
        Row: {
          active: boolean | null
          created_at: string
          destination_branch_id: string
          distance_km: number | null
          estimated_hours: number | null
          flat_rate: number | null
          id: string
          name: string | null
          origin_branch_id: string
          owner_id: string
          price_per_kg: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          destination_branch_id: string
          distance_km?: number | null
          estimated_hours?: number | null
          flat_rate?: number | null
          id?: string
          name?: string | null
          origin_branch_id: string
          owner_id: string
          price_per_kg?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          destination_branch_id?: string
          distance_km?: number | null
          estimated_hours?: number | null
          flat_rate?: number | null
          id?: string
          name?: string | null
          origin_branch_id?: string
          owner_id?: string
          price_per_kg?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_routes_destination_branch_id_fkey"
            columns: ["destination_branch_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_routes_origin_branch_id_fkey"
            columns: ["origin_branch_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_service_job_history: {
        Row: {
          changed_by: string | null
          created_at: string | null
          from_status: string | null
          id: string
          job_id: string
          metadata: Json | null
          notes: string | null
          to_status: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string | null
          from_status?: string | null
          id?: string
          job_id: string
          metadata?: Json | null
          notes?: string | null
          to_status: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string | null
          from_status?: string | null
          id?: string
          job_id?: string
          metadata?: Json | null
          notes?: string | null
          to_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_service_job_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_service_job_history_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "pos_service_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_service_jobs: {
        Row: {
          additional_issues: string | null
          assigned_to: string | null
          cancel_reason: string | null
          checked_in_by: string | null
          checked_out_by: string | null
          checkout_photo_url: string | null
          completed_at: string | null
          created_at: string | null
          customer_id: string | null
          customer_name: string | null
          customer_phone: string | null
          device_description: string | null
          device_model: string | null
          device_serial: string | null
          due_by: string | null
          engineer_notes: string | null
          estimated_minutes: number | null
          fault_description: string
          id: string
          intake_lat: number | null
          intake_lng: number | null
          intake_photo_url: string | null
          location_id: string | null
          original_quoted_price: number | null
          owner_id: string
          paid_by_transaction: string | null
          preset_id: string | null
          quoted_price: number | null
          status: string
          ticket_number: string
          updated_at: string | null
          warranty_expires_at: string | null
          warranty_job_id: string | null
        }
        Insert: {
          additional_issues?: string | null
          assigned_to?: string | null
          cancel_reason?: string | null
          checked_in_by?: string | null
          checked_out_by?: string | null
          checkout_photo_url?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          device_description?: string | null
          device_model?: string | null
          device_serial?: string | null
          due_by?: string | null
          engineer_notes?: string | null
          estimated_minutes?: number | null
          fault_description: string
          id?: string
          intake_lat?: number | null
          intake_lng?: number | null
          intake_photo_url?: string | null
          location_id?: string | null
          original_quoted_price?: number | null
          owner_id: string
          paid_by_transaction?: string | null
          preset_id?: string | null
          quoted_price?: number | null
          status?: string
          ticket_number: string
          updated_at?: string | null
          warranty_expires_at?: string | null
          warranty_job_id?: string | null
        }
        Update: {
          additional_issues?: string | null
          assigned_to?: string | null
          cancel_reason?: string | null
          checked_in_by?: string | null
          checked_out_by?: string | null
          checkout_photo_url?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          device_description?: string | null
          device_model?: string | null
          device_serial?: string | null
          due_by?: string | null
          engineer_notes?: string | null
          estimated_minutes?: number | null
          fault_description?: string
          id?: string
          intake_lat?: number | null
          intake_lng?: number | null
          intake_photo_url?: string | null
          location_id?: string | null
          original_quoted_price?: number | null
          owner_id?: string
          paid_by_transaction?: string | null
          preset_id?: string | null
          quoted_price?: number | null
          status?: string
          ticket_number?: string
          updated_at?: string | null
          warranty_expires_at?: string | null
          warranty_job_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_service_jobs_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_service_jobs_checked_in_by_fkey"
            columns: ["checked_in_by"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_service_jobs_checked_out_by_fkey"
            columns: ["checked_out_by"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_service_jobs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "pos_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_service_jobs_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_service_jobs_paid_by_transaction_fkey"
            columns: ["paid_by_transaction"]
            isOneToOne: false
            referencedRelation: "pos_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_service_jobs_preset_id_fkey"
            columns: ["preset_id"]
            isOneToOne: false
            referencedRelation: "pos_service_presets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_service_jobs_warranty_job_id_fkey"
            columns: ["warranty_job_id"]
            isOneToOne: false
            referencedRelation: "pos_service_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_service_parts: {
        Row: {
          created_at: string | null
          id: string
          inventory_id: string | null
          job_id: string
          line_total: number | null
          name: string
          qty: number
          unit_cost: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          inventory_id?: string | null
          job_id: string
          line_total?: number | null
          name: string
          qty?: number
          unit_cost?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          inventory_id?: string | null
          job_id?: string
          line_total?: number | null
          name?: string
          qty?: number
          unit_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_service_parts_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_service_parts_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "pos_service_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_service_presets: {
        Row: {
          active: boolean | null
          category: string
          created_at: string | null
          estimated_minutes: number | null
          id: string
          location_id: string | null
          name: string
          owner_id: string
          parts_required: Json | null
          price: number
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          category?: string
          created_at?: string | null
          estimated_minutes?: number | null
          id?: string
          location_id?: string | null
          name: string
          owner_id: string
          parts_required?: Json | null
          price?: number
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          category?: string
          created_at?: string | null
          estimated_minutes?: number | null
          id?: string
          location_id?: string | null
          name?: string
          owner_id?: string
          parts_required?: Json | null
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_service_presets_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_service_warranties: {
        Row: {
          claim_reason: string | null
          claimed: boolean | null
          claimed_at: string | null
          created_at: string | null
          expires_at: string
          id: string
          original_job_id: string
          owner_id: string
          warranty_days: number
          warranty_job_id: string | null
        }
        Insert: {
          claim_reason?: string | null
          claimed?: boolean | null
          claimed_at?: string | null
          created_at?: string | null
          expires_at: string
          id?: string
          original_job_id: string
          owner_id: string
          warranty_days?: number
          warranty_job_id?: string | null
        }
        Update: {
          claim_reason?: string | null
          claimed?: boolean | null
          claimed_at?: string | null
          created_at?: string | null
          expires_at?: string
          id?: string
          original_job_id?: string
          owner_id?: string
          warranty_days?: number
          warranty_job_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_service_warranties_original_job_id_fkey"
            columns: ["original_job_id"]
            isOneToOne: false
            referencedRelation: "pos_service_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_service_warranties_warranty_job_id_fkey"
            columns: ["warranty_job_id"]
            isOneToOne: false
            referencedRelation: "pos_service_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_shift_audit_log: {
        Row: {
          details_json: Json | null
          event: string
          id: string
          logged_at: string | null
          owner_id: string
          performed_by: string | null
          shift_id: string
        }
        Insert: {
          details_json?: Json | null
          event: string
          id?: string
          logged_at?: string | null
          owner_id: string
          performed_by?: string | null
          shift_id: string
        }
        Update: {
          details_json?: Json | null
          event?: string
          id?: string
          logged_at?: string | null
          owner_id?: string
          performed_by?: string | null
          shift_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_shift_audit_log_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "pos_shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_shifts: {
        Row: {
          cashier_id: string
          closed_at: string | null
          closed_by: string | null
          closing_balance: number | null
          created_at: string | null
          expected_balance: number | null
          id: string
          location_id: string
          notes: string | null
          opened_at: string
          opened_by: string | null
          opening_balance: number | null
          owner_id: string
          status: string | null
          updated_at: string | null
          variance_amount: number | null
          variance_reason: string | null
        }
        Insert: {
          cashier_id: string
          closed_at?: string | null
          closed_by?: string | null
          closing_balance?: number | null
          created_at?: string | null
          expected_balance?: number | null
          id?: string
          location_id: string
          notes?: string | null
          opened_at: string
          opened_by?: string | null
          opening_balance?: number | null
          owner_id: string
          status?: string | null
          updated_at?: string | null
          variance_amount?: number | null
          variance_reason?: string | null
        }
        Update: {
          cashier_id?: string
          closed_at?: string | null
          closed_by?: string | null
          closing_balance?: number | null
          created_at?: string | null
          expected_balance?: number | null
          id?: string
          location_id?: string
          notes?: string | null
          opened_at?: string
          opened_by?: string | null
          opening_balance?: number | null
          owner_id?: string
          status?: string | null
          updated_at?: string | null
          variance_amount?: number | null
          variance_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_shifts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_staff: {
        Row: {
          active: boolean | null
          created_at: string | null
          email: string | null
          id: string
          invited_at: string | null
          last_login_at: string | null
          location_id: string | null
          name: string
          owner_id: string
          phone: string | null
          pin_hash: string | null
          role: string
          sector: string | null
          sector_edit_count: number
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          email?: string | null
          id?: string
          invited_at?: string | null
          last_login_at?: string | null
          location_id?: string | null
          name: string
          owner_id: string
          phone?: string | null
          pin_hash?: string | null
          role: string
          sector?: string | null
          sector_edit_count?: number
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          email?: string | null
          id?: string
          invited_at?: string | null
          last_login_at?: string | null
          location_id?: string | null
          name?: string
          owner_id?: string
          phone?: string | null
          pin_hash?: string | null
          role?: string
          sector?: string | null
          sector_edit_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "pos_staff_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_stock_adjustments: {
        Row: {
          adjusted_by: string | null
          counted_qty: number
          created_at: string
          id: string
          inventory_id: string | null
          location_id: string | null
          owner_id: string
          product_name: string | null
          reason: string | null
          session_ref: string | null
          system_qty: number
          unit_cost: number
          variance: number
          variance_value: number
        }
        Insert: {
          adjusted_by?: string | null
          counted_qty?: number
          created_at?: string
          id?: string
          inventory_id?: string | null
          location_id?: string | null
          owner_id: string
          product_name?: string | null
          reason?: string | null
          session_ref?: string | null
          system_qty?: number
          unit_cost?: number
          variance?: number
          variance_value?: number
        }
        Update: {
          adjusted_by?: string | null
          counted_qty?: number
          created_at?: string
          id?: string
          inventory_id?: string | null
          location_id?: string | null
          owner_id?: string
          product_name?: string | null
          reason?: string | null
          session_ref?: string | null
          system_qty?: number
          unit_cost?: number
          variance?: number
          variance_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "pos_stock_adjustments_adjusted_by_fkey"
            columns: ["adjusted_by"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_stock_adjustments_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_stock_adjustments_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_stock_transfers: {
        Row: {
          completed_at: string | null
          created_at: string | null
          from_location_id: string
          id: string
          initiated_by: string | null
          inventory_id: string
          notes: string | null
          owner_id: string
          product_name: string
          qty: number
          received_by: string | null
          status: string
          to_location_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          from_location_id: string
          id?: string
          initiated_by?: string | null
          inventory_id: string
          notes?: string | null
          owner_id: string
          product_name: string
          qty: number
          received_by?: string | null
          status?: string
          to_location_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          from_location_id?: string
          id?: string
          initiated_by?: string | null
          inventory_id?: string
          notes?: string | null
          owner_id?: string
          product_name?: string
          qty?: number
          received_by?: string | null
          status?: string
          to_location_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_stock_transfers_from_location_id_fkey"
            columns: ["from_location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_stock_transfers_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_stock_transfers_to_location_id_fkey"
            columns: ["to_location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_stripe_customers: {
        Row: {
          created_at: string | null
          id: string
          owner_id: string
          pos_customer_id: string | null
          stripe_customer_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          owner_id: string
          pos_customer_id?: string | null
          stripe_customer_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          owner_id?: string
          pos_customer_id?: string | null
          stripe_customer_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_stripe_customers_pos_customer_id_fkey"
            columns: ["pos_customer_id"]
            isOneToOne: false
            referencedRelation: "pos_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_tax_audit_log: {
        Row: {
          created_at: string | null
          id: string
          items_json: Json
          jurisdiction: string
          owner_id: string
          subtotal: number
          tax_calculation_version: string | null
          total: number
          total_tax: number
          transaction_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          items_json: Json
          jurisdiction: string
          owner_id: string
          subtotal: number
          tax_calculation_version?: string | null
          total: number
          total_tax: number
          transaction_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          items_json?: Json
          jurisdiction?: string
          owner_id?: string
          subtotal?: number
          tax_calculation_version?: string | null
          total?: number
          total_tax?: number
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_tax_audit_log_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_tax_audit_log_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "suspicious_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_tax_audit_log_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "pos_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_tax_filings: {
        Row: {
          created_at: string | null
          filing_data_json: Json | null
          filing_period_end: string
          filing_period_start: string
          filing_reference: string | null
          id: string
          jurisdiction: string
          net_due: number | null
          owner_id: string
          status: string | null
          submitted_at: string | null
          submitted_to: string | null
          tax_paid: number | null
          total_tax_due: number | null
          total_turnover: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          filing_data_json?: Json | null
          filing_period_end: string
          filing_period_start: string
          filing_reference?: string | null
          id?: string
          jurisdiction: string
          net_due?: number | null
          owner_id: string
          status?: string | null
          submitted_at?: string | null
          submitted_to?: string | null
          tax_paid?: number | null
          total_tax_due?: number | null
          total_turnover?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          filing_data_json?: Json | null
          filing_period_end?: string
          filing_period_start?: string
          filing_reference?: string | null
          id?: string
          jurisdiction?: string
          net_due?: number | null
          owner_id?: string
          status?: string | null
          submitted_at?: string | null
          submitted_to?: string | null
          tax_paid?: number | null
          total_tax_due?: number | null
          total_turnover?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pos_tax_rules: {
        Row: {
          created_at: string | null
          effective_date: string | null
          id: string
          is_active: boolean | null
          jurisdiction_code: string
          owner_id: string
          reduced_rates: Json | null
          rule_version: string | null
          standard_rate: number
          tax_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          effective_date?: string | null
          id?: string
          is_active?: boolean | null
          jurisdiction_code: string
          owner_id: string
          reduced_rates?: Json | null
          rule_version?: string | null
          standard_rate: number
          tax_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          effective_date?: string | null
          id?: string
          is_active?: boolean | null
          jurisdiction_code?: string
          owner_id?: string
          reduced_rates?: Json | null
          rule_version?: string | null
          standard_rate?: number
          tax_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_tax_rules_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_tax_rules_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "suspicious_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_transaction_history: {
        Row: {
          change_details_json: Json | null
          change_reason: string | null
          changed_at: string | null
          changed_by: string | null
          hash: string
          id: string
          owner_id: string
          previous_hash: string | null
          state_json: Json
          transaction_id: string
          version: number
        }
        Insert: {
          change_details_json?: Json | null
          change_reason?: string | null
          changed_at?: string | null
          changed_by?: string | null
          hash: string
          id?: string
          owner_id: string
          previous_hash?: string | null
          state_json: Json
          transaction_id: string
          version: number
        }
        Update: {
          change_details_json?: Json | null
          change_reason?: string | null
          changed_at?: string | null
          changed_by?: string | null
          hash?: string
          id?: string
          owner_id?: string
          previous_hash?: string | null
          state_json?: Json
          transaction_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "pos_transaction_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_transaction_history_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_transaction_history_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "suspicious_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_transaction_history_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "pos_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_transaction_line_items: {
        Row: {
          created_at: string | null
          id: string
          name: string
          quantity: number
          tax_amount: number | null
          tax_code: string | null
          tax_rate: number | null
          transaction_id: string
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          quantity: number
          tax_amount?: number | null
          tax_code?: string | null
          tax_rate?: number | null
          transaction_id: string
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          quantity?: number
          tax_amount?: number | null
          tax_code?: string | null
          tax_rate?: number | null
          transaction_id?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "pos_transaction_line_items_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "pos_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_transactions: {
        Row: {
          amend_reason: string | null
          amended_at: string | null
          amended_by: string | null
          amended_from: string | null
          amount_tendered: number | null
          cashier_id: string | null
          created_at: string | null
          customer_id: string | null
          customer_vat_number: string | null
          discount_amount: number | null
          id: string
          notes: string | null
          owner_id: string
          paid_at: string | null
          payment_failure_reason: string | null
          payment_method: string | null
          payment_status: string | null
          payment_type: string
          pos_location_id: string | null
          qbo_invoice_id: string | null
          receipt_sent: boolean | null
          refund_amount: number | null
          refund_id: string | null
          refund_reason: string | null
          refund_reason_details: string | null
          refunded_at: string | null
          shift_id: string | null
          status: string
          stripe_payment_id: string | null
          subtotal: number
          synced_at: string | null
          synced_to_quickbooks: boolean | null
          synced_to_xero: boolean | null
          tax_amount: number | null
          tax_calculation_details_json: Json | null
          tax_calculation_version: string | null
          tax_country_code: string | null
          tax_jurisdiction: string | null
          total: number
          total_tax: number | null
          xero_invoice_id: string | null
        }
        Insert: {
          amend_reason?: string | null
          amended_at?: string | null
          amended_by?: string | null
          amended_from?: string | null
          amount_tendered?: number | null
          cashier_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          customer_vat_number?: string | null
          discount_amount?: number | null
          id?: string
          notes?: string | null
          owner_id: string
          paid_at?: string | null
          payment_failure_reason?: string | null
          payment_method?: string | null
          payment_status?: string | null
          payment_type: string
          pos_location_id?: string | null
          qbo_invoice_id?: string | null
          receipt_sent?: boolean | null
          refund_amount?: number | null
          refund_id?: string | null
          refund_reason?: string | null
          refund_reason_details?: string | null
          refunded_at?: string | null
          shift_id?: string | null
          status?: string
          stripe_payment_id?: string | null
          subtotal: number
          synced_at?: string | null
          synced_to_quickbooks?: boolean | null
          synced_to_xero?: boolean | null
          tax_amount?: number | null
          tax_calculation_details_json?: Json | null
          tax_calculation_version?: string | null
          tax_country_code?: string | null
          tax_jurisdiction?: string | null
          total: number
          total_tax?: number | null
          xero_invoice_id?: string | null
        }
        Update: {
          amend_reason?: string | null
          amended_at?: string | null
          amended_by?: string | null
          amended_from?: string | null
          amount_tendered?: number | null
          cashier_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          customer_vat_number?: string | null
          discount_amount?: number | null
          id?: string
          notes?: string | null
          owner_id?: string
          paid_at?: string | null
          payment_failure_reason?: string | null
          payment_method?: string | null
          payment_status?: string | null
          payment_type?: string
          pos_location_id?: string | null
          qbo_invoice_id?: string | null
          receipt_sent?: boolean | null
          refund_amount?: number | null
          refund_id?: string | null
          refund_reason?: string | null
          refund_reason_details?: string | null
          refunded_at?: string | null
          shift_id?: string | null
          status?: string
          stripe_payment_id?: string | null
          subtotal?: number
          synced_at?: string | null
          synced_to_quickbooks?: boolean | null
          synced_to_xero?: boolean | null
          tax_amount?: number | null
          tax_calculation_details_json?: Json | null
          tax_calculation_version?: string | null
          tax_country_code?: string | null
          tax_jurisdiction?: string | null
          total?: number
          total_tax?: number | null
          xero_invoice_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_transactions_amended_by_fkey"
            columns: ["amended_by"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_transactions_amended_from_fkey"
            columns: ["amended_from"]
            isOneToOne: false
            referencedRelation: "pos_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_transactions_cashier_id_fkey"
            columns: ["cashier_id"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "pos_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_transactions_pos_location_id_fkey"
            columns: ["pos_location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_transactions_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "pos_shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_trucks: {
        Row: {
          created_at: string
          id: string
          location_id: string | null
          make_model: string | null
          notes: string | null
          owner_id: string
          plate_number: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          location_id?: string | null
          make_model?: string | null
          notes?: string | null
          owner_id: string
          plate_number: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          location_id?: string | null
          make_model?: string | null
          notes?: string | null
          owner_id?: string
          plate_number?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_trucks_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_vehicle_inspections: {
        Row: {
          branch_id: string | null
          created_at: string
          driver_id: string
          flagged_issues: Json | null
          id: string
          lat: number | null
          lng: number | null
          notes: string | null
          owner_id: string
          photo_cargo: string | null
          photo_front: string | null
          photo_left: string | null
          photo_rear: string | null
          photo_right: string | null
          photo_tyres: string | null
          status: string
          truck_id: string
          type: string
        }
        Insert: {
          branch_id?: string | null
          created_at?: string
          driver_id: string
          flagged_issues?: Json | null
          id?: string
          lat?: number | null
          lng?: number | null
          notes?: string | null
          owner_id: string
          photo_cargo?: string | null
          photo_front?: string | null
          photo_left?: string | null
          photo_rear?: string | null
          photo_right?: string | null
          photo_tyres?: string | null
          status?: string
          truck_id: string
          type: string
        }
        Update: {
          branch_id?: string | null
          created_at?: string
          driver_id?: string
          flagged_issues?: Json | null
          id?: string
          lat?: number | null
          lng?: number | null
          notes?: string | null
          owner_id?: string
          photo_cargo?: string | null
          photo_front?: string | null
          photo_left?: string | null
          photo_rear?: string | null
          photo_right?: string | null
          photo_tyres?: string | null
          status?: string
          truck_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_vehicle_inspections_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_vehicle_inspections_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_vehicle_inspections_truck_id_fkey"
            columns: ["truck_id"]
            isOneToOne: false
            referencedRelation: "pos_trucks"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_webhook_queue: {
        Row: {
          created_at: string
          error_message: string | null
          event_type: string
          external_id: string
          id: string
          integration_id: string
          next_retry_at: string | null
          owner_id: string
          payload: Json
          platform: string
          processed: boolean
          processed_at: string | null
          retry_count: number
          signature: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          event_type: string
          external_id: string
          id?: string
          integration_id: string
          next_retry_at?: string | null
          owner_id: string
          payload: Json
          platform: string
          processed?: boolean
          processed_at?: string | null
          retry_count?: number
          signature?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          event_type?: string
          external_id?: string
          id?: string
          integration_id?: string
          next_retry_at?: string | null
          owner_id?: string
          payload?: Json
          platform?: string
          processed?: boolean
          processed_at?: string | null
          retry_count?: number
          signature?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_webhook_queue_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "pos_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          business_name: string | null
          business_type: string | null
          collective_opt_in: boolean | null
          collective_opted_at: string | null
          consent_ip_hash: string | null
          country_code: string | null
          county: string | null
          created_at: string | null
          currency: string | null
          currency_symbol: string | null
          data_consent: boolean | null
          data_consent_at: string | null
          full_name: string | null
          ico_number: string | null
          id: string
          is_suspicious: boolean | null
          market_intelligence_opt_in: boolean | null
          market_intelligence_opted_at: string | null
          notify_digest_hour: number | null
          notify_email_alerts: boolean | null
          notify_whatsapp: boolean | null
          onboarded: boolean | null
          phone: string | null
          plan: string | null
          plan_id: string | null
          pos_enabled: boolean | null
          pos_seat_count: number | null
          pos_stripe_subscription_id: string | null
          postcode: string | null
          preferred_locale: string | null
          region: string | null
          registration_country: string | null
          registration_ip_hash: string | null
          role: string | null
          sector_hints: string | null
          town: string | null
          training_consent: boolean | null
          training_consent_at: string | null
          updated_at: string | null
          vat_number: string | null
          whatsapp_number: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          business_name?: string | null
          business_type?: string | null
          collective_opt_in?: boolean | null
          collective_opted_at?: string | null
          consent_ip_hash?: string | null
          country_code?: string | null
          county?: string | null
          created_at?: string | null
          currency?: string | null
          currency_symbol?: string | null
          data_consent?: boolean | null
          data_consent_at?: string | null
          full_name?: string | null
          ico_number?: string | null
          id: string
          is_suspicious?: boolean | null
          market_intelligence_opt_in?: boolean | null
          market_intelligence_opted_at?: string | null
          notify_digest_hour?: number | null
          notify_email_alerts?: boolean | null
          notify_whatsapp?: boolean | null
          onboarded?: boolean | null
          phone?: string | null
          plan?: string | null
          plan_id?: string | null
          pos_enabled?: boolean | null
          pos_seat_count?: number | null
          pos_stripe_subscription_id?: string | null
          postcode?: string | null
          preferred_locale?: string | null
          region?: string | null
          registration_country?: string | null
          registration_ip_hash?: string | null
          role?: string | null
          sector_hints?: string | null
          town?: string | null
          training_consent?: boolean | null
          training_consent_at?: string | null
          updated_at?: string | null
          vat_number?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          business_name?: string | null
          business_type?: string | null
          collective_opt_in?: boolean | null
          collective_opted_at?: string | null
          consent_ip_hash?: string | null
          country_code?: string | null
          county?: string | null
          created_at?: string | null
          currency?: string | null
          currency_symbol?: string | null
          data_consent?: boolean | null
          data_consent_at?: string | null
          full_name?: string | null
          ico_number?: string | null
          id?: string
          is_suspicious?: boolean | null
          market_intelligence_opt_in?: boolean | null
          market_intelligence_opted_at?: string | null
          notify_digest_hour?: number | null
          notify_email_alerts?: boolean | null
          notify_whatsapp?: boolean | null
          onboarded?: boolean | null
          phone?: string | null
          plan?: string | null
          plan_id?: string | null
          pos_enabled?: boolean | null
          pos_seat_count?: number | null
          pos_stripe_subscription_id?: string | null
          postcode?: string | null
          preferred_locale?: string | null
          region?: string | null
          registration_country?: string | null
          registration_ip_hash?: string | null
          role?: string | null
          sector_hints?: string | null
          town?: string | null
          training_consent?: boolean | null
          training_consent_at?: string | null
          updated_at?: string | null
          vat_number?: string | null
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      recognition_history: {
        Row: {
          confidence: number | null
          confirmed: boolean | null
          created_at: string | null
          id: string
          inventory_id: string | null
          is_match: boolean | null
          owner_id: string
          recognized_name: string
          source: string | null
          updated_at: string | null
        }
        Insert: {
          confidence?: number | null
          confirmed?: boolean | null
          created_at?: string | null
          id?: string
          inventory_id?: string | null
          is_match?: boolean | null
          owner_id: string
          recognized_name: string
          source?: string | null
          updated_at?: string | null
        }
        Update: {
          confidence?: number | null
          confirmed?: boolean | null
          created_at?: string | null
          id?: string
          inventory_id?: string | null
          is_match?: boolean | null
          owner_id?: string
          recognized_name?: string
          source?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recognition_history_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_deliveries: {
        Row: {
          ai_confidence: number | null
          created_at: string
          currency: string
          delivery_date: string | null
          food_costs_updated: number | null
          id: string
          invoice_ref: string | null
          items_count: number | null
          items_json: Json | null
          location_id: string | null
          notes: string | null
          owner_id: string
          supplier_name: string | null
          total_value: number | null
        }
        Insert: {
          ai_confidence?: number | null
          created_at?: string
          currency?: string
          delivery_date?: string | null
          food_costs_updated?: number | null
          id?: string
          invoice_ref?: string | null
          items_count?: number | null
          items_json?: Json | null
          location_id?: string | null
          notes?: string | null
          owner_id: string
          supplier_name?: string | null
          total_value?: number | null
        }
        Update: {
          ai_confidence?: number | null
          created_at?: string
          currency?: string
          delivery_date?: string | null
          food_costs_updated?: number | null
          id?: string
          invoice_ref?: string | null
          items_count?: number | null
          items_json?: Json | null
          location_id?: string | null
          notes?: string | null
          owner_id?: string
          supplier_name?: string | null
          total_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_deliveries_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_deliveries_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_deliveries_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "suspicious_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_eighty_six: {
        Row: {
          eighty_sixed_at: string | null
          eighty_sixed_by: string | null
          id: string
          item_name: string
          location_id: string | null
          menu_item_id: string | null
          owner_id: string
          reason: string | null
          restored_at: string | null
        }
        Insert: {
          eighty_sixed_at?: string | null
          eighty_sixed_by?: string | null
          id?: string
          item_name: string
          location_id?: string | null
          menu_item_id?: string | null
          owner_id: string
          reason?: string | null
          restored_at?: string | null
        }
        Update: {
          eighty_sixed_at?: string | null
          eighty_sixed_by?: string | null
          id?: string
          item_name?: string
          location_id?: string | null
          menu_item_id?: string | null
          owner_id?: string
          reason?: string | null
          restored_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_eighty_six_eighty_sixed_by_fkey"
            columns: ["eighty_sixed_by"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_eighty_six_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_eighty_six_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "restaurant_menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_item_modifier_groups: {
        Row: {
          group_id: string
          item_id: string
        }
        Insert: {
          group_id: string
          item_id: string
        }
        Update: {
          group_id?: string
          item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_item_modifier_groups_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "restaurant_modifier_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_item_modifier_groups_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "restaurant_menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_kitchen_tickets: {
        Row: {
          bump_count: number | null
          completed_at: string | null
          covers: number | null
          id: string
          items_json: Json
          location_id: string | null
          order_id: string
          order_type: string | null
          owner_id: string
          sent_at: string | null
          server_name: string | null
          started_at: string | null
          station: string
          status: string | null
          table_name: string | null
        }
        Insert: {
          bump_count?: number | null
          completed_at?: string | null
          covers?: number | null
          id?: string
          items_json?: Json
          location_id?: string | null
          order_id: string
          order_type?: string | null
          owner_id: string
          sent_at?: string | null
          server_name?: string | null
          started_at?: string | null
          station: string
          status?: string | null
          table_name?: string | null
        }
        Update: {
          bump_count?: number | null
          completed_at?: string | null
          covers?: number | null
          id?: string
          items_json?: Json
          location_id?: string | null
          order_id?: string
          order_type?: string | null
          owner_id?: string
          sent_at?: string | null
          server_name?: string | null
          started_at?: string | null
          station?: string
          status?: string | null
          table_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_kitchen_tickets_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_kitchen_tickets_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "restaurant_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_labor_shifts: {
        Row: {
          break_mins: number | null
          clock_in: string
          clock_out: string | null
          hourly_rate: number | null
          id: string
          location_id: string | null
          notes: string | null
          owner_id: string
          role: string
          staff_id: string
          status: string | null
          total_cost: number | null
          total_hours: number | null
        }
        Insert: {
          break_mins?: number | null
          clock_in?: string
          clock_out?: string | null
          hourly_rate?: number | null
          id?: string
          location_id?: string | null
          notes?: string | null
          owner_id: string
          role: string
          staff_id: string
          status?: string | null
          total_cost?: number | null
          total_hours?: number | null
        }
        Update: {
          break_mins?: number | null
          clock_in?: string
          clock_out?: string | null
          hourly_rate?: number | null
          id?: string
          location_id?: string | null
          notes?: string | null
          owner_id?: string
          role?: string
          staff_id?: string
          status?: string | null
          total_cost?: number | null
          total_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_labor_shifts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_labor_shifts_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_menu_categories: {
        Row: {
          available: boolean | null
          color: string | null
          created_at: string | null
          icon: string | null
          id: string
          location_id: string | null
          name: string
          owner_id: string
          sort_order: number | null
        }
        Insert: {
          available?: boolean | null
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          location_id?: string | null
          name: string
          owner_id: string
          sort_order?: number | null
        }
        Update: {
          available?: boolean | null
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          location_id?: string | null
          name?: string
          owner_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_menu_categories_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_menu_items: {
        Row: {
          allergens: string[] | null
          available: boolean | null
          calories: number | null
          category_id: string | null
          created_at: string | null
          description: string | null
          eighty_sixed: boolean | null
          food_cost: number | null
          id: string
          image_url: string | null
          name: string
          owner_id: string
          prep_time_mins: number | null
          price: number
          sort_order: number | null
          station: string | null
          tags: string[] | null
        }
        Insert: {
          allergens?: string[] | null
          available?: boolean | null
          calories?: number | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          eighty_sixed?: boolean | null
          food_cost?: number | null
          id?: string
          image_url?: string | null
          name: string
          owner_id: string
          prep_time_mins?: number | null
          price?: number
          sort_order?: number | null
          station?: string | null
          tags?: string[] | null
        }
        Update: {
          allergens?: string[] | null
          available?: boolean | null
          calories?: number | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          eighty_sixed?: boolean | null
          food_cost?: number | null
          id?: string
          image_url?: string | null
          name?: string
          owner_id?: string
          prep_time_mins?: number | null
          price?: number
          sort_order?: number | null
          station?: string | null
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "restaurant_menu_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_modifier_groups: {
        Row: {
          created_at: string | null
          id: string
          max_selections: number | null
          min_selections: number | null
          name: string
          owner_id: string
          required: boolean | null
          selection_type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          max_selections?: number | null
          min_selections?: number | null
          name: string
          owner_id: string
          required?: boolean | null
          selection_type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          max_selections?: number | null
          min_selections?: number | null
          name?: string
          owner_id?: string
          required?: boolean | null
          selection_type?: string | null
        }
        Relationships: []
      }
      restaurant_modifiers: {
        Row: {
          group_id: string
          id: string
          name: string
          owner_id: string
          price_adjustment: number | null
          sort_order: number | null
        }
        Insert: {
          group_id: string
          id?: string
          name: string
          owner_id: string
          price_adjustment?: number | null
          sort_order?: number | null
        }
        Update: {
          group_id?: string
          id?: string
          name?: string
          owner_id?: string
          price_adjustment?: number | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_modifiers_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "restaurant_modifier_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_online_orders: {
        Row: {
          accepted_at: string | null
          collected_at: string | null
          created_at: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string
          items_json: Json
          location_id: string | null
          order_id: string | null
          owner_id: string
          ready_at: string | null
          requested_time: string | null
          source: string | null
          status: string | null
          subtotal: number | null
          total: number | null
        }
        Insert: {
          accepted_at?: string | null
          collected_at?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          items_json?: Json
          location_id?: string | null
          order_id?: string | null
          owner_id: string
          ready_at?: string | null
          requested_time?: string | null
          source?: string | null
          status?: string | null
          subtotal?: number | null
          total?: number | null
        }
        Update: {
          accepted_at?: string | null
          collected_at?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          items_json?: Json
          location_id?: string | null
          order_id?: string | null
          owner_id?: string
          ready_at?: string | null
          requested_time?: string | null
          source?: string | null
          status?: string | null
          subtotal?: number | null
          total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_online_orders_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_online_orders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "restaurant_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_order_item_modifiers: {
        Row: {
          group_name: string | null
          id: string
          modifier_id: string | null
          name: string
          order_item_id: string
          price_adjustment: number | null
        }
        Insert: {
          group_name?: string | null
          id?: string
          modifier_id?: string | null
          name: string
          order_item_id: string
          price_adjustment?: number | null
        }
        Update: {
          group_name?: string | null
          id?: string
          modifier_id?: string | null
          name?: string
          order_item_id?: string
          price_adjustment?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_order_item_modifiers_modifier_id_fkey"
            columns: ["modifier_id"]
            isOneToOne: false
            referencedRelation: "restaurant_modifiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_order_item_modifiers_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "restaurant_order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_order_items: {
        Row: {
          course: string | null
          created_at: string | null
          food_cost: number | null
          id: string
          menu_item_id: string | null
          name: string
          notes: string | null
          order_id: string
          owner_id: string
          qty: number | null
          ready_at: string | null
          sent_at: string | null
          served_at: string | null
          station: string | null
          status: string | null
          unit_price: number
          void_reason: string | null
          voided_by: string | null
        }
        Insert: {
          course?: string | null
          created_at?: string | null
          food_cost?: number | null
          id?: string
          menu_item_id?: string | null
          name: string
          notes?: string | null
          order_id: string
          owner_id: string
          qty?: number | null
          ready_at?: string | null
          sent_at?: string | null
          served_at?: string | null
          station?: string | null
          status?: string | null
          unit_price: number
          void_reason?: string | null
          voided_by?: string | null
        }
        Update: {
          course?: string | null
          created_at?: string | null
          food_cost?: number | null
          id?: string
          menu_item_id?: string | null
          name?: string
          notes?: string | null
          order_id?: string
          owner_id?: string
          qty?: number | null
          ready_at?: string | null
          sent_at?: string | null
          served_at?: string | null
          station?: string | null
          status?: string | null
          unit_price?: number
          void_reason?: string | null
          voided_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "restaurant_menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "restaurant_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_order_items_voided_by_fkey"
            columns: ["voided_by"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_orders: {
        Row: {
          covers: number | null
          created_at: string | null
          customer_id: string | null
          customer_name: string | null
          customer_phone: string | null
          discount_amount: number | null
          first_item_sent_at: string | null
          id: string
          last_item_ready_at: string | null
          location_id: string | null
          notes: string | null
          order_type: string | null
          owner_id: string
          paid_at: string | null
          payment_type: string | null
          pos_transaction_id: string | null
          seated_at: string | null
          server_id: string | null
          source_ref: string | null
          status: string | null
          subtotal: number | null
          table_id: string | null
          tax_amount: number | null
          total: number | null
        }
        Insert: {
          covers?: number | null
          created_at?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          discount_amount?: number | null
          first_item_sent_at?: string | null
          id?: string
          last_item_ready_at?: string | null
          location_id?: string | null
          notes?: string | null
          order_type?: string | null
          owner_id: string
          paid_at?: string | null
          payment_type?: string | null
          pos_transaction_id?: string | null
          seated_at?: string | null
          server_id?: string | null
          source_ref?: string | null
          status?: string | null
          subtotal?: number | null
          table_id?: string | null
          tax_amount?: number | null
          total?: number | null
        }
        Update: {
          covers?: number | null
          created_at?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          discount_amount?: number | null
          first_item_sent_at?: string | null
          id?: string
          last_item_ready_at?: string | null
          location_id?: string | null
          notes?: string | null
          order_type?: string | null
          owner_id?: string
          paid_at?: string | null
          payment_type?: string | null
          pos_transaction_id?: string | null
          seated_at?: string | null
          server_id?: string | null
          source_ref?: string | null
          status?: string | null
          subtotal?: number | null
          table_id?: string | null
          tax_amount?: number | null
          total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "pos_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_orders_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_orders_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_orders_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_reservations: {
        Row: {
          covers: number | null
          created_at: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          duration_mins: number | null
          id: string
          location_id: string | null
          notes: string | null
          owner_id: string
          reserved_at: string
          status: string | null
          table_id: string | null
        }
        Insert: {
          covers?: number | null
          created_at?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          duration_mins?: number | null
          id?: string
          location_id?: string | null
          notes?: string | null
          owner_id: string
          reserved_at: string
          status?: string | null
          table_id?: string | null
        }
        Update: {
          covers?: number | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          duration_mins?: number | null
          id?: string
          location_id?: string | null
          notes?: string | null
          owner_id?: string
          reserved_at?: string
          status?: string | null
          table_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_reservations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_reservations_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_tables: {
        Row: {
          capacity: number | null
          created_at: string | null
          current_order_id: string | null
          height: number | null
          id: string
          location_id: string | null
          name: string
          owner_id: string
          reservation_at: string | null
          reservation_name: string | null
          seated_at: string | null
          section: string | null
          server_id: string | null
          shape: string | null
          status: string | null
          width: number | null
          x_pos: number | null
          y_pos: number | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          current_order_id?: string | null
          height?: number | null
          id?: string
          location_id?: string | null
          name: string
          owner_id: string
          reservation_at?: string | null
          reservation_name?: string | null
          seated_at?: string | null
          section?: string | null
          server_id?: string | null
          shape?: string | null
          status?: string | null
          width?: number | null
          x_pos?: number | null
          y_pos?: number | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          current_order_id?: string | null
          height?: number | null
          id?: string
          location_id?: string | null
          name?: string
          owner_id?: string
          reservation_at?: string | null
          reservation_name?: string | null
          seated_at?: string | null
          section?: string | null
          server_id?: string | null
          shape?: string | null
          status?: string | null
          width?: number | null
          x_pos?: number | null
          y_pos?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_tables_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_tables_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_waste_log: {
        Row: {
          cost_per_unit: number | null
          created_at: string | null
          id: string
          item_name: string
          location_id: string | null
          logged_by: string | null
          menu_item_id: string | null
          owner_id: string
          qty: number | null
          reason: string | null
          total_cost: number | null
          unit: string | null
        }
        Insert: {
          cost_per_unit?: number | null
          created_at?: string | null
          id?: string
          item_name: string
          location_id?: string | null
          logged_by?: string | null
          menu_item_id?: string | null
          owner_id: string
          qty?: number | null
          reason?: string | null
          total_cost?: number | null
          unit?: string | null
        }
        Update: {
          cost_per_unit?: number | null
          created_at?: string | null
          id?: string
          item_name?: string
          location_id?: string | null
          logged_by?: string | null
          menu_item_id?: string | null
          owner_id?: string
          qty?: number | null
          reason?: string | null
          total_cost?: number | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_waste_log_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_waste_log_logged_by_fkey"
            columns: ["logged_by"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_waste_log_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "restaurant_menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_appointments: {
        Row: {
          client_id: string | null
          created_at: string
          duration_mins: number
          id: string
          location_id: string | null
          notes: string | null
          owner_id: string
          price: number
          scheduled_at: string
          service_category: string | null
          service_name: string
          status: string
          stylist_id: string | null
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          duration_mins?: number
          id?: string
          location_id?: string | null
          notes?: string | null
          owner_id: string
          price?: number
          scheduled_at?: string
          service_category?: string | null
          service_name: string
          status?: string
          stylist_id?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          duration_mins?: number
          id?: string
          location_id?: string | null
          notes?: string | null
          owner_id?: string
          price?: number
          scheduled_at?: string
          service_category?: string | null
          service_name?: string
          status?: string
          stylist_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "salon_appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "salon_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salon_appointments_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salon_appointments_stylist_id_fkey"
            columns: ["stylist_id"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_client_photos: {
        Row: {
          appointment_id: string | null
          client_id: string | null
          created_at: string
          id: string
          kind: string
          notes: string | null
          owner_id: string
          photo_url: string
          service_type: string | null
          storage: string
          stylist_id: string | null
        }
        Insert: {
          appointment_id?: string | null
          client_id?: string | null
          created_at?: string
          id?: string
          kind?: string
          notes?: string | null
          owner_id: string
          photo_url: string
          service_type?: string | null
          storage?: string
          stylist_id?: string | null
        }
        Update: {
          appointment_id?: string | null
          client_id?: string | null
          created_at?: string
          id?: string
          kind?: string
          notes?: string | null
          owner_id?: string
          photo_url?: string
          service_type?: string | null
          storage?: string
          stylist_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "salon_client_photos_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "salon_appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salon_client_photos_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "salon_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salon_client_photos_stylist_id_fkey"
            columns: ["stylist_id"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_clients: {
        Row: {
          birthday: string | null
          created_at: string
          email: string | null
          id: string
          last_visit_at: string | null
          location_id: string | null
          name: string
          notes: string | null
          owner_id: string
          phone: string | null
          total_spend: number
          total_visits: number
          updated_at: string
        }
        Insert: {
          birthday?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_visit_at?: string | null
          location_id?: string | null
          name: string
          notes?: string | null
          owner_id: string
          phone?: string | null
          total_spend?: number
          total_visits?: number
          updated_at?: string
        }
        Update: {
          birthday?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_visit_at?: string | null
          location_id?: string | null
          name?: string
          notes?: string | null
          owner_id?: string
          phone?: string | null
          total_spend?: number
          total_visits?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "salon_clients_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "pos_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_color_formulas: {
        Row: {
          brand: string | null
          client_id: string | null
          created_at: string
          developer: string | null
          formula: string
          id: string
          notes: string | null
          owner_id: string
          processing_mins: number | null
          stylist_id: string | null
        }
        Insert: {
          brand?: string | null
          client_id?: string | null
          created_at?: string
          developer?: string | null
          formula: string
          id?: string
          notes?: string | null
          owner_id: string
          processing_mins?: number | null
          stylist_id?: string | null
        }
        Update: {
          brand?: string | null
          client_id?: string | null
          created_at?: string
          developer?: string | null
          formula?: string
          id?: string
          notes?: string | null
          owner_id?: string
          processing_mins?: number | null
          stylist_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "salon_color_formulas_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "salon_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salon_color_formulas_stylist_id_fkey"
            columns: ["stylist_id"]
            isOneToOne: false
            referencedRelation: "pos_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_product_usage: {
        Row: {
          amount_used: number
          appointment_id: string | null
          client_id: string | null
          cost: number
          created_at: string
          id: string
          inventory_id: string | null
          owner_id: string
          product_name: string
          service_name: string | null
          unit: string
        }
        Insert: {
          amount_used?: number
          appointment_id?: string | null
          client_id?: string | null
          cost?: number
          created_at?: string
          id?: string
          inventory_id?: string | null
          owner_id: string
          product_name: string
          service_name?: string | null
          unit?: string
        }
        Update: {
          amount_used?: number
          appointment_id?: string | null
          client_id?: string | null
          cost?: number
          created_at?: string
          id?: string
          inventory_id?: string | null
          owner_id?: string
          product_name?: string
          service_name?: string | null
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "salon_product_usage_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "salon_appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salon_product_usage_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "salon_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salon_product_usage_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      sector_trends: {
        Row: {
          change_pct: number | null
          country: string | null
          created_at: string | null
          id: string
          metric: string
          period: string
          sample_size: number | null
          sector: string
          value: number | null
        }
        Insert: {
          change_pct?: number | null
          country?: string | null
          created_at?: string | null
          id?: string
          metric: string
          period: string
          sample_size?: number | null
          sector: string
          value?: number | null
        }
        Update: {
          change_pct?: number | null
          country?: string | null
          created_at?: string | null
          id?: string
          metric?: string
          period?: string
          sample_size?: number | null
          sector?: string
          value?: number | null
        }
        Relationships: []
      }
      security_audits: {
        Row: {
          created_at: string
          duration_ms: number
          failures: number
          id: string
          overall_status: string
          passed: number
          report: Json
          run_id: string
          total_checks: number
          warnings: number
        }
        Insert: {
          created_at?: string
          duration_ms?: number
          failures?: number
          id?: string
          overall_status: string
          passed?: number
          report?: Json
          run_id: string
          total_checks?: number
          warnings?: number
        }
        Update: {
          created_at?: string
          duration_ms?: number
          failures?: number
          id?: string
          overall_status?: string
          passed?: number
          report?: Json
          run_id?: string
          total_checks?: number
          warnings?: number
        }
        Relationships: []
      }
      shared_insights: {
        Row: {
          answer_text: string
          chart_label: string | null
          chart_labels: Json | null
          chart_type: string | null
          chart_values: Json | null
          created_at: string | null
          expires_at: string | null
          id: string
          insight_header: string | null
          kpi_cards: Json | null
          question: string
          recommendations: Json | null
          user_id: string | null
          view_count: number | null
        }
        Insert: {
          answer_text: string
          chart_label?: string | null
          chart_labels?: Json | null
          chart_type?: string | null
          chart_values?: Json | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          insight_header?: string | null
          kpi_cards?: Json | null
          question: string
          recommendations?: Json | null
          user_id?: string | null
          view_count?: number | null
        }
        Update: {
          answer_text?: string
          chart_label?: string | null
          chart_labels?: Json | null
          chart_type?: string | null
          chart_values?: Json | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          insight_header?: string | null
          kpi_cards?: Json | null
          question?: string
          recommendations?: Json | null
          user_id?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      simulation_runs: {
        Row: {
          break_even_units: number | null
          candidate_id: string | null
          contribution_margin_pct: number | null
          created_at: string | null
          dead_stock_risk: string | null
          expected_monthly_units: number | null
          gross_margin_pct: number | null
          id: string
          landed_cost: number | null
          lead_time_days: number | null
          months_to_recover: number | null
          moq: number | null
          packaging_cost: number | null
          platform_fee_pct: number | null
          projected_monthly_profit: number | null
          sell_price: number | null
          shipping_cost: number | null
          stockout_risk: string | null
          user_id: string
          verdict: string | null
        }
        Insert: {
          break_even_units?: number | null
          candidate_id?: string | null
          contribution_margin_pct?: number | null
          created_at?: string | null
          dead_stock_risk?: string | null
          expected_monthly_units?: number | null
          gross_margin_pct?: number | null
          id?: string
          landed_cost?: number | null
          lead_time_days?: number | null
          months_to_recover?: number | null
          moq?: number | null
          packaging_cost?: number | null
          platform_fee_pct?: number | null
          projected_monthly_profit?: number | null
          sell_price?: number | null
          shipping_cost?: number | null
          stockout_risk?: string | null
          user_id: string
          verdict?: string | null
        }
        Update: {
          break_even_units?: number | null
          candidate_id?: string | null
          contribution_margin_pct?: number | null
          created_at?: string | null
          dead_stock_risk?: string | null
          expected_monthly_units?: number | null
          gross_margin_pct?: number | null
          id?: string
          landed_cost?: number | null
          lead_time_days?: number | null
          months_to_recover?: number | null
          moq?: number | null
          packaging_cost?: number | null
          platform_fee_pct?: number | null
          projected_monthly_profit?: number | null
          sell_price?: number | null
          shipping_cost?: number | null
          stockout_risk?: string | null
          user_id?: string
          verdict?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "simulation_runs_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "expansion_candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      social_signals: {
        Row: {
          ad_spend: number | null
          avg_order_value: number | null
          campaign_name: string | null
          clicks: number | null
          comments: number | null
          content_id: string
          content_type: string | null
          conversion_rate: number | null
          creator_handle: string | null
          currency: string | null
          engagement_rate: number | null
          gross_revenue: number | null
          id: string
          impressions: number | null
          is_paid: boolean | null
          likes: number | null
          orders: number | null
          platform: string
          product_name: string | null
          raw_data: Json | null
          record_date: string | null
          roas: number | null
          save_rate: number | null
          saves: number | null
          shares: number | null
          sku: string | null
          source_id: string | null
          source_type: string
          synced_at: string | null
          units_sold: number | null
          updated_at: string | null
          user_id: string
          views: number | null
          viral_score: number | null
        }
        Insert: {
          ad_spend?: number | null
          avg_order_value?: number | null
          campaign_name?: string | null
          clicks?: number | null
          comments?: number | null
          content_id: string
          content_type?: string | null
          conversion_rate?: number | null
          creator_handle?: string | null
          currency?: string | null
          engagement_rate?: number | null
          gross_revenue?: number | null
          id?: string
          impressions?: number | null
          is_paid?: boolean | null
          likes?: number | null
          orders?: number | null
          platform: string
          product_name?: string | null
          raw_data?: Json | null
          record_date?: string | null
          roas?: number | null
          save_rate?: number | null
          saves?: number | null
          shares?: number | null
          sku?: string | null
          source_id?: string | null
          source_type: string
          synced_at?: string | null
          units_sold?: number | null
          updated_at?: string | null
          user_id: string
          views?: number | null
          viral_score?: number | null
        }
        Update: {
          ad_spend?: number | null
          avg_order_value?: number | null
          campaign_name?: string | null
          clicks?: number | null
          comments?: number | null
          content_id?: string
          content_type?: string | null
          conversion_rate?: number | null
          creator_handle?: string | null
          currency?: string | null
          engagement_rate?: number | null
          gross_revenue?: number | null
          id?: string
          impressions?: number | null
          is_paid?: boolean | null
          likes?: number | null
          orders?: number | null
          platform?: string
          product_name?: string | null
          raw_data?: Json | null
          record_date?: string | null
          roas?: number | null
          save_rate?: number | null
          saves?: number | null
          shares?: number | null
          sku?: string | null
          source_id?: string | null
          source_type?: string
          synced_at?: string | null
          units_sold?: number | null
          updated_at?: string | null
          user_id?: string
          views?: number | null
          viral_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "social_signals_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "connected_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          grace_questions: number | null
          id: string
          plan_id: string
          soft_warning_sent: boolean | null
          status: string | null
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          trial_ends_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          grace_questions?: number | null
          id?: string
          plan_id?: string
          soft_warning_sent?: boolean | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          grace_questions?: number | null
          id?: string
          plan_id?: string
          soft_warning_sent?: boolean | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_log: {
        Row: {
          error_message: string | null
          finished_at: string | null
          id: string
          records_new: number | null
          records_synced: number | null
          records_updated: number | null
          source_id: string | null
          started_at: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          error_message?: string | null
          finished_at?: string | null
          id?: string
          records_new?: number | null
          records_synced?: number | null
          records_updated?: number | null
          source_id?: string | null
          started_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          error_message?: string | null
          finished_at?: string | null
          id?: string
          records_new?: number | null
          records_synced?: number | null
          records_updated?: number | null
          source_id?: string | null
          started_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sync_log_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "connected_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          accepted_at: string | null
          email: string
          id: string
          invite_expires_at: string | null
          invite_token: string | null
          invited_at: string | null
          joined_at: string | null
          name: string | null
          org_id: string | null
          role: string | null
          status: string | null
          team_id: string
          user_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          email: string
          id?: string
          invite_expires_at?: string | null
          invite_token?: string | null
          invited_at?: string | null
          joined_at?: string | null
          name?: string | null
          org_id?: string | null
          role?: string | null
          status?: string | null
          team_id: string
          user_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          email?: string
          id?: string
          invite_expires_at?: string | null
          invite_token?: string | null
          invited_at?: string | null
          joined_at?: string | null
          name?: string | null
          org_id?: string | null
          role?: string | null
          status?: string | null
          team_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          id: string
          name: string
          owner_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          owner_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          owner_id?: string
        }
        Relationships: []
      }
      templates: {
        Row: {
          biz_type: string
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          questions: string[]
        }
        Insert: {
          biz_type: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          questions: string[]
        }
        Update: {
          biz_type?: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          questions?: string[]
        }
        Relationships: []
      }
      trials: {
        Row: {
          converted: boolean | null
          created_at: string | null
          ends_at: string
          id: string
          started_at: string
          trial_type: string
          user_id: string
        }
        Insert: {
          converted?: boolean | null
          created_at?: string | null
          ends_at?: string
          id?: string
          started_at?: string
          trial_type: string
          user_id: string
        }
        Update: {
          converted?: boolean | null
          created_at?: string | null
          ends_at?: string
          id?: string
          started_at?: string
          trial_type?: string
          user_id?: string
        }
        Relationships: []
      }
      unified_data: {
        Row: {
          ad_spend: number | null
          campaign: string | null
          category: string | null
          channel: string | null
          cost_price: number | null
          coupon_code: string | null
          coupon_discount: number | null
          created_at: string | null
          currency: string | null
          customer_region: string | null
          damaged_stock: number | null
          discount: number | null
          gross_margin: number | null
          gross_revenue: number | null
          id: string
          low_stock_flag: boolean | null
          marketplace_fee: number | null
          net_margin: number | null
          net_revenue: number | null
          packaging_cost: number | null
          payment_status: string | null
          payout_amount: number | null
          product_name: string | null
          raw_data: Json | null
          record_date: string | null
          refund_amount: number | null
          selling_price: number | null
          shipping_cost: number | null
          sku: string | null
          source_id: string | null
          source_record_id: string | null
          source_type: string
          stock_level: number | null
          stock_movement: number | null
          supplier: string | null
          tax: number | null
          total_cost: number | null
          units_sold: number | null
          updated_at: string | null
          user_id: string
          variant: string | null
        }
        Insert: {
          ad_spend?: number | null
          campaign?: string | null
          category?: string | null
          channel?: string | null
          cost_price?: number | null
          coupon_code?: string | null
          coupon_discount?: number | null
          created_at?: string | null
          currency?: string | null
          customer_region?: string | null
          damaged_stock?: number | null
          discount?: number | null
          gross_margin?: number | null
          gross_revenue?: number | null
          id?: string
          low_stock_flag?: boolean | null
          marketplace_fee?: number | null
          net_margin?: number | null
          net_revenue?: number | null
          packaging_cost?: number | null
          payment_status?: string | null
          payout_amount?: number | null
          product_name?: string | null
          raw_data?: Json | null
          record_date?: string | null
          refund_amount?: number | null
          selling_price?: number | null
          shipping_cost?: number | null
          sku?: string | null
          source_id?: string | null
          source_record_id?: string | null
          source_type: string
          stock_level?: number | null
          stock_movement?: number | null
          supplier?: string | null
          tax?: number | null
          total_cost?: number | null
          units_sold?: number | null
          updated_at?: string | null
          user_id: string
          variant?: string | null
        }
        Update: {
          ad_spend?: number | null
          campaign?: string | null
          category?: string | null
          channel?: string | null
          cost_price?: number | null
          coupon_code?: string | null
          coupon_discount?: number | null
          created_at?: string | null
          currency?: string | null
          customer_region?: string | null
          damaged_stock?: number | null
          discount?: number | null
          gross_margin?: number | null
          gross_revenue?: number | null
          id?: string
          low_stock_flag?: boolean | null
          marketplace_fee?: number | null
          net_margin?: number | null
          net_revenue?: number | null
          packaging_cost?: number | null
          payment_status?: string | null
          payout_amount?: number | null
          product_name?: string | null
          raw_data?: Json | null
          record_date?: string | null
          refund_amount?: number | null
          selling_price?: number | null
          shipping_cost?: number | null
          sku?: string | null
          source_id?: string | null
          source_record_id?: string | null
          source_type?: string
          stock_level?: number | null
          stock_movement?: number | null
          supplier?: string | null
          tax?: number | null
          total_cost?: number | null
          units_sold?: number | null
          updated_at?: string | null
          user_id?: string
          variant?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "unified_data_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "connected_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      upgrade_triggers: {
        Row: {
          converted: boolean | null
          feature: string
          id: string
          plan_needed: string
          trigger: string
          triggered_at: string | null
          user_id: string
        }
        Insert: {
          converted?: boolean | null
          feature: string
          id?: string
          plan_needed: string
          trigger: string
          triggered_at?: string | null
          user_id: string
        }
        Update: {
          converted?: boolean | null
          feature?: string
          id?: string
          plan_needed?: string
          trigger?: string
          triggered_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      upload_analytics: {
        Row: {
          business_type: string | null
          column_count: number | null
          column_names: string[] | null
          country: string | null
          created_at: string | null
          file_type: string | null
          id: string
          row_count: number | null
          user_id: string | null
        }
        Insert: {
          business_type?: string | null
          column_count?: number | null
          column_names?: string[] | null
          country?: string | null
          created_at?: string | null
          file_type?: string | null
          id?: string
          row_count?: number | null
          user_id?: string | null
        }
        Update: {
          business_type?: string | null
          column_count?: number | null
          column_names?: string[] | null
          country?: string | null
          created_at?: string | null
          file_type?: string | null
          id?: string
          row_count?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      uploads: {
        Row: {
          column_names: string[] | null
          conversation_id: string | null
          created_at: string | null
          file_size: number | null
          filename: string
          id: string
          parsed_sample: Json | null
          project_id: string | null
          row_count: number | null
          status: string | null
          storage_path: string | null
          user_id: string
        }
        Insert: {
          column_names?: string[] | null
          conversation_id?: string | null
          created_at?: string | null
          file_size?: number | null
          filename: string
          id?: string
          parsed_sample?: Json | null
          project_id?: string | null
          row_count?: number | null
          status?: string | null
          storage_path?: string | null
          user_id: string
        }
        Update: {
          column_names?: string[] | null
          conversation_id?: string | null
          created_at?: string | null
          file_size?: number | null
          filename?: string
          id?: string
          parsed_sample?: Json | null
          project_id?: string | null
          row_count?: number | null
          status?: string | null
          storage_path?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "uploads_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uploads_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      usage: {
        Row: {
          alerts_run: number | null
          exports: number | null
          forecasts: number | null
          id: string
          period: string
          questions: number | null
          syncs_run: number | null
          updated_at: string | null
          uploads: number | null
          user_id: string
        }
        Insert: {
          alerts_run?: number | null
          exports?: number | null
          forecasts?: number | null
          id?: string
          period: string
          questions?: number | null
          syncs_run?: number | null
          updated_at?: string | null
          uploads?: number | null
          user_id: string
        }
        Update: {
          alerts_run?: number | null
          exports?: number | null
          forecasts?: number | null
          id?: string
          period?: string
          questions?: number | null
          syncs_run?: number | null
          updated_at?: string | null
          uploads?: number | null
          user_id?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          error: string | null
          event_type: string
          id: string
          payload: Json
          processed: boolean | null
          received_at: string | null
          source_type: string
        }
        Insert: {
          error?: string | null
          event_type: string
          id?: string
          payload: Json
          processed?: boolean | null
          received_at?: string | null
          source_type: string
        }
        Update: {
          error?: string | null
          event_type?: string
          id?: string
          payload?: Json
          processed?: boolean | null
          received_at?: string | null
          source_type?: string
        }
        Relationships: []
      }
      whatsapp_autopilot_rules: {
        Row: {
          conditions: Json | null
          created_at: string | null
          enabled: boolean | null
          fire_count: number | null
          id: string
          last_fired_at: string | null
          message_template: string
          owner_id: string
          trigger: string
          updated_at: string | null
        }
        Insert: {
          conditions?: Json | null
          created_at?: string | null
          enabled?: boolean | null
          fire_count?: number | null
          id?: string
          last_fired_at?: string | null
          message_template: string
          owner_id: string
          trigger: string
          updated_at?: string | null
        }
        Update: {
          conditions?: Json | null
          created_at?: string | null
          enabled?: boolean | null
          fire_count?: number | null
          id?: string
          last_fired_at?: string | null
          message_template?: string
          owner_id?: string
          trigger?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      x_agent_activity: {
        Row: {
          created_at: string | null
          edited_reply: string | null
          generated_reply: string
          id: string
          keyword_query: string | null
          posted_at: string | null
          posted_reply_id: string | null
          status: string
          tweet_author: string | null
          tweet_author_id: string | null
          tweet_id: string
          tweet_likes: number | null
          tweet_replies: number | null
          tweet_text: string
        }
        Insert: {
          created_at?: string | null
          edited_reply?: string | null
          generated_reply: string
          id?: string
          keyword_query?: string | null
          posted_at?: string | null
          posted_reply_id?: string | null
          status?: string
          tweet_author?: string | null
          tweet_author_id?: string | null
          tweet_id: string
          tweet_likes?: number | null
          tweet_replies?: number | null
          tweet_text: string
        }
        Update: {
          created_at?: string | null
          edited_reply?: string | null
          generated_reply?: string
          id?: string
          keyword_query?: string | null
          posted_at?: string | null
          posted_reply_id?: string | null
          status?: string
          tweet_author?: string | null
          tweet_author_id?: string | null
          tweet_id?: string
          tweet_likes?: number | null
          tweet_replies?: number | null
          tweet_text?: string
        }
        Relationships: []
      }
    }
    Views: {
      ingredient_price_market: {
        Row: {
          avg_price: number | null
          category: string | null
          currency: string | null
          data_points: number | null
          ingredient: string | null
          max_price: number | null
          median: number | null
          min_price: number | null
          p25: number | null
          p75: number | null
          period: string | null
          region: string | null
          unit: string | null
        }
        Relationships: []
      }
      product_hot_list: {
        Row: {
          confirmed_count: number | null
          inventory_id: string | null
          owner_id: string | null
          recognition_count: number | null
          recognized_name: string | null
          success_rate: number | null
        }
        Relationships: [
          {
            foreignKeyName: "recognition_history_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      recent_anomalies: {
        Row: {
          analysis_date: string | null
          analysis_type: string | null
          anomaly: Json | null
          owner_id: string | null
          period_days: number | null
          raw_analysis: string | null
        }
        Relationships: []
      }
      shift_performance_summary: {
        Row: {
          avg_shift_duration_hours: number | null
          avg_variance_amount: number | null
          cashier_id: string | null
          max_variance_amount: number | null
          owner_id: string | null
          perfect_reconciliations: number | null
          reconciliation_rate: number | null
          shifts_with_variance: number | null
          total_shifts: number | null
        }
        Relationships: []
      }
      suspicious_accounts: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string | null
          ip_flagged: boolean | null
          ip_signup_count: number | null
          is_suspicious: boolean | null
          plan_id: string | null
          registration_country: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      cancel_account_deletion: { Args: { p_user_id: string }; Returns: Json }
      increment_insight_views: {
        Args: { insight_id: string }
        Returns: undefined
      }
      increment_usage: {
        Args: { p_field: string; p_user_id: string }
        Returns: undefined
      }
      normalize_timestamp: { Args: { raw_ts: string }; Returns: string }
      record_signup_ip: {
        Args: { p_country?: string; p_ip_hash: string; p_user_id: string }
        Returns: Json
      }
      request_account_deletion: {
        Args: { p_reason?: string; p_user_id: string }
        Returns: Json
      }
      update_consent: {
        Args: {
          p_data_consent: boolean
          p_ip_hash?: string
          p_training_consent: boolean
          p_user_id: string
        }
        Returns: Json
      }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

