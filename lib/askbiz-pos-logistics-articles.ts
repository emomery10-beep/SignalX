import { AcademyArticle } from "./academy-types";

export const ASKBIZ_POS_LOGISTICS_ARTICLES: AcademyArticle[] = [
  {
    slug: "logistics-overview-dashboard-askbiz",
    title: "Understanding the Logistics Dashboard",
    description: "A complete guide to the AskBiz POS Logistics dashboard — reading parcel counts, fleet status, delivery revenue, and performance metrics at a glance.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["logistics", "dashboard", "deliveries", "parcels", "fleet", "POS", "AskBiz", "overview"],
    keyTakeaways: [
      "The Logistics dashboard shows live parcel counts by status — Pending, In Transit, Delivered, Failed — so you know the health of your delivery operation at a glance.",
      "Use the Branch and date filters to isolate a single location's logistics performance.",
      "Delivery revenue (fees collected from customers) appears separately from product revenue so you can track your delivery model's profitability."
    ],
    content: [
      {
        heading: "Navigating to the Logistics section",
        body: "From the top navigation bar, click POS. In the sub-navigation, click Logistics. The dashboard loads showing your delivery operation's headline metrics. At the top, three filter controls let you focus the data: Branch (All Branches or a specific location), Sector (your business type, if multi-sector), and Date Range (Today, Yesterday, Last 7 days, Last 30 days, or custom). Set these before reading any numbers — leaving it on All Branches with a broad date range gives you the aggregate picture; narrowing to a single branch and today gives you the operational view."
      },
      {
        heading: "Parcel status overview",
        body: "The four headline tiles show your parcel pipeline: Pending (orders received but not yet assigned to a driver), In Transit (out for delivery right now), Delivered (successfully completed), and Failed (delivery attempt made but unsuccessful). The ratio of Delivered to Failed tells you your delivery success rate — a healthy operation typically achieves 90–95% first-attempt success. High Pending counts early in the day are normal; high Pending counts late in the day mean orders aren't being dispatched fast enough."
      },
      {
        heading: "Fleet status",
        body: "Below the parcel tiles, the Fleet section shows each driver's current status: Available (logged in and waiting for assignments), On Route (currently making deliveries), Off Duty (not currently active). The number beside each driver shows how many parcels they currently have on board. A driver with a high parcel count and a long active time may be struggling with a difficult route — check in. Drivers showing Available with parcels still Pending means you need to assign or they need to accept."
      },
      {
        heading: "Delivery revenue tile",
        body: "The Revenue tile on the Logistics dashboard shows delivery fees collected from customers in the selected period — not the value of goods being delivered, but the charge for the delivery service itself. This is the income your logistics operation generates. Compare it against the cost of running the operation (driver wages, fuel, vehicle costs) to assess delivery profitability. If delivery fees consistently fall short of costs, you either need to raise delivery charges or optimise the route efficiency to reduce cost per parcel."
      },
      {
        heading: "Recent deliveries feed",
        body: "Below the fleet section, a live feed shows the most recent delivery events: 'Order #1042 delivered by James — 14:32', 'Order #1039 failed attempt — customer not home — 14:18'. This feed refreshes automatically. It's the closest thing to a live control tower view of your delivery operation. Click any event row to see the full delivery record — the customer's address, the assigned driver, all status updates with timestamps, and any notes left by the driver."
      }
    ],
    relatedSlugs: ["logistics-creating-delivery-order-askbiz", "logistics-driver-management-askbiz", "logistics-delivery-reports-askbiz"],
    faq: [
      { q: "Does the dashboard update in real time?", a: "Yes — the Logistics dashboard refreshes automatically every 30 seconds. Driver location updates and status changes appear without needing to reload the page." },
      { q: "Can I set the dashboard as my default POS view?", a: "You can navigate directly to the Logistics tab each time you log in. There's no setting to change the default landing tab, but the sub-navigation remembers your last position within a session." },
      { q: "What counts as a 'failed' delivery?", a: "A delivery is marked Failed when the driver logs an unsuccessful attempt — customer not home, incorrect address, refused delivery, or access denied. Failed deliveries require a resolution action: rescheduling, returning to depot, or contacting the customer." }
    ]
  },

  {
    slug: "logistics-creating-delivery-order-askbiz",
    title: "Creating and Dispatching a Delivery Order",
    description: "Step-by-step guide to creating a delivery order in AskBiz POS — entering customer and address details, adding items, setting the delivery fee, and dispatching to a driver.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["delivery order", "dispatch", "create delivery", "logistics", "POS", "AskBiz", "courier"],
    keyTakeaways: [
      "A delivery order is created at the till or from the Logistics tab and includes the customer address, items, delivery fee, and assigned driver.",
      "Orders can be dispatched immediately (driver takes it now) or scheduled for a future time slot.",
      "The customer receives a notification when the order is dispatched and again when it's delivered."
    ],
    content: [
      {
        heading: "Starting a delivery order",
        body: "There are two ways to create a delivery order. From the till: open the till as normal, add items to the basket, then before completing payment select Delivery as the fulfilment method instead of Over Counter. From the Logistics tab: click New Delivery Order and build the order from scratch. The till method is more common for walk-in customers who pay for goods and want them delivered. The Logistics tab method is used for phone orders, pre-paid online orders, or B2B deliveries where the goods come from stock."
      },
      {
        heading: "Entering the customer and delivery address",
        body: "Search for an existing customer by name, phone, or email. If found, their saved delivery address pre-fills automatically. For a new customer, enter their Name, Phone Number, and Delivery Address. The address entry has a postcode lookup — type the postcode and select the street from the dropdown, then enter the house number. Add any delivery notes (e.g. 'Leave at door if no answer', 'Ring the bell twice', 'Call customer on arrival'). These notes appear on the driver's delivery screen."
      },
      {
        heading: "Adding items to the delivery",
        body: "If starting from the Logistics tab, add items by searching the product catalogue exactly as you would at the till. Scan barcodes or type product names. Set quantities. The system checks stock availability — if an item is out of stock, you're warned before confirming. The total value of goods is calculated. For till-originated deliveries, the items are already in the basket from the original sale — you're just changing the fulfilment method."
      },
      {
        heading: "Setting the delivery fee and payment",
        body: "Enter the Delivery Fee — the amount you're charging the customer for the delivery service. This can be a flat rate, based on distance (calculated automatically if you've set up distance-based pricing), or free (enter 0). Payment is collected at this stage: the customer can pay in full now (card or cash at the counter) or the order can be marked as Cash on Delivery (COD) — the driver collects payment when the goods are handed over. Select the payment method and process payment if collected now."
      },
      {
        heading: "Assigning and dispatching",
        body: "After payment, assign a driver. The Available Drivers list shows who's currently active and their existing parcel load. Select a driver and click Dispatch. The driver immediately receives a notification on their AskBiz driver app with the delivery address, items list, customer contact, and any notes. The order status changes from Pending to In Transit. From this point, you can track the driver's progress from the Logistics dashboard. If no drivers are available immediately, save the order as Pending and assign later."
      }
    ],
    relatedSlugs: ["logistics-driver-management-askbiz", "logistics-scheduling-deliveries-askbiz", "logistics-cash-on-delivery-askbiz"],
    faq: [
      { q: "Can I create a delivery order for an item that isn't in the POS catalogue?", a: "Yes — use a custom/open item at the till. Enter a description and price manually. This is useful for one-off delivery jobs." },
      { q: "What if I need to change the delivery address after dispatching?", a: "Open the delivery order from the Logistics tab and edit the address. The driver app updates in real time with the new address." },
      { q: "Can customers place delivery orders online themselves?", a: "If you've connected an online ordering platform (via Integrations), orders can flow in automatically. Otherwise, delivery orders are created manually by staff." }
    ]
  },

  {
    slug: "logistics-driver-management-askbiz",
    title: "Adding and Managing Delivery Drivers",
    description: "How to set up driver profiles in AskBiz POS, manage their availability, track their activity, and control what they can see and do in the driver app.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["drivers", "couriers", "driver management", "logistics", "POS", "AskBiz", "fleet"],
    keyTakeaways: [
      "Each driver has a profile in AskBiz with login credentials for the driver app — they don't need access to the full POS.",
      "Driver availability is controlled by their active/inactive status and their working hours settings.",
      "You can see every driver's current location, parcel load, and recent delivery history from the Logistics dashboard."
    ],
    content: [
      {
        heading: "Creating a driver profile",
        body: "Go to POS > Logistics > Drivers. Click Add Driver. Fill in: Full Name, Phone Number (used for customer-facing notifications — 'Your driver James will call on arrival'), Email Address (for app login), and Vehicle Type (motorcycle, car, van, bicycle — this affects which delivery zones they can cover). Set their Branch — the location they operate from. If your drivers work across multiple branches, set their primary branch here and allow multi-branch access in their permissions. Click Save and set an initial password."
      },
      {
        heading: "The driver app",
        body: "Drivers use the AskBiz Driver App (available on iOS and Android) rather than the full POS. They log in with their email and password. The app shows: their current queue of assigned deliveries, the customer address and contact for each, the items in each delivery, and delivery notes. Drivers update delivery status from the app: tapping Mark as Delivered confirms a successful delivery; tapping Failed Attempt logs an unsuccessful one with a reason. All updates sync to your Logistics dashboard in real time."
      },
      {
        heading: "Setting working hours and availability",
        body: "On each driver's profile, set their Working Hours — the days and times they're typically available. This helps the dispatch screen show only drivers who are scheduled to work when you're assigning deliveries. A driver can also set themselves as Available or Off Duty from within their app, overriding the schedule for ad-hoc changes (e.g. calling in sick or working extra hours). The Logistics dashboard reflects their real-time availability status."
      },
      {
        heading: "Vehicle and zone assignment",
        body: "If you've set up delivery zones, assign each driver to the zones they cover. A motorcycle driver might cover a tight urban zone; a van driver covers wider suburban zones. When you create a delivery order for an address in Zone B, only drivers assigned to Zone B appear in the Available Drivers list. This prevents accidentally dispatching a bicycle courier to an address 20 miles away. For small operations with no formal zones, leave zone assignment open — any driver can take any delivery."
      },
      {
        heading: "Viewing driver performance",
        body: "On any driver's profile page, click the Performance tab. You'll see: total deliveries completed this period, on-time delivery rate (% delivered within the promised window), average delivery time (from dispatch to completion), failed attempt rate, and customer feedback score (if you've enabled post-delivery ratings). This data is useful for annual reviews, deciding which drivers to prioritise for peak periods, and identifying who might need additional training or support."
      }
    ],
    relatedSlugs: ["logistics-driver-performance-askbiz", "logistics-delivery-zones-routes-askbiz", "logistics-overview-dashboard-askbiz"],
    faq: [
      { q: "Can a driver be a member of POS staff as well?", a: "Yes — a person can have both a staff profile (for till access) and a driver profile. They're separate profiles with separate logins unless you configure single-sign-on access." },
      { q: "How many drivers can I have on one AskBiz account?", a: "There's no driver limit in AskBiz. Each driver profile uses one team member seat in your subscription." },
      { q: "Can I track a driver's GPS location from the dashboard?", a: "Yes — if the driver has location sharing enabled on their app (which they consent to during onboarding), their real-time position appears on the Logistics map view." }
    ]
  },

  {
    slug: "logistics-parcel-tracking-askbiz",
    title: "Tracking Parcels and Updating Delivery Status",
    description: "How to monitor delivery progress in AskBiz POS — tracking parcel status in real time, updating status manually, and investigating delayed or stuck orders.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 4,
    keywords: ["parcel tracking", "delivery status", "tracking", "logistics", "POS", "AskBiz", "real-time"],
    keyTakeaways: [
      "Every delivery order has a status timeline — from Created through Dispatched, In Transit, and Delivered (or Failed).",
      "Status updates happen automatically when drivers use the app, but managers can also update status manually for edge cases.",
      "The tracking link sent to customers lets them follow their delivery without calling you."
    ],
    content: [
      {
        heading: "The delivery status timeline",
        body: "Every delivery order in AskBiz moves through a defined status sequence: Created (order exists, not yet assigned), Assigned (driver allocated, not yet departed), In Transit (driver has picked up and is en route), Delivered (customer received the goods), or Failed (attempt made, unsuccessful). Each status change is timestamped automatically and logged to the order's audit trail. You can see the full timeline — including which staff member created the order, which driver was assigned, and when each status change occurred — by opening any delivery from the Logistics tab."
      },
      {
        heading: "Tracking from the Logistics dashboard",
        body: "The Logistics dashboard shows all In Transit parcels as a live list or on a map (if GPS tracking is enabled). Click any In Transit order to see the delivery detail screen: the customer's address, the driver's last known location, the time it was dispatched, and the estimated arrival time. If the driver is significantly delayed versus the estimated arrival, this is the view that will show it — flag it and contact the driver directly to understand the situation."
      },
      {
        heading: "Manual status updates",
        body: "Status normally updates from the driver's app. But sometimes you need to update manually — the driver's phone died, they have no signal, or the delivery was completed by a third-party courier who doesn't use the app. Open the delivery order and click Update Status. Select the new status from the dropdown: Picked Up, In Transit, Delivered, or Failed Attempt. Add a note explaining the manual update. The timestamp records when the update was made and who made it."
      },
      {
        heading: "The customer tracking link",
        body: "When an order is dispatched, AskBiz can automatically send the customer a tracking link via SMS or email (configure this in Logistics > Settings > Notifications). The tracking link shows the customer a live status page: 'Your order is on its way. Driver: James. Estimated arrival: 2:45pm.' As the driver's status updates, the page refreshes. Customers who can see their delivery progressing are far less likely to call asking 'where is my order?' — reducing your inbound contact volume significantly."
      },
      {
        heading: "Investigating stuck orders",
        body: "A delivery showing In Transit for an unusually long time is a warning sign. Open the order and check the timeline: when was it dispatched? Where was the driver last located? Has any update been received from the driver? Call the driver first — most 'stuck' deliveries are explained by traffic, a difficult address, or a phone with low battery. If you can't reach the driver, check the Logistics map for their last known position. If the situation isn't resolved, you may need to reassign the delivery to another driver."
      }
    ],
    relatedSlugs: ["logistics-overview-dashboard-askbiz", "logistics-failed-deliveries-askbiz", "logistics-customer-notifications-askbiz"],
    faq: [
      { q: "Can customers track their delivery without a tracking link?", a: "If they have the order number, they can look it up on your customer portal (if you've configured one). Otherwise, tracking requires the link sent to their phone or email." },
      { q: "How accurate are estimated arrival times?", a: "ETAs are calculated based on the distance to the delivery address and the driver's historical speed data. In heavy traffic they can be inaccurate — treat ETAs as guides, not guarantees." },
      { q: "Can I see all historical delivery statuses for a customer?", a: "Open the customer's profile in Operations > Customers and click the Deliveries tab — it shows every delivery ever made to that customer with status, driver, and date." }
    ]
  },

  {
    slug: "logistics-delivery-zones-routes-askbiz",
    title: "Setting Up Delivery Zones and Route Planning",
    description: "How to define delivery zones in AskBiz POS — drawing coverage areas, assigning zones to drivers, setting zone-based delivery fees, and optimising routes for efficiency.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: ["delivery zones", "routes", "route planning", "coverage area", "logistics", "POS", "AskBiz", "zone"],
    keyTakeaways: [
      "Delivery zones define where you deliver and at what price — create zones by drawing a radius or polygon on the map.",
      "Assigning drivers to zones ensures the right vehicle type covers the right area.",
      "Route optimisation groups multiple deliveries by zone to reduce total travel time and fuel cost."
    ],
    content: [
      {
        heading: "Why delivery zones matter",
        body: "Without zones, your logistics operation accepts every delivery request regardless of distance or cost. A delivery 30 miles away might generate £5 in delivery fees but cost £25 in driver time and fuel — a significant loss. Delivery zones solve this by defining exactly where you deliver, at what fee, and with which vehicle type. When a customer address falls outside all defined zones, AskBiz flags it as undeliverable (or allows you to override and handle it as a special case)."
      },
      {
        heading: "Creating a delivery zone",
        body: "Go to POS > Logistics > Zones. Click Add Zone. Give it a name — 'City Centre', 'Zone 1', 'North Suburbs'. Choose the shape: Radius (draw a circle from your depot — enter the radius in miles or km) or Polygon (draw a custom shape on the map for irregular coverage areas). For radius zones, enter the depot address and the maximum distance. For polygon zones, click points on the map to draw the boundary. The map updates as you draw. Set the Delivery Fee for this zone and the Maximum Delivery Time promise (e.g. 45 minutes for city centre, 90 minutes for outer zones)."
      },
      {
        heading: "Assigning drivers to zones",
        body: "On each driver's profile, find the Zones section. Tick the zones this driver is authorised to cover. A bicycle courier might cover only the city centre zone; a van driver might cover zones 1, 2, and 3. When you dispatch a delivery to an address in Zone 2, only drivers assigned to Zone 2 appear in the Available Drivers list. This prevents routing mismatches — you won't accidentally send a scooter driver 15 miles into the suburbs. Drivers can cover multiple zones; you can also leave zones unrestricted if your team is small and flexible."
      },
      {
        heading: "Zone-based delivery fees",
        body: "Each zone has its own delivery fee, set when you create the zone. When a delivery order is created and the customer's address is matched to a zone, AskBiz automatically populates the delivery fee field with that zone's rate. The operator can override it for special cases. For businesses offering free delivery within a certain radius and charging beyond it, set the inner zone fee to 0 and the outer zones to your standard rates. Complex tiered pricing (e.g. free under £30 spend, £3.99 for smaller orders) can be configured in Logistics > Settings > Fee Rules."
      },
      {
        heading: "Route optimisation",
        body: "When multiple deliveries are ready to dispatch, click Optimise Routes in the Logistics tab. AskBiz groups pending deliveries by zone and suggests the most efficient delivery sequence for each driver — minimising total travel distance while respecting delivery time promises. The optimised route is shown on a map with a numbered sequence: Stop 1, Stop 2, Stop 3. Review the suggested route and click Accept — the driver's app updates with the stops in optimised order. For time-sensitive deliveries (e.g. hot food), you can manually prioritise a specific stop to be first regardless of distance."
      }
    ],
    relatedSlugs: ["logistics-driver-management-askbiz", "logistics-creating-delivery-order-askbiz", "logistics-delivery-reports-askbiz"],
    faq: [
      { q: "What happens if a customer address falls on the boundary of two zones?", a: "AskBiz assigns the address to the zone whose boundary it's closest inside. If ambiguous, you're prompted to select the zone manually when creating the delivery order." },
      { q: "Can I have zones that overlap?", a: "Technically yes, but it creates ambiguity in fee assignment. Best practice is non-overlapping zones with clear boundaries. Use a catchall outer zone for any address not covered by your primary zones." },
      { q: "Does the route optimiser account for one-way streets and traffic?", a: "AskBiz uses mapping data that includes one-way streets. Live traffic data depends on your region and mapping provider integration. Check Settings > Logistics > Map Provider for your configuration." }
    ]
  },

  {
    slug: "logistics-fleet-management-askbiz",
    title: "Managing Your Delivery Fleet",
    description: "How to set up and manage vehicles in AskBiz POS — registering fleet assets, tracking vehicle utilisation, managing capacity, and recording maintenance events.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["fleet", "vehicles", "fleet management", "logistics", "POS", "AskBiz", "vans", "capacity"],
    keyTakeaways: [
      "Registering vehicles in AskBiz links them to drivers and tracks their utilisation, capacity, and delivery history.",
      "Vehicle capacity settings prevent over-loading — AskBiz warns if a new delivery would exceed a vehicle's weight or volume limit.",
      "Maintenance records stored in AskBiz give you a single log of servicing, MOTs, and repairs for each vehicle."
    ],
    content: [
      {
        heading: "Setting up vehicle records",
        body: "Go to POS > Logistics > Fleet. Click Add Vehicle. Enter: Vehicle Name or Registration (e.g. 'White Transit — AB21 XYZ'), Vehicle Type (Bicycle, Motorcycle, Car, Van, Truck), and Capacity — the maximum load the vehicle can carry. Capacity can be entered as weight (kg), volume (cubic metres), or parcel count — whichever metric you use to manage your loads. Set the Branch the vehicle is based at and assign it a primary driver (though vehicles can be driven by different people on different days). Save the vehicle record."
      },
      {
        heading: "Tracking vehicle utilisation",
        body: "The Fleet overview in Logistics shows each vehicle's current status: In Use (assigned to an active driver with deliveries on board), Available (at depot), or Under Maintenance (taken out of service). Click any vehicle to see its utilisation history: how many deliveries it carried last week, average load per trip, and percentage of shifts where it was active. High utilisation (consistently above 80%) suggests you're close to needing an additional vehicle. Low utilisation suggests you may have more fleet than you need."
      },
      {
        heading: "Capacity management",
        body: "When a driver is assigned multiple deliveries, AskBiz calculates the total load — summing the weight or volume of all parcels in the run. If the total exceeds the vehicle's capacity setting, a warning appears before dispatch. This prevents vehicles from being overloaded and ensures delivery quality — a van driver trying to squeeze 20 boxes into a 15-box van will damage goods and frustrate customers. When capacity is exceeded, split the run between two drivers or remove lower-priority deliveries and reschedule them for a second run."
      },
      {
        heading: "Recording maintenance events",
        body: "On each vehicle's profile, there's a Maintenance tab. Click Log Maintenance Event and enter: Date, Type (Service, MOT, Tyre Change, Repair, Other), Description, Cost, and the next service due date. Set the vehicle status to Under Maintenance — this removes it from the available fleet immediately, preventing accidental assignment. When the vehicle returns to service, change the status back to Available. Over time, the maintenance log gives you a complete service history for each vehicle — useful for resale value, lease compliance, or fleet insurance."
      },
      {
        heading: "Planning for vehicle downtime",
        body: "Schedule known maintenance periods in advance. If a van is due for its annual service next Thursday, mark it as Under Maintenance for that day in advance. This prevents it from appearing in the available fleet and lets you plan around reduced capacity — perhaps holding back lower-urgency deliveries for that day or arranging a temp vehicle. AskBiz sends a notification to the logistics manager the day before a scheduled maintenance period if you've enabled maintenance reminders in Logistics > Settings."
      }
    ],
    relatedSlugs: ["logistics-driver-management-askbiz", "logistics-delivery-zones-routes-askbiz", "logistics-driver-performance-askbiz"],
    faq: [
      { q: "Can one vehicle be assigned to different drivers on different days?", a: "Yes. Vehicles and drivers are linked per trip, not permanently. When creating a dispatch, you select both the driver and the vehicle they'll use." },
      { q: "Does AskBiz track fuel costs?", a: "You can record fuel costs as a maintenance event. For detailed fuel tracking with mileage logs, an integration with a fleet management tool may be needed." },
      { q: "Can I insure vehicles through AskBiz?", a: "No — AskBiz is not an insurance provider. The maintenance records can be exported and shared with your insurer for vehicle history purposes." }
    ]
  },

  {
    slug: "logistics-delivery-fees-pricing-askbiz",
    title: "Configuring Delivery Fees and Pricing Rules",
    description: "How to set up delivery fees in AskBiz POS — flat rates, distance-based pricing, order-value thresholds for free delivery, and peak-time surcharges.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["delivery fees", "pricing", "delivery charges", "free delivery", "logistics", "POS", "AskBiz", "surcharge"],
    keyTakeaways: [
      "Delivery fees can be flat rate, distance-based, or conditional on order value — configure in Logistics > Settings > Fee Rules.",
      "Free delivery thresholds (e.g. free over £30) increase average basket size and are easy to set up.",
      "Peak-time surcharges let you charge more during high-demand periods to manage fleet capacity."
    ],
    content: [
      {
        heading: "The three fee models",
        body: "AskBiz supports three delivery fee models. Flat Rate: every delivery costs the same regardless of distance or order size — simple to communicate and easy for customers to understand. Distance-Based: the fee increases with distance from your depot — fair for drivers covering longer routes, but more complex to explain. Value-Based: the fee varies by order value — typically free above a threshold (£30, £50) and charged below it. You can combine models: flat rate by zone (Zone 1 = £3.99, Zone 2 = £5.99) with a free delivery threshold (any order over £50 gets free delivery regardless of zone)."
      },
      {
        heading: "Setting up fee rules",
        body: "Go to POS > Logistics > Settings > Fee Rules. Click Add Rule. Define the conditions: Zone (All zones or a specific zone), Order Value (All orders, Under £30, etc.), and Time (All hours or specific hours for peak surcharges). Set the Fee — a fixed amount or Free. Rules are evaluated in order: the first matching rule applies. Put your most specific rules first (e.g. 'Zone 1, Over £50 = Free') and your catch-all rule last ('All zones, all values = £3.99'). Test by creating a dummy delivery order to confirm the fee auto-populates correctly."
      },
      {
        heading: "Free delivery thresholds",
        body: "A free delivery threshold is a powerful tool for increasing basket size. If customers know delivery is free over £30, many will add items to reach the threshold — boosting your average order value. Set up a rule: Condition: Order Value ≥ £30. Fee: Free. Place this rule above your standard paid delivery rule. When a delivery order is created with a basket value of £30 or more, the fee automatically sets to zero. Consider displaying the threshold prominently — 'Add £X more for free delivery' on the order confirmation screen is a simple upsell prompt."
      },
      {
        heading: "Peak-time surcharges",
        body: "If your delivery demand spikes at certain times (lunch rush for a restaurant, Friday evenings for retail), you can add a surcharge for those periods. Create a fee rule: Time: 12:00–14:00, Fee: Standard rate + £1.50 (or a higher flat rate). This does two things: it covers the higher cost of servicing peak demand (more driver hours, less efficient routes) and it nudges price-sensitive customers to order outside peak times, smoothing demand. Be transparent about peak surcharges — customers who see an unexpected charge feel deceived; customers who know in advance usually accept it."
      },
      {
        heading: "VAT on delivery charges",
        body: "In the UK, delivery charges are subject to VAT at the same rate as the goods being delivered, unless the delivery is genuinely a separate service. For a standard retail business delivering VATable goods, the delivery fee is standard-rated at 20%. For a food delivery business delivering zero-rated food, the delivery charge is also zero-rated. Set the VAT rate on each fee rule to match your situation. Your accountant can confirm the correct treatment for your specific business model."
      }
    ],
    relatedSlugs: ["logistics-delivery-zones-routes-askbiz", "logistics-creating-delivery-order-askbiz", "logistics-cash-on-delivery-askbiz"],
    faq: [
      { q: "Can I override the auto-calculated delivery fee on a specific order?", a: "Yes — when creating a delivery order, the fee field is editable. You can type any amount, including zero. The override is logged in the order record." },
      { q: "Can I offer free delivery as a promotion for specific customers?", a: "Yes — create a 0% delivery fee rule and assign it via a promotional code or through the customer's price list. The customer-specific fee overrides the standard rule." },
      { q: "Can delivery fees be included in the product price rather than shown separately?", a: "Not natively in AskBiz — delivery fees are always a separate line item for transparency. If you want 'delivery included' pricing, set the fee to zero and build the delivery cost into your product prices." }
    ]
  },

  {
    slug: "logistics-failed-deliveries-askbiz",
    title: "Handling Failed Delivery Attempts",
    description: "How to manage failed deliveries in AskBiz POS — recording the reason, notifying the customer, rescheduling, and deciding when to return goods to the depot.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["failed delivery", "undelivered", "rescheduling", "logistics", "POS", "AskBiz", "return to depot"],
    keyTakeaways: [
      "Failed deliveries must be resolved: rescheduled, returned to depot, or cancelled — they can't remain in Failed status indefinitely.",
      "Recording the failure reason (not home, wrong address, access denied) builds data that helps identify systemic address or process problems.",
      "Customer communication is critical — a customer who hears proactively about a failed attempt is far less upset than one who waits all day for a delivery that never arrived."
    ],
    content: [
      {
        heading: "How a delivery is marked as failed",
        body: "From the driver's app, when a delivery cannot be completed, the driver taps Failed Attempt. They're prompted to select a reason: Customer Not Home, Wrong Address, Access Denied (locked building, gated community), Customer Refused Delivery, or Other. They can add a free-text note and optionally take a photo (of the door, the intercom, or any note left). This information is immediately visible in your Logistics dashboard under the Failed tab. The driver retains the goods and returns to depot unless you instruct otherwise."
      },
      {
        heading: "Notifying the customer",
        body: "AskBiz can automatically send a notification when a delivery is marked Failed — an SMS or email saying: 'Hi [Name], we attempted to deliver your order today but were unable to complete the delivery. Reason: [Reason]. We'll contact you shortly to reschedule.' This automated message goes out within minutes of the driver marking the failure. Configure this in Logistics > Settings > Notifications. The message should include a contact number or link so the customer can take action immediately. A customer who receives this message within 5 minutes of the failed attempt has a much better experience than one who discovers it hours later."
      },
      {
        heading: "Rescheduling the delivery",
        body: "Open the failed delivery from the Logistics tab. Click Reschedule. Choose a new delivery date and time slot — either a specific slot or 'next available'. If the failure was due to a wrong address, update the address before rescheduling. Reassign to a driver. The order status returns to Assigned and moves back into the active queue. The customer receives a confirmation of the rescheduled delivery time. A rescheduled delivery that succeeds is still logged as having had one failed attempt — this is important for tracking your true first-attempt delivery rate."
      },
      {
        heading: "Return to depot and refunds",
        body: "If a delivery cannot be rescheduled (customer cancels, repeatedly not home, refuses delivery), click Return to Depot on the failed delivery record. Stock is automatically returned to the originating branch's inventory count. If the customer paid for the goods upfront, you'll need to process a refund — click Issue Refund from the delivery record, which creates a return record linked to the original sale. The delivery fee may or may not be refundable depending on your policy; set this in Logistics > Settings > Refund Policy."
      },
      {
        heading: "Analysing failure patterns",
        body: "In Logistics Reports > Failed Deliveries, you can see a breakdown by reason over any date range. If 'Customer Not Home' accounts for 80% of failures, consider implementing delivery time slots so customers choose when they'll be available. If 'Wrong Address' is high, review your address capture process at order creation. If failures cluster on specific routes or zones, those areas may need clearer addressing or better instructions from the driver. Reducing your failure rate by even a few percentage points meaningfully reduces cost — every failed delivery requires driver time, fuel, and rescheduling effort."
      }
    ],
    relatedSlugs: ["logistics-scheduling-deliveries-askbiz", "logistics-customer-notifications-askbiz", "logistics-parcel-tracking-askbiz"],
    faq: [
      { q: "How many delivery attempts do you make before returning to depot?", a: "Set your policy in Logistics > Settings > Attempt Policy — typically 2 or 3 attempts before return. AskBiz will flag orders that have reached the maximum attempts and prompt you to decide on return or escalation." },
      { q: "Can the driver leave the parcel in a safe place if the customer isn't home?", a: "If the customer has provided safe place instructions in their delivery notes, the driver can follow them and mark the delivery as completed with a photo of where it was left. This is a policy decision for your business — configure it in Logistics Settings." },
      { q: "Who bears the cost of a second delivery attempt?", a: "This is a policy decision. Some businesses charge an additional delivery fee for re-attempts; others absorb the cost as part of the service. Document your policy clearly on order confirmation pages." }
    ]
  },

  {
    slug: "logistics-customer-notifications-askbiz",
    title: "Configuring Customer Delivery Notifications",
    description: "How to set up automated SMS and email notifications for customers in AskBiz POS — dispatch confirmations, ETA alerts, delivery confirmations, and failed attempt messages.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: ["notifications", "SMS", "email", "customer communication", "logistics", "POS", "AskBiz", "ETA"],
    keyTakeaways: [
      "Automated delivery notifications reduce inbound 'where is my order?' calls by keeping customers informed at every stage.",
      "Notifications are triggered by status changes — you configure which events send a message and what that message says.",
      "Personalised messages (including the customer's name, driver's name, and estimated time) feel professional and build trust."
    ],
    content: [
      {
        heading: "Finding notification settings",
        body: "Go to POS > Logistics > Settings > Notifications. This page lists all notification triggers — events in the delivery lifecycle that can send a message to the customer. Each trigger has a toggle (on/off), a message template, and a channel (SMS, Email, or both). Triggers include: Order Confirmed, Driver Assigned, Out for Delivery (dispatched), ETA Update (when arrival time changes significantly), Delivered, and Failed Attempt. Turn on the ones relevant to your operation and customise the message templates."
      },
      {
        heading: "Writing effective notification messages",
        body: "Message templates support dynamic fields in double curly braces: {{customer_name}}, {{driver_name}}, {{order_number}}, {{estimated_arrival}}, {{delivery_address}}, {{tracking_link}}. A good dispatch notification: 'Hi {{customer_name}}, your order is on its way! {{driver_name}} will deliver to {{delivery_address}} by approximately {{estimated_arrival}}. Track here: {{tracking_link}}'. Keep messages concise — under 160 characters for SMS to avoid splitting into two messages. Email notifications can be longer and include order details, but a clear subject line ('Your order is on its way') is essential."
      },
      {
        heading: "SMS vs email notifications",
        body: "SMS notifications have an open rate over 90% and are read within minutes. They're ideal for time-sensitive updates like 'Driver is 10 minutes away'. Email notifications have lower immediate open rates but can carry more information and create a paper trail. Best practice: use SMS for the dispatch notification and delivery confirmation (the two most time-sensitive messages), and email for the order confirmation and receipt. Customers who prefer a channel can update their preference in their profile."
      },
      {
        heading: "ETA notifications",
        body: "The ETA Update trigger fires when the estimated arrival time shifts by more than a threshold you set (e.g. 15 minutes later than originally promised). This prevents customers from waiting at the wrong time. The message: 'Hi {{customer_name}}, your delivery is running slightly late. Updated estimated arrival: {{estimated_arrival}}. Sorry for the wait.' Proactive honesty about delays dramatically reduces the number of angry calls compared to saying nothing and hoping the customer doesn't notice."
      },
      {
        heading: "Post-delivery rating request",
        body: "After a delivery is marked as Delivered, configure a follow-up message (typically sent 30 minutes after completion via email) asking the customer to rate their delivery experience. The rating request links to a simple 1–5 star form. Ratings appear on the driver's profile in AskBiz, giving you customer-validated performance data. Businesses with consistently high delivery ratings can use them as a marketing asset; businesses with low ratings use them as an early warning system before negative reviews appear publicly."
      }
    ],
    relatedSlugs: ["logistics-parcel-tracking-askbiz", "logistics-failed-deliveries-askbiz", "logistics-driver-performance-askbiz"],
    faq: [
      { q: "Does AskBiz charge per SMS sent?", a: "SMS notifications use credits from your AskBiz SMS balance or your connected SMS provider (e.g. Twilio). Check your plan for included credits and per-message rates." },
      { q: "Can I send notifications in multiple languages?", a: "Message templates are single-language per account. For multi-language businesses, you can create separate notification templates and assign them based on customer language preference if that field is set on the customer profile." },
      { q: "Can I send a notification manually without waiting for a status trigger?", a: "Yes — open any delivery order and click Send Message. Type a free-text message and select SMS or Email. This sends directly to the customer's contact details on the order." }
    ]
  },

  {
    slug: "logistics-proof-of-delivery-askbiz",
    title: "Collecting Proof of Delivery",
    description: "How to set up and use proof of delivery in AskBiz POS — capturing customer signatures, photos, and delivery confirmation on the driver app to protect against disputes.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 4,
    keywords: ["proof of delivery", "POD", "signature", "photo", "logistics", "POS", "AskBiz", "delivery confirmation"],
    keyTakeaways: [
      "Proof of delivery (POD) is your evidence that goods were received — essential for resolving 'I never received it' disputes.",
      "AskBiz supports three POD types: customer signature, delivery photo, or PIN confirmation — use one or combine them.",
      "POD is attached to the delivery record and visible in the Logistics dashboard and on the order audit trail."
    ],
    content: [
      {
        heading: "Why proof of delivery matters",
        body: "Without proof of delivery, any customer can claim their order never arrived — and you have no evidence to contradict them. This exposes you to refund demands for goods that were genuinely delivered. Proof of delivery (POD) closes this gap by capturing evidence at the moment of handover: a customer signature on the driver's screen, a photo of the goods at the delivery address, or a PIN code the customer confirms. POD is also a quality assurance tool — a driver who knows every delivery is recorded is more careful about handover standards."
      },
      {
        heading: "Configuring POD requirements",
        body: "Go to POS > Logistics > Settings > Proof of Delivery. Choose your required POD type: Signature (customer signs on the driver's phone screen), Photo (driver photographs the delivered parcel at the address), PIN Confirmation (customer receives a 4-digit PIN by SMS; they read it to the driver who enters it), or Any (driver can choose whichever method is practical). Set whether POD is Required (driver cannot mark as Delivered without it) or Optional (encouraged but not enforced). For high-value deliveries, require a signature; for standard deliveries, a photo is usually sufficient."
      },
      {
        heading: "Collecting a signature",
        body: "When the driver is at the customer's address and ready to hand over, they tap Collect Signature in the driver app. A blank signature pad appears. The customer signs with their finger on the driver's phone screen. The driver taps Accept and the delivery is marked as Delivered. The signature image is attached to the delivery record immediately. If the customer refuses to sign, the driver can mark the delivery as Delivered Without Signature and add a note — this is still logged, just without the signature image."
      },
      {
        heading: "Photo proof of delivery",
        body: "The driver taps Take Photo, uses their phone camera to photograph the delivered parcel — ideally at the customer's door with the address visible, or in the customer's hands. The photo is automatically attached to the delivery record with a timestamp and GPS coordinates. This is particularly useful for 'safe place' deliveries where the customer isn't present — the photo proves the parcel was left at the specified location. Photos are stored in the delivery record for 12 months by default."
      },
      {
        heading: "Accessing POD after delivery",
        body: "Open any completed delivery from the Logistics tab. At the bottom of the delivery detail screen, the POD section shows the attached signature image, photo, or PIN confirmation timestamp. Click to enlarge. If a customer contacts you claiming non-delivery, open the relevant order and share the POD directly with them — most disputes are resolved immediately when the customer sees photographic evidence or their own signature. Export the POD image for insurance claims or legal purposes if needed."
      }
    ],
    relatedSlugs: ["logistics-parcel-tracking-askbiz", "logistics-failed-deliveries-askbiz", "logistics-creating-delivery-order-askbiz"],
    faq: [
      { q: "Is an electronic signature legally valid in the UK?", a: "Yes. Electronic signatures are legally valid under the Electronic Communications Act 2000 and EU eIDAS regulation (which UK law retained post-Brexit). They're sufficient evidence for civil disputes about delivery." },
      { q: "What happens to POD data under GDPR?", a: "POD images (particularly signatures) are personal data under UK GDPR. AskBiz retains them for a configurable period (default 12 months) after which they are automatically deleted. Do not store POD data beyond the period needed for potential dispute resolution." },
      { q: "Can I require different POD types for different order values?", a: "Yes — create POD rules by order value: e.g. Photo for orders under £50, Signature for orders over £50. Configure this in Logistics > Settings > POD Rules." }
    ]
  },

  {
    slug: "logistics-returns-collections-askbiz",
    title: "Processing Delivery Returns and Collections",
    description: "How to manage return collections in AskBiz POS — scheduling a driver to collect goods from a customer, processing the return, and restocking or refunding the item.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["returns", "collections", "reverse logistics", "logistics", "POS", "AskBiz", "refund", "pickup"],
    keyTakeaways: [
      "A return collection is a reverse delivery — a driver goes to the customer to collect goods and bring them back.",
      "AskBiz handles the collection as a logistics job, so it's tracked, assigned to a driver, and logged like any outbound delivery.",
      "Once collected, goods are returned to stock (if resaleable) and the customer refund is processed automatically."
    ],
    content: [
      {
        heading: "When a customer wants to return by collection",
        body: "Some customers can't or won't travel to your location to return goods — particularly for large items, elderly or mobility-limited customers, or businesses offering a premium returns service. A collection return means you send a driver to the customer's address to collect the goods. In AskBiz, this is called a Reverse Delivery or Collection Job. It works like an outbound delivery in reverse: you create a job, assign a driver, the driver collects the goods and brings them back to the depot, and the return is then processed."
      },
      {
        heading: "Creating a collection job",
        body: "Open the original sale or delivery from which the return is needed. Click Return / Collect. AskBiz creates a collection job linked to the original order — it inherits the customer's address, contact details, and the items to be collected. Select the items being returned (full order or partial). Set a collection date and time window. Assign a driver. The driver receives the job in their app: 'Collection from [Customer Name], [Address]. Items: [List]. Notes: [Any instructions].' The driver goes to the address and collects the goods."
      },
      {
        heading: "The driver's collection workflow",
        body: "The driver arrives at the customer's address. In the app, they open the collection job and tap Begin Collection. They inspect the returned goods — checking they match the items listed and assessing condition. If goods are damaged or not as expected, they can note this in the app before accepting. Once satisfied, they tap Collected and, if POD is required, the customer signs or takes a photo of the handover. The driver brings the goods back to the depot. The collection status updates to Returned to Depot on your Logistics dashboard."
      },
      {
        heading: "Processing the return at the depot",
        body: "When the goods arrive at the depot, open the collection job and click Process Return. Inspect the physical goods: are they resaleable? If yes, mark them as Returned to Stock — AskBiz increases the inventory count automatically. If damaged, record a wastage write-off. Once the condition is confirmed, AskBiz links back to the original transaction and presents the refund options: full refund, partial refund (if goods are partly damaged), or exchange. Process the refund via the original payment method."
      },
      {
        heading: "Delivery fee on returns",
        body: "Decide whether you refund the original delivery fee and whether you charge a collection fee. Standard practice: if the item is faulty or your error, refund both the goods and the original delivery fee and absorb the collection cost. If the customer simply changed their mind, refunding the goods but not the original delivery fee (and potentially charging a collection fee) is common. Set your policy in Logistics > Settings > Returns Policy and communicate it clearly to customers at the time of purchase."
      }
    ],
    relatedSlugs: ["pos-returns-refunds-askbiz", "logistics-failed-deliveries-askbiz", "logistics-proof-of-delivery-askbiz"],
    faq: [
      { q: "Can I issue the refund before the goods are collected?", a: "You can, but it's not recommended — you're refunding without confirmation the goods are returned. Best practice: process the refund when goods arrive at depot and condition is verified." },
      { q: "What if a customer says they never received the goods but we have POD?", a: "Present the POD (signature, photo, or PIN confirmation) to the customer. If the dispute persists, escalate to a formal dispute process — AskBiz's POD evidence is typically sufficient for courier insurance claims." },
      { q: "Can I run collections for third-party orders (e.g. items purchased elsewhere)?", a: "Yes — you can create a collection job without a linked AskBiz sale. This allows you to offer a collection and disposal service or collect items for repair." }
    ]
  },

  {
    slug: "logistics-scheduling-deliveries-askbiz",
    title: "Scheduling Future Deliveries and Time Slots",
    description: "How to set up delivery time slots in AskBiz POS — letting customers choose when they want delivery, managing slot capacity, and scheduling a day's routes in advance.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["scheduling", "time slots", "delivery slots", "logistics", "POS", "AskBiz", "booking", "capacity"],
    keyTakeaways: [
      "Delivery time slots give customers certainty and dramatically reduce failed delivery attempts — customers who chose a slot are home for it.",
      "Slot capacity limits prevent over-booking — AskBiz stops taking bookings for a slot once it's full.",
      "Scheduling tomorrow's deliveries tonight lets drivers start the day with a planned route rather than an improvised one."
    ],
    content: [
      {
        heading: "Why time slots matter",
        body: "The single biggest cause of failed deliveries is the customer not being home. Time slots solve this by giving the customer a say in when they receive their delivery. A customer who chose '2pm–4pm Tuesday' will make sure they're home at that time. Studies consistently show first-attempt success rates of 95%+ for slotted deliveries vs 75–80% for unscheduled 'anytime' deliveries. Beyond reducing failures, slots also let you plan routes more efficiently — you know exactly how many deliveries are happening in each time window, so you can allocate drivers accordingly."
      },
      {
        heading: "Setting up time slots",
        body: "Go to POS > Logistics > Settings > Delivery Slots. Click Add Slot. Define: Start Time, End Time (e.g. 09:00–11:00), Days Available (Mon–Fri, weekdays only, all days, etc.), Maximum Bookings (the number of deliveries this slot can accommodate), and Lead Time (the minimum hours in advance a slot can be booked — prevents last-minute orders for slots that can't realistically be served). Create enough slots to cover your operating hours at an appropriate granularity: 2-hour slots for most retailers; 30-minute slots for premium services."
      },
      {
        heading: "Offering slots when creating an order",
        body: "When creating a delivery order, the Delivery Time section shows available slots for the next 7 days. Slots at capacity are greyed out and unselectable. Choose the customer's preferred slot. The order is scheduled for that window — it won't appear in the driver's queue until the morning of the delivery date. This prevents confusion between today's orders and future-scheduled ones. For orders taken by phone or in person, the operator selects the slot on behalf of the customer. For online orders, the customer selects their own slot at checkout."
      },
      {
        heading: "Planning the next day's routes",
        body: "The evening before a delivery day, go to Logistics > Schedule. Select tomorrow's date. AskBiz shows all booked deliveries grouped by time slot and zone. Click Optimise Routes to generate suggested driver assignments for the day — each driver gets a run that fits within the slot windows and their geographic zone. Review and adjust as needed (account for a driver being off sick, a vehicle in maintenance, etc.). Confirm the plan. Drivers receive their schedule for tomorrow in the app that evening — they can review their route before starting their shift."
      },
      {
        heading: "Slot capacity management",
        body: "Slots fill up on busy days — monitor capacity from Logistics > Schedule. If a slot is nearly full and you anticipate more orders, you can temporarily increase capacity (if you have driver availability). If all slots are full for a day, new delivery orders for that date show as unavailable and the next available slot is offered automatically. For peak periods (Christmas, sale events), add extra slots or increase capacity in advance — do this in Logistics > Settings > Delivery Slots rather than scrambling on the day."
      }
    ],
    relatedSlugs: ["logistics-creating-delivery-order-askbiz", "logistics-delivery-zones-routes-askbiz", "logistics-failed-deliveries-askbiz"],
    faq: [
      { q: "Can I offer same-day delivery slots?", a: "Yes — set a slot for today with a lead time of 0 hours (or 1 hour). The slot appears as available until its capacity is reached or until the start time passes." },
      { q: "What happens if a driver runs late and can't complete all their slot deliveries?", a: "AskBiz flags deliveries at risk of missing their window. You can reassign them to another available driver or contact the customer to update their expected time. The slot breach is logged." },
      { q: "Can customers reschedule their slot?", a: "If you offer a customer-facing booking portal, customers can self-service reschedule. Otherwise, a staff member updates the slot on the order from the Logistics tab." }
    ]
  },

  {
    slug: "logistics-bulk-dispatch-askbiz",
    title: "Bulk Dispatching Multiple Orders at Once",
    description: "How to dispatch multiple delivery orders simultaneously in AskBiz POS — selecting orders in bulk, grouping by driver and zone, and sending a full run in one action.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: ["bulk dispatch", "batch dispatch", "multiple orders", "logistics", "POS", "AskBiz", "run"],
    keyTakeaways: [
      "Bulk dispatch saves time when you have many orders to send out — select all relevant orders and assign to a driver in one action.",
      "Grouping orders by zone before bulk-dispatching maximises route efficiency.",
      "Each driver receives their full run in the app at once, with a suggested delivery sequence."
    ],
    content: [
      {
        heading: "When to use bulk dispatch",
        body: "Individual dispatch (assigning one order at a time) is fine when orders trickle in throughout the day. But many businesses have a batch model: all morning orders are packed, and at 11am a driver takes the whole batch out at once. Doing this order-by-order takes several minutes and is prone to missing orders. Bulk dispatch does it in one operation: select all the orders for this driver's run, assign them together, and confirm — the driver gets all their stops at once in a single, route-optimised list."
      },
      {
        heading: "Selecting orders for bulk dispatch",
        body: "Go to POS > Logistics and click the Pending tab — all unassigned orders appear here. Tick the checkboxes next to the orders you want to include in this dispatch run. Use filters to narrow the selection: by Zone (select only Zone 2 orders for the van driver who covers Zone 2), by Time Slot (all orders booked for the 12:00–14:00 slot), or by Branch. Once you've selected the right orders, click Bulk Dispatch at the top of the list."
      },
      {
        heading: "Assigning to a driver and optimising",
        body: "A bulk dispatch panel appears. Select the driver from the Available Drivers list. AskBiz checks the total parcel count against the vehicle's capacity and warns if it's exceeded. Click Optimise Route — AskBiz sequences the selected deliveries into the most efficient route, accounting for the delivery zones and any time-slot constraints. Review the optimised sequence on the map. If a sequence looks wrong (e.g. a tight-time-slot delivery should go first despite being geographically further), drag it to the top of the list. Click Confirm Dispatch."
      },
      {
        heading: "What the driver sees",
        body: "The driver's app updates immediately with their full run: Stop 1, Stop 2, Stop 3... with the customer name, address, items, and notes for each. Tapping a stop opens the navigation to that address in the driver's preferred maps app. After each delivery (or failed attempt), the driver marks the stop as complete and automatically moves to the next stop. The Logistics dashboard updates in real time — you can see the driver's progress through the run without calling them."
      },
      {
        heading: "Handling split runs",
        body: "Sometimes a driver completes their morning run and returns for a second run in the afternoon. For the afternoon run, repeat the bulk dispatch process — select the afternoon orders and assign to the same driver (or a different one). Each dispatch creates a separate 'run' in the driver's history, so you can see morning vs afternoon performance separately. If a driver is partway through a run and picks up an additional urgent order, add it to their active run via the single-order dispatch from the active delivery's screen — it appends to the end of their list."
      }
    ],
    relatedSlugs: ["logistics-creating-delivery-order-askbiz", "logistics-delivery-zones-routes-askbiz", "logistics-scheduling-deliveries-askbiz"],
    faq: [
      { q: "Can I bulk-dispatch to multiple drivers at once?", a: "Not in a single action — bulk dispatch assigns the selected orders to one driver. Repeat the process with a different selection for each driver." },
      { q: "What if I need to remove an order from a bulk run after dispatching?", a: "Open the specific order from the Logistics tab and click Reassign or Recall. This removes it from the driver's run and returns it to Pending. The driver's app updates immediately." },
      { q: "Does bulk dispatch work with third-party couriers?", a: "If you're using an integrated third-party courier (via Logistics > Integrations), bulk dispatch exports the order manifest to the courier's system. The specific workflow depends on the courier integration." }
    ]
  },

  {
    slug: "logistics-driver-performance-askbiz",
    title: "Monitoring Driver Performance Metrics",
    description: "How to use AskBiz POS to track and evaluate driver performance — delivery success rates, on-time percentages, average delivery times, and customer satisfaction scores.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["driver performance", "KPIs", "delivery metrics", "on-time", "logistics", "POS", "AskBiz", "analytics"],
    keyTakeaways: [
      "The four key driver metrics are: Delivery Success Rate, On-Time Rate, Average Delivery Time, and Customer Satisfaction Score.",
      "Benchmarking drivers against each other and against the fleet average reveals your best performers and those who need support.",
      "Performance data should inform coaching conversations, not just management decisions — share it with drivers so they can improve."
    ],
    content: [
      {
        heading: "Finding the driver performance report",
        body: "Go to POS > Logistics > Reports > Driver Performance. Select a date range and use the Driver filter to view one driver or all drivers. The report table shows every driver with their key metrics for the period. At the top, fleet-level averages give you a benchmark: if the fleet average delivery success rate is 92%, a driver at 78% is significantly below average and needs attention; a driver at 97% is a model for others."
      },
      {
        heading: "Delivery success rate",
        body: "Success rate is the percentage of delivery attempts that resulted in a successful delivery on the first attempt. Formula: Successful Deliveries ÷ Total Attempts × 100. A healthy rate is typically 90–95% for consumer deliveries. Persistently low success rates for a specific driver might indicate route issues (incorrect address data they're not resolving), poor communication skills (not reaching customers effectively), or failure to follow delivery instructions. Review their failed delivery reasons to understand which category the failures fall into."
      },
      {
        heading: "On-time delivery rate",
        body: "On-time rate measures the percentage of deliveries completed within the promised time window (as set in your delivery slot or SLA configuration). Formula: Deliveries Within Window ÷ Total Deliveries × 100. Late deliveries frustrate customers and breach any SLAs you've agreed with B2B clients. Consistently late drivers may need route optimisation support, may be taking on too many parcels per run, or may need to start earlier. Check if the issue is specific zones (traffic bottlenecks) or consistent across all their routes."
      },
      {
        heading: "Average delivery time",
        body: "Average delivery time is measured from dispatch (driver picks up the parcel) to completion (delivery marked as done). This metric tells you how efficiently a driver moves through their run. Compare drivers on similar routes: if two drivers cover the same zone but one consistently averages 12 minutes per stop while another averages 22 minutes, investigate why. Common reasons: time spent searching for addresses, extended conversations with customers, or inefficient parking choices. Share the data with the slower driver and discuss specific improvements."
      },
      {
        heading: "Customer satisfaction scores",
        body: "If you've enabled post-delivery rating requests, customer satisfaction scores (1–5 stars) appear on each driver's performance report. A driver with consistently low ratings despite a good delivery success rate might have an attitude or communication issue — technically making deliveries but leaving customers unhappy. Use low satisfaction scores as the prompt for a coaching conversation, not an immediate disciplinary action. Ask the driver what challenges they face on their runs — often there's a structural issue (the rating prompt is confusing, or customers are rating the product quality not the delivery service)."
      }
    ],
    relatedSlugs: ["logistics-driver-management-askbiz", "logistics-delivery-reports-askbiz", "logistics-customer-notifications-askbiz"],
    faq: [
      { q: "Can I share the performance report with drivers so they can see their own stats?", a: "Yes — generate the report filtered to a single driver and export as PDF. Share with the driver in their regular review meeting. Transparency about metrics tends to improve performance." },
      { q: "Are drivers notified when they're performing poorly?", a: "Not automatically. Performance data is visible to managers in AskBiz; drivers see only their own app. Coaching conversations triggered by the data are a manager responsibility." },
      { q: "Can I set performance targets for drivers?", a: "You can set benchmarks in your own processes (e.g. minimum 90% on-time rate) and flag any driver below them in the report. AskBiz doesn't currently send automated alerts when a driver falls below a specific threshold." }
    ]
  },

  {
    slug: "logistics-cash-on-delivery-askbiz",
    title: "Managing Cash on Delivery (COD) Payments",
    description: "How to set up and process cash on delivery in AskBiz POS — configuring COD as a payment option, recording driver collections, reconciling cash at the end of the day.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["cash on delivery", "COD", "payment collection", "logistics", "POS", "AskBiz", "driver cash"],
    keyTakeaways: [
      "COD orders are flagged on the driver's delivery list — the driver collects payment at the door before handing over the goods.",
      "Drivers submit their COD collections at the end of each shift, which reconciles against the expected total in AskBiz.",
      "COD reconciliation is logged in the Audit trail, giving you a clear record of every collection."
    ],
    content: [
      {
        heading: "Enabling cash on delivery",
        body: "Go to POS > Logistics > Settings > Payment Methods. Enable Cash on Delivery. Set any restrictions: maximum COD order value (to limit your risk on unverified customers), eligible zones (perhaps only within city limits where collections are easy to reconcile), or eligible customer types (e.g. only existing customers with a track record). Once enabled, COD appears as a payment option when creating delivery orders — the operator selects it instead of collecting payment upfront."
      },
      {
        heading: "How COD orders appear to the driver",
        body: "In the driver's app, COD deliveries are marked with a cash icon — visually distinct from prepaid orders. The order detail screen shows the amount to collect in large, clear text: 'Collect: £47.50'. Before the driver taps Delivered, the app prompts them to confirm collection: 'Confirm you received £47.50 from the customer?' The driver selects Yes (or logs the actual amount received if the customer gave a different amount — the app handles the difference as change or a discrepancy). The payment is logged against the delivery record immediately."
      },
      {
        heading: "Giving change for COD",
        body: "Drivers carrying COD deliveries need float money to give change. At the start of the shift, issue each COD driver a float — record this in Logistics > COD Reconciliation > Issue Float and enter the driver's name and float amount. The driver uses this float to give change during their run. When calculating end-of-shift reconciliation, the expected cash balance = float + total COD collections. This is the amount the driver should physically hand over when they return to depot."
      },
      {
        heading: "End-of-shift COD reconciliation",
        body: "When the driver returns, go to Logistics > COD Reconciliation and open their shift record. AskBiz shows: Float Issued + COD Collected (sum of all COD amounts recorded in the app) = Expected Cash Returned. The driver hands over their cash. Count it and enter the actual amount. If it matches expected, mark as Reconciled. If there's a discrepancy (a customer underpaid, a recording error, or — worst case — driver misappropriation), record the discrepancy and investigate. All reconciliation records are logged in the Audit trail."
      },
      {
        heading: "COD and your accounts",
        body: "COD revenue is recorded at the point of collection — when the driver marks the payment confirmed in the app. This differs from upfront payment orders, which are recorded at time of sale. For your accountant, COD revenue needs to be included in the correct reporting period. AskBiz's daily sales reports show COD and prepaid revenue separately, making the categorisation clear. Ensure your accountant knows how COD works in AskBiz so they can account for it correctly, particularly at period end when some COD orders may be In Transit."
      }
    ],
    relatedSlugs: ["logistics-creating-delivery-order-askbiz", "logistics-end-of-day-logistics-askbiz", "pos-end-of-day-reconciliation-askbiz"],
    faq: [
      { q: "What if a COD customer refuses to pay at the door?", a: "The driver should not hand over the goods. They mark the delivery as Failed — Refused Delivery. Bring the goods back to depot. The order stays unpaid and you follow up with the customer." },
      { q: "Can drivers accept card payment for COD orders?", a: "If the driver carries a portable card terminal linked to AskBiz, yes. Enable Card on Delivery in the same settings panel as COD. The card terminal processes the payment and AskBiz records it automatically." },
      { q: "Can I require COD for specific customers (e.g. ones with a history of late payment)?", a: "Yes — set a customer's default payment method to Cash on Delivery on their customer profile. Any delivery order for that customer will default to COD." }
    ]
  },

  {
    slug: "logistics-delivery-sla-askbiz",
    title: "Setting and Monitoring Delivery SLAs",
    description: "How to configure delivery service level agreements (SLAs) in AskBiz POS — setting time promises by zone or order type, tracking SLA compliance, and managing breaches.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["SLA", "service level agreement", "delivery promise", "on-time", "logistics", "POS", "AskBiz", "compliance"],
    keyTakeaways: [
      "An SLA is a promised delivery timeframe — AskBiz measures every delivery against it and flags breaches.",
      "Set SLAs by zone, order type, or customer tier — B2B clients may have contractual SLAs different from your standard consumer promise.",
      "SLA breach reports give you the evidence to investigate route efficiency or fleet capacity problems."
    ],
    content: [
      {
        heading: "What is a delivery SLA?",
        body: "A service level agreement (SLA) is a commitment about the quality of service you'll provide. For logistics, the most common SLA is a delivery time promise: 'Orders placed before 12pm are delivered the same day by 5pm.' Or for zone-based SLAs: 'Zone 1 deliveries are completed within 45 minutes of dispatch.' Breaking an SLA has consequences: for consumer customers, it damages trust and generates refund requests; for B2B clients with contractual SLAs, it may trigger penalties or service credits. AskBiz tracks every delivery against its SLA in real time."
      },
      {
        heading: "Configuring SLAs",
        body: "Go to POS > Logistics > Settings > SLAs. Click Add SLA. Define: Name (e.g. 'Standard Consumer', 'Zone 1 Express', 'B2B Contracted'), Scope (All Orders, a specific Zone, a specific Customer Type), and the Time Promise — either Max Delivery Time from Dispatch (e.g. 60 minutes) or Delivery by a Fixed Time (e.g. by 17:30 for same-day orders placed before 12:00). Set the SLA priority: if multiple SLAs could apply to one order, the highest-priority one is used. Save."
      },
      {
        heading: "SLA status on the Logistics dashboard",
        body: "Every active delivery on the Logistics dashboard now shows an SLA indicator alongside its status. Orders comfortably within their SLA window show green. Orders approaching their deadline (within 15 minutes of breach) show amber. Breached orders show red. This real-time traffic-light system lets you triage quickly: prioritise the amber orders, investigate the reds. Click any order to see the exact deadline and how long remains. For breached orders, the audit trail records the breach time and all relevant status updates."
      },
      {
        heading: "SLA compliance reporting",
        body: "In Logistics > Reports > SLA Compliance, the report shows: total deliveries in scope, number meeting SLA, number breaching SLA, and your overall compliance rate as a percentage. Filter by date range, zone, driver, or SLA type. Sort by worst compliance to identify systemic problem areas. If your Zone 2 SLA compliance is 95% but Zone 3 is 62%, something structural is wrong with Zone 3 — too many deliveries per driver, traffic bottlenecks, or unrealistic time promises for that geography."
      },
      {
        heading: "Responding to SLA breaches",
        body: "For consumer orders, proactively notify the customer when an SLA is about to breach — don't wait for them to complain. The automated notification system (see Customer Notifications article) can send an ETA update when a breach becomes likely. For B2B clients with contractual SLAs, maintain a breach log: the delivery record shows the SLA deadline, the actual delivery time, and the breach duration. Share this with the client in your monthly service review — transparency about breaches, with a clear improvement plan, is far better than hoping they don't notice."
      }
    ],
    relatedSlugs: ["logistics-driver-performance-askbiz", "logistics-delivery-reports-askbiz", "logistics-customer-notifications-askbiz"],
    faq: [
      { q: "Can I set SLAs for collection orders as well as deliveries?", a: "Yes — configure a Collection SLA (e.g. collections must be completed within 2 hours of the customer's requested window) using the same SLA settings screen." },
      { q: "What if weather or traffic makes the SLA unreachable? Can I suspend it?", a: "You can mark specific orders as SLA Excused (due to circumstances outside your control) from the order detail screen. Excused orders are excluded from SLA compliance calculations." },
      { q: "Can I have different SLAs for premium customers?", a: "Yes — create a 'Premium' SLA with a tighter time window and assign it to customer profiles flagged as premium. When a delivery is created for that customer, the premium SLA applies automatically." }
    ]
  },

  {
    slug: "logistics-third-party-couriers-askbiz",
    title: "Integrating Third-Party Delivery Platforms",
    description: "How to connect AskBiz POS to third-party courier and delivery platforms — importing orders automatically, tracking deliveries in one place, and reconciling courier revenue.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["third-party", "courier", "integration", "Uber Eats", "Glovo", "logistics", "POS", "AskBiz"],
    keyTakeaways: [
      "Connecting third-party platforms (Uber Eats, Deliveroo, Glovo, etc.) to AskBiz imports their orders automatically into your POS.",
      "You can track third-party deliveries alongside your own fleet in the AskBiz Logistics dashboard.",
      "Reconciling courier commission fees against your gross sales reveals the true profitability of each platform."
    ],
    content: [
      {
        heading: "Why integrate third-party platforms?",
        body: "Many businesses use third-party delivery platforms (Uber Eats, Deliveroo, Glovo, Just Eat) alongside or instead of their own delivery fleet. Without integration, you're managing two separate systems: the platform's dashboard and AskBiz. Orders, stock, and revenue are disconnected. With integration, third-party orders flow into AskBiz automatically — reducing manual entry, keeping stock accurate, and giving you a unified revenue view across your own deliveries and third-party platforms."
      },
      {
        heading: "Setting up an integration",
        body: "Go to POS > Operations > Integrations and find your delivery platform in the list. Click Connect. You'll be redirected to the platform's authorisation page to approve AskBiz access. Once authorised, configure the sync settings: which menu/product catalogue to use (your AskBiz catalogue syncs to the platform), whether orders auto-accept or need manual confirmation, and which branch receives the orders. Click Save. New orders placed on the platform will now appear in AskBiz — typically within 30–60 seconds of the customer placing the order."
      },
      {
        heading: "How third-party orders appear in AskBiz",
        body: "Third-party orders appear in the Logistics tab tagged with the platform name (Uber Eats, Deliveroo, etc.) and a platform order reference. Since the platform handles the delivery with their own fleet, these orders skip the driver assignment step — they automatically progress from Accepted to In Transit (when the platform driver picks up) to Delivered (when the platform confirms delivery). The stock is decremented from your inventory as the order is accepted, keeping your stock count accurate across all channels."
      },
      {
        heading: "Reconciling platform revenue",
        body: "Third-party platforms charge a commission on every order — typically 15–35% of the order value. The platform pays you net of commission, not the gross order value. In AskBiz, platform orders record the gross order value (what the customer paid). Go to Logistics > Reports > Platform Revenue to see, by platform: Gross Sales, Commission %, Commission Amount, and Net Received. Compare platforms: if Uber Eats generates more gross sales but a higher commission rate than Deliveroo, your actual net revenue from Deliveroo might be higher. This data is essential for negotiating commission rates and deciding which platforms are worth maintaining."
      },
      {
        heading: "Keeping menus in sync",
        body: "When you add a new product to AskBiz, it doesn't automatically appear on your third-party platform menus unless you've enabled two-way menu sync in the integration settings. Check the Menu Sync setting: one-way (AskBiz pushes to platform) or two-way (changes flow both ways). For pricing, some platforms require prices be set separately within their platform — check whether price changes in AskBiz propagate to the platform or need to be updated there manually. Out-of-stock items: if a product hits zero stock in AskBiz, the integration should automatically mark it as unavailable on the platform (configure this in Integration Settings > Stock Sync)."
      }
    ],
    relatedSlugs: ["pos-integrations-askbiz", "logistics-delivery-reports-askbiz", "retail-multi-branch-inventory-askbiz"],
    faq: [
      { q: "What if the platform goes down or doesn't send orders through?", a: "AskBiz logs connection errors for each platform. Check Integrations > [Platform Name] > Connection Log for error details. Most issues resolve on reconnection. During outages, you'll need to monitor the platform's own dashboard directly." },
      { q: "Can I pause a platform integration without disconnecting it?", a: "Yes — click Pause Integration. This stops new orders from flowing in without removing the configuration. Useful during stock shortages or operational issues. Orders already in the platform will need to be managed directly in the platform's dashboard during the pause." },
      { q: "Can AskBiz dispatch third-party orders to my own drivers instead of the platform's fleet?", a: "This depends on the platform. Some (like Deliveroo for Business) support merchant fulfilment — you use your own drivers instead of theirs. If your platform supports this, configure it in the platform's settings and AskBiz will treat the order as a standard delivery to assign to one of your drivers." }
    ]
  },

  {
    slug: "logistics-delivery-reports-askbiz",
    title: "Running Logistics Reports: KPIs and Performance Analysis",
    description: "How to use AskBiz POS Logistics reports to measure delivery performance — total deliveries, success rates, revenue, driver productivity, and zone-level analysis.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: ["logistics reports", "delivery KPIs", "performance", "analytics", "logistics", "POS", "AskBiz", "reporting"],
    keyTakeaways: [
      "The Logistics reports section contains five key reports: Summary, Driver Performance, Zone Analysis, Platform Revenue, and SLA Compliance.",
      "Set a consistent reporting cadence — weekly for operational decisions, monthly for strategic review.",
      "The most important logistics KPI is Delivery Success Rate — everything else is secondary to getting goods to customers reliably."
    ],
    content: [
      {
        heading: "Getting to Logistics Reports",
        body: "Go to POS > Logistics > Reports. The reports menu has several sub-sections. Start with Summary — this gives a high-level snapshot of your logistics operation for any date range: total orders created, total dispatched, total delivered, total failed, delivery revenue collected, average delivery time, and overall SLA compliance rate. Export the Summary as PDF for inclusion in a weekly operations report. The other sub-sections provide granular drill-downs into specific areas."
      },
      {
        heading: "Summary report — the weekly check",
        body: "The Summary report is your weekly health check for logistics. Key questions to answer each Monday: Did our delivery success rate stay above 90%? Was our average delivery time within SLA? Did delivery revenue cover our fleet costs? Were there any zones with significantly worse performance? If any metric is outside your target range, drill into the relevant detailed report to understand why. The Summary report should take 5 minutes to read — it's designed for operational decision-making, not detailed analysis."
      },
      {
        heading: "Zone analysis report",
        body: "The Zone Analysis report breaks down delivery performance by geographic zone. For each zone: number of deliveries, success rate, average delivery time, failed attempt rate, and delivery revenue. Sort by success rate to find your worst-performing zones. Poor-performing zones often have structural issues: confusing addressing, poor parking, or high-density buildings with difficult access. Use the zone analysis to decide where to invest in route optimisation, additional driver training, or better delivery instructions."
      },
      {
        heading: "Revenue and cost analysis",
        body: "The Revenue report shows delivery fees collected, broken down by date, zone, driver, and platform (if using integrations). Compare delivery revenue to your estimated delivery costs: (Driver hours × hourly rate) + (distance × fuel cost per km) + vehicle depreciation. If delivery fees don't cover costs, your delivery operation is subsidising your sales — intentional if it's a customer acquisition strategy, but you should know. If delivery is profitable, understand which zones and time slots are most profitable and prioritise them."
      },
      {
        heading: "Exporting and sharing logistics data",
        body: "Every logistics report can be exported as CSV or PDF. CSV is useful for further analysis in Excel or sharing with your operations team. PDF is useful for presenting to stakeholders. Set up scheduled report exports in Reports > Schedule: for example, a weekly Driver Performance CSV emailed to your logistics manager every Monday morning, and a monthly SLA Compliance PDF emailed to your operations director on the 1st of each month. Automated reporting reduces the chance of data being reviewed only when something goes wrong."
      }
    ],
    relatedSlugs: ["logistics-overview-dashboard-askbiz", "logistics-driver-performance-askbiz", "logistics-delivery-sla-askbiz"],
    faq: [
      { q: "How far back does the logistics data go?", a: "All logistics records from account creation are retained. There's no automatic purge of delivery history." },
      { q: "Can I compare this month's logistics performance to last month?", a: "Yes — most reports have a comparison toggle. Select 'Compare to previous period' and AskBiz shows side-by-side columns for both periods, with percentage change highlighted." },
      { q: "Can I share a logistics report with a client (e.g. a B2B customer who wants delivery proof)?", a: "Export the relevant delivery records as PDF — each delivery shows status history, driver, and POD. This export is suitable for sharing with clients. For contractual SLA reporting, use the SLA Compliance report exported over the contract period." }
    ]
  },

  {
    slug: "logistics-end-of-day-logistics-askbiz",
    title: "End-of-Day Logistics Reconciliation",
    description: "A step-by-step guide to closing out your logistics operation at end of day in AskBiz POS — confirming all deliveries, reconciling driver cash, returning undelivered goods to stock, and reviewing the day's performance.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 5,
    keywords: ["end of day", "logistics", "reconciliation", "close", "driver cash", "POS", "AskBiz", "EOD"],
    keyTakeaways: [
      "End-of-day logistics reconciliation closes all active delivery sessions and confirms the day's final status for every order.",
      "Undelivered goods must be returned to stock — failing to do this leaves phantom stock discrepancies in your inventory.",
      "Reviewing the day's performance metrics before the team leaves gives you immediate feedback while context is fresh."
    ],
    content: [
      {
        heading: "Why end-of-day matters for logistics",
        body: "Unlike till reconciliation (which is one operation per till), logistics reconciliation spans every driver, every parcel, and every COD payment. Leaving it undone means: stock discrepancies from unprocessed returns, COD cash not reconciled against driver records, and orders stuck in 'In Transit' status that are actually back at depot. The end-of-day process takes 15–30 minutes but prevents hours of confusion the following morning."
      },
      {
        heading: "Step 1 — Check all active deliveries",
        body: "In the Logistics dashboard, filter for In Transit orders. At end of day, this list should ideally be empty — every order dispatched today should be either Delivered or Failed. If any order is still showing In Transit, contact the driver. Common explanations: the driver forgot to tap 'Delivered' on a completed order (ask them to update it now), the delivery is genuinely still in progress (confirm the situation), or the driver is unreachable (update the status manually and investigate the next morning). Don't leave In Transit orders unresolved overnight."
      },
      {
        heading: "Step 2 — Reconcile COD cash",
        body: "For each driver who carried COD deliveries, go to Logistics > COD Reconciliation and open their shift. AskBiz shows the expected cash total (float issued + COD collected). Count the physical cash the driver hands over and enter it. Mark the shift as Reconciled. Any discrepancies are flagged and logged. File the reconciliation record — it's your audit evidence that driver cash was accounted for. If a driver has left for the day without submitting their cash, this is a serious process gap; address it in your driver procedures."
      },
      {
        heading: "Step 3 — Return undelivered goods to stock",
        body: "Failed deliveries mean goods are back at the depot. For each failed delivery, open the order and click Return to Stock. AskBiz adds the goods back to your inventory count. If goods were damaged during transport, record a wastage write-off instead — don't return damaged goods to stock, as they'll appear as sellable when they're not. Once all failed delivery goods are processed (returned to stock or written off), your inventory count accurately reflects what's physically in the depot."
      },
      {
        heading: "Step 4 — Review the day's performance",
        body: "Open Logistics > Reports > Summary and set the date to today. Review: how many deliveries went out, how many were successful, how many failed, total COD collected, and your same-day SLA compliance rate. Note any drivers who had an unusually high failure rate or were significantly late. This 5-minute review while the day is fresh lets you catch patterns early — a driver who had 3 failed deliveries today might be having a problem that's worth a quick conversation before they start tomorrow's run."
      },
      {
        heading: "Step 5 — Prepare for tomorrow",
        body: "Check tomorrow's scheduled deliveries in Logistics > Schedule. Are there enough drivers available? Are all the time slots properly booked? Are any vehicles scheduled for maintenance? If tomorrow looks busy, ensure enough drivers are on shift and that vehicle capacity is adequate. Brief your morning dispatcher on any outstanding issues from today — orders that need rescheduling, customers who need to be called, or vehicles that need attention. A clear handover prevents tomorrow starting in chaos."
      }
    ],
    relatedSlugs: ["logistics-cash-on-delivery-askbiz", "logistics-failed-deliveries-askbiz", "pos-end-of-day-reconciliation-askbiz"],
    faq: [
      { q: "Can I automate parts of the end-of-day process?", a: "Yes — in Logistics > Settings, enable Auto-Return to Stock for failed deliveries (goods are automatically returned without manual action), and set an end-of-day reminder notification to prompt the logistics manager at a specific time." },
      { q: "What if a driver is still out on a delivery when I'm trying to close the day?", a: "Wait for them to complete or contact them. Don't force-close a delivery session while a driver still has goods in transit — you'll create a reconciliation discrepancy." },
      { q: "Should I run a stock take after end-of-day logistics reconciliation?", a: "Not daily. Monthly stock takes suffice for most businesses. However, if you've had a high volume of returns and write-offs on a particular day, a spot-check of the affected product counts is a good idea." }
    ]
  }
];
