#!/usr/bin/env python3
"""
Daily Brief for Tony - 6am briefing
Combines: News, Email priorities, Calendar, Weather, Project updates, Action items
"""

import subprocess
import json
from datetime import datetime, timedelta
import os

WORKSPACE = "/Users/kofi/.openclaw/workspace"
KNOWLEDGE_BASE = f"{WORKSPACE}/elaman-knowledge"

def get_news():
    """Fetch news based on Tony's interests"""
    interests = [
        "UK retail banking technology",
        "IT governance GRC UK",
        "Oracle ERP enterprise architecture",
        "UK immigration policy skilled worker visa",
        "UK mortgage rates energy costs",
        "AI automation n8n workflows",
        "Ghana fintech mobile money",
        "PwC Big 4 digital audit",
    ]
    
    # Would integrate with news API or RSS feeds
    # For now, placeholder for news aggregation
    return {
        "status": "News integration pending - can add RSS/API feeds",
        "topics": interests
    }

def check_calendar():
    """Check today's calendar events"""
    # Would integrate with Google Calendar or Apple Calendar
    return {
        "today": [],
        "tomorrow": [],
        "status": "Calendar integration pending"
    }

def get_weather():
    """Get Manchester weather forecast"""
    try:
        result = subprocess.run(
            ['curl', '-s', 'wttr.in/Manchester?format=%c+%t+%w+%h'],
            capture_output=True, text=True, timeout=10
        )
        return result.stdout.strip()
    except:
        return "Weather unavailable"

def check_high_priority_emails():
    """Check if there are urgent emails"""
    try:
        state_file = f"{WORKSPACE}/memory/email-state.json"
        if os.path.exists(state_file):
            with open(state_file) as f:
                state = json.load(f)
            
            important = state.get('importantEmails', [])
            urgent = [e for e in important if e.get('score', 0) >= 60]
            
            if urgent:
                return {
                    'count': len(urgent),
                    'emails': urgent[:3]  # Top 3
                }
            return {'count': 0, 'emails': []}
    except:
        pass
    
    return {'count': 0, 'emails': []}

def get_project_status():
    """Review project updates from knowledge base"""
    projects = []
    
    # Check if knowledge base exists
    if os.path.exists(KNOWLEDGE_BASE):
        summary_file = f"{KNOWLEDGE_BASE}/SUMMARY.md"
        if os.path.exists(summary_file):
            with open(summary_file) as f:
                content = f.read()
                # Extract key projects and status
                projects.append("Knowledge base available - see elaman-knowledge/SUMMARY.md")
    
    # Check active projects in workspace
    active_projects = [
        "ghana-reconcile-pro",
        "linkedin-job-automation", 
        "career-pilot-pro",
        "job-matcher-pro",
        "atlas-business-hub",
        "elaman-talk",
        "customer-service-ai-agent",
        "airbnb-docker-app",
    ]
    
    return {
        "active_count": len(active_projects),
        "knowledge_base": os.path.exists(KNOWLEDGE_BASE),
        "projects": active_projects[:5]  # Top 5
    }

def generate_action_items():
    """Generate suggested action items based on context"""
    actions = []
    
    # Job search actions
    actions.append({
        'category': 'Job Search',
        'priority': 'HIGH',
        'items': [
            'Check DWP job alerts for new IT roles £75k+',
            'Follow up on recent applications (Lloyds, Crowe, AJ Bell)',
            'Update LinkedIn with latest achievements',
        ]
    })
    
    # Business actions
    actions.append({
        'category': 'Elaman Group',
        'priority': 'MEDIUM',
        'items': [
            'Review ghana-reconcile-pro development progress',
            'Check n8n workflow automations',
            'Review any client proposals pending',
        ]
    })
    
    # Personal/Admin
    actions.append({
        'category': 'Personal/Admin',
        'priority': 'MEDIUM',
        'items': [
            'Review any visa/immigration updates',
            'Monitor mortgage rate news',
            'Check EV charging/energy costs',
        ]
    })
    
    return actions

def format_brief():
    """Generate the full daily brief"""
    date = datetime.now().strftime("%A, %d %B %Y")
    
    sections = []
    sections.append(f"# 🌅 Daily Brief for Tony")
    sections.append(f"**{date}** | Generated at {datetime.now().strftime('%H:%M')}\n")
    
    # Weather
    weather = get_weather()
    sections.append(f"## 🌤️ Weather (Manchester)\n{weather}\n")
    
    # Priority Emails
    emails = check_high_priority_emails()
    sections.append("## 📧 Priority Emails")
    if emails['count'] > 0:
        sections.append(f"**{emails['count']} urgent email(s) requiring attention:**\n")
        for email in emails['emails']:
            sections.append(f"- **From:** {email.get('from', 'Unknown')}")
            sections.append(f"  **Subject:** {email.get('subject', 'No subject')}")
            sections.append(f"  **Why:** {', '.join(email.get('reasons', []))}\n")
    else:
        sections.append("✅ No urgent emails\n")
    
    # Calendar
    calendar = check_calendar()
    sections.append("## 📅 Today's Calendar")
    sections.append(f"{calendar.get('status', 'No events')}\n")
    
    # Projects
    projects = get_project_status()
    sections.append("## 🚀 Projects Overview")
    sections.append(f"- **Active Projects:** {projects['active_count']}")
    sections.append(f"- **Knowledge Base:** {'✅ Available' if projects['knowledge_base'] else '❌ Not yet organized'}")
    if projects['knowledge_base']:
        sections.append(f"  → Review: `{KNOWLEDGE_BASE}/SUMMARY.md`")
    sections.append(f"- **Key Projects:** {', '.join(projects['projects'])}\n")
    
    # Action Items
    actions = generate_action_items()
    sections.append("## ✅ Today's Action Items\n")
    for action in actions:
        sections.append(f"### {action['category']} ({action['priority']})")
        for item in action['items']:
            sections.append(f"- [ ] {item}")
        sections.append("")
    
    # News/Interests
    news = get_news()
    sections.append("## 📰 News & Insights")
    sections.append(f"Tracking: {', '.join(news['topics'][:3])}...")
    sections.append(f"\n{news['status']}\n")
    
    # Footer
    sections.append("---")
    sections.append("*Generated by Kofi - Your Digital Twin*")
    sections.append("Questions? Just ask! 🤝")
    
    return "\n".join(sections)

def main():
    brief = format_brief()
    
    # Save to memory
    today = datetime.now().strftime("%Y-%m-%d")
    brief_file = f"{WORKSPACE}/memory/daily-brief-{today}.md"
    
    os.makedirs(f"{WORKSPACE}/memory", exist_ok=True)
    
    with open(brief_file, 'w') as f:
        f.write(brief)
    
    print(brief)
    print(f"\n💾 Saved to: {brief_file}")

if __name__ == '__main__':
    main()
