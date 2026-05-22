import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log('Gemini API client initialized successfully for server-side proxy.');
  } catch (error) {
    console.error('Failed to initialize Gemini API Client:', error);
  }
} else {
  console.log('No GEMINI_API_KEY found in process.env. Server will run in high-fidelity simulated reasoning mode.');
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    apiConnected: !!ai, 
    time: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV || 'development'
  });
});

// Process prompts using the Gemini model with structured output tags for thinking steps.
app.post('/api/chat', async (req, res) => {
  const { message, history, systemPrompt, agentName, activeModel } = req.body;

  const resolvedModel = activeModel === 'gemma-local' || activeModel === 'llama-local' 
    ? 'gemini-3.1-flash-lite' // fallback for local dry run
    : 'gemini-3.5-flash';

  const defaultSystemPrompt = systemPrompt || 'You are the core intelligence of OwnWorks, a futuristic AI workforce operating system. Help the user deploy agents, connect workflows, or answer questions.';
  
  const instruction = `${defaultSystemPrompt}
CRITICAL OUTPUT INSTRUCTION: Before providing your response, you MUST output your step-by-step reasoning or internal trace planning inside a '<thinking>' block as a list of actions or logical tasks (separated by newline). 
For example:
<thinking>
Querying knowledge base for system status
Determining agent capabilities for Lead Outreach
Preparing tools: Gmail Outreach, ScoutPro
</thinking>
Hello, I have initiated the requested actions...

Always structure your thought process. Make sure to keep the '<thinking>' tag at the very beginning of your response.`;

  if (ai) {
    try {
      // Build message payload
      const contentsList: any[] = [];
      
      // Map history if provided to keep chat context
      if (history && Array.isArray(history)) {
        history.forEach((msg: any) => {
          contentsList.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          });
        });
      }
      
      // Push final message
      contentsList.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: resolvedModel as any,
        contents: contentsList,
        config: {
          systemInstruction: instruction,
          temperature: 0.7,
        }
      });

      const rawText = response.text || '';
      
      // Parse out '<thinking>' tags
      let cleanText = rawText;
      let thinkingSteps: string[] = [];
      
      const thinkingRegex = /<thinking>([\s\S]*?)<\/thinking>/i;
      const match = rawText.match(thinkingRegex);
      if (match) {
        thinkingSteps = match[1]
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);
        cleanText = rawText.replace(thinkingRegex, '').trim();
      } else {
        // Fallback steps if the AI forgot the tags
        thinkingSteps = [
          'Initializing OwnWorks neural bridge...',
          'Orchestrating agent collaboration routing...',
          'Synthesizing workspace action response'
        ];
      }

      res.json({
        content: cleanText,
        thinkingSteps,
        timestamp: new Date().toISOString(),
        modelUsed: resolvedModel,
        apiReal: true
      });

    } catch (error: any) {
      console.error('Gemini API execution error:', error);
      res.status(500).json({ 
        error: 'Engine error', 
        message: error.message || 'An error occurred during Gemini processing.' 
      });
    }
  } else {
    // Elegant simulation if no API Key is set, so the app remains perfect and responsive!
    setTimeout(() => {
      let thinkingSteps: string[] = [
        'Checking secure environment keyrings...',
        'Resolving offline execution policy settings...',
        'Orchestrating local model parameters for OwnWorks engine...'
      ];
      
      let responseContent = '';
      const promptLower = message.toLowerCase();

      if (promptLower.includes('agent') || promptLower.includes('create')) {
        thinkingSteps.push('Parsing target agent roles: ScoutPro and CopyScribe');
        thinkingSteps.push('Creating system prompt guidelines & securing memory buffers');
        responseContent = `I have updated the orchestrator registers. I recommend deploying **ScoutPro** to scan outbound targets, coupled with **CopyScribe** running on cloud endpoints to generate customized email drafts.

*(Note: OwnWorks is running in Demonstration Mode because GEMINI_API_KEY is not defined. You can connect keys under Settings > API Secrets.)*`;
      } else if (promptLower.includes('workflow') || promptLower.includes('n8n')) {
        thinkingSteps.push('Interrogating visual node connectors for workspace');
        thinkingSteps.push('Verifying webhook triggers & pipeline dispatch thresholds');
        responseContent = `The **Lead Enrichment Campaign** workflow trigger is armed and listening. Live telemetry indicates latency of 45ms. You can drag and drop nodes or trigger a manual execution to test.`;
      } else {
        thinkingSteps.push('Parsing general workspace command queries');
        thinkingSteps.push('Retrieving timeline history from memory engine vectors');
        responseContent = `Welcome back to the OwnWorks Command Center. I am ready to assist you. You can build customized agents, assemble n8n-style visual triggers, and run private security scans locally. Let me know what you want to perform!`;
      }

      res.json({
        content: responseContent,
        thinkingSteps,
        timestamp: new Date().toISOString(),
        modelUsed: 'mock-gemma-local',
        apiReal: false
      });
    }, 1200);
  }
});

// Start server with Vite middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OwnWorks OS background engine online. Streaming to http://localhost:${PORT}`);
  });
}

startServer();
