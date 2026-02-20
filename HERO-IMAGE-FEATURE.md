# Hero Image Upload Feature - Complete Guide

## Overview
Admin users can now upload and change the main hero image on the home page by selecting an image from their local computer. The image is automatically uploaded to Cloudinary and stored in the database.

---

## Setup Instructions

### Step 1: Run SQL Script in Supabase
Run the file `ADD-HERO-IMAGES.sql` in your Supabase SQL Editor.

This will:
- Create `hero_images` table
- Add necessary indexes and RLS policies
- Insert a default hero image

### Step 2: Backend is Already Updated
The backend has been updated with these new endpoints:
- `GET /api/hero-images/active` - Get the current active hero image
- `GET /api/hero-images` - Get all hero images (admin)
- `POST /api/hero-images` - Upload new hero image
- `PUT /api/hero-images/:id` - Update hero image
- `DELETE /api/hero-images/:id` - Delete hero image

### Step 3: Frontend is Already Updated
The home page now:
- Fetches and displays the hero image from the database
- Shows an edit button for admin users (appears on hover)
- Allows image upload from local computer
- Uploads to Cloudinary automatically

---

## How to Use

### For Admin Users:

1. **Login as Admin**
   - Make sure you're logged in with the admin account

2. **Navigate to Home Page**
   - Go to http://localhost:3000

3. **Upload Hero Image**
   - Scroll to the hero section (top of page with large image on right)
   - Hover over the hero image
   - Click the **edit icon** (pen/pencil) that appears in the top-right corner
   - Select an image from your computer (max 5MB)
   - Wait for upload to complete
   - Image will update automatically!

---

## Technical Details

### Image Processing
- **Upload Method**: Local file selection → Base64 conversion → Cloudinary upload
- **Size Limit**: 5MB maximum
- **Accepted Formats**: All image formats (jpg, png, webp, etc.)
- **Cloudinary Folder**: `dreamfit/hero`
- **Transformation**: Resized to 1200x1400 with auto quality

### Database Schema
```sql
hero_images {
  id: UUID (Primary Key)
  image_url: TEXT (Cloudinary URL)
  title: VARCHAR(255)
  subtitle: TEXT
  position: VARCHAR(50) - Default: 'main'
  is_active: BOOLEAN - Default: true
  display_order: INTEGER - Default: 1
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

### Features
✅ **Upload from local computer** - No need to paste URLs
✅ **Automatic Cloudinary upload** - Images stored securely
✅ **Admin-only access** - Edit button only visible to admins
✅ **Hover to reveal** - Clean UI, button appears on hover
✅ **Loading indicator** - Shows spinner during upload
✅ **Error handling** - Validates file size and type
✅ **Auto-replacement** - New upload deactivates old image
✅ **Persistent storage** - Saves to database + Cloudinary

---

## API Endpoints

### Get Active Hero Image
```http
GET /api/hero-images/active
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "image_url": "https://res.cloudinary.com/...",
    "title": "Hero Image",
    "subtitle": "Fashion Collection",
    "position": "main",
    "is_active": true,
    "display_order": 1,
    "created_at": "2025-10-04T...",
    "updated_at": "2025-10-04T..."
  }
}
```

### Upload New Hero Image
```http
POST /api/hero-images
Content-Type: application/json

{
  "image": "data:image/png;base64,...",
  "title": "Hero Image",
  "subtitle": "Fashion Collection",
  "position": "main"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Hero image uploaded successfully",
  "data": {
    "id": "uuid",
    "image_url": "https://res.cloudinary.com/...",
    ...
  }
}
```

---

## User Flow

```
1. Admin hovers over hero image
   ↓
2. Edit button appears (pen icon)
   ↓
3. Admin clicks edit button
   ↓
4. File picker opens
   ↓
5. Admin selects image from computer
   ↓
6. Image validates (size & type)
   ↓
7. Image converts to base64
   ↓
8. POST to /api/hero-images
   ↓
9. Backend uploads to Cloudinary
   ↓
10. Backend saves URL to database
   ↓
11. Frontend updates image display
   ↓
12. Success message shown
```

---

## File Locations

### SQL Script:
- `ADD-HERO-IMAGES.sql` - Create hero_images table

### Backend:
- `backend/simple-working-server.js:1518-1727` - Hero image endpoints

### Frontend:
- `frontend/src/pages/Home.tsx:27-30` - State management
- `frontend/src/pages/Home.tsx:144-210` - Load & upload functions
- `frontend/src/pages/Home.tsx:340-387` - Hero image UI with edit button

---

## Troubleshooting

### Image not updating?
1. Check browser console for errors
2. Verify Cloudinary credentials in backend `.env`
3. Check database connection in Supabase

### Edit button not showing?
1. Make sure you're logged in as admin
2. Hover over the hero image (button appears on hover)
3. Check that `user.isAdmin === true`

### Upload fails?
1. Check file size (must be < 5MB)
2. Ensure file is an image format
3. Check backend logs for errors
4. Verify Cloudinary API credentials

### Image shows but edit button doesn't work?
1. Check browser console for JavaScript errors
2. Verify file input ref is working
3. Test with a small image file first

---

## Future Enhancements (Optional)

- [ ] Multiple hero images carousel
- [ ] Image cropping before upload
- [ ] Preview before upload
- [ ] Drag and drop upload
- [ ] Batch upload multiple images
- [ ] Image editing (filters, brightness, etc.)
- [ ] Schedule hero image changes
- [ ] A/B testing different hero images

---

## Security

✅ **File Size Validation** - Max 5MB
✅ **File Type Validation** - Images only
✅ **Admin Only Access** - Edit button only for admins
✅ **Cloudinary Security** - Secure uploads with API key
✅ **Database RLS** - Row-level security enabled

---

## Summary

The hero image upload feature is now fully functional! Admin users can easily update the main hero image on the home page by:

1. Hovering over the image
2. Clicking the edit button
3. Selecting an image from their computer
4. Waiting for automatic upload and update

The image is stored securely in Cloudinary and the URL is saved to the Supabase database. The home page automatically fetches and displays the active hero image on page load.

**Benefits:**
- ✨ Easy to use - just click and select
- 🚀 Fast uploads via Cloudinary
- 💾 Persistent storage in database
- 🎨 Clean UI with hover interaction
- 🔒 Secure admin-only access
- 📱 Responsive and optimized images

Enjoy your new hero image management feature! 🎉
