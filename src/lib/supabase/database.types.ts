export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          tech_stack: string[];
          tech_stack_text: string;
          icon: string;
          live_link: string | null;
          github_link: string | null;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          tech_stack?: string[];
          tech_stack_text?: string;
          icon?: string;
          live_link?: string | null;
          github_link?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          tech_stack?: string[];
          tech_stack_text?: string;
          icon?: string;
          live_link?: string | null;
          github_link?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      experiences: {
        Row: {
          id: string;
          title: string;
          company: string;
          date_range: string;
          description: string;
          skills: string[];
          icon: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          company: string;
          date_range: string;
          description?: string;
          skills?: string[];
          icon?: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          company?: string;
          date_range?: string;
          description?: string;
          skills?: string[];
          icon?: string;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      site_content: {
        Row: {
          id: string;
          key: string;
          content: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          content?: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          content?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      skills: {
        Row: {
          id: string;
          name: string;
          level: number;
          category: "technical" | "tool";
          sort_order: number;
          bold: boolean;
          font_size: "sm" | "base" | "lg" | "xl";
          text_align: "left" | "center" | "right";
        };
        Insert: {
          id?: string;
          name: string;
          level?: number;
          category?: "technical" | "tool";
          sort_order?: number;
          bold?: boolean;
          font_size?: "sm" | "base" | "lg" | "xl";
          text_align?: "left" | "center" | "right";
        };
        Update: {
          id?: string;
          name?: string;
          level?: number;
          category?: "technical" | "tool";
          sort_order?: number;
          bold?: boolean;
          font_size?: "sm" | "base" | "lg" | "xl";
          text_align?: "left" | "center" | "right";
        };
        Relationships: [];
      };
      certifications: {
        Row: {
          id: string;
          title: string;
          issuer: string;
          date: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          title: string;
          issuer: string;
          date: string;
          sort_order?: number;
        };
        Update: {
          id?: string;
          title?: string;
          issuer?: string;
          date?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      education: {
        Row: {
          id: string;
          degree: string;
          institution: string;
          date_range: string;
          icon: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          degree: string;
          institution: string;
          date_range: string;
          icon?: string;
          sort_order?: number;
        };
        Update: {
          id?: string;
          degree?: string;
          institution?: string;
          date_range?: string;
          icon?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string | null;
          message: string;
          created_at: string;
          read: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject?: string | null;
          message: string;
          created_at?: string;
          read?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string | null;
          message?: string;
          created_at?: string;
          read?: boolean;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
