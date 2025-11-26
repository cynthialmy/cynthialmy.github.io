---
layout: page
title: Portfolio
subtitle: I enjoy the excitement of creation.
---

{% assign case_posts = site.posts | where_exp: 'post', 'post.project_type' %}
{% assign project_types = site.project_types %}
{% assign available_types = '' | split: '' %}
{% for post in case_posts %}
  {% if post.project_type %}
    {% assign type_array = post.project_type | split: '|' %}
    {% assign available_types = available_types | concat: type_array | uniq %}
  {% endif %}
{% endfor %}

{% if case_posts.size > 0 %}
## Featured Case Studies

{% if project_types %}
{% assign has_visible_filters = false %}
{% for entry in project_types %}
  {% assign key = entry[0] %}
  {% if available_types contains key %}
    {% assign has_visible_filters = true %}
    {% break %}
  {% endif %}
{% endfor %}
{% if has_visible_filters %}
<div class="project-filter-bar" data-project-filter-group="projects-grid">
  <span class="filter-label">Filter by:</span>
  <button class="filter-chip" type="button" data-filter-value="all">All</button>
  {% for entry in project_types %}
    {% assign key = entry[0] %}
    {% if available_types contains key %}
      {% assign meta = entry[1] %}
      <button class="filter-chip" type="button" data-filter-value="{{ key }}">{{ meta.label }}</button>
    {% endif %}
  {% endfor %}
</div>
{% endif %}
{% endif %}

<div class="project-card-grid" data-project-filter-target="projects-grid">
  {% for post in case_posts %}
  {% assign proj_key = post.project_type | default: 'other' %}
  {% assign proj_meta = site.project_types[proj_key] | default: site.project_types.other %}
  {% assign proj_label = proj_meta.label | default: proj_key %}
  {% assign proj_color = proj_meta.color | default: site.project_types.other.color | default: '#6b7280' %}
  <article class="project-card" data-project-type="{{ proj_key }}">
    <a class="project-card-link" href="{{ post.url | relative_url }}">
      <div class="project-card-header">
        <h3>{{ post.title | strip_html }}</h3>
        {% if post.subtitle %}
        <p class="project-card-subtitle">{{ post.subtitle | strip_html }}</p>
        {% endif %}
      </div>
      <span class="project-type-badge" style="--badge-color: {{ proj_color }};">{{ proj_label }}</span>
      <p class="project-card-meta">
        {% assign date_format = site.date_format | default: "%B %-d, %Y" %}
        {{ post.date | date: date_format }}
      </p>
      <p class="project-card-excerpt">
        {{ post.excerpt | strip_html | truncate: 180 }}
      </p>
    </a>
  </article>
  {% endfor %}
</div>

<script src="{{ '/assets/js/project-filters.js' | relative_url }}"></script>
{% endif %}

## Product & Service
- **[akaboo World](https://akabooworld.com/)**
  Used Baby Gear Marketplace listing solutions.

- **[akaTask](https://apps.apple.com/az/app/akatask/id6566193664?platform=iphone)**
  Task management and collaboration platform.

- **[Zoner](https://zoner-landing-page.web.app/)**
  Time zone shifting, jet lag prevention helper.

- **[Spice IT Global](https://www.spiceitglobal.com/)**
  Help businesses to elevate their online presence.

## Project

- **[Data Contract Summary](https://cynthialmy.github.io/book_summaries/)**
  Efficiently handle YAML-based data contracts with the Data Contract Manager. Explore on [GitHub (Internal)](https://github.com/volvo-cars/data-contract-manager).

- **[Dopamine Box: Logging Joyful Moments](https://cynthialmy.github.io/imba-habit/)**
  Log daily activities and moods with Imba (a language that compiles to JavaScript). Explore on [GitHub](https://github.com/cynthialmy/imba-habit/).

- **[course-website-design: Educational Platform Redesign](https://cynthialmy.github.io/course-website-design/)**
  Enhance user experience and interactivity with this restyling project for CS 7450 at Georgia Tech.

## Interactive Data Visualization
- **[d3-scrollama: Interactive Scrollytelling](https://cynthialmy.github.io/d3-scrollama/)**
  This project highlights the power of 'scrollytelling' in conveying complex information in an engaging way.

- **[d3-Interaction: Engaging Data Charts](https://cynthialmy.github.io/d3-Interaction/)**
  This initiative enhances user interaction with data charts, transforming static visuals into interactive experiences.

- **[bridge-dash: Infrastructure Insights](https://github.com/cynthialmy/bridge-dash)**
  BridgeDash provides a deep dive into various aspects of bridges, showcasing how data can inform and inspire.

- **[simple-d3-charts: Back to Basics](https://cynthialmy.github.io/simple-d3-charts/)**
  This foundational project demystifies the principles of crafting intuitive and straightforward D3.js charts.


## Video Demo

### Advanced Infrastructure Analysis
- **[City-Scale Infrastructure Intelligence via Dynamic Analysis (Poster)](resources/2017-POSTER-FYP.pdf)**

  This extensive study applies dynamic analysis for predictive maintenance, contributing to sustainable urban living. This project was 2017 HKUST President's Cup Final List.

  #### Video (Click to Play):

  [![REALIZING CITY-SCALE INFRASTRUCTURE INTELLIGENCE VIA EXTENSIVE DYNAMIC ANALYSIS](https://img.youtube.com/vi/xRT6hPYlndc/0.jpg)](https://www.youtube.com/watch?v=xRT6hPYlndc)

  [![REALIZING CITY-SCALE INFRASTRUCTURE INTELLIGENCE VIA EXTENSIVE DYNAMIC ANALYSIS](https://img.youtube.com/vi/cpcj_DlfkNQ/0.jpg)](https://www.youtube.com/watch?v=cpcj_DlfkNQ)

  [![REALIZING CITY-SCALE INFRASTRUCTURE INTELLIGENCE VIA EXTENSIVE DYNAMIC ANALYSIS](https://img.youtube.com/vi/zTncLSXekfI/0.jpg)](https://www.youtube.com/watch?v=zTncLSXekfI)

### Workshops and Analysis
- **[Sentiment Analysis with Python Workshop (GitHub)](https://github.com/cynthialmy/Sentiment-Analysis-with-Scikit-learn)**

  This workshop empowers participants with the tools to decipher customer sentiments, utilizing advanced machine learning techniques.

  #### Video (Click to Play):

  [![Sentiment Analysis with Python Workshop](https://img.youtube.com/vi/ywkblnkrr2k/0.jpg)](https://www.youtube.com/watch?v=ywkblnkrr2k)


- **[Geospatial Analysis of Yelp User Behavior (Poster)](https://github.com/cynthialmy/Geospatial_Analysis_for_Yelp_User_Behaviour/blob/main/team010poster.pdf)**

  This analysis reveals trends across geospatial locations, offering valuable insights into customer preferences and habits.

  #### Video (Click to Play):

  [![Sentiment Analysis with Python Workshop](https://img.youtube.com/vi/0bh1kNOlYd8/0.jpg)](https://www.youtube.com/watch?v=0bh1kNOlYd8)

  [![Yelp Demo](https://img.youtube.com/vi/cZWj-torlqY/0.jpg)](https://www.youtube.com/watch?v=cZWj-torlqY)

### Innovative Solutions for Everyday Challenges
- **[Real-time Display for Machine Status (Poster)](resources/2015-poster-president-cup.pdf)**

  This project addresses the efficient use of public facilities through IoT concepts, enhancing communal living experiences. This project was 2015 HKUST [President's Cup Golden Awardee](https://www.ce.ust.hk/news/gold-award-2014-2015-presidents-cup).

  #### Video (Click to Play):

  [![Real-time Display for Machine Status](https://img.youtube.com/vi/c284vsNPz00/0.jpg)](https://www.youtube.com/watch?v=c284vsNPz00)

## Explore More

Interested in seeing more of my work? Visit my [GitHub](https://github.com/cynthialmy) for a full list of my projects and contributions.

<!-- ## Let's Connect!

I'm always open to discussing new ideas, collaborative ventures, or opportunities. Feel free to [reach out](mailto:cynthialmy@gmail.com) for a chat or brainstorming session. Together, we can drive innovation and create a data-driven future! -->
