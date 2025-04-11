import OpenAI from 'openai';
import BUILDING_STANDARDS from '../data/buildingStandards.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function checkOpenAICompliance(text) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Updated to latest model
      messages: [
        {
          role: "system",
          content: `Analyze architectural plans against these standards: ${JSON.stringify(BUILDING_STANDARDS)}. 
                    Respond ONLY with compliance issues in this format: 
                    [Issue#] [Standard] - [Description]`
        },
        {
          role: "applicant",
          content: `DOCUMENT EXCERPT:\n${text.substring(0, 3500)}` // Reduced context window
        }
      ],
      temperature: 0.2, // Added for more deterministic responses
      max_tokens: 800
    });

    return parseAIResponse(response.choices[0]?.message?.content || '');
  } catch (error) {
    console.error('OpenAI API error:', error);
    return ['Error using AI compliance checker. Falling back to rule-based checks only.'];
  }
}

function parseAIResponse(response) {
  const issues = [];
  const lines = response.split('\n');
  
  for (const line of lines) {
    if (/^\d+\.\s*\[.+\]:/.test(line)) {
      issues.push(line.trim());
    }
  }
  
  return issues;
};

