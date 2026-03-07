# QueueSense | AI-Powered Customer Support Platform

> **An AI assistant for B2B SaaS support teams that reads tickets, summarises the issue, and drafts replies so agents can clear the queue faster while staying in control**

---

## 🎯 What This Does

Customer support agents waste hours reading long messages and writing replies from scratch. QueueSense changes that.

When a ticket comes in:
- AI analyses the ticket and tells you what the issue is, how urgent it is, and what tags fit (urgent/important customer/highly negative tone)
- AI drafts a reply in your brand's tone, ready to review and send
- Internal team chat gets AI-suggested replies too

Humans stay in control. AI does the heavy reading and drafting.

**The Problem:** Support queues can be long. Agents read the same types of messages over and over, jump between tools, and write replies sentence by sentence. It's slow and tiring which impacts the customer satisfaction, especially for firms with rapid growth in customer base.

**The Solution:** A React frontend connected to n8n workflows that handle AI processing. Three separate workflows analyse tickets, draft replies, and suggest chat responses — all via webhooks.

---

## 🚀 What This Shows

### **AI Operations & Automation Skills**
- **Frontend to backend integration**: Connected a React app to n8n via webhooks, replacing direct Gemini API calls with a proper backend architecture
- **Multi-workflow design**: Built 3 separate n8n workflows for different AI tasks, each with its own webhook endpoint
- **AI Agent configuration**: Set up OpenAI-powered agents with custom system prompts for ticket analysis, reply drafting, and chat suggestions
- **Structured data extraction**: Parsed AI output into typed JSON fields for frontend consumption
- **Prompt engineering**: Designed prompts that return consistent, structured output across different ticket types
- **Debugging webhook responses**: Fixed array vs object response format issues between n8n and frontend

### **System Design Thinking**
This project shows how to take an AI-powered frontend and give it a proper backend. Instead of calling AI directly from the browser (which exposes API keys), the frontend calls webhooks. The n8n workflows handle AI processing and return clean data. This is how production apps actually work.

---

## 🏗️ Architecture

### **How It Fits Together**
```
React Frontend (QueueSense UI)
        ↓
   HTTP POST to n8n webhooks
        ↓
┌───────────────────────────────────────────────────┐
│                  n8n Cloud                         │
│                                                    │
│  Workflow 1: Ticket Analysis                       │
│  Webhook → AI Agent → Code Node → Respond          │
│                                                    │
│  Workflow 2: Reply Draft                           │
│  Webhook → AI Agent → Code Node → Respond          │
│                                                    │
│  Workflow 3: Chat Reply                            │
│  Webhook → AI Agent → Code Node → Respond          │
└───────────────────────────────────────────────────┘
        ↓
   JSON response back to frontend
        ↓
   UI displays analysis, draft, or chat reply
```

### **The Three Workflows**

| Workflow | Endpoint | What It Does | Returns |
|----------|----------|--------------|---------|
| **Ticket Analysis** | `/analyse-ticket` | Reads ticket, determines urgency, sentiment, tags | summary, priority, sentiment, tags, confidence, suggested assignee |
| **Reply Draft** | `/generate-draft` | Writes email reply in brand tone using knowledge base | draft email text |
| **Chat Reply** | `/generate-chat-reply` | Suggests reply for internal team chat | suggested reply text |

### **Workflow Structure (Same Pattern for All Three)**
<img width="1860" height="818" alt="image" src="https://github.com/user-attachments/assets/c253ecbb-0f37-47f7-87df-cd647da74030" />

```
Webhook (receives POST data)
    ↓
AI Agent (OpenAI + custom prompt)
    ↓
Code Node (parses output, formats response)
    ↓
Respond to Webhook (sends JSON back to frontend)
```

---

## 📊 What Each Workflow Returns

### **Ticket Analysis**
```json
{
  "summary": "Customer cannot log in with SSO after plan upgrade",
  "suggestedPriority": "Critical",
  "sentiment": "Urgent",
  "tags": ["sso", "authentication", "enterprise"],
  "confidenceScore": 0.92,
  "suggestedAssignee": "account_manager"
}
```

### **Reply Draft**
```json
{
  "draft": "Hi Alice, sorry about the disruption. I know that's urgent..."
}
```

### **Chat Reply**
```json
{
  "reply": "I can cover Friday — what time is the shift?"
}
```

---

## 🛠️ Tech Used

| Tool | What For |
|------|----------|
| **React + TypeScript** | Frontend UI |
| **n8n (cloud)** | Backend workflow engine |
| **OpenAI GPT** | AI model for analysis and drafting |
| **Webhooks** | API endpoints connecting frontend to backend |
| **JavaScript** | Code nodes for parsing AI output |
| **Tailwind CSS** | Styling |
| **Claude** | Prompting and debugging |

---

## 🔧 How to Set It Up

### **What You Need**
- n8n account (cloud or self-hosted)
- OpenAI API key
- Node.js for running the frontend locally

### **Backend Setup (n8n)**

1. **Import the workflows**
   ```
   In n8n: Settings → Import from File → Select each workflow JSON
   ```

2. **Add OpenAI credentials**
   - Go to Settings → Credentials → Add Credential → OpenAI
   - Paste your API key

3. **Activate all three workflows**
   - Toggle each workflow to "Active" in the top right

4. **Copy the webhook URLs**
   - Click each Webhook node → Production tab → Copy URL

### **Frontend Setup**

1. **Clone the repo and install**
   ```bash
   git clone https://github.com/saicbm98/QueSense---AI-powered-customer-ticketing.git
   cd QueSense---AI-powered-customer-ticketing
   npm install
   ```

2. **Update webhook URLs**
   
   In `services/geminiService.ts`, update these lines with your webhook URLs:
   ```typescript
   const ANALYZE_TICKET_URL = 'https://your-n8n.app.n8n.cloud/webhook/analyse-ticket';
   const GENERATE_DRAFT_URL = 'https://your-n8n.app.n8n.cloud/webhook/generate-draft';
   const GENERATE_CHAT_REPLY_URL = 'https://your-n8n.app.n8n.cloud/webhook/generate-chat-reply';
   ```

3. **Run locally**
   ```bash
   npm run dev
   ```

4. **Test**
   - Click on any ticket → AI Analysis should appear
   - Draft email should generate
   - Go to Inbox → Click sparkle icon → Chat reply should appear

---

## 🎓 Problems I Hit and How I Fixed Them

| Problem | Fix |
|---------|-----|
| Frontend was calling Gemini directly (API key exposed) | Replaced with n8n webhook calls |
| Webhook data was nested inside `body` object | Changed AI Agent prompts from `$json.subject` to `$json.body.subject` |
| AI output was a JSON string, not parsed object | Added Code node with `JSON.parse()` |
| n8n returned array `[{...}]` but frontend expected object `{...}` | Changed Respond to Webhook to "First Entry Only" |
| Sparkle button showed "could not generate reply" | Fixed array unwrapping in frontend service file |

---

## 📂 Files in This Repo

```
QueSense---AI-powered-customer-ticketing/
├── src/
│   ├── components/           # React components
│   ├── services/
│   │   └── geminiService.ts  # Webhook calls (renamed from original)
│   ├── constants.ts          # Mock data
│   ├── types.ts              # TypeScript types
│   └── App.tsx               # Main app
├── workflows/
│   ├── ticket_analysis.json  # n8n workflow
│   ├── reply_draft.json      # n8n workflow
│   └── chat_reply.json       # n8n workflow
├── package.json
├── .gitignore
└── README.md
```

---

## 🔄 Ways to Customise

- **Different AI model**: Swap OpenAI for Claude or Gemini in the AI Agent nodes
- **Different tone**: Edit the system prompts in each workflow
- **Add more context**: Expand the knowledge base in the Reply Draft workflow
- **Connect to real CRM**: Add HubSpot or Zendesk nodes after the AI processing
- **Add Slack alerts**: Notify team when high-priority tickets come in

---

## 🤝 Connect

**Built by:** Sai Medicherla

**Links:**
- 🌐 Portfolio: [linkedin-replacer](https://linkedin-replacer-127790892770.us-west1.run.app/)
- 🐦 X/Twitter: [@mscb160798](https://x.com/mscb160798)
- 💻 GitHub: [@saicbm98](https://github.com/saicbm98)
- 💼 Wellfound: [Sai Medicherla](https://wellfound.com/u/sai-medicherla)

**Looking for:** AI Operations, Automation Engineering, Product Operations

**Available:** Now

---

## 📜 Licence

MIT — use it however you want.

---

⭐ **If this helped, give it a star!**
