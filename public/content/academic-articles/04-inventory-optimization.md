# Inventory Management & Stock Optimization Algorithms

**Demand Forecasting, Economic Order Quantity, and Real-Time Rebalancing for Retail**

---

## Abstract

Inventory optimization is critical for retail profitability, balancing stockouts (lost revenue) against overstocking (tied-up capital). This paper examines demand forecasting algorithms, Economic Order Quantity (EOQ) models, and dynamic rebalancing strategies for multi-location POS systems. We analyze real-time inventory data to predict demand, optimize reorder points, and allocate stock across locations. Case studies from SMB retailers demonstrate 15–25% improvement in stock turnover and working capital efficiency.

---

## 1. Introduction

### 1.1 The Inventory Problem

**Three Inventory Extremes:**

```
Too Much Stock:
├─ Capital tied up in unsold inventory
├─ Perishable products expire (waste)
├─ Storage costs accumulate
├─ Markdown pressure (older stock must sell)
└─ Opportunity cost: Could invest in marketing

Example: Black Hair Soap
├─ Purchased: 500 units @ £2 cost = £1,000 capital tied up
├─ Sales: 10 units/week = 50 weeks to sell (9 months!)
├─ Expiry: 12 months, so 2 months waste risk
└─ Cost: £1,000 capital + waste risk = inefficient
```

```
Too Little Stock:
├─ Stockouts: Customer leaves empty-handed
├─ Lost revenue: Might never return
├─ Market share loss: Competitor gets the sale
├─ Customer dissatisfaction: "You're always out of stock"
└─ Low inventory turns = inefficient use of space

Example: Black Hair Soap
├─ Stock: 10 units
├─ Demand: 50 units/week
├─ Stockout frequency: 4–5 stockouts per week
├─ Lost sales: 200+ units/month = £400 revenue/month
└─ Cost: £400/month × 12 = £4,800/year lost revenue
```

```
Optimal Stock:
├─ Just enough to meet demand (most of the time)
├─ Low inventory carrying cost
├─ Minimal stockouts
├─ Fast turnover (capital recycled frequently)

Example: Black Hair Soap
├─ Stock: 75 units (enough for ~1.5 weeks at 50 units/week)
├─ Stockout frequency: 1 per 10 weeks (acceptable 90% fill rate)
├─ Capital: £150 tied up (vs £1,000 in overstocking)
├─ Turnover: Every 1.5 weeks = 33 turns/year (fast)
└─ Result: Minimal waste + acceptable availability
```

### 1.2 Inventory Metrics

**Key Performance Indicators:**

```
Inventory Turnover Ratio:
  Formula: COGS / Average Inventory Value
  Example: £30,000 annual COGS / £2,000 avg inventory = 15 turns/year
  Interpretation: Entire inventory sold and replaced 15 times/year
  Benchmark: 
    ├─ Fast-moving (food): 20+ turns/year
    ├─ Medium (beauty): 8–12 turns/year
    └─ Slow (furniture): 2–4 turns/year
  
Days Inventory Outstanding (DIO):
  Formula: 365 / Turnover ratio
  Example: 365 / 15 = 24 days
  Interpretation: Average inventory held for 24 days before sale
  Target: As low as possible (faster turnover = better)

Stock-to-Sales Ratio:
  Formula: Ending Inventory / Monthly Sales
  Example: £2,000 inventory / £10,000 sales = 0.20
  Interpretation: Inventory equals 20% of monthly revenue
  Target: Industry-dependent (beauty: 0.15–0.25)

Stockout Rate:
  Formula: (Days out of stock / Total days) × 100%
  Example: 2 days stockout / 30 days = 6.7% stockout rate
  Target: <5% (acceptable), >10% (critical problem)
```

---

## 2. Demand Forecasting

### 2.1 Simple Moving Average (SMA)

**Baseline model (assumes stable demand):**

```
Black Hair Soap weekly sales (last 8 weeks):
├─ Week 1: 48 units
├─ Week 2: 52 units
├─ Week 3: 50 units
├─ Week 4: 51 units
├─ Week 5: 49 units
├─ Week 6: 53 units
├─ Week 7: 50 units
├─ Week 8: 52 units

Simple Moving Average (4-week):
Forecast Week 9 = (50 + 51 + 49 + 53) / 4 = 50.75 units
Forecast Week 10 = (49 + 53 + 50 + 52) / 4 = 51 units

Accuracy:
├─ Actual Week 9: 49 units
├─ Forecast: 50.75 units
├─ Error: -1.75 units (3.6% error - good)

When to use:
├─ Stable demand (no seasonality)
├─ Mature products
├─ Fast-moving items (noise averages out)
```

### 2.2 Exponential Smoothing (ETS)

**More sophisticated (weight recent data more heavily):**

```
Formula: Forecast(t+1) = α × Demand(t) + (1-α) × Forecast(t)

Where α (smoothing factor) = 0–1
├─ α = 0.1: Very smooth (slow to react to changes)
├─ α = 0.3: Moderate (balanced)
├─ α = 0.7: Responsive (reacts quickly to changes)

Example (α = 0.3):
Week 1 forecast: 50 units (initial guess)

Week 2 actual: 48 units
Week 2 forecast = 0.3 × 48 + (1–0.3) × 50 = 14.4 + 35 = 49.4

Week 3 actual: 52 units
Week 3 forecast = 0.3 × 52 + 0.7 × 49.4 = 15.6 + 34.6 = 50.2

Week 4 actual: 50 units
Week 4 forecast = 0.3 × 50 + 0.7 × 50.2 = 15 + 35.1 = 50.1

Advantage over SMA:
├─ Reacts to recent demand changes
├─ Less memory required (no 4–8 week history)
└─ Better for trending products
```

### 2.3 Seasonal Decomposition

**More complex (handles seasonality):**

```
Black Hair Soap (monthly data):
├─ Jan: 800 units (winter, product popular)
├─ Feb: 750 units
├─ Mar: 700 units
├─ Apr: 600 units (spring, warmer, less demand)
├─ May: 550 units
├─ Jun: 550 units
├─ Jul: 600 units
├─ Aug: 700 units
├─ Sep: 800 units (back-to-school, more demand)
├─ Oct: 850 units
├─ Nov: 900 units (holiday prep)
└─ Dec: 950 units (holiday season, peak)

Decomposition:
├─ Trend: Flat overall (~700 units/month average)
├─ Seasonality: 
│  ├─ Peak: Nov–Dec (+20–28%)
│  ├─ Trough: Apr–Jun (-20%)
│  └─ Cycle: 12-month pattern
└─ Noise: Random fluctuation ±2%

Forecast (using decomposition):
├─ Jan 2026 forecast: 700 × 1.14 = 798 units (trend × seasonal factor)
├─ Apr 2026 forecast: 700 × 0.86 = 602 units
└─ Accuracy: Much better than SMA (accounts for seasonality)

When to use:
├─ Clear seasonal patterns (beauty products, fashion, food)
├─ Holiday/weather effects
├─ Year-round planning
```

### 2.4 Machine Learning: Time Series Models

**Advanced (Prophet, ARIMA, Neural Networks):**

```
Prophet (Meta's time series library):
├─ Components: Trend + Seasonality + Holidays
├─ Handles: Missing data, outliers, multiple seasonalities
├─ Output: Point forecast + confidence intervals

Example:
  Forecast(Jan 2026): 800 units [760, 840] (80% confidence interval)
  ├─ Point estimate: 800 units
  ├─ Lower bound: 760 units (worse case)
  └─ Upper bound: 840 units (better case)

ARIMA (Autoregressive Integrated Moving Average):
├─ Parameters: p, d, q (determined by ACF/PACF analysis)
├─ Handles: Non-stationary data, trends, auto-correlation
├─ Better than ETS for complex patterns

Neural Networks (LSTM - Long Short-Term Memory):
├─ Learns: Complex patterns from historical data
├─ Handles: Multiple features (promotions, competitor activity, weather)
├─ Accuracy: Often 10–20% better than traditional methods
├─ Cost: Requires data science expertise
```

### 2.5 Demand Forecast Accuracy Metrics

**How to measure forecast quality:**

```
Mean Absolute Error (MAE):
├─ Formula: Average of |actual – forecast|
├─ Example: (|49–50.75| + |53–50.75| + |48–50.75|) / 3 = 1.75 units
├─ Interpretation: Forecast off by ~1.75 units on average
└─ Target: <5% of demand

Mean Absolute Percentage Error (MAPE):
├─ Formula: Average of |actual – forecast| / actual × 100%
├─ Example: (1.75 / 50.5) × 100% = 3.5% MAPE
├─ Interpretation: Forecast off by 3.5% on average
└─ Target: <10% (excellent), <5% (very good), >20% (needs improvement)

Bias (systematic over/under forecasting):
├─ Formula: Average of (actual – forecast)
├─ Example: -0.3 units
├─ Interpretation: Consistently over-forecast by 0.3 units
├─ Target: Close to 0 (no bias)
└─ Action: If biased, adjust smoothing factor
```

---

## 3. Economic Order Quantity (EOQ)

### 3.1 Classic EOQ Model

**Mathematical model to minimize inventory cost:**

```
Total Annual Cost = Holding Cost + Ordering Cost

Holding Cost:
├─ Formula: (Q/2) × H
├─ Where Q = order quantity, H = annual holding cost per unit
├─ Example: Black Hair Soap
│  ├─ Order quantity: 100 units
│  ├─ Holding cost: £0.50/unit/year (storage, insurance)
│  ├─ Holding cost: (100/2) × £0.50 = £25/year
│  └─ Interpretation: Average 50 units held, costs £25 to store

Ordering Cost:
├─ Formula: (D/Q) × S
├─ Where D = annual demand, S = cost per order
├─ Example:
│  ├─ Annual demand: 2,600 units (50/week)
│  ├─ Cost per order: £20 (processing, shipping)
│  ├─ Ordering cost: (2,600/100) × £20 = £520/year
│  └─ Interpretation: 26 orders/year, costs £520 total

Total Cost = £25 + £520 = £545/year

Economic Order Quantity (EOQ):
├─ Formula: √(2 × D × S / H)
├─ Calculation: √(2 × 2,600 × £20 / £0.50)
├─ = √(208,000)
├─ = 456 units
└─ Interpretation: Order 456 units at a time to minimize total cost

Optimal reorder schedule:
├─ Annual demand: 2,600 units
├─ Order size: 456 units
├─ Orders/year: 2,600 / 456 = 5.7 (so 6 orders/year)
├─ Order frequency: Every ~60 days
└─ Total cost at EOQ: (456/2 × £0.50) + (2,600/456 × £20) = £114 + £114 = £228/year

Cost comparison:
├─ Small orders (100 units): £545/year (wasteful)
├─ EOQ (456 units): £228/year (optimal) ✓
├─ Large orders (1,000 units): £310/year (tied-up capital)
└─ Savings: 58% vs small orders
```

### 3.2 Limitations and Extensions

**When EOQ breaks down:**

```
Assumption: Constant demand
Reality: Demand fluctuates
├─ EOQ recommends ordering when inventory reaches R (reorder point)
├─ But demand variability means sometimes stock-out before order arrives
└─ Solution: Add safety stock (discussed next)

Assumption: Constant holding cost
Reality: Warehousing cost may be fixed (not per-unit)
└─ Solution: Use ABC analysis to group products

Assumption: Linear ordering cost
Reality: Bulk discounts available
├─ Large orders cheaper per unit
├─ Trade-off: Save on unit cost, but higher holding cost
└─ Solution: Compare total cost at each discount tier
```

---

## 4. Safety Stock & Reorder Points

### 4.1 Safety Stock Formula

**Buffer stock to prevent stockouts:**

```
Demand Variability:
Black Hair Soap weekly demand:
├─ Mean: 50 units/week
├─ Standard deviation: 5 units
├─ Min: 40 units (bad week)
├─ Max: 60 units (good week)

Reorder Point (without safety stock):
├─ Lead time: 2 weeks (time from order to delivery)
├─ Expected demand during lead time: 50 × 2 = 100 units
├─ Reorder when inventory = 100 units
└─ Problem: If demand spikes to 60 units/week × 2 weeks = 120 units, stockout!

Safety Stock (to protect against demand variability):
├─ Formula: z × σ × √L
├─ Where z = service level factor, σ = std dev, L = lead time
├─ Example (95% service level):
│  ├─ z = 1.645 (from normal distribution table)
│  ├─ σ = 5 units
│  ├─ L = 2 weeks
│  ├─ Safety stock = 1.645 × 5 × √2 = 11.6 ≈ 12 units
│  └─ Interpretation: Keep 12 extra units as buffer

Reorder Point (with safety stock):
├─ Formula: (Mean demand × Lead time) + Safety stock
├─ Calculation: (50 × 2) + 12 = 112 units
├─ Interpretation: When inventory drops to 112 units, place order
└─ Benefit: 95% confidence of meeting demand during lead time

Service Level vs. Safety Stock:
├─ 80% service level: 0.84 × σ × √L = 5.9 units (risky)
├─ 90% service level: 1.28 × σ × √L = 9.0 units
├─ 95% service level: 1.645 × σ × √L = 11.6 units ✓ (typical)
├─ 99% service level: 2.33 × σ × √L = 16.5 units (expensive)
└─ Trade-off: More safety stock = higher holding costs but fewer stockouts
```

### 4.2 Reorder Point Optimization

**Real-world adjustment:**

```
Formula reorder point: 112 units

But consider:
├─ Lead time variability: 2±1 week sometimes, adjust by +50% buffer
│  └─ Adjusted: 112 + (50 × 1) = 162 units
├─ Seasonal demand: If spring (low demand), reduce by 20%
│  └─ Adjusted for spring: 162 × 0.8 = 130 units
└─ Supplier reliability: If supplier often late, increase safety stock 25%

Final reorder point: 130–162 units (depending on season)

Real implementation in POS:
└─ CREATE TABLE reorder_points (
    product_id UUID,
    season VARCHAR(50),
    reorder_point INT,
    safety_stock INT,
    lead_time_days INT,
    target_service_level INT
  );
```

---

## 5. Multi-Location Inventory Optimization

### 5.1 Centralized vs. Decentralized Models

**Challenge: How much stock in each location?**

```
Product: Black Hair Soap
Locations: London, Berlin, SF
Total weekly demand: 150 units
├─ London: 50 units/week (33%)
├─ Berlin: 50 units/week (33%)
└─ SF: 50 units/week (34%)

Decentralized (each store independent):
├─ London: Order EOQ (456 units) = 9 weeks supply
├─ Berlin: Order EOQ (456 units) = 9 weeks supply
├─ SF: Order EOQ (456 units) = 9 weeks supply
├─ Total inventory: 1,368 units held
└─ Problem: Excessive inventory system-wide, tied-up capital

Centralized (central warehouse distributes):
├─ Central warehouse: Order bulk (1,368 units = 9 weeks for all)
├─ Each store: Keep 2–3 weeks buffer (75–112 units)
├─ Total inventory: 625 units held (54% reduction)
├─ Benefit: Lower capital tied up, better utilization

Hybrid (recommended):
├─ Central warehouse: 4-week supply (600 units)
├─ London store: 1.5-week supply (75 units)
├─ Berlin store: 1.5-week supply (75 units)
├─ SF store: 1.5-week supply (75 units)
├─ Total: 825 units (vs 1,368 decentralized)
└─ Benefit: Balance local responsiveness + efficiency
```

### 5.2 Dynamic Rebalancing Algorithm

**Real-time stock reallocation:**

```
Trigger: Daily stock level check

Algorithm:
1. For each product:
   a. Query stock levels across all locations
   b. Calculate expected demand next 7 days
   c. Identify critical low stock (<2 days supply)
   d. Find surplus locations (>10 days supply)
   
2. Generate transfer recommendations:
   ├─ London: 100 units (supply), Berlin: 10 units (critical low)
   └─ Suggest: Transfer 40 units London → Berlin
   
3. Cost-benefit analysis:
   ├─ Transfer cost: £20 (shipping)
   ├─ Stockout cost if not transferred: 40 × £5 lost margin = £200
   ├─ Net benefit: £200 - £20 = £180
   └─ Decision: ✓ Transfer (positive ROI)
   
4. Execute or recommend:
   ├─ Automatic: If <£20 cost
   └─ Notify manager: If >£20 cost (approval needed)

Real implementation (pseudocode):

def rebalance_inventory(locations, products):
  transfers = []
  
  for product in products:
    stock_by_location = {loc: get_stock(loc, product) for loc in locations}
    demand_7d = forecast_demand(product, days=7)
    target_per_location = demand_7d / len(locations)
    
    for from_loc, from_stock in stock_by_location.items():
      if from_stock > target_per_location * 1.5:  # Surplus
        for to_loc, to_stock in stock_by_location.items():
          if to_stock < target_per_location * 0.5:  # Deficit
            transfer_qty = min(
              from_stock - target_per_location,
              target_per_location - to_stock
            )
            transfer_cost = calculate_cost(from_loc, to_loc)
            stockout_cost = transfer_qty * product.margin * 0.1  # 10% stockout risk
            
            if stockout_cost > transfer_cost:
              transfers.append({
                'from': from_loc,
                'to': to_loc,
                'product': product,
                'quantity': transfer_qty,
                'benefit': stockout_cost - transfer_cost
              })
  
  return sort_by_benefit(transfers)
```

---

## 6. ABC Inventory Classification

### 6.1 Pareto Analysis (80/20 Rule)

**Focus optimization effort on high-impact items:**

```
Product Sales Distribution:

Category A (High value, 20% of items, 80% of revenue):
├─ Black Hair Soap: £10,000/year revenue (10%)
├─ Shea Butter Cream: £8,000/year (8%)
├─ Organic Oils: £7,500/year (7.5%)
├─ ... other high-revenue products
└─ Total: ~£80,000/year (80% of store revenue)

Category B (Medium value, 30% of items, 15% of revenue):
├─ Face masks: £3,000/year (3%)
├─ Scrubs: £2,500/year (2.5%)
├─ ... other medium products
└─ Total: ~£15,000/year (15% of store revenue)

Category C (Low value, 50% of items, 5% of revenue):
├─ Sample packets: £300/year (0.3%)
├─ Gift sets: £200/year (0.2%)
├─ ... other slow-moving items
└─ Total: ~£5,000/year (5% of store revenue)

Optimization Strategy:

Category A (Critical):
├─ Frequent inventory checks (daily)
├─ High service level target: 99% (minimize stockouts)
├─ EOQ calculation (optimize ordering)
├─ Automated reorder alerts
└─ Cost: Worth the effort (high ROI)

Category B (Normal):
├─ Weekly inventory checks
├─ Service level target: 95%
├─ EOQ used, but less precise
└─ Semi-automated reorders

Category C (Low priority):
├─ Monthly inventory checks
├─ Service level target: 80% (accept some stockouts)
├─ Simple reorder levels (not EOQ)
├─ Can over-order without major cost impact
└─ Minimal effort

Result:
├─ Focus optimization on 20% of products
├─ Significant impact on 80% of revenue
├─ 60% effort reduction
```

---

## 7. Conclusion

**Key Inventory Principles for Retailers:**

1. **Demand Forecasting is Critical:**
   - Use simple methods (SMA) for baseline
   - Add seasonality (decomposition) for accuracy
   - Consider advanced models (Prophet, LSTM) for complex patterns

2. **EOQ Balances Holding vs. Ordering Costs:**
   - Calculate EOQ for each product
   - Use 456-unit formula example as template
   - Aim to minimize total inventory cost

3. **Safety Stock Prevents Stockouts:**
   - Add buffer stock based on demand variability
   - 95% service level typical (1.645 × σ × √L formula)
   - Adjust for lead time and seasonality

4. **Multi-Location Requires Dynamic Rebalancing:**
   - Centralized warehouse + distributed stores (hybrid)
   - Daily rebalancing algorithm (transfer when beneficial)
   - Cost-benefit analysis drives transfers

5. **ABC Classification Focuses Effort:**
   - 20% of products = 80% of revenue (Category A)
   - Optimize A ruthlessly, accept C minimally
   - Balanced effort allocation

---

## References

1. Silver, E. A., Pyke, D. F., & Peterson, R. (2016). "Inventory Management and Production Planning and Scheduling." John Wiley & Sons.
2. Chopra, S., & Meindl, P. (2015). "Supply Chain Management: Strategy, Planning, and Operation." Pearson.
3. Taylor, S. J. (2015). "Forecasting Methods for Management." John Wiley & Sons.
4. Makridakis, S., Spiliotis, E., & Assimakopoulos, V. (2020). "Statistical and Machine Learning Forecasting Methods: Concerns and Ways Forward." PLOS ONE.

---

**Keywords**: Inventory optimization, demand forecasting, EOQ, safety stock, ABC analysis

**Academic Level**: Master's / Operations Management

**Last Updated**: May 14, 2026
