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

Generate exactly ${numberOfQuestions} interview questions and answers.

Candidate Details:
- Role: ${role}
- Experience: ${experience} years
- Focus Topics: ${topicsToFocus}

Instructions:
- Questions should match the candidate experience level.
- Answers should be beginner-friendly and detailed.
- Keep answers concise but informative.
- If code is needed, include it as plain text inside the answer.
- Use \\n for line breaks inside strings.

IMPORTANT:
Return ONLY a valid JSON array.

JSON format:
[
  {
    "question": "Question here?",
    "answer": "Answer here."
  }
]

Strict Rules:
1. No markdown.
2. No triple backticks.
3. No explanations outside JSON.
4. Use only double quotes.
5. No trailing commas.
6. Return valid parsable JSON only.
`;

  
/**
 * Generates a prompt for the AI to provide a detailed explanation of a single interview question.
 * Ensures the AI returns a strictly valid JSON object with title and explanation.
 */
const conceptExplainPrompt = (question) => `
Explain this interview question for a beginner developer:

"${question}"

Return ONLY valid JSON object:

{
  "title": "Short title",
  "explanation": "Detailed markdown explanation"
}

Rules:
1. Return only JSON.
2. Explanation should use markdown.
3. Include examples if needed.
4. No text outside JSON.
`;

module.exports = { questionAnswerPrompt, conceptExplainPrompt };