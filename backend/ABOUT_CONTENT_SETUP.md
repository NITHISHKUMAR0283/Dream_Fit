# About Content Setup Guide

## Database Setup

To enable the customizable About page feature, you need to create the `about_content` table in your Supabase database.

### Steps:

1. **Go to Supabase Dashboard**
   - Navigate to your Supabase project
   - Go to SQL Editor

2. **Run the SQL Script**
   - Copy the contents of `supabase-about-content.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the script

3. **Verify the Table**
   - Go to Table Editor
   - You should see the new `about_content` table
   - It should have 8 default content blocks (hero, headings, text, stats, team)

### API Endpoints

The following endpoints are now available:

- **GET** `/api/about-content` - Get all content blocks (ordered by display_order)
- **GET** `/api/about-content/:id` - Get a single content block
- **POST** `/api/about-content` - Create a new content block
- **PUT** `/api/about-content/:id` - Update a content block
- **DELETE** `/api/about-content/:id` - Delete a content block
- **POST** `/api/about-content/reorder` - Reorder content blocks

### Content Block Types

The system supports the following block types:

1. **hero** - Large banner with title, subtitle, and image
2. **heading** - Headings (h1-h5) with customizable size and boldness
3. **text** - Text paragraphs with alignment and size options
4. **image** - Images with position and resolution control
5. **stats** - Statistics display with multiple items
6. **team** - Team member profiles with images and bios

### Content Block Structure

Each block has:
- `id` (UUID) - Unique identifier
- `type` (VARCHAR) - Block type (hero, heading, text, etc.)
- `display_order` (INTEGER) - Display order on the page
- `content` (JSONB) - Flexible JSON content specific to each block type
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp (auto-updated)

### Frontend Integration

The frontend About page (`frontend/src/pages/About.tsx`) will automatically:
- Load content blocks from the API on page load
- Display blocks in the order specified by `display_order`
- Show admin controls when user is admin or demo mode is enabled
- Allow creating, editing, deleting, and reordering blocks

### Testing

To test the admin features without logging in as admin:
1. Navigate to `/about`
2. Click the "Edit Mode OFF" button in the top-right corner
3. This enables demo admin mode for testing
4. All admin controls (add, edit, delete, reorder) will be visible
