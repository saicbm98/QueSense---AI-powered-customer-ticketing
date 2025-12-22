# QueueSense

QueueSense is an AI helper app for B2B SaaS support teams.  
It reads support tickets, surfaces the most important details, and drafts replies so agents can clear the queue faster with less mental load, while always keeping a human in the loop.

> Demo and portfolio project, designed to feel like a real support tool for a mid sized B2B SaaS company.

---

## Table of contents

- [Overview](#overview)
- [Who is it for](#who-is-it-for)
- [Core problems](#core-problems)
- [Key features](#key-features)
- [User flow](#user-flow)
- [AI behavior and prompts](#ai-behavior-and-prompts)
- [Interface and design](#interface-and-design)
- [Data model](#data-model)
- [Architecture](#architecture)
- [Getting started](#getting-started)
- [Configuration](#configuration)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

Customer support queues are noisy, high volume and often messy.  
Agents waste a lot of time reading long messages, jumping between tools and writing replies from scratch.

QueueSense gives support teams a focused ticket dashboard that:

- Summarises tickets automatically  
- Suggests priority, sentiment and tags  
- Drafts on brand replies that agents can review, edit and ship  

Humans stay in control, the AI does the heavy reading and drafting.

---

## Who is it for

**Target users**

- Customer Support Agents at B2B SaaS companies  
- Support Managers and Team Leads  

**Typical situation**

- In the middle of a busy shift  
- Long backlog of tickets  
- Many tools open at once, such as help desk, internal docs, CRM, Slack  
- Need to decide what to answer first and how to respond quickly without mistakes  

The app is simple enough that a non technical support manager can understand it in under a minute during a demo.

---

## Core problems

Right now, handling tickets is painful because:

- Someone manually decides which tickets are urgent or important  
- Agents read long messages just to understand what the customer is really asking  
- They click into other tools to see plan, value and history  
- They write replies sentence by sentence and try to keep tone consistent  
- Managers lack a clean view of which tickets need help first  

QueueSense reduces this manual effort so humans mainly:

- Scan AI summaries  
- Adjust priority or tags when needed  
- Review the AI reply, tweak it and send from their main support tool  

---

## Key features

### Ticket grid with AI summary and priority

- Ticket list shown as a grid of cards in a modern dashboard layout  
- Each card contains:
  - Ticket ID and status badge such as Open, Pending, In Progress, Escalated, Resolved  
  - Subject and short AI generated summary  
  - Customer or company name  
  - Assigned agent avatar and name  
  - Last updated time  
  - Category tag chips, for example Billing, Authentication, Onboarding  
  - Priority label such as Low, Medium, High, Critical  
  - Progress bar that shows the ticket stage: Created, Assigned, In Progress, Resolved  

### Ticket detail with AI analysis

Clicking a card opens a ticket detail view that shows:

- Full conversation text  
- Customer info such as plan, monthly revenue, high value flag, customer since date  
- AI Summary section:
  - Concise summary of the issue  
  - Suggested priority  
  - Suggested tags  
  - Sentiment such as Positive, Neutral, Negative  
  - Confidence score with a warning if confidence is low  

### AI drafted reply in brand tone

Inside the ticket detail view:

- AI generated reply draft that uses:
  - Conversation text  
  - Brand tone configuration  
  - Product docs or FAQ snippets  
- Reply remains fully editable by the agent  
- Controls for:
  - Regenerate reply  
  - Make shorter  
  - Make more detailed  
  - Copy reply to clipboard  

AI replies are clearly marked as AI generated. The app never auto sends replies.

### Attention dashboard

A compact dashboard highlights:

- Count of high priority tickets  
- Count of tickets from high value customers  
- Count of tickets with negative sentiment or urgent language  

This gives managers a quick sense of what needs attention first.

### Human in the loop by design

- AI content is always labeled  
- All AI text is editable  
- No one click send from QueueSense  
- AI can show uncertainty, for example "Low confidence, please review carefully"  

---

## User flow

1. **Open QueueSense**

   - User lands on the Tickets page  
   - Ticket grid is preloaded with synthetic sample tickets  
   - Dashboard tiles show high priority, high value and urgent sentiment counts  

2. **Scan tickets**

   - Filter by status using pill style tabs: All, Open, Pending, Resolved, Closed  
   - Use search to find tickets by keyword, customer or subject  
   - Card level summaries and badges help users decide what to open first  

3. **Open a ticket**

   - Click a card to view full ticket details  
   - See AI summary, suggested priority, tags and sentiment  
   - Review customer context and history  

4. **Generate and refine a reply**

   - Configure or confirm brand tone and docs  
   - Generate AI reply draft  
   - Adjust with Shorter, More detailed or Regenerate controls  
   - Edit text if needed and copy into the main support tool  

5. **Outcome**

   - Tickets move faster  
   - Agents spend less time reading and drafting  
   - Replies feel more consistent and on brand  

---

## AI behavior and prompts

The app treats AI as two main services.

### Summary, priority and tags

Conceptual prompt shape:

> You are a support assistant. Read the ticket text and customer info, then respond with JSON containing:
> - `shortSummary`  
> - `suggestedPriority` (Low, Medium, High, Critical)  
> - `tags` (array of short lowercase tags)  
> - `sentiment` (Positive, Neutral, Negative)  
> - `confidence` (0 to 1)

Inputs:

- Ticket subject and body  
- Customer info such as plan, revenue, high value flag, customer since date  
- Optional docs context  

Outputs are rendered on the ticket card and detail view.

### Reply drafting

Conceptual prompt shape:

> You are writing a reply on behalf of a B2B SaaS support agent.  
> Use the provided tone description. Use product docs if helpful, do not invent features.  
> Address the customer by name, be clear and concise, and say that the team will follow up if needed.  
> Return only the reply text.

Inputs:

- Conversation history for the ticket  
- Brand tone description  
- Product docs or FAQ text  

The result is shown in an editable text area with clear "AI generated" labeling.

---

## Interface and design

The design follows a modern SaaS dashboard style.

**Branding**

- App name: `QueueSense`  
- Logo: simple blue circular icon plus wordmark  

**Layout**

- Top navigation bar with logo and main sections:
  - Inbox, Knowledge Base, Analytics, Tickets, Customers  
- Tickets section used as the primary view for this demo  
- Header row with:
  - Status filter tabs  
  - Search and filter controls  
  - Buttons for Performance, Import Tickets, New Ticket  

**Visual style**

- Primary blue: `#006CFF`  
- Soft sky blue: `#E6F0FF`  
- Neutral white background with light gray sections  
- Medium gray secondary text  
- Yellow for Pending, red for Escalated  
- Rounded corners and subtle shadows on cards and controls  

---

## Data model

Example shape for a ticket object:
```ts
