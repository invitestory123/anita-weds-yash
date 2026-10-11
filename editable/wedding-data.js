/**
 * wedding-data.js — Customer-facing editable data layer for Anita & Yash Wedding
 * Blue Diamond Resort, Muzaffarpur · 20–21 November 2026
 */

window.WEDDING_DATA = {
  couple: {
    bride: "Anita",
    groom: "Yash",
    brideFull: "Anita",
    groomFull: "Yash",
    brideParents: "",
    groomParents: "",
    familyName: "Banka",
    hashtag: "#AnitaWedsYash",
    monogram: "A · Y",
  },

  wedding: {
    dateISO: "2026-11-20T12:30:00+05:30",
    dateLabel: "20th – 21st November 2026",
    timeLabel: "",
    dayLabel: "Friday & Saturday",
    dayNum: "20 – 21",
    monthLabel: "November",
    yearLabel: "2026",
  },

  verse: {
    hindi: "॥ श्री गणेशाय नमः ॥",
    tamil: "॥ शुभ विवाह ॥",
    text: "With the blessings of Lord Ganesha and our families, we joyfully invite you to celebrate the wedding of Yash and Anita.",
  },

  cover: {
    kicker: "Welcome to",
    title: "Our Wedding",
    headline: "A Beautiful Beginning Awaits",
    gratitude: "Thank you for being a part of our special day.",
    cta: "Tap to Begin",
  },

  intro: {
    videoSrc: "./editable/assets/video/intro.mp4",
    posterSrc: "./editable/assets/video/poster.png",
    focusHint: "Tap to enter",
    skipLabel: "Skip",
    musicEnabled: false,
  },

  venue: {
    name: "Blue Diamond Resort",
    address: "NH-57, Garha, Darbhanga Road, Muzaffarpur, Bihar 843103",
    mapsQuery: "Blue Diamond Resort And Hotel, NH- 57, Garha, Darbhanga Road, Muzaffarpur, Bihar 843103",
  },

  familyCard: {
    headline: "Banka Family Welcomes You",
    quote: "A wedding is not just a celebration, it is a feeling shared with loved ones.",
    message: "Thank you for standing by us, blessing Yash & Anita, and being a part of this beautiful journey.",
    regardsLabel: "Regards",
    regardsName: "Smt Narvadi Devi Banka",
  },

  rsvp: {
    phone: "",
    whatsapp: "",
    email: "",
    note: "Smt. Narvadi Devi Banka & Family",
  },

  events: [
    {
      name: "Mayra",
      date: "Friday, 20th November 2026",
      dayLabel: "Friday",
      dayNum: "20",
      monthLabel: "November 2026",
      time: "12:30 PM onwards",
      venue: "Blue Diamond Resort, Muzaffarpur",
      note: "Traditional Mayra ceremony blessed with love, family traditions, and joyful customs.",
    },
    {
      name: "Ring Ceremony & Sangeet",
      date: "Friday, 20th November 2026",
      dayLabel: "Friday",
      dayNum: "20",
      monthLabel: "November 2026",
      time: "7:00 PM onwards",
      venue: "Blue Diamond Resort, Muzaffarpur",
      note: "An enchanting evening of ring exchange followed by celebratory sangeet performances and music.",
    },
    {
      name: "Haldi & Carnival",
      date: "Saturday, 21st November 2026",
      dayLabel: "Saturday",
      dayNum: "21",
      monthLabel: "November 2026",
      time: "10:00 AM onwards",
      venue: "Blue Diamond Resort, Muzaffarpur",
      note: "A sunlit celebration of auspicious haldi hues, games, music, and festive carnival joy.",
    },
    {
      name: "Varmala",
      date: "Saturday, 21st November 2026",
      dayLabel: "Saturday",
      dayNum: "21",
      monthLabel: "November 2026",
      time: "7:30 PM onwards",
      venue: "Blue Diamond Resort, Muzaffarpur",
      note: "The auspicious Varmala ceremony as two souls unite together in love and holy matrimony.",
    },
  ],

  program: [
    { name: "Mayra", time: "12:30 PM" },
    { name: "Ring Ceremony & Sangeet", time: "7:00 PM" },
    { name: "Haldi & Carnival", time: "10:00 AM" },
    { name: "Varmala", time: "7:30 PM" },
  ],

  sections: {
    events: true,
    venue: true,
    countdown: true,
    rsvp: true,
    familyCard: true,
  },
};
