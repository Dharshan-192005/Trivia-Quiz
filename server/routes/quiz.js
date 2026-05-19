const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Category maps
const categoryNames = {
  '9': 'General Knowledge',
  '17': 'Science & Nature',
  '18': 'Computers & Technology',
  '21': 'Sports',
  '22': 'Geography',
  '23': 'History'
};

// Helper function to decode HTML entities commonly returned by OpenTDB
function decodeHTML(html) {
  if (!html) return '';
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&eacute;/g, 'é')
    .replace(/&Oslash;/g, 'Ø')
    .replace(/&oacute;/g, 'ó')
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&ndash;/g, '-')
    .replace(/&mdash;/g, '-')
    .replace(/&deg;/g, '°')
    .replace(/&micro;/g, 'µ');
}

// Helper to shuffle an array
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Simple middleware to verify token
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Token is not valid' });
  }
};

// GET /api/quiz/generate
router.get('/generate', auth, async (req, res) => {
  const { category, difficulty } = req.query;
  const categoryName = categoryNames[category] || 'General Knowledge';
  const selectedDifficulty = difficulty || 'medium';
  
  const geminiKey = process.env.GEMINI_API_KEY;

  try {
    console.log(`[Quiz] Attempting Gemini question generation for Category: ${categoryName}, Difficulty: ${selectedDifficulty}`);
    
    // Generate unique questions every time by passing a random seed and asking for unique sub-topics
    const randomSeed = Math.random().toString(36).substring(7);
    const prompt = `Generate exactly 10 highly engaging multiple-choice trivia questions for the category '${categoryName}' and difficulty level '${selectedDifficulty}'.
To ensure absolute variety, choose a completely unpredictable set of diverse sub-topics. Incorporate random seed token: '${randomSeed}'.
Each question must be a unique object containing:
- 'question': a string representing the question text.
- 'options': an array of exactly 4 strings representing the choice options.
- 'correct': a string matching exactly one of the options in the options array.
- 'explanation': a short sentence explaining why it is correct.
Respond with a strictly formatted JSON array containing exactly these properties. Return only the raw JSON array.`;

    const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!apiResponse.ok) {
      throw new Error(`Gemini API returned error code ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    const jsonText = data.candidates[0].content.parts[0].text;
    
    // Parse the generated questions JSON
    const parsedQuestions = JSON.parse(jsonText);

    // Validate that we got a valid array
    if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
      console.log(`[Quiz] Successfully generated 10 dynamic questions via Gemini LLM!`);
      return res.json(parsedQuestions);
    } else {
      throw new Error('Gemini did not return a valid questions array');
    }

  } catch (err) {
    console.warn(`[Quiz] Gemini call failed/unauthorized (Reason: ${err.message}). Activating public OpenTDB API fallback...`);
    
    try {
      // Map 'advanced' difficulty back to OpenTDB's 'hard' if needed
      const openTdbDiff = selectedDifficulty === 'advanced' ? 'hard' : selectedDifficulty;
      
      let url = `https://opentdb.com/api.php?amount=10&category=${category}&type=multiple`;
      if (openTdbDiff !== 'mixed') {
        url += `&difficulty=${openTdbDiff}`;
      }

      console.log(`[Quiz] Fetching dynamic questions from OpenTDB: ${url}`);
      const tdbResponse = await fetch(url);
      
      if (!tdbResponse.ok) {
        throw new Error(`OpenTDB error: ${tdbResponse.statusText}`);
      }

      const tdbData = await tdbResponse.json();

      if (tdbData.results && tdbData.results.length > 0) {
        // Map OpenTDB results to our unified dynamic format!
        const mappedQuestions = tdbData.results.map((q) => {
          const correctAns = decodeHTML(q.correct_answer);
          const incorrectAns = q.incorrect_answers.map(decodeHTML);
          const options = shuffleArray([correctAns, ...incorrectAns]);

          return {
            question: decodeHTML(q.question),
            options,
            correct: correctAns,
            explanation: `This is a verified live ${categoryName} question sourced dynamically from the global Open Trivia index.`
          };
        });

        console.log(`[Quiz] Successfully loaded ${mappedQuestions.length} unique questions dynamically from OpenTDB!`);
        return res.json(mappedQuestions);
      } else {
        throw new Error('OpenTDB returned no results');
      }

    } catch (tdbErr) {
      console.error('[Quiz] OpenTDB fallback failed as well, serving hardcoded backups...', tdbErr.message);
      
      // Serve a local set of diverse questions as the absolute emergency fallback
      const emergencyPool = [
        { question: "Which of the following is the standard port for HTTPS communication?", correct: "443", options: ["80", "8080", "443", "22"], explanation: "Port 443 is designated for secure web browser communication." },
        { question: "What does CPU stand for?", correct: "Central Processing Unit", options: ["Central Process Unit", "Computer Processing Unit", "Central Processing Unit", "Central Processor Utility"], explanation: "The CPU executes commands and runs instructions for computing systems." },
        { question: "What is the powerhouse of the cell?", correct: "Mitochondria", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi Apparatus"], explanation: "Mitochondria generate most of the cell's supply of ATP, used as a source of chemical energy." },
        { question: "Which year did World War II end?", correct: "1945", options: ["1943", "1944", "1945", "1946"], explanation: "World War II officially concluded with the signing of surrender documents in 1945." }
      ];
      
      res.json(emergencyPool);
    }
  }
});

module.exports = router;
