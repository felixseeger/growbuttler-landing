# Test Instructions for GrowButtler Features

## Overview
This document provides step-by-step instructions to test all new features with 3 test plants.

## Prerequisites
1. Have the application running locally
2. Be logged in as a test user
3. Have 3 plant images ready (can use stock cannabis plant photos)

---

## Test Plant Data

### Plant 1: Blue Dream (Vegetative)
- **Name:** Blue Dream
- **Strain:** Blue Dream (Sativa-Dominant Hybrid)
- **Stage:** Vegetative
- **Location:** Tent A
- **Start Date:** 21 days ago (calculate: today - 21 days)

**Journal Entry Data:**
- **Date:** Today
- **Note:** "Plants are developing nicely with strong stems and vibrant green leaves. Increased light intensity to 600W. Fan leaves are spreading well."
- **Temperature:** 76°F
- **Humidity:** 60%
- **pH Level:** 6.3
- **Nutrient Mix:** Flora Grow (2-1-6)
- **Image:** Upload a vegetative stage cannabis plant image

---

### Plant 2: Northern Lights (Flowering)
- **Name:** Northern Lights
- **Strain:** Northern Lights #5 (Indica)
- **Stage:** Flowering
- **Location:** Tent B
- **Start Date:** 56 days ago (8 weeks ago)

**Journal Entry Data:**
- **Date:** Today
- **Note:** "Flowering week 2 - First pistils appearing! Trichome development starting on sugar leaves. Switched to 12/12 light cycle. Beautiful purple hues developing."
- **Temperature:** 72°F
- **Humidity:** 50%
- **pH Level:** 6.0
- **Nutrient Mix:** Flora Bloom (0-5-4)
- **Image:** Upload a flowering stage cannabis plant image

---

### Plant 3: Girl Scout Cookies (Seedling)
- **Name:** Girl Scout Cookies
- **Strain:** GSC (Hybrid)
- **Stage:** Seedling
- **Location:** Propagation Station
- **Start Date:** 7 days ago

**Journal Entry Data:**
- **Date:** Today
- **Note:** "Seedling just emerged! First true leaves showing. Keeping humidity dome on for 2 more days. Root development looks healthy in clear cup."
- **Temperature:** 78°F
- **Humidity:** 70%
- **pH Level:** 6.5
- **Nutrient Mix:** Light Seedling Mix (quarter strength)
- **Image:** Upload a seedling stage cannabis plant image

---

## Step-by-Step Testing Instructions

### Phase 1: Create Plants

#### For Each Plant (repeat 3 times):

1. **Navigate to Dashboard**
   - Go to `/dashboard`
   - Should see "Seed New Life" button

2. **Click "Seed New Life" or "+ Add Plant"**
   - Modal should open with plant creation form

3. **Fill in Plant Details**
   - Name: [Use plant name from data above]
   - Strain: [Use strain from data above]
   - Stage: [Select from dropdown]
   - Location: [Use location from data above]
   - Start Date: [Calculate based on days ago]
   - Upload Image: [Select appropriate plant image]

4. **Submit**
   - Click "Add Plant"
   - Should redirect to the plant's journal page
   - Should see plant in dashboard grid

---

### Phase 2: Add Journal Entries with Data

#### For Each Plant (repeat 3 times):

1. **Navigate to Plant Journal**
   - Click on plant card in dashboard
   - OR use "Log Journal" button

2. **Option A: Use Quick Entry (for text + image)**
   - In the quick entry box at top of journal
   - Type the note text
   - Click "Add Photo" button
   - Select journal entry image
   - Click "Eintrag hinzufügen"
   - Entry should appear in timeline

3. **Option B: Use Full Entry Form (for data + vitals)**
   - Click "Log Journal" from dashboard
   - OR navigate to `/journal/new-entry?plantId={plantId}`
   - Fill in all fields:
     - Entry Date: Today
     - Upload image
     - Temperature slider
     - Humidity slider
     - Nutrient Mix
     - pH Level
     - Daily Narrative (the note text)
   - Click "Save to Chronicle"
   - Should return to journal page with new entry

---

### Phase 3: Test Plant Management Features

#### Edit Plant:

1. **Navigate to Plant Journal**
   - Click on any plant card

2. **Open Plant Settings**
   - Click three-dot menu (⋮) in plant header
   - Menu should appear with "Edit Plant" and "Delete Plant"

3. **Edit Plant**
   - Click "Edit Plant"
   - Modal opens with current data
   - Change name to: "[Original Name] - Edited"
   - Change stage to different option
   - Upload new image (optional)
   - Click "Update Plant"
   - Should see updated name in header
   - All journal entries should reflect new name

#### Test Quick Entry with Image:

1. **In Plant Journal**
   - Type a note in quick entry box
   - Click "Add Photo"
   - Select an image
   - Preview should appear
   - Click X to remove (test removal)
   - Add image again
   - Click "Eintrag hinzufügen"
   - Entry should appear with image and text

#### Edit Journal Entry:

1. **Find Any Entry**
   - Locate a user-created entry (not expert insight)

2. **Click Edit Button (pencil icon)**
   - Inline editing textarea appears
   - Modify the text
   - Click "Save"
   - Text should update in timeline

3. **Click Cancel (test cancellation)**
   - Edit another entry
   - Click "Cancel" instead
   - Should return to view mode without changes

#### Delete Journal Entry:

1. **Click Delete Button (trash icon)**
   - Confirmation dialog appears
   - Click "OK" to confirm
   - Entry should disappear from timeline

#### Delete Plant:

1. **Open Plant Settings Menu**
   - Click three-dot menu (⋮)

2. **Click "Delete Plant"**
   - Confirmation appears showing entry count
   - Example: "Are you sure you want to delete 'Blue Dream'? This will delete all 3 journal entries..."
   - Click "OK"
   - Should redirect to dashboard
   - Plant should be removed from grid

---

### Phase 4: Verify Dashboard Integration

After creating all 3 plants with entries, verify dashboard shows:

1. **Plant Grid**
   - ✅ 3 plant cards displayed
   - ✅ Each shows correct image
   - ✅ Each shows correct Day number
   - ✅ Each shows correct stage badge (color-coded)
   - ✅ Each shows correct Week number
   - ✅ Strain name displayed under plant name

2. **Plant Card Actions**
   - ✅ Clicking card navigates to journal
   - ✅ "Log Journal" button works
   - ✅ Stage colors match stage type

3. **Greeting Section**
   - Shows personalized greeting
   - Shows "Your garden is thriving today" status

---

## Expected Results Summary

### Features to Verify:

✅ Create 3 plants with images
✅ Add journal entries with images and environmental data
✅ Quick entry with text only
✅ Quick entry with image only
✅ Quick entry with text + image
✅ Full journal entry form with all vitals
✅ Edit plant details (name, stage, location, image)
✅ Edit journal entries inline
✅ Delete journal entries with confirmation
✅ Delete plants with confirmation (removes all entries)
✅ Dashboard shows all plants with real data
✅ Day/Week calculations are correct
✅ Stage badges show correct colors
✅ Images display correctly everywhere
✅ Navigation between dashboard and journals works
✅ "Seed New Life" and "+ Add Plant" both work

---

## Dashboard Data Points

After testing, the dashboard should show:

**Plant 1 (Blue Dream):**
- Day: ~21-22
- Week: 3-4
- Stage: Vegetative (green badge)
- 1+ journal entries

**Plant 2 (Northern Lights):**
- Day: ~56-57
- Week: 8
- Stage: Flowering (orange badge)
- 1+ journal entries

**Plant 3 (Girl Scout Cookies):**
- Day: ~7-8
- Week: 1-2
- Stage: Seedling (bright green badge)
- 1+ journal entries

---

## Troubleshooting

**If images don't upload:**
- Check `/public/uploads/journal-images/` directory exists
- Check file permissions
- Try smaller image files (< 5MB)

**If plants don't appear:**
- Check browser console for errors
- Verify authentication (try logging out and back in)
- Check API responses in Network tab

**If day/week numbers are wrong:**
- Verify start date calculation
- Check timezone settings

---

## API Endpoints Reference

For manual testing via API:

```bash
# Create plant
POST /api/plants/add
{
  "name": "Blue Dream",
  "strain": "Blue Dream (Sativa-Dominant Hybrid)",
  "stage": "vegetative",
  "location": "Tent A",
  "startDate": "2026-02-09T00:00:00Z",
  "featuredImageUrl": "http://localhost:3006/uploads/journal-images/..."
}

# Create journal entry
POST /api/journal-entry/add
{
  "plantId": "plant-xxx",
  "entryDate": "2026-03-02",
  "narrative": "Plants are developing nicely...",
  "temperature": 76,
  "humidity": 60,
  "phLevel": "6.3",
  "nutrientMix": "Flora Grow (2-1-6)",
  "featuredImageUrl": "http://localhost:3006/uploads/journal-images/..."
}

# Quick entry
POST /api/journal-entry/quick
{
  "plantId": "plant-xxx",
  "content": "Quick update text",
  "postId": null
}
```

---

## Success Criteria

✅ All 3 plants created successfully
✅ All journal entries saved with images and data
✅ Dashboard displays all plants with correct info
✅ Edit/delete operations work without errors
✅ Images load on all pages
✅ Day/Week numbers calculate correctly
✅ No console errors
✅ All navigation works smoothly
