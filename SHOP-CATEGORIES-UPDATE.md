# Shop Page Categories - Dynamic from Database

## What Changed

The Shop page category filters are now **dynamically loaded from the database** instead of being hardcoded!

---

## Before vs After

### ❌ Before (Hardcoded):
```javascript
const categories = ['Summer Dresses', 'Evening Wear', 'Casual Wear', 'Bohemian', 'Party Wear', 'Formal'];
```

### ✅ After (Dynamic from Database):
```javascript
const [categories, setCategories] = useState<string[]>([]);

const loadCategories = async () => {
  const response = await fetch('http://localhost:5000/api/categories');
  const result = await response.json();
  const categoryNames = result.data.map((cat: any) => cat.name);
  setCategories(categoryNames);
};
```

---

## How It Works

### 1. **Categories Page** (Admin Management)
Admins can manage categories at `/categories`:
- ✅ Add new categories
- ✅ Edit category names and details
- ✅ Delete categories
- ✅ Toggle home page visibility
- ✅ Upload category images

### 2. **Shop Page** (Automatic Filtering)
The shop page automatically:
- ✅ Fetches all categories from database on load
- ✅ Displays them in the "Categories" filter section
- ✅ Updates whenever you add/edit/delete categories
- ✅ Shows only active categories

### 3. **Connection Flow**
```
Admin adds category in /categories
           ↓
Category saved to database (Supabase)
           ↓
Shop page fetches categories
           ↓
Category appears in filter list
           ↓
Users can filter products by that category
```

---

## How to Use

### For Admins:

**Add a New Category:**
1. Go to http://localhost:3000/categories
2. Click "Add Category"
3. Fill in:
   - Category Name (e.g., "Summer Dresses")
   - Description
   - Image URL or upload image
   - Show on Home Page (optional)
4. Click "Save Category"
5. **The category automatically appears in Shop page filters!**

**Edit Existing Category:**
1. Go to http://localhost:3000/categories
2. Hover over a category card
3. Click the edit (pencil) icon
4. Update the category name or details
5. Click "Save"
6. **Shop page updates automatically!**

**Delete a Category:**
1. Go to http://localhost:3000/categories
2. Hover over a category card
3. Click the delete (trash) icon
4. Confirm deletion
5. **Category removed from Shop filters!**

### For Users:

1. Go to http://localhost:3000/shop
2. Look at the "Categories" filter section (left sidebar)
3. See all available categories loaded from database
4. Click any category to filter products
5. Categories update automatically when admin adds new ones

---

## Technical Details

### API Endpoint
```http
GET /api/categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "name": "Summer Dresses",
      "description": "Light and breezy summer dresses",
      "image": "https://...",
      "show_on_home": true,
      "home_order": 1
    },
    {
      "id": "uuid-2",
      "name": "Evening Wear",
      "description": "Elegant evening dresses",
      "image": "https://...",
      "show_on_home": false,
      "home_order": 2
    }
  ]
}
```

### Frontend Code Location
**File:** `frontend/src/pages/Shop.tsx`

**Key Changes:**
- Line 18: `const [categories, setCategories] = useState<string[]>([]);`
- Lines 37-52: `loadCategories()` function
- Line 34: Categories loaded on component mount

### Database Table
**Table:** `categories`

**Columns:**
- `id` (UUID) - Primary key
- `name` (VARCHAR) - Category name displayed in shop
- `description` (TEXT) - Category description
- `image` (TEXT) - Category image URL
- `show_on_home` (BOOLEAN) - Show on home page
- `home_order` (INTEGER) - Display order
- `created_at` (TIMESTAMP) - Creation time
- `updated_at` (TIMESTAMP) - Last update time

---

## Benefits

✅ **No Code Changes Needed** - Add categories without touching code
✅ **Real-time Updates** - Shop page reflects database immediately
✅ **Admin Friendly** - Easy to manage via UI
✅ **Consistent** - Same categories everywhere (Home, Shop, etc.)
✅ **Scalable** - Add unlimited categories
✅ **User-Friendly** - Shoppers see only active categories

---

## Examples

### Example 1: Adding "Winter Collection"
```
1. Admin goes to /categories
2. Clicks "Add Category"
3. Enters:
   - Name: "Winter Collection"
   - Description: "Cozy winter wear"
   - Image: [uploads winter image]
4. Saves
5. Shop page now shows "Winter Collection" in filters
6. Users can filter by "Winter Collection"
```

### Example 2: Renaming "Party Wear" to "Party Dresses"
```
1. Admin goes to /categories
2. Finds "Party Wear" card
3. Clicks edit icon
4. Changes name to "Party Dresses"
5. Saves
6. Shop page filter updates to "Party Dresses"
7. Old links still work (uses category ID internally)
```

### Example 3: Removing "Bohemian"
```
1. Admin goes to /categories
2. Finds "Bohemian" card
3. Clicks delete (trash) icon
4. Confirms deletion
5. "Bohemian" removed from shop filters
6. Products with "Bohemian" category still exist but need reassignment
```

---

## Important Notes

⚠️ **Category Names in URLs**
- Shop uses category names in URLs: `/shop?category=Summer%20Dresses`
- If you rename a category, old bookmarked links may break
- Consider keeping names stable or adding URL redirects

⚠️ **Product Assignment**
- Products have `category` field with category name
- If you delete a category, products with that category still exist
- Reassign products before deleting categories

✅ **Best Practices**
- Use clear, descriptive category names
- Don't create too many categories (5-10 is ideal)
- Keep category names short for better UI
- Use consistent naming (e.g., "Summer Dresses" not "summer dresses")

---

## Summary

The Shop page category filters are now **100% dynamic** and managed through the database. Admins can add, edit, or delete categories via the Categories page at `/categories`, and these changes **automatically reflect** in the Shop page filters without any code changes.

This makes the e-commerce site much more flexible and easier to manage! 🎉

**Quick Links:**
- Manage Categories: http://localhost:3000/categories
- Shop Page: http://localhost:3000/shop
- Home Page: http://localhost:3000

Enjoy your dynamic category management! ✨
