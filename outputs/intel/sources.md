---
version: "1.1"
updated: "2026-05-23"
sources_healthy_note: "Disabled 7 feeds after failed 2026-05-23 fetch (not in 2026-05-22 registry). Reddit/Nitter/AIM need alternate URLs or manual reading."
---

# Curated RSS sources — PM & AI intel

Edit this file to add/remove feeds. Set `enabled: false` to skip without deleting.

> **Rules:** RSS/Atom URLs only (DEC-24). No LLM on fetch (DEC-25).

---

## PM Thought Leaders

### Lenny Rachitsky — Newsletter

- **feed_group:** Lenny Rachitsky
- **enabled:** true
- **rss:** https://www.lennysnewsletter.com/feed
- **web:** http://lennysnewsletter.com/
- **twitter:** https://twitter.com/lennysan
- **linkedin:** https://www.linkedin.com/in/lennyrachitsky/

### Lenny Rachitsky — X (Twitter)

- **feed_group:** Lenny Rachitsky
- **enabled:** true
- **rss:** https://nitter.net/lennysan/rss
- **twitter:** https://twitter.com/lennysan
- **note:** Nitter RSS bridge for @lennysan; third-party instance may go offline.

### Lenny Rachitsky — LinkedIn

- **feed_group:** Lenny Rachitsky
- **enabled:** false
- **rss:** https://www.linkedin.com/in/lennyrachitsky/
- **linkedin:** https://www.linkedin.com/in/lennyrachitsky/
- **note:** No public RSS (Phase 12). Profile link for manual reading — enable only if you add a working RSS bridge.

### Aakash Gupta — Product Growth (Newsletter)

- **feed_group:** Aakash Gupta
- **enabled:** true
- **rss:** https://aakashg.substack.com/feed
- **web:** https://www.news.aakashg.com/
- **twitter:** https://twitter.com/aakashgupta
- **linkedin:** https://www.linkedin.com/in/aagupta/

### Aakash Gupta — AI by Aakash (Newsletter)

- **feed_group:** Aakash Gupta
- **enabled:** true
- **rss:** https://www.aibyaakash.com/feed
- **web:** https://www.aibyaakash.com/

### Aakash Gupta — X (Twitter)

- **feed_group:** Aakash Gupta
- **enabled:** true
- **rss:** https://nitter.net/aakashgupta/rss
- **twitter:** https://twitter.com/aakashgupta
- **note:** Nitter bridge; @aakashg0 also used — this instance resolves @aakashgupta.

### Aakash Gupta — LinkedIn

- **feed_group:** Aakash Gupta
- **enabled:** false
- **rss:** https://www.linkedin.com/in/aagupta/
- **linkedin:** https://www.linkedin.com/in/aagupta/
- **note:** No public RSS (Phase 12). Profile for manual reading.

### Andrej Karpathy — Substack

- **feed_group:** Andrej Karpathy
- **enabled:** true
- **rss:** https://karpathy.substack.com/feed
- **web:** https://karpathy.substack.com/
- **twitter:** https://twitter.com/karpathy
- **linkedin:** https://www.linkedin.com/in/andrejkarpathy/

### Andrej Karpathy — Blog (Bear)

- **feed_group:** Andrej Karpathy
- **enabled:** true
- **rss:** https://karpathy.bearblog.dev/feed/?type=rss
- **web:** https://karpathy.ai/

### Andrej Karpathy — X (Twitter)

- **feed_group:** Andrej Karpathy
- **enabled:** true
- **rss:** https://nitter.net/karpathy/rss
- **twitter:** https://twitter.com/karpathy
- **note:** Nitter RSS bridge for @karpathy.

### Andrej Karpathy — LinkedIn

- **feed_group:** Andrej Karpathy
- **enabled:** false
- **rss:** https://www.linkedin.com/in/andrejkarpathy/
- **linkedin:** https://www.linkedin.com/in/andrejkarpathy/
- **note:** No public RSS (Phase 12). Profile for manual reading.

### Pawel Huryn

- **enabled:** true
- **rss:** https://www.productcompass.pm/feed

### Mind the Product

- **enabled:** false
- **rss:** https://www.mindtheproduct.com/feed/
- **note:** Site returns JSON, not RSS/Atom (parser error). No stable public feed found — use newsletter or re-enable when they publish Atom again.

### SVPG — Marty Cagan

- **enabled:** true
- **rss:** https://www.svpg.com/feed/

### Reforge Blog

- **enabled:** true
- **rss:** https://feeds.feedburner.com/reforge
- **note:** Official `reforge.com/blog/rss.xml` returns 500; FeedBurner mirror works.

---

## AI Labs & Research

### OpenAI Blog

- **enabled:** true
- **rss:** https://openai.com/blog/rss.xml

### Google AI Blog

- **enabled:** true
- **rss:** https://blog.google/technology/ai/rss/

### Anthropic News

- **enabled:** true
- **rss:** https://raw.githubusercontent.com/taobojlen/anthropic-rss-feed/main/anthropic_news_rss.xml
- **note:** Unofficial community feed (Anthropic has no public RSS). Updates ~every 6h via GitHub Actions.

### Hugging Face Blog

- **enabled:** true
- **rss:** https://huggingface.co/blog/feed.xml

---

## AI PM & Builders

### Latent Space

- **enabled:** true
- **rss:** https://www.latent.space/feed

### Ben's Bites

- **enabled:** true
- **rss:** https://www.bensbites.com/feed

### Simon Willison

- **enabled:** true
- **rss:** https://simonwillison.net/atom/everything/

---

## India — AI, Tech & Product

> Indian startup, AI, and product news. Use workbench filter **India — AI, tech & product**.

### Inc42

- **enabled:** true
- **rss:** https://inc42.com/feed/
- **web:** https://inc42.com/

### YourStory

- **enabled:** true
- **rss:** https://yourstory.com/feed
- **web:** https://yourstory.com/

### Medianama

- **enabled:** true
- **rss:** https://www.medianama.com/feed/
- **web:** https://www.medianama.com/
- **note:** Policy, platforms, and tech in India.

### Analytics India Magazine (AIM)

- **enabled:** false
- **rss:** https://analyticsindiamagazine.com/feed/
- **web:** https://analyticsindiamagazine.com/
- **note:** Disabled 2026-05-23 — `getaddrinfo ENOTFOUND analyticsindiamagazine.com`. Not in registry on 2026-05-22. Try `analyticsindia.com` feed if re-enabling.

### Entrackr

- **enabled:** false
- **rss:** https://entrackr.com/feed
- **web:** https://entrackr.com/
- **note:** Disabled 2026-05-23 — HTTP 404 on `/feed`. Not in registry on 2026-05-22. Use site/newsletter manually.

### NextBigWhat

- **enabled:** true
- **rss:** https://nextbigwhat.com/feed/
- **web:** https://nextbigwhat.com/

### Livemint — Technology

- **enabled:** true
- **rss:** https://www.livemint.com/rss/technology
- **web:** https://www.livemint.com/technology

### TechCircle

- **enabled:** false
- **rss:** https://www.techcircle.in/feed
- **web:** https://www.techcircle.in/
- **note:** Disabled 2026-05-23 — malformed RSS XML. Not in registry on 2026-05-22.

---

## Indian Voices (X / Twitter)

> Nitter RSS bridges — third-party; may go offline. Profile links for manual reading.

### Kunal Shah — X

- **feed_group:** Kunal Shah
- **enabled:** true
- **rss:** https://nitter.net/kunalb11/rss
- **twitter:** https://twitter.com/kunalb11
- **note:** Indian startup ecosystem.

### Punit Soni — X

- **feed_group:** Punit Soni
- **enabled:** true
- **rss:** https://nitter.net/punitsoni/rss
- **twitter:** https://twitter.com/punitsoni
- **note:** Product leadership (global + India relevant).

### Deepak Abbot — X

- **feed_group:** Deepak Abbot
- **enabled:** false
- **rss:** https://nitter.net/dabbott/rss
- **twitter:** https://twitter.com/dabbott
- **linkedin:** https://www.linkedin.com/in/dabbott/
- **note:** Disabled 2026-05-23 — Nitter HTTP 404. Not in registry on 2026-05-22. Use X/LinkedIn manually.

### Anupam Mittal — X

- **feed_group:** Anupam Mittal
- **enabled:** true
- **rss:** https://nitter.net/anupammittal/rss
- **twitter:** https://twitter.com/anupammittal
- **note:** Startups / Shark Tank India context.

### Shreyas Doshi — X

- **feed_group:** Shreyas Doshi
- **enabled:** true
- **rss:** https://nitter.net/shreyas/rss
- **twitter:** https://twitter.com/shreyas
- **note:** PM craft (high signal for product leadership).

### Shreyas Doshi — LinkedIn

- **feed_group:** Shreyas Doshi
- **enabled:** false
- **linkedin:** https://www.linkedin.com/in/shreyasdoshi/
- **note:** No public RSS — manual reading.

---

## Forums & Community

- **content_filter:** ai-pm

### Reddit — r/ProductManagement

- **enabled:** false
- **rss:** https://www.reddit.com/r/ProductManagement/.rss
- **web:** https://www.reddit.com/r/ProductManagement/
- **note:** Disabled 2026-05-23 — HTTP 403 (Reddit blocks server RSS). Not in registry on 2026-05-22.

### Reddit — r/StartupsIndia

- **enabled:** false
- **rss:** https://www.reddit.com/r/StartupsIndia/.rss
- **web:** https://www.reddit.com/r/StartupsIndia/
- **note:** Disabled 2026-05-23 — HTTP 403. Not in registry on 2026-05-22.

### Reddit — r/indianstartups

- **enabled:** false
- **rss:** https://www.reddit.com/r/indianstartups/.rss
- **web:** https://www.reddit.com/r/indianstartups/
- **note:** Disabled 2026-05-23 — HTTP 403. Not in registry on 2026-05-22.

---

## Building & Craft

### First Round Review

- **enabled:** false
- **rss:** https://review.firstround.com/rss
- **note:** `/rss` and `/feed.xml` return 404 from fetch; site may block bots. Subscribe via newsletter or re-test in a browser RSS extension.

### Julian Shapiro — Blog

- **enabled:** true
- **rss:** https://www.julian.com/blog/rss.xml

### Stratechery (Ben Thompson)

- **enabled:** false
- **rss:** https://stratechery.com/feed/
- **note:** Often subscriber-only; enable if your reader has access

---

## Tech News

- **content_filter:** ai-pm

### TechCrunch

- **enabled:** true
- **rss:** https://techcrunch.com/feed/
- **web:** https://techcrunch.com/
- **note:** Items filtered to AI / product / startup keywords at fetch time.

### The Verge

- **enabled:** true
- **rss:** https://www.theverge.com/rss/index.xml
- **web:** https://www.theverge.com/

### The Next Web

- **enabled:** true
- **rss:** https://thenextweb.com/feed/
- **web:** https://thenextweb.com/

### WIRED

- **enabled:** true
- **rss:** https://www.wired.com/feed/rss
- **web:** https://www.wired.com/

### Tech in Asia

- **enabled:** true
- **rss:** https://feeds.feedburner.com/techinasia
- **web:** https://www.techinasia.com/
- **note:** Direct `/feed` returns 403; FeedBurner mirror works.

---

## Health log (updated by fetch)

*Last run writes counts into daily `feed/` frontmatter, not here.*