---
layout: post
title: "Jet Lag Personalization Engine Deep-dive"
subtitle: How Our Product Generates Adaptive Adjustment Plans
tags: [JetLagPreparation, TravelTips, CircadianRhythm, SleepAdjustment, LightExposure, MealTiming, FamilyTravel, SleepScience, ResearchInsights]
project_type: independent
comments: true
thumbnail-img: assets/img/t-minimum.png
share-img: assets/img/t-minimum.png
# author: Cynthia Mengyuan Li
---

This deep-dive outlines the scientific and algorithmic foundation behind the Jet Lag Personalization Engine, the core system powering our app’s customized sleep and circadian-adjustment plans. The goal of the feature is simple: help travelers arrive alert, aligned, and ready—regardless of how many time zones they cross.

### Problem Overview

Jet lag remains one of the top pain points for long-haul travelers. While general travel tips exist, users lack:

- Personalized guidance based on their own sleep behavior

- Science-backed adjustments aligned with circadian biology

- Actionable plans that adapt to direction, duration, age, and schedule constraints

Our product solves this by generating dynamic, evidence-based pre-travel and on-arrival plans, tailored to each family member.

### Foundational Science Behind the Algorithm

**Temperature Minimum (t-min) as a Personal Circadian Anchor**

The algorithm identifies each user’s estimated temperature minimum (t-min)—the lowest point in their 24-hour body temperature cycle and a key marker for circadian shifts.

- Typically occurs 90–120 minutes before habitual wake time

- Determines when light or activity will advance or delay the internal clock

- Enables the app to calculate precise light and sleep timing recommendations

![t-minimum](../assets/img/t-minimum.png)

**Light Sensitivity & the Circadian Dead Zone**

Because sensitivity to light varies over the day:

- Light after t-min → shifts clock earlier

- Light before t-min → shifts clock later

- Dead zone (10am–4pm) → light has minimal effect

These principles are built into the algorithm to optimize timing recommendations for each travel direction.

### Inputs That Drive Personalization

The personalization engine ingests a structured set of user and trip variables:

| Input Category     | Example Data Points                               | How It Impacts the Plan                             |
| ------------------ | ------------------------------------------------- | --------------------------------------------------- |
| Travel Itinerary   | Departure/arrival times, direction, zones crossed | Determines total circadian shift required           |
| User Profile       | Age group, baseline wake/sleep patterns           | Sets safe & realistic daily time-shift increments   |
| Preparation Window | Days until departure                              | Controls how aggressively or gradually shifts occur |
| Family Composition | Adults, children, toddlers, infants               | Allows unique schedules per traveler                |

These factors feed into a rules-based model that outputs individualized recommendations.


---

### Sleep & Schedule Adjustment Logic
To reduce jet lag severity, the system creates a daily phase-shift schedule for each user.

**Daily Shift Values (by Age Group)**

| Age Group | Eastward (Earlier) | Westward (Later) |
| --------- | ------------------ | ---------------- |
| Adult     | 30–60 mins/day     | 30–60 mins/day   |
| Child     | 30–60 mins/day     | 30–60 mins/day   |
| Toddler   | 15–30 mins/day     | 15–30 mins/day   |
| Infant    | 10–20 mins/day     | 10–20 mins/day   |

The app calculates a daily_shift value and applies it across:

- bedtime
- wake time
- nap windows (if applicable)

This ensures a smooth circadian transition rather than a sudden shift post-arrival.

### Light Exposure Timing Engine

Light recommendations reinforce the intended circadian direction:

| Travel Direction | Optimal Light Timing |
| ---------------- | -------------------- |
| Eastward         | Morning exposure     |
| Westward         | Evening exposure     |

The engine dynamically aligns light timing with the user’s t-min to ensure maximum effectiveness.

### Meal & Activity Timing Recommendations

Meal timing and physical activity are included as secondary zeitgebers (time cues).

| Direction | Meal Shift       | Activity Timing  |
| --------- | ---------------- | ---------------- |
| Eastward  | Earlier each day | Morning exercise |
| Westward  | Later each day   | Evening exercise |

These factors increase plan adherence and improve the likelihood of circadian adaptation.

### Arrival Strategy
Once travelers land, the product delivers adaptive instructions:

- Align meals to local time immediately

- Avoid light during the circadian dead zone

- Seek or avoid bright light depending on the intended direction of shift

These real-time adjustments help users stabilize into the new timezone faster.

### What the User Receives

Each traveler (or family member) receives a personalized, structured plan that includes:

1. Daily Sleep & Wake Shifts
Gradual adjustments matched to travel direction and age group.

2. Light Exposure Windows
Optimized using the user’s t-min to efficiently shift the circadian clock.

3. Meal & Activity Schedules
Complementary cues that reinforce the desired shift.

This is how the app helps travelers arrive alert, aligned, and ready—regardless of how many time zones they cross.

### References

- Huberman, A. (2021). Find Your Temperature Minimum to Defeat Jetlag, Shift Work, and Sleeplessness. [Podcast episode]. In Huberman Lab. Retrieved from [https://www.hubermanlab.com/episode/find-your-temperature-minimum-to-defeat-jetlag-shift-work-and-sleeplessness](https://www.hubermanlab.com/episode/find-your-temperature-minimum-to-defeat-jetlag-shift-work-and-sleeplessness)
