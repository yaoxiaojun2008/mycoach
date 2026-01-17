
import { Article } from '../types';

const getEnv = (key: string) => {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
        return process.env[key];
    }
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
        return (import.meta as any).env[`VITE_${key}`] || (import.meta as any).env[key];
    }
    return '';
};

const DEEPSEEK_API_KEY = getEnv('DEEPSEEK_API_KEY');
const API_URL = 'https://api.deepseek.com/chat/completions';

const callDeepSeek = async (systemPrompt: string, userPrompt: string) => {
    if (!DEEPSEEK_API_KEY) throw new Error("Missing API Key");

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ]
        })
    });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    const data = await response.json();
    return data.choices[0].message.content;
};

// --- PHASE 1: STYLE & TOPIC ANALYSIS ---
export const analyzeStyle = async (writingSample: string) => {
    const systemPrompt = "You are an expert writing style analyst. Provide clear, structured analysis.";
    const userPrompt = `Analyze this writing sample for style, topic, tone, and genre:

WRITING SAMPLE:
---
${writingSample}
---

Provide response in TWO PARTS:

PART 1 - SUMMARY (2-3 sentences): Briefly describe the overall writing style, main topic, tone, and intended audience.

PART 2 - DETAILED ANALYSIS: Provide detailed analysis covering:
1. Writing style (formal, informal, academic, etc.)
2. Topic and subject matter
3. Overall tone
4. Genre and format
5. Target audience

CRITICAL: Be specific and provide clear examples from the text, using exact quotes where possible.`;

    try {
        const result = await callDeepSeek(systemPrompt, userPrompt);
        return result;
    } catch (error) {
        console.error("Style Analysis failed", error);
        return "Failed to analyze style. Please try again.";
    }
};

// --- PHASE 2: EVALUATE STRENGTHS & WEAKNESSES ---
export const evaluateContent = async (writingSample: string) => {
    const systemPrompt = "You are a professional writing evaluator. Be specific with examples.";
    const userPrompt = `Analyze this writing for strengths and weaknesses:

Analyze this writing for strengths and weaknesses.

CRITICAL DEFINITIONS:
- STRENGTH: Something done WELL that demonstrates writing skill. Must show quality, not just presence. For example:
    * "Uses vivid descriptive language: 'golden sunset'" is a strength
    * "Mentions the Arctic fox" is NOT a strength (just a topic choice)
    * "Uses quotation marks" is NOT a strength (using formatting is basic, not skilled use)
    * "Properly cites sources with author and date" is a strength
    * "Has quotation marks around a fact but no proper citation" is a WEAKNESS (attempted but failed)

- WEAKNESS: Something that hurts writing quality or is done incorrectly. Examples:
    * Grammatical errors: "he don't"
    * Missing citations or improper citations (quotes without source attribution)
    * Run-on sentences or fragments
    * Vague language or unsupported claims
    * Repetitive phrasing

- NOT STRENGTHS: Don't list neutral observations as strengths
    * Simply "uses facts" = neutral, not a strength
    * "mentions multiple sources" = neutral without assessing quality
    * "has an introduction" = expected, not a strength

WRITING:
---
${writingSample}
---

Provide response in TWO PARTS:

PART 1 - SUMMARY (2-3 sentences): Give an overall assessment focusing on what's done well vs. what needs fixing.

PART 2 - DETAILED FEEDBACK:

STRENGTHS (2-4 items maximum, only genuine quality):
For each strength:
- State the strength clearly
- Quote the specific text showing it (use exact quotes)
- Explain why this demonstrates writing skill

WEAKNESSES (2-5 items, be honest about problems):
For each weakness:
- State the weakness clearly
- Quote the specific problematic text
- Explain the impact on reader understanding

CONSTRAINT: Do NOT list neutral observations or attempts as strengths. If something is attempted but done incorrectly (like citations), mark it as a weakness.`;

    try {
        const result = await callDeepSeek(systemPrompt, userPrompt);
        return result;
    } catch (error) {
        console.error("Evaluation failed", error);
        return "Failed to evaluate content. Please try again.";
    }
};

// --- PHASE 3: GENERATE IMPROVEMENT SUGGESTIONS ---
export const suggestImprovements = async (writingSample: string) => {
    const systemPrompt = "You are an encouraging writing coach. Provide specific, actionable suggestions.";
    const userPrompt = `Based on this writing:

Based on this writing, provide specific improvement suggestions:

WRITING:
---
${writingSample}
---

CRITICAL REQUIREMENTS:
- Every suggestion MUST reference something specific from the actual text
- Do NOT give generic writing advice like "improve grammar" without specifying what
- Each suggestion must show: LOCATION (quote or sentence number), PROBLEM (what's wrong), SOLUTION (how to fix it)
- Suggestions should be prioritized by impact

Provide response in TWO PARTS:

PART 1 - SUMMARY (2-3 sentences): Identify the top 2-3 improvements that would have the biggest impact.

PART 2 - DETAILED IMPROVEMENT SUGGESTIONS (4-6 items only - prioritized):

For each suggestion, provide in this order:
1. LOCATION: Quote the specific problematic text or describe which sentence/paragraph
2. THE ISSUE: What's the problem with this exact text
3. IMPACT: Why this matters for reader understanding
4. SPECIFIC FIX: Rewrite or revise this exact part (show before → after)
5. WHY THIS WORKS: Explain the improvement

Example of GOOD suggestion:
    LOCATION: "he don't know"
    THE ISSUE: Subject-verb disagreement (plural subject requires "do" not "don't")
    IMPACT: Errors reduce reader confidence in the writer's authority
    SPECIFIC FIX: Change "don't" to "doesn't"
    WHY THIS WORKS: Correct grammar makes the sentence clear and professional

Example of BAD suggestion:
    "Improve grammar" - Too vague, doesn't reference actual text

CONSTRAINT: EVERY suggestion must point to specific words/phrases in the writing.`;

    try {
        const result = await callDeepSeek(systemPrompt, userPrompt);
        return result;
    } catch (error) {
        console.error("Improvement suggestion failed", error);
        return "Failed to generate suggestions. Please try again.";
    }
};

// --- PHASE 4: CREATE REFINED VERSION ---
export const refineContent = async (writingSample: string) => {
    const systemPrompt = "You are an expert editor. Maintain original voice while improving clarity, grammar, and flow.";
    const userPrompt = `Rewrite this writing, improving it while maintaining the original voice:

Rewrite this writing, improving it while maintaining the original voice and meaning:

ORIGINAL:
---
${writingSample}
---

REVISION PRIORITIES (in order):
1. Fix critical errors (grammar, subject-verb, spelling, missing citations)
2. Improve clarity (replace vague phrases with specific ones)
3. Enhance flow (improve sentence variety and connections)
4. Strengthen evidence (add or improve citations/examples)
5. Maintain student's original voice and intended message

Provide response in TWO PARTS:

PART 1 - SUMMARY OF CHANGES (3-4 sentences): List the specific improvements made and their impact on quality.

PART 2 - REFINED VERSION:
Create an improved version that:
- Fixes all grammar/spelling/citation errors
- Replaces vague language with specific examples
- Improves sentence variety and flow
- Keeps the student's original voice and message intact
- Remains authentic to their thinking (don't rewrite their ideas)

CONSTRAINT: Do NOT change the core message or add new ideas. Improve only the expression and correctness.

After the refined version, add a brief note (2-3 sentences) explaining the specific improvements made.`;

    try {
        const result = await callDeepSeek(systemPrompt, userPrompt);
        return result;
    } catch (error) {
        console.error("Refinement failed", error);
        return "Failed to refine content. Please try again.";
    }
};

// --- PHASE 5: FOLLOW-UP QUESTIONS ---
export const generateFollowUp = async (writingSample: string, styleAnalysis: string | null, contentEvaluation: string | null) => {
    const systemPrompt = "You are a thoughtful teacher. Generate personalized follow-up questions to deepen student understanding.";
    const userPrompt = `Based on the student's writing and the previous analysis (if available), generate 3-5 personalized follow-up questions.

WRITING:
---
${writingSample}
---

STYLE ANALYSIS (Context):
${styleAnalysis || "Not available"}

CONTENT EVALUATION (Context):
${contentEvaluation || "Not available"}

Generate a list of questions that:
1. Help the student understand their writing style/choices.
2. Encourage critical thinking about their vocabulary or structure.
3. Address specific weaknesses mentioned in the evaluation.
4. Are encouraging and educational.

Format as a simple numbered list with a brief explanation of the 'Goal' for each question.`;

    try {
        const result = await callDeepSeek(systemPrompt, userPrompt);
        return result;
    } catch (error) {
        console.error("Follow-up generation failed", error);
        return "Failed to generate follow-up questions. Please try again.";
    }
};
