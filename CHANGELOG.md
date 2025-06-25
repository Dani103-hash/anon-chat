
# Changelog

All notable changes to AnonChat will be documented in this file.

## [v1.0.0] - 2025-06-25

### 🔧 Fixed
- **RLS Policies**: Fixed Row Level Security policies preventing user creation and message delivery
- **Authentication Flow**: Implemented proper three-step access logic (anonymous → return → secure)
- **Message Routing**: Fixed message delivery to ensure messages reach the correct username
- **User Creation**: Resolved "Create my inbox" button errors

### ✨ Added
- **Email/Password Auth**: Added email/password authentication alongside Google OAuth
- **Anonymous User System**: Implemented localStorage-based anonymous sessions with upgrade path
- **Real-time Messages**: Added live message delivery with notifications
- **PWA Features**: Full Progressive Web App support with install prompts
- **Message Slideshow**: Animated preview of sample anonymous messages
- **Engagement Tips**: User guidance tips for better experience

### 🏗️ Components Created
- `Auth.tsx` - Authentication page with email/password and Google login
- `QuickUserCreation.tsx` - Anonymous user creation flow
- Database migration for proper RLS policies

### 🔄 Enhanced
- `useUserSession.ts` - Complete auth state management
- `useMessages.ts` - Reliable message delivery system
- `App.tsx` - Added auth routing
- `Index.tsx` - Improved homepage experience

---

## [v1.1.0] - 2025-06-25

### 🚀 New Competitive Features

#### 1. Social Media Integration
- **Share to Story**: One-click sharing to Instagram/TikTok stories
- **Bio Link Generator**: Automated link creation for social media bios
- **Platform Detection**: Smart username suggestions based on popular platforms
- **Copy Bio Text**: Perfect formatted text for social media bios

#### 2. Message Categories & Reactions
- **Categories**: Compliments, Questions, Confessions, Fun, Advice
- **Quick Reactions**: Heart, Fire, Laughing, Surprised, Thinking emojis
- **Message Stats**: View count and reaction summaries (anonymous)
- **Category Filtering**: Filter messages by type for better organization

#### 3. Gamification System
- **Daily Streaks**: Consecutive days of activity tracking
- **Achievement Badges**: "Popular" (10+ messages), "Mysterious" (send 50 messages), "Friendly" (high positive reactions)
- **Level System**: Progressive leveling based on activity and engagement
- **Progress Tracking**: Visual progress bars and statistics dashboard
- **Rewards**: Unlock special message backgrounds, custom themes

### 🏗️ New Components Created
- `SocialShare.tsx` - Social media integration and link sharing
- `MessageCategories.tsx` - Message categorization and reaction system
- `GamificationSystem.tsx` - Achievement and level system
- `useGamification.ts` - Hook for managing user stats and achievements

### 🔄 Enhanced
- `UserDashboard.tsx` - Added tabbed interface with categories and achievements
- `Index.tsx` - Integrated social sharing for logged-in users
- Added achievement tracking and level progression
- Improved user engagement through gamification elements

### 📱 Features Added
- **Social Sharing**: Easy sharing to Instagram, TikTok, Twitter
- **Bio Text Generation**: Automatic bio text creation with link
- **Achievement System**: 5 different achievement types with progress tracking
- **Level Progression**: Experience-based leveling system
- **Category System**: Organized message categorization
- **Reaction System**: Emoji reactions for messages
- **Statistics Dashboard**: Comprehensive user activity tracking
