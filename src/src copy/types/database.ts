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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          brand: string
          description: string
          price: number
          sale_price: number | null
          images: string[]
          category: string
          sustainability_score: number
          sustainability_details: Json | null
          sizes: string[]
          colors: string[]
          is_new: boolean
          is_bestseller: boolean
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          brand: string
          description: string
          price: number
          sale_price?: number | null
          images: string[]
          category: string
          sustainability_score: number
          sustainability_details?: Json | null
          sizes: string[]
          colors: string[]
          is_new?: boolean
          is_bestseller?: boolean
          tags: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          brand?: string
          description?: string
          price?: number
          sale_price?: number | null
          images?: string[]
          category?: string
          sustainability_score?: number
          sustainability_details?: Json | null
          sizes?: string[]
          colors?: string[]
          is_new?: boolean
          is_bestseller?: boolean
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          size: string | null
          color: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity: number
          size?: string | null
          color?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          size?: string | null
          color?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          order_number: string
          status: string
          total_amount: number
          shipping_address: Json
          billing_address: Json
          payment_method: string
          payment_status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          order_number: string
          status?: string
          total_amount: number
          shipping_address: Json
          billing_address: Json
          payment_method: string
          payment_status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          order_number?: string
          status?: string
          total_amount?: number
          shipping_address?: Json
          billing_address?: Json
          payment_method?: string
          payment_status?: string
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          size: string | null
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          size?: string | null
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          size?: string | null
          color?: string | null
          created_at?: string
        }
      }
      style_preferences: {
        Row: {
          id: string
          user_id: string
          colors: string[]
          patterns: string[]
          fits: string[]
          occasions: string[]
          favorites: string[]
          body_type: string | null
          size: string | null
          style_persona: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          colors?: string[]
          patterns?: string[]
          fits?: string[]
          occasions?: string[]
          favorites?: string[]
          body_type?: string | null
          size?: string | null
          style_persona?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          colors?: string[]
          patterns?: string[]
          fits?: string[]
          occasions?: string[]
          favorites?: string[]
          body_type?: string | null
          size?: string | null
          style_persona?: string | null
          created_at?: string
          updated_at?: string
        }
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