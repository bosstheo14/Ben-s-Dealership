/* ==========================================================================
   data.js — THIS IS THE ONLY FILE YOU NEED FOR DAY-TO-DAY UPDATES.
   Dealership details, announcements, and every vehicle on the lot live here.
   Save the file, refresh the browser, and the whole site updates.
   ========================================================================== */

window.SITE = {
  name:     "NewMississippi",
  subtitle: "Motors \u00B7 Jackson",

  /* --- Homepage words --------------------------------------------------- */
  tagline: "Straight prices and clean cars on the south side of Jackson.",
  lede:    "Every vehicle on the lot is listed here with its real price, its mileage and its VIN. Come look at it in person, or start your financing application before you drive over.",
  about:   "NewMississippi is a locally owned dealership serving Jackson and the surrounding metro. We keep a small, hand-picked lot and we price every vehicle in the window.",

  /* --- Where you are ---------------------------------------------------- */
  street: "",                 /* e.g. "1234 Terry Road" */
  city:   "Jackson",
  state:  "MS",
  zip:    "",                 /* e.g. "39204" */

  /* --- How people reach you --------------------------------------------- */
  phone: "",                  /* e.g. "(601) 555-0134" */
  email: "",                  /* where credit applications are sent */

  /* --- Hours: edit the right-hand side ---------------------------------- */
  hours: [
    { d: "Monday",    h: "9:00 AM \u2013 6:00 PM" },
    { d: "Tuesday",   h: "9:00 AM \u2013 6:00 PM" },
    { d: "Wednesday", h: "9:00 AM \u2013 6:00 PM" },
    { d: "Thursday",  h: "9:00 AM \u2013 6:00 PM" },
    { d: "Friday",    h: "9:00 AM \u2013 6:00 PM" },
    { d: "Saturday",  h: "9:00 AM \u2013 4:00 PM" },
    { d: "Sunday",    h: "Closed" }
  ],

  /* --- Social links. Leave a url blank to hide that button. -------------- */
  socials: [
    { label: "Facebook",  url: "" },
    { label: "Instagram", url: "" },
    { label: "TikTok",    url: "" }
  ]
};

/* ==========================================================================
   WHERE THE APPLY BUTTONS GO

   mode: "hosted"  every Apply button on the site opens hostedUrl in a new tab.
                   Use this once you have your lender's secure application link
                   (RouteOne, Dealertrack, AppOne). This is the setting you want
                   for real applicants, because their personal information goes
                   straight to the lender over an encrypted connection and never
                   touches this website.

   mode: "builtin" the Apply buttons open apply.html, the form built into this
                   site. Fine for showing the owner how it looks. Do NOT use it
                   to collect real driver license numbers.
   ========================================================================== */
window.APPLY = {
  mode:       "builtin",
  hostedUrl:  "",                      /* paste your lender's application URL here */
  hostedName: "our secure lending partner"
};

/* ==========================================================================
   ANNOUNCEMENTS — newest first. Empty the list to hide the section.
   ========================================================================== */
window.NEWS = [
  {
    when:  "Set a date",
    title: "Add your first announcement",
    body:  "Edit this block in assets/js/data.js. Announcements show at the top of the homepage: new arrivals, weekend specials, holiday hours."
  }
];

/* ==========================================================================
   INVENTORY — one { } block per vehicle.

   TO ADD A VEHICLE
   1. Drop the photos in assets/img/   (name them like 2018-accord-1.jpg)
   2. Copy a whole { ... } block below and paste it above the others
   3. Give it a new "id" (the stock number, no spaces)
   4. Fill in the rest and list the photo filenames
   5. Save, refresh the browser. Done.

   status: "available" | "pending" | "sold"
   Any field left as "" is simply hidden on the site.
   ========================================================================== */
window.INVENTORY = [

  {
    id:           "NM1001",
    stock:        "NM1001",
    year:         "2018",
    make:         "Honda",
    model:        "Accord",
    trim:         "Sport 1.5T",
    vin:          "1HGCV1F30JA000000",
    mileage:      "86400",
    price:        "16995",
    payment:      "",
    body:         "Sedan",
    color:        "Modern Steel",
    engine:       "1.5L turbo 4-cylinder",
    transmission: "Automatic",
    drivetrain:   "Front wheel drive",
    fuel:         "Gasoline",
    status:       "available",
    description:  "Clean two-owner Accord with service records. New tires front and rear.",
    photos:       []
  }

];
