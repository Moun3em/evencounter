export type EventStatus = 'draft' | 'active' | 'closed'

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          owner_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          owner_id: string
          created_at?: string
        }
        Update: {
          name?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          id: string
          org_id: string
          name: string
          date: string
          venue: string | null
          capacity: number | null
          status: EventStatus
          scan_pin: string
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          name: string
          date: string
          venue?: string | null
          capacity?: number | null
          status?: EventStatus
          scan_pin: string
          created_at?: string
        }
        Update: {
          name?: string
          date?: string
          venue?: string | null
          capacity?: number | null
          status?: EventStatus
          scan_pin?: string
        }
        Relationships: []
      }
      attendees: {
        Row: {
          id: string
          event_id: string
          name: string
          phone: string | null
          email: string | null
          card_token: string
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          name: string
          phone?: string | null
          email?: string | null
          card_token: string
          created_at?: string
        }
        Update: {
          name?: string
          phone?: string | null
          email?: string | null
        }
        Relationships: []
      }
      check_ins: {
        Row: {
          id: string
          attendee_id: string
          event_id: string
          checked_in_at: string
          scanner_session: string | null
        }
        Insert: {
          id?: string
          attendee_id: string
          event_id: string
          checked_in_at?: string
          scanner_session?: string | null
        }
        Update: {
          [key: string]: never
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      event_status: EventStatus
    }
    CompositeTypes: Record<string, never>
  }
}
