# HEARTBEAT.md Template

```markdown
# Keep this file empty (or with only comments) to skip heartbeat API calls.

# Add tasks below when you want the agent to check something periodically.

## Daily Brief at 6am

- [ ] **Generate Daily Brief** - Run `/Users/kofi/.openclaw/workspace/scripts/daily-brief.py`
  - Weather (Manchester)
  - Priority emails (from email checker)
  - Calendar events (today + tomorrow)
  - Project status updates
  - Action items (job search, business, personal)
  - News/insights on Tony's interests
  - Save to: `/Users/kofi/.openclaw/workspace/memory/daily-brief-YYYY-MM-DD.md`
  - **Notify Tony** with the brief if:
    - Urgent emails found
    - Important calendar events today
    - Time-sensitive action items
    - Otherwise: save silently, available on request

# Daily Checks (rotate through these 2-4 times per day)

- [ ] **Email Check** - Run `/Users/kofi/.openclaw/workspace/scripts/check-emails.py`
  - Notify Tony if high-priority emails found (score ≥60)
  - Focus: recruiters, job applications, visa/immigration, banking, security alerts
  - Skip: newsletters, promos, routine notifications

- [ ] **Calendar** - Check upcoming events (next 24-48h)

- [ ] **Weather** - Manchester forecast (if Tony might go out)

## State Tracking
- Email state: `/Users/kofi/.openclaw/workspace/memory/email-state.json`
```
