// prompts.js

/**
 * Generates a prompt for the AI to produce technical interview questions and answers.
 * Ensures the AI strictly returns a valid JSON array.
 */
const questionAnswerPrompt = (
  role,
  experience,
  topicsToFocus,
  numberOfQuestions
) => `
You are an expert technical interviewer and educator.

Your task is to generate high-quality interview preparation content.

---

ROLE:
${role}

EXPERIENCE LEVEL:
${experience} years

TOPICS TO FOCUS:
${topicsToFocus}

NUMBER OF QUESTIONS:
${numberOfQuestions}

---

OUTPUT REQUIREMENTS:

Return ONLY a valid JSON array.

Each item must follow EXACTLY this structure:

[
  {
    "question": "string",
    "answer": "string"
  }
]

---

STRICT RULES (VERY IMPORTANT):

1. Output must be valid JSON only (no markdown, no explanation).
2. Do NOT include backticks, headings, or extra text.
3. Use double quotes only.
4. No trailing commas.
5. Escape new lines using \\n only.
6. Keep answers clear, structured, and beginner-friendly.
7. If code is included:
   - write it as plain text inside the string
   - use \\n for line breaks
   - DO NOT use triple backticks
8. Do not number questions inside output.
9. Avoid overly long answers; keep them interview-focused.

---

QUALITY RULES:

- Questions should be practical and commonly asked in interviews.
- Answers should be simple, correct, and structured.
- Include code examples only when necessary.

---

EXAMPLE OUTPUT:

[
  {
    "question": "What is React?",
    "answer": "React is a JavaScript library used for building user interfaces.\\nIt uses components and a virtual DOM for efficient rendering."
  }
]
`;

  
/**
 * Generates a prompt for the AI to provide a detailed explanation of a single interview question.
 * Ensures the AI returns a strictly valid JSON object with title and explanation.
 */
const conceptExplainPrompt = (question) => `
You are an expert software educator.

Explain the given topic in a beginner-friendly but technically correct way.

---

TOPIC:
${question}

---

OUTPUT FORMAT:

Return ONLY a valid JSON object.

Structure:

{
  "title": "string",
  "explanation": "string (markdown allowed)"
}

---

STRICT RULES:

1. Output ONLY valid JSON (no extra text).
2. No markdown outside the JSON.
3. Use double quotes only.
4. Escape all newlines as \\n.
5. Escape all double quotes inside strings as \\".
6. Keep explanation structured and easy to understand.

---

EXPLANATION RULES:

Inside "explanation":

- You MAY use markdown:
  - ### headings
  - bullet points
- Code blocks must be inside the string using:
  \`\`\`language
  code
  \`\`\`

BUT IMPORTANT:
- Everything must remain inside a valid JSON string
- Escape correctly

---

EXAMPLE OUTPUT:

{
  "title": "React Basics",
  "explanation": "### What is React?\\nReact is a JavaScript library...\\n\\n### Example:\\n\`\`\`jsx\\nconst App = () => { return <div>Hello</div>; }\\n\`\`\`"
}
`;

module.exports = { questionAnswerPrompt, conceptExplainPrompt };