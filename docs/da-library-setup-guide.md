# DA Library Setup Guide — Custom Blocks

This document describes the exact content to author in DA for each custom block
so they appear in the DA block picker for authors.

## Prerequisites

1. Go to `https://da.live/edit#/katmakur/poc-adobe-eds/`
2. Create folder: `library/`
3. Create folder: `library/blocks/`

---

## Block Documents to Create

Each section below = one document to create inside `library/blocks/`.

---

### Document: `library/blocks/hero`

Create this document with TWO block tables (two variations), separated by a
section break (horizontal rule / `---` in DA).

#### Variation 1: Hero (Image)

Table header row: `Hero`

| Hero | |
|------|---|
| (insert an image here) | |
| Your Headline Here | |
| Supporting subtext goes here describing the page or section. | |
| [Explore Now](/find-a-cruise) | |

Then immediately after, add a Library Metadata table:

| Library Metadata | |
|---|---|
| Description | Full-width hero with background image, heading, subtext, and CTA button. |

--- (section break) ---

#### Variation 2: Hero (Video)

| Hero | |
|------|---|
| https://example.com/video.mp4 | |
| Video Hero Headline | |
| Engaging subtext over a looping video background. | |
| [Book Your Cruise](/find-a-cruise) | |

| Library Metadata | |
|---|---|
| Description | Full-width hero with looping video background. Paste a .mp4 URL in the first row. |

---

### Document: `library/blocks/promo-cards`

Table header row: `Promo Cards`

| Promo Cards | |
|---|---|
| (image of Caribbean) | **Caribbean Getaway**<br>Explore crystal-clear waters and pristine beaches.<br>[View Cruises](/find-a-cruise?destination=caribbean) |
| (image of Mediterranean) | **Mediterranean Explorer**<br>Discover ancient ports and vibrant coastal cities.<br>[View Cruises](/find-a-cruise?destination=mediterranean) |
| (image of Alaska) | **Alaska Adventure**<br>Witness glaciers, wildlife, and stunning wilderness.<br>[View Cruises](/find-a-cruise?destination=alaska) |

| Library Metadata | |
|---|---|
| Description | 3-card promotional layout. Each row = one card. Column 1: image, Column 2: title + description + CTA link. |

---

### Document: `library/blocks/cards`

| Cards | |
|---|---|
| (image) | **Card Title**<br>Description text for this card item. |
| (image) | **Card Title**<br>Description text for this card item. |
| (image) | **Card Title**<br>Description text for this card item. |

| Library Metadata | |
|---|---|
| Description | Grid of content cards. Each row = one card. Column 1: image, Column 2: rich text content. |

---

### Document: `library/blocks/columns`

#### Variation 1: Columns (2-up)

| Columns | |
|---|---|
| **Left Column**<br>Content for the left side. | **Right Column**<br>Content for the right side. |

| Library Metadata | |
|---|---|
| Description | Two-column layout for side-by-side content. Each cell = one column. |

--- (section break) ---

#### Variation 2: Columns (3-up)

| Columns | | |
|---|---|---|
| **Column 1**<br>First column content. | **Column 2**<br>Second column content. | **Column 3**<br>Third column content. |

| Library Metadata | |
|---|---|
| Description | Three-column layout. Add more cells for more columns. |

---

### Document: `library/blocks/itinerary-table`

| Itinerary Table | |
|---|---|
| Day 1 | Miami, Florida — Departs 5:00 PM |
| Day 2 | At Sea — Cruising |
| Day 3 | Cozumel, Mexico — Arrives 8:00 AM, Departs 5:00 PM |
| Day 4 | Grand Cayman, Cayman Islands — Arrives 7:00 AM, Departs 4:00 PM |
| Day 5 | At Sea — Cruising |
| Day 6 | Miami, Florida — Arrives 7:00 AM |

| Library Metadata | |
|---|---|
| Description | Day-by-day port itinerary timeline. Each row: Column 1 = day number, Column 2 = port details with arrival/departure times. |

---

### Document: `library/blocks/cruise-ship-reference`

| Cruise Ship Reference | |
|---|---|
| Ocean Voyager | |
| 2,800 | |
| 2024 | |
| /cruise-ships/ocean-voyager/2024 | |

| Library Metadata | |
|---|---|
| Description | Linked ship card for cruise pages. Fields in order: ship name, guest capacity, version/year, ship page URL. |

---

### Document: `library/blocks/cruise-detail`

| Cruise Detail | |
|---|---|
| CRU12345 | |
| ITN67890 | |
| Western Caribbean | |
| 7-Night Western Caribbean | |
| Ocean Voyager | |
| 7 | |
| 2025-03-15 | |
| 2025-03-22 | |
| Miami | |
| Miami | |
| false | |
| Miami, Cozumel, Grand Cayman, Jamaica | |

| Library Metadata | |
|---|---|
| Description | Full cruise details block (typically auto-populated by feed pipeline). Fields: cruiseId, itineraryId, name, nightName, shipName, duration, departDate, arrivalDate, departPort, arrivalPort, soldOut, portList. |

---

### Document: `library/blocks/ship-detail`

| Ship Detail | |
|---|---|
| SHIP001 | |
| Ocean Voyager | |
| 2024 | |
| 2,800 | |
| 330m | |
| 42m | |
| 22 knots | |
| 14 room categories across 4 suite types | |
| Ocean Voyager is our flagship vessel, offering world-class amenities and breathtaking ocean views. | |

| Library Metadata | |
|---|---|
| Description | Ship specifications block (typically auto-populated by feed pipeline). Fields: shipId, name, version, guests, length, width, speed, roomSummary, shortDescription. |

---

### Document: `library/blocks/room-detail`

| Room Detail | |
|---|---|
| SHIP001 | |
| Ocean Voyager | |
| 2024 | |
| BALCONY | |
| Balcony Stateroom | |
| B1 | |
| Deluxe Balcony | |
| Spacious balcony stateroom with ocean views. | |
| Enjoy your private balcony with stunning views, queen bed, and luxury bathroom. | |
| Private Balcony | Queen Bed | Mini Bar | 42" TV | Room Service | |
| B1A||B1B||B1C | |
| 28 sqm | |

| Library Metadata | |
|---|---|
| Description | Room/stateroom category details (typically auto-populated by feed pipeline). Fields: shipId, shipName, shipVersion, roomTypeId, roomTypeName, categoryId, categoryName, shortDescription, longDescription, amenities (pipe-separated), subCategories (double-pipe separated), area. |

---

### Document: `library/blocks/excursion-detail`

| Excursion Detail | |
|---|---|
| EXC001 | |
| Mayan Ruins Discovery Tour | |
| Cozumel | |
| Western Caribbean | |
| MODERATE | |
| CULTURAL_DISCOVERY | |
| 6 hours | |
| 89 | |
| USD | |
| true | |
| Explore the ancient Mayan ruins of Tulum perched on cliffs overlooking the Caribbean Sea. | |

| Library Metadata | |
|---|---|
| Description | Shore excursion details (typically auto-populated by feed pipeline). Fields: id, name, portName, destinationName, activityLevel, collectionType, duration, priceLevel, currency, wheelChairAccessible, longDescription. |

---

### Document: `library/blocks/cruise-itinerary`

| Cruise Itinerary | |
|---|---|
| Miami|MIA|United States|2025-03-15T17:00:00||Cozumel|COZ|Mexico|2025-03-17T08:00:00|17:00||Grand Cayman|GCM|Cayman Islands|2025-03-18T07:00:00|16:00||At Sea|ATSEADAY|||2025-03-19||Miami|MIA|United States|2025-03-22T07:00:00| | |

| Library Metadata | |
|---|---|
| Description | Port-by-port itinerary timeline (typically auto-populated by feed pipeline). Single field with pipe-delimited port data: portName|portId|country|arrivalDate|departTime separated by || for each port. |

---

### Document: `library/blocks/cruise-excursions`

| Cruise Excursions | |
|---|---|
| EXC001|Mayan Ruins Tour|6 hours|89|USD||EXC002|Snorkeling Adventure|4 hours|65|USD||EXC003|Beach Break|3 hours|45|USD | |
| 12 | |

| Library Metadata | |
|---|---|
| Description | Shore excursions list (typically auto-populated by feed pipeline). Row 1: pipe-delimited excursion entries (id|name|duration|price|currency) separated by ||. Row 2: total excursion count. |

---

## Blocks Sheet

After creating all block documents above, create a **sheet** at `library/blocks`.
This sheet needs columns: `name` and `path`.

| name | path |
|---|---|
| Hero | https://content.da.live/katmakur/poc-adobe-eds/library/blocks/hero |
| Promo Cards | https://content.da.live/katmakur/poc-adobe-eds/library/blocks/promo-cards |
| Cards | https://content.da.live/katmakur/poc-adobe-eds/library/blocks/cards |
| Columns | https://content.da.live/katmakur/poc-adobe-eds/library/blocks/columns |
| Itinerary Table | https://content.da.live/katmakur/poc-adobe-eds/library/blocks/itinerary-table |
| Cruise Ship Reference | https://content.da.live/katmakur/poc-adobe-eds/library/blocks/cruise-ship-reference |
| Cruise Detail | https://content.da.live/katmakur/poc-adobe-eds/library/blocks/cruise-detail |
| Ship Detail | https://content.da.live/katmakur/poc-adobe-eds/library/blocks/ship-detail |
| Room Detail | https://content.da.live/katmakur/poc-adobe-eds/library/blocks/room-detail |
| Excursion Detail | https://content.da.live/katmakur/poc-adobe-eds/library/blocks/excursion-detail |
| Cruise Itinerary | https://content.da.live/katmakur/poc-adobe-eds/library/blocks/cruise-itinerary |
| Cruise Excursions | https://content.da.live/katmakur/poc-adobe-eds/library/blocks/cruise-excursions |

---

## Site Config — Library Tab

Go to: `https://da.live/config#/katmakur/poc-adobe-eds/`

Open or create a sheet tab named **`library`** and add:

| title | path |
|---|---|
| Blocks | https://content.da.live/katmakur/poc-adobe-eds/library/blocks.json |

Save the config.

---

## Final Checklist

- [ ] All block documents created in `library/blocks/`
- [ ] All block documents previewed AND published
- [ ] Blocks sheet created at `library/blocks` with name + path columns
- [ ] Blocks sheet previewed AND published
- [ ] Site config updated with library tab pointing to blocks.json
- [ ] Config saved
- [ ] Open any document → expand Library → verify blocks appear
