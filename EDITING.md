# Customer Editing Guide — ganesha-gopuram

This template is a luxury South-Indian temple wedding invitation featuring a 3-stage opening sequence (cover → intro video → invitation), Ganesha blessings, couple & family lineages, multi-event program, venue details, and WhatsApp RSVP.

---

## Normal Customer Changes

All routine customer edits are configured in:
→ [editable/wedding-data.js](file:///Users/amnas/Desktop/h2track/ganesha-gopuram/editable/wedding-data.js)

### Couple & Families
Edit `couple` in `editable/wedding-data.js`:
- `bride` & `groom`: Short first names (e.g. `"Priya"`, `"Arjun"`)
- `brideFull` & `groomFull`: Full formal names
- `brideParents` & `groomParents`: Parents' names
- `familyName`: Family title (e.g. `"Naidu"`)
- `hashtag`: e.g. `"#ArjunWedsPriya"`
- `monogram`: e.g. `"A · P"`

### Wedding Date & Times
Edit `wedding` in `editable/wedding-data.js`:
- `dateISO`: ISO timestamp string with timezone (e.g. `"2026-11-14T10:30:00+05:30"`), drives countdown and calendar
- `dateLabel`: e.g. `"Saturday, 14th November 2026"`
- `timeLabel`: e.g. `"At 10:30 AM onwards"`
- `dayLabel`, `dayNum`, `monthLabel`, `yearLabel`

### Sacred Verses & Intro Cover
Edit `verse` and `cover` in `editable/wedding-data.js`:
- `verse.hindi`: e.g. `"॥ शुभ विवाह ॥"`
- `verse.tamil`: e.g. `"சுப திருமணம்"`
- `verse.text`: Blessing copy
- `cover`: Intro cover card kicker, title, headline, and CTA

### Intro Video & Media
Edit `intro` in `editable/wedding-data.js`:
- `videoSrc`: Intro video (`./editable/assets/video/intro.mp4`)
- `posterSrc`: Video poster image (`./editable/assets/video/poster.png`)

### Venue & WhatsApp RSVP
Edit `venue` and `rsvp` in `editable/wedding-data.js`:
- `venue.name`, `venue.address`, `venue.mapsQuery`
- `rsvp.phone`, `rsvp.whatsapp` (digits only, e.g. `"919876543210"` for WhatsApp link), `rsvp.email`, `rsvp.note`

### Events & Day Schedule
Edit `events` and `program` arrays in `editable/wedding-data.js`.

---

## Special Sections & Features

- **3-Stage Gate State Machine**: Cover card → Video animation → Invitation entry.
- **WhatsApp Direct RSVP**: Auto-populates attendance message with couple names.
- **Google & Apple Calendar**: Creates instant calendar reminders.

---

## Rules for Future Agents

1. Make edits in `editable/wedding-data.js` and swap files in `editable/assets/`.
2. Do not modify bundled code in `assets/` unless a customer specifically requests structural code changes.
3. Preserve temple motifs, typography, animations, and responsiveness.
4. Verify by opening the page locally or running `node --check editable/wedding-data.js`.
