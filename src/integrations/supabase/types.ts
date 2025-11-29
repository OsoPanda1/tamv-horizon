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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      auction_bids: {
        Row: {
          amount: number
          auction_id: string
          bidder_id: string
          created_at: string | null
          currency: Database["public"]["Enums"]["currency_type"] | null
          id: string
          is_auto_bid: boolean | null
          is_winning: boolean | null
          max_auto_bid: number | null
        }
        Insert: {
          amount: number
          auction_id: string
          bidder_id: string
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_type"] | null
          id?: string
          is_auto_bid?: boolean | null
          is_winning?: boolean | null
          max_auto_bid?: number | null
        }
        Update: {
          amount?: number
          auction_id?: string
          bidder_id?: string
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_type"] | null
          id?: string
          is_auto_bid?: boolean | null
          is_winning?: boolean | null
          max_auto_bid?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "auction_bids_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
        ]
      }
      auctions: {
        Row: {
          bid_count: number | null
          category: string | null
          commission_percent: number | null
          created_at: string | null
          creator_id: string
          currency: Database["public"]["Enums"]["currency_type"] | null
          current_bid: number | null
          description: string | null
          end_time: string
          id: string
          image_url: string | null
          metadata: Json | null
          nft_contract_address: string | null
          nft_token_id: string | null
          reserve_price: number | null
          start_time: string
          starting_price: number
          status: Database["public"]["Enums"]["auction_status"] | null
          tags: string[] | null
          title: string
          updated_at: string | null
          winner_id: string | null
          winning_bid: number | null
        }
        Insert: {
          bid_count?: number | null
          category?: string | null
          commission_percent?: number | null
          created_at?: string | null
          creator_id: string
          currency?: Database["public"]["Enums"]["currency_type"] | null
          current_bid?: number | null
          description?: string | null
          end_time: string
          id?: string
          image_url?: string | null
          metadata?: Json | null
          nft_contract_address?: string | null
          nft_token_id?: string | null
          reserve_price?: number | null
          start_time: string
          starting_price: number
          status?: Database["public"]["Enums"]["auction_status"] | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          winner_id?: string | null
          winning_bid?: number | null
        }
        Update: {
          bid_count?: number | null
          category?: string | null
          commission_percent?: number | null
          created_at?: string | null
          creator_id?: string
          currency?: Database["public"]["Enums"]["currency_type"] | null
          current_bid?: number | null
          description?: string | null
          end_time?: string
          id?: string
          image_url?: string | null
          metadata?: Json | null
          nft_contract_address?: string | null
          nft_token_id?: string | null
          reserve_price?: number | null
          start_time?: string
          starting_price?: number
          status?: Database["public"]["Enums"]["auction_status"] | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          winner_id?: string | null
          winning_bid?: number | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          bookpi_hash: string | null
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          new_state: Json | null
          prev_state: Json | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          bookpi_hash?: string | null
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_state?: Json | null
          prev_state?: Json | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          bookpi_hash?: string | null
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_state?: Json | null
          prev_state?: Json | null
          user_agent?: string | null
        }
        Relationships: []
      }
      channel_subscribers: {
        Row: {
          channel_id: string
          id: string
          subscribed_at: string | null
          subscription_expires_at: string | null
          user_id: string
        }
        Insert: {
          channel_id: string
          id?: string
          subscribed_at?: string | null
          subscription_expires_at?: string | null
          user_id: string
        }
        Update: {
          channel_id?: string
          id?: string
          subscribed_at?: string | null
          subscription_expires_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_subscribers_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          avatar_url: string | null
          category: string | null
          commission_percent: number | null
          created_at: string | null
          currency: Database["public"]["Enums"]["currency_type"] | null
          description: string | null
          id: string
          is_premium: boolean | null
          last_post_at: string | null
          name: string
          owner_id: string
          price: number | null
          subscriber_count: number | null
          total_revenue: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          category?: string | null
          commission_percent?: number | null
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_type"] | null
          description?: string | null
          id?: string
          is_premium?: boolean | null
          last_post_at?: string | null
          name: string
          owner_id: string
          price?: number | null
          subscriber_count?: number | null
          total_revenue?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          category?: string | null
          commission_percent?: number | null
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_type"] | null
          description?: string | null
          id?: string
          is_premium?: boolean | null
          last_post_at?: string | null
          name?: string
          owner_id?: string
          price?: number | null
          subscriber_count?: number | null
          total_revenue?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      collaboration_requests: {
        Row: {
          complementary_skills: string[] | null
          created_at: string | null
          id: string
          match_score: number | null
          message: string | null
          project_idea: string | null
          requester_id: string
          responded_at: string | null
          status: string | null
          target_id: string
        }
        Insert: {
          complementary_skills?: string[] | null
          created_at?: string | null
          id?: string
          match_score?: number | null
          message?: string | null
          project_idea?: string | null
          requester_id: string
          responded_at?: string | null
          status?: string | null
          target_id: string
        }
        Update: {
          complementary_skills?: string[] | null
          created_at?: string | null
          id?: string
          match_score?: number | null
          message?: string | null
          project_idea?: string | null
          requester_id?: string
          responded_at?: string | null
          status?: string | null
          target_id?: string
        }
        Relationships: []
      }
      concert_tickets: {
        Row: {
          concert_id: string
          currency: Database["public"]["Enums"]["currency_type"] | null
          id: string
          is_used: boolean | null
          price_paid: number
          purchased_at: string | null
          ticket_type: string | null
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          concert_id: string
          currency?: Database["public"]["Enums"]["currency_type"] | null
          id?: string
          is_used?: boolean | null
          price_paid: number
          purchased_at?: string | null
          ticket_type?: string | null
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          concert_id?: string
          currency?: Database["public"]["Enums"]["currency_type"] | null
          id?: string
          is_used?: boolean | null
          price_paid?: number
          purchased_at?: string | null
          ticket_type?: string | null
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "concert_tickets_concert_id_fkey"
            columns: ["concert_id"]
            isOneToOne: false
            referencedRelation: "concerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concert_tickets_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      concerts: {
        Row: {
          commission_percent: number | null
          cover_image: string | null
          created_at: string | null
          creator_earnings: number | null
          creator_id: string
          currency: Database["public"]["Enums"]["currency_type"] | null
          current_attendees: number | null
          description: string | null
          dreamspace_id: string | null
          duration_minutes: number | null
          has_xr: boolean | null
          id: string
          max_attendees: number | null
          metadata: Json | null
          platform_earnings: number | null
          start_time: string
          status: Database["public"]["Enums"]["concert_status"] | null
          tags: string[] | null
          ticket_price: number
          title: string
          total_revenue: number | null
          updated_at: string | null
        }
        Insert: {
          commission_percent?: number | null
          cover_image?: string | null
          created_at?: string | null
          creator_earnings?: number | null
          creator_id: string
          currency?: Database["public"]["Enums"]["currency_type"] | null
          current_attendees?: number | null
          description?: string | null
          dreamspace_id?: string | null
          duration_minutes?: number | null
          has_xr?: boolean | null
          id?: string
          max_attendees?: number | null
          metadata?: Json | null
          platform_earnings?: number | null
          start_time: string
          status?: Database["public"]["Enums"]["concert_status"] | null
          tags?: string[] | null
          ticket_price?: number
          title: string
          total_revenue?: number | null
          updated_at?: string | null
        }
        Update: {
          commission_percent?: number | null
          cover_image?: string | null
          created_at?: string | null
          creator_earnings?: number | null
          creator_id?: string
          currency?: Database["public"]["Enums"]["currency_type"] | null
          current_attendees?: number | null
          description?: string | null
          dreamspace_id?: string | null
          duration_minutes?: number | null
          has_xr?: boolean | null
          id?: string
          max_attendees?: number | null
          metadata?: Json | null
          platform_earnings?: number | null
          start_time?: string
          status?: Database["public"]["Enums"]["concert_status"] | null
          tags?: string[] | null
          ticket_price?: number
          title?: string
          total_revenue?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      digital_pets: {
        Row: {
          abilities: string[] | null
          avatar_url: string | null
          born_at: string | null
          created_at: string | null
          energy: number | null
          happiness: number | null
          id: string
          last_fed_at: string | null
          last_played_at: string | null
          level: number | null
          metadata: Json | null
          name: string
          owner_id: string
          rarity: Database["public"]["Enums"]["pet_rarity"] | null
          species: string
          xp: number | null
        }
        Insert: {
          abilities?: string[] | null
          avatar_url?: string | null
          born_at?: string | null
          created_at?: string | null
          energy?: number | null
          happiness?: number | null
          id?: string
          last_fed_at?: string | null
          last_played_at?: string | null
          level?: number | null
          metadata?: Json | null
          name: string
          owner_id: string
          rarity?: Database["public"]["Enums"]["pet_rarity"] | null
          species: string
          xp?: number | null
        }
        Update: {
          abilities?: string[] | null
          avatar_url?: string | null
          born_at?: string | null
          created_at?: string | null
          energy?: number | null
          happiness?: number | null
          id?: string
          last_fed_at?: string | null
          last_played_at?: string | null
          level?: number | null
          metadata?: Json | null
          name?: string
          owner_id?: string
          rarity?: Database["public"]["Enums"]["pet_rarity"] | null
          species?: string
          xp?: number | null
        }
        Relationships: []
      }
      dreamspace_visits: {
        Row: {
          dreamspace_id: string
          duration_seconds: number | null
          entry_fee_paid: number | null
          id: string
          rating: number | null
          transaction_id: string | null
          visited_at: string | null
          visitor_id: string
        }
        Insert: {
          dreamspace_id: string
          duration_seconds?: number | null
          entry_fee_paid?: number | null
          id?: string
          rating?: number | null
          transaction_id?: string | null
          visited_at?: string | null
          visitor_id: string
        }
        Update: {
          dreamspace_id?: string
          duration_seconds?: number | null
          entry_fee_paid?: number | null
          id?: string
          rating?: number | null
          transaction_id?: string | null
          visited_at?: string | null
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dreamspace_visits_dreamspace_id_fkey"
            columns: ["dreamspace_id"]
            isOneToOne: false
            referencedRelation: "dreamspaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dreamspace_visits_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      dreamspaces: {
        Row: {
          commission_percent: number | null
          cover_image: string | null
          created_at: string | null
          currency: Database["public"]["Enums"]["currency_type"] | null
          description: string | null
          entry_price: number | null
          has_xr: boolean | null
          id: string
          is_public: boolean | null
          name: string
          owner_id: string
          rating: number | null
          ratings_count: number | null
          scene_config: Json | null
          space_type: string | null
          tags: string[] | null
          total_revenue: number | null
          updated_at: string | null
          visitors_count: number | null
        }
        Insert: {
          commission_percent?: number | null
          cover_image?: string | null
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_type"] | null
          description?: string | null
          entry_price?: number | null
          has_xr?: boolean | null
          id?: string
          is_public?: boolean | null
          name: string
          owner_id: string
          rating?: number | null
          ratings_count?: number | null
          scene_config?: Json | null
          space_type?: string | null
          tags?: string[] | null
          total_revenue?: number | null
          updated_at?: string | null
          visitors_count?: number | null
        }
        Update: {
          commission_percent?: number | null
          cover_image?: string | null
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_type"] | null
          description?: string | null
          entry_price?: number | null
          has_xr?: boolean | null
          id?: string
          is_public?: boolean | null
          name?: string
          owner_id?: string
          rating?: number | null
          ratings_count?: number | null
          scene_config?: Json | null
          space_type?: string | null
          tags?: string[] | null
          total_revenue?: number | null
          updated_at?: string | null
          visitors_count?: number | null
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string | null
          role: string | null
          subscription_expires_at: string | null
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string | null
          role?: string | null
          subscription_expires_at?: string | null
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string | null
          role?: string | null
          subscription_expires_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          avatar_url: string | null
          category: string | null
          commission_percent: number | null
          cover_image: string | null
          created_at: string | null
          currency: Database["public"]["Enums"]["currency_type"] | null
          description: string | null
          id: string
          is_paid: boolean | null
          is_private: boolean | null
          max_members: number | null
          member_count: number | null
          name: string
          owner_id: string
          price: number | null
          total_revenue: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          category?: string | null
          commission_percent?: number | null
          cover_image?: string | null
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_type"] | null
          description?: string | null
          id?: string
          is_paid?: boolean | null
          is_private?: boolean | null
          max_members?: number | null
          member_count?: number | null
          name: string
          owner_id: string
          price?: number | null
          total_revenue?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          category?: string | null
          commission_percent?: number | null
          cover_image?: string | null
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_type"] | null
          description?: string | null
          id?: string
          is_paid?: boolean | null
          is_private?: boolean | null
          max_members?: number | null
          member_count?: number | null
          name?: string
          owner_id?: string
          price?: number | null
          total_revenue?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      isabella_messages: {
        Row: {
          attachments: string[] | null
          content: string
          created_at: string | null
          emotion: string | null
          id: string
          metadata: Json | null
          role: string
          session_id: string
          user_id: string | null
        }
        Insert: {
          attachments?: string[] | null
          content: string
          created_at?: string | null
          emotion?: string | null
          id?: string
          metadata?: Json | null
          role: string
          session_id: string
          user_id?: string | null
        }
        Update: {
          attachments?: string[] | null
          content?: string
          created_at?: string | null
          emotion?: string | null
          id?: string
          metadata?: Json | null
          role?: string
          session_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "isabella_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "isabella_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      isabella_sessions: {
        Row: {
          context: string | null
          emotion_state: string | null
          id: string
          is_active: boolean | null
          last_activity: string | null
          message_count: number | null
          started_at: string | null
          user_id: string
        }
        Insert: {
          context?: string | null
          emotion_state?: string | null
          id?: string
          is_active?: boolean | null
          last_activity?: string | null
          message_count?: number | null
          started_at?: string | null
          user_id: string
        }
        Update: {
          context?: string | null
          emotion_state?: string | null
          id?: string
          is_active?: boolean | null
          last_activity?: string | null
          message_count?: number | null
          started_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          icon: string | null
          id: string
          is_read: boolean | null
          message: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          title: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      pet_accessories: {
        Row: {
          accessory_type: string | null
          created_at: string | null
          currency: Database["public"]["Enums"]["currency_type"] | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          rarity: Database["public"]["Enums"]["pet_rarity"] | null
          stats_boost: Json | null
        }
        Insert: {
          accessory_type?: string | null
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_type"] | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          rarity?: Database["public"]["Enums"]["pet_rarity"] | null
          stats_boost?: Json | null
        }
        Update: {
          accessory_type?: string | null
          created_at?: string | null
          currency?: Database["public"]["Enums"]["currency_type"] | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          rarity?: Database["public"]["Enums"]["pet_rarity"] | null
          stats_boost?: Json | null
        }
        Relationships: []
      }
      pet_owned_accessories: {
        Row: {
          accessory_id: string
          equipped: boolean | null
          id: string
          pet_id: string
          purchased_at: string | null
        }
        Insert: {
          accessory_id: string
          equipped?: boolean | null
          id?: string
          pet_id: string
          purchased_at?: string | null
        }
        Update: {
          accessory_id?: string
          equipped?: boolean | null
          id?: string
          pet_id?: string
          purchased_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pet_owned_accessories_accessory_id_fkey"
            columns: ["accessory_id"]
            isOneToOne: false
            referencedRelation: "pet_accessories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pet_owned_accessories_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "digital_pets"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          followers_count: number | null
          following_count: number | null
          goals: string[] | null
          id: string
          interests: string[] | null
          is_online: boolean | null
          last_active: string | null
          level: number | null
          member_since: string | null
          skills: string[] | null
          updated_at: string | null
          user_id: string
          username: string | null
          xp: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          followers_count?: number | null
          following_count?: number | null
          goals?: string[] | null
          id?: string
          interests?: string[] | null
          is_online?: boolean | null
          last_active?: string | null
          level?: number | null
          member_since?: string | null
          skills?: string[] | null
          updated_at?: string | null
          user_id: string
          username?: string | null
          xp?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          followers_count?: number | null
          following_count?: number | null
          goals?: string[] | null
          id?: string
          interests?: string[] | null
          is_online?: boolean | null
          last_active?: string | null
          level?: number | null
          member_since?: string | null
          skills?: string[] | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
          xp?: number | null
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          algorithm: string | null
          created_at: string | null
          entity_id: string
          entity_type: string
          expires_at: string | null
          id: string
          reason: string | null
          score: number
          user_id: string
        }
        Insert: {
          algorithm?: string | null
          created_at?: string | null
          entity_id: string
          entity_type: string
          expires_at?: string | null
          id?: string
          reason?: string | null
          score: number
          user_id: string
        }
        Update: {
          algorithm?: string | null
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          expires_at?: string | null
          id?: string
          reason?: string | null
          score?: number
          user_id?: string
        }
        Relationships: []
      }
      referral_rewards: {
        Row: {
          active_referrals: number | null
          created_at: string | null
          earned_amount: number | null
          id: string
          rank: number | null
          reward_months: number | null
          tier: string
          total_referrals: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active_referrals?: number | null
          created_at?: string | null
          earned_amount?: number | null
          id?: string
          rank?: number | null
          reward_months?: number | null
          tier: string
          total_referrals?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active_referrals?: number | null
          created_at?: string | null
          earned_amount?: number | null
          id?: string
          rank?: number | null
          reward_months?: number | null
          tier?: string
          total_referrals?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          activated_at: string | null
          created_at: string | null
          id: string
          referred_id: string
          referrer_id: string
          reward_amount: number | null
          reward_claimed: boolean | null
          status: string | null
        }
        Insert: {
          activated_at?: string | null
          created_at?: string | null
          id?: string
          referred_id: string
          referrer_id: string
          reward_amount?: number | null
          reward_claimed?: boolean | null
          status?: string | null
        }
        Update: {
          activated_at?: string | null
          created_at?: string | null
          id?: string
          referred_id?: string
          referrer_id?: string
          reward_amount?: number | null
          reward_claimed?: boolean | null
          status?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          bookpi_hash: string | null
          completed_at: string | null
          created_at: string | null
          creator_amount: number | null
          currency: Database["public"]["Enums"]["currency_type"]
          description: string | null
          id: string
          metadata: Json | null
          module: string | null
          platform_fee: number | null
          reference_id: string | null
          reference_type: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string | null
          wallet_id: string | null
        }
        Insert: {
          amount: number
          bookpi_hash?: string | null
          completed_at?: string | null
          created_at?: string | null
          creator_amount?: number | null
          currency?: Database["public"]["Enums"]["currency_type"]
          description?: string | null
          id?: string
          metadata?: Json | null
          module?: string | null
          platform_fee?: number | null
          reference_id?: string | null
          reference_type?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          type: Database["public"]["Enums"]["transaction_type"]
          user_id?: string | null
          wallet_id?: string | null
        }
        Update: {
          amount?: number
          bookpi_hash?: string | null
          completed_at?: string | null
          created_at?: string | null
          creator_amount?: number | null
          currency?: Database["public"]["Enums"]["currency_type"]
          description?: string | null
          id?: string
          metadata?: Json | null
          module?: string | null
          platform_fee?: number | null
          reference_id?: string | null
          reference_type?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string | null
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_interactions: {
        Row: {
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          interaction_type: string
          user_id: string
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          interaction_type: string
          user_id: string
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          interaction_type?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          granted_at: string | null
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance_eth: number | null
          balance_mxn: number | null
          balance_tamv: number | null
          balance_usd: number | null
          created_at: string | null
          id: string
          is_locked: boolean | null
          total_earned: number | null
          total_spent: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance_eth?: number | null
          balance_mxn?: number | null
          balance_tamv?: number | null
          balance_usd?: number | null
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          total_earned?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance_eth?: number | null
          balance_mxn?: number | null
          balance_tamv?: number | null
          balance_usd?: number | null
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          total_earned?: number | null
          total_spent?: number | null
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
      calculate_commission: {
        Args: { _amount: number; _commission_percent: number }
        Returns: {
          creator_amount: number
          platform_amount: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      log_audit_event: {
        Args: {
          _action: string
          _actor_id: string
          _entity_id: string
          _entity_type: string
          _metadata?: Json
          _new_state?: Json
          _prev_state?: Json
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "user" | "creator" | "moderator" | "admin" | "superadmin"
      auction_status: "draft" | "upcoming" | "active" | "ended" | "cancelled"
      concert_status: "draft" | "scheduled" | "live" | "ended" | "cancelled"
      currency_type: "TAMV" | "ETH" | "USD" | "MXN"
      notification_type:
        | "info"
        | "success"
        | "warning"
        | "achievement"
        | "social"
        | "economic"
      pet_rarity: "common" | "rare" | "epic" | "legendary" | "mythic"
      transaction_status: "pending" | "completed" | "failed" | "cancelled"
      transaction_type:
        | "income"
        | "expense"
        | "transfer"
        | "commission"
        | "refund"
        | "withdrawal"
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
      app_role: ["user", "creator", "moderator", "admin", "superadmin"],
      auction_status: ["draft", "upcoming", "active", "ended", "cancelled"],
      concert_status: ["draft", "scheduled", "live", "ended", "cancelled"],
      currency_type: ["TAMV", "ETH", "USD", "MXN"],
      notification_type: [
        "info",
        "success",
        "warning",
        "achievement",
        "social",
        "economic",
      ],
      pet_rarity: ["common", "rare", "epic", "legendary", "mythic"],
      transaction_status: ["pending", "completed", "failed", "cancelled"],
      transaction_type: [
        "income",
        "expense",
        "transfer",
        "commission",
        "refund",
        "withdrawal",
      ],
    },
  },
} as const
