#!/usr/bin/env python3
"""
Daily email checker for Tony's Gmail
Filters by importance based on job search, business, and personal priorities
"""

import imaplib
import subprocess
import email
from email.header import decode_header
from datetime import datetime, timedelta
import json
import sys

# Retrieve password from Keychain
def get_password():
    result = subprocess.run(
        ['security', 'find-generic-password', '-a', 'dtony47@gmail.com', '-s', 'gmail-app-password', '-w'],
        capture_output=True, text=True
    )
    return result.stdout.strip()

# Priority keywords and senders
HIGH_PRIORITY = {
    'senders': [
        'linkedin.com', 'indeed.com', 'glassdoor.com', 'cv-library.co.uk',
        'heidrick.com', 'harveynash.com', 'hays.com', 'roberthalf.com',
        'lloydsbank.com', 'natwest.com', 'nationwide.co.uk', 'tsb.co.uk', 'virginmoney.com',
        'crowe.co.uk', 'ajbell.co.uk', 'manchester.ac.uk',
        'pwc.com', 'kpmg.com', 'ey.com', 'deloitte.com',
        'gov.uk', 'homeoffice.gov.uk', 'visas-immigration.service.gov.uk',
        'apple.com', 'dell.com', 'bargainhardware.co.uk',
    ],
    'subjects': [
        'interview', 'application', 'role', 'position', 'opportunity', 'job',
        'visa', 'sponsorship', 'skilled worker', 'ILR', 'immigration',
        'offer', 'salary', 'contract', 'onboarding',
        'invoice', 'payment', 'client', 'project',
        'mortgage', 'rate', 'property', 'energy',
        'security alert', 'login', 'password',
    ],
    'business': [
        'elaman', 'ghana-reconcile', 'jobhunter', 'n8n',
        'stripe', 'supabase', 'cloudflare',
    ]
}

def decode_mime(header):
    if not header:
        return ''
    decoded = decode_header(header)
    result = ''
    for text, encoding in decoded:
        if isinstance(text, bytes):
            result += text.decode(encoding or 'utf-8', errors='replace')
        else:
            result += text
    return result

def check_importance(from_addr, subject, body):
    """Score email importance (0-100)"""
    score = 0
    reasons = []
    
    from_lower = from_addr.lower()
    subject_lower = subject.lower()
    body_lower = body.lower() if body else ''
    
    # Check high-priority senders
    for sender in HIGH_PRIORITY['senders']:
        if sender in from_lower:
            score += 40
            reasons.append(f'Priority sender: {sender}')
            break
    
    # Check subject keywords
    for keyword in HIGH_PRIORITY['subjects']:
        if keyword in subject_lower:
            score += 20
            reasons.append(f'Subject keyword: {keyword}')
            break
    
    # Check business-related
    for term in HIGH_PRIORITY['business']:
        if term in from_lower or term in subject_lower or term in body_lower:
            score += 15
            reasons.append(f'Business: {term}')
            break
    
    # Job-specific boost
    job_terms = ['head of', 'director', 'senior', 'manager', 'architect', 'GRC', 'audit']
    for term in job_terms:
        if term in subject_lower:
            score += 25
            reasons.append(f'Job role: {term}')
            break
    
    # Visa/immigration boost
    if any(term in subject_lower for term in ['visa', 'sponsorship', 'ILR', 'immigration']):
        score += 30
        reasons.append('Immigration/visa related')
    
    # Security alerts (need attention but not urgent)
    if 'security alert' in subject_lower or 'login' in subject_lower:
        score += 10
        reasons.append('Security notification')
    
    return score, reasons

def fetch_emails(mail, days=1):
    """Fetch emails from last N days"""
    date = (datetime.now() - timedelta(days=days)).strftime('%d-%b-%Y')
    status, messages = mail.search(None, f'(SINCE {date})')
    return messages[0].split()

def main():
    try:
        password = get_password()
        mail = imaplib.IMAP4_SSL('imap.gmail.com')
        mail.login('dtony47@gmail.com', password)
        mail.select('inbox')
        
        # Fetch emails from last 24 hours
        email_ids = fetch_emails(mail, days=1)
        
        if not email_ids:
            print("📭 No new emails in the last 24 hours")
            return
        
        print(f"📬 Checking {len(email_ids)} emails from last 24 hours...\n")
        
        important = []
        for msg_id in email_ids:
            status, msg_data = mail.fetch(msg_id, '(RFC822)')
            msg = email.message_from_bytes(msg_data[0][1])
            
            subject = decode_mime(msg['Subject'])
            from_addr = msg['From']
            date = msg['Date']
            
            # Get body (text/plain only)
            body = ''
            if msg.is_multipart():
                for part in msg.walk():
                    if part.get_content_type() == 'text/plain':
                        try:
                            body = part.get_payload(decode=True).decode('utf-8', errors='replace')
                            break
                        except:
                            pass
            else:
                try:
                    body = msg.get_payload(decode=True).decode('utf-8', errors='replace')
                except:
                    pass
            
            score, reasons = check_importance(from_addr, subject, body)
            
            if score >= 30:  # Threshold for importance
                important.append({
                    'from': from_addr,
                    'subject': subject,
                    'date': date,
                    'score': score,
                    'reasons': reasons
                })
        
        mail.close()
        mail.logout()
        
        # Output results
        if not important:
            print("✅ No important emails requiring attention")
            print("   (All emails filtered as low priority)")
        else:
            # Sort by score
            important.sort(key=lambda x: x['score'], reverse=True)
            
            print(f"🚨 {len(important)} IMPORTANT EMAIL(S) FOUND:\n")
            for i, email_item in enumerate(important[:10], 1):  # Top 10
                print(f"{i}. 📧 From: {email_item['from']}")
                print(f"   Subject: {email_item['subject']}")
                print(f"   Date: {email_item['date']}")
                print(f"   Priority Score: {email_item['score']}/100")
                print(f"   Why: {', '.join(email_item['reasons'])}")
                print()
            
            if len(important) > 10:
                print(f"... and {len(important) - 10} more")
        
        # Save state for tracking
        state = {
            'lastCheck': datetime.now().isoformat(),
            'totalChecked': len(email_ids),
            'importantFound': len(important),
            'importantEmails': important[:5]  # Keep last 5 for reference
        }
        
        with open('/Users/kofi/.openclaw/workspace/memory/email-state.json', 'w') as f:
            json.dump(state, f, indent=2)
        
    except Exception as e:
        print(f"❌ Error checking emails: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
