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

function normalizeTopic(topic = '') {
  return topic.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

const topicFallbackPools = [
  {
    match: ['marvel cinematic universe', 'mcu', 'marvel films', 'marvel movies', 'marvel'],
    questions: [
      {
        question: "In the Marvel Cinematic Universe, what is the name of Tony Stark's AI assistant before FRIDAY?",
        correct: "JARVIS",
        options: ["EDITH", "JARVIS", "ULTRON", "KAREN"],
        explanation: "JARVIS is Tony Stark's original AI assistant before FRIDAY is introduced."
      },
      {
        question: "Which Infinity Stone is hidden inside Loki's scepter in the MCU?",
        correct: "Mind Stone",
        options: ["Space Stone", "Mind Stone", "Reality Stone", "Power Stone"],
        explanation: "The Mind Stone is revealed to be inside Loki's scepter."
      },
      {
        question: "What metal is Captain America's shield primarily made from in the MCU?",
        correct: "Vibranium",
        options: ["Adamantium", "Vibranium", "Titanium", "Uru"],
        explanation: "Captain America's shield is made from vibranium from Wakanda."
      },
      {
        question: "Who becomes the Black Panther after King T'Chaka's death?",
        correct: "T'Challa",
        options: ["M'Baku", "Killmonger", "T'Challa", "W'Kabi"],
        explanation: "T'Challa becomes king of Wakanda and the Black Panther."
      },
      {
        question: "Which movie first brings the Avengers together as a team?",
        correct: "The Avengers",
        options: ["Iron Man 2", "Captain America: The First Avenger", "The Avengers", "Thor"],
        explanation: "The Avengers is the first MCU film where the core team assembles."
      },
      {
        question: "What is the name of Thor's hammer before it is destroyed by Hela?",
        correct: "Mjolnir",
        options: ["Stormbreaker", "Gungnir", "Mjolnir", "Hofund"],
        explanation: "Mjolnir is Thor's original enchanted hammer."
      },
      {
        question: "Which Guardian of the Galaxy repeatedly says, 'I am Groot'?",
        correct: "Groot",
        options: ["Rocket", "Drax", "Groot", "Star-Lord"],
        explanation: "Groot's limited vocabulary is one of his signature MCU traits."
      },
      {
        question: "Who is revealed as Peter Quill's father in Guardians of the Galaxy Vol. 2?",
        correct: "Ego",
        options: ["Yondu", "Ego", "Thanos", "The Collector"],
        explanation: "Ego the Living Planet is revealed as Peter Quill's biological father."
      },
      {
        question: "Which character opens portals to bring heroes back in Avengers: Endgame?",
        correct: "Doctor Strange",
        options: ["Wong", "Doctor Strange", "Loki", "Scarlet Witch"],
        explanation: "Doctor Strange and the sorcerers open portals during the final battle."
      },
      {
        question: "What phrase does Steve Rogers say before the final battle charge in Avengers: Endgame?",
        correct: "Avengers, assemble",
        options: ["Avengers, unite", "Avengers, assemble", "Heroes, rise", "For Earth"],
        explanation: "Steve Rogers finally says the iconic phrase 'Avengers, assemble.'"
      },
      {
        question: "Which organization does Nick Fury lead in the early MCU?",
        correct: "S.H.I.E.L.D.",
        options: ["HYDRA", "S.W.O.R.D.", "S.H.I.E.L.D.", "A.I.M."],
        explanation: "Nick Fury is the director of S.H.I.E.L.D. in the early MCU."
      },
      {
        question: "Who trains Stephen Strange in the mystic arts?",
        correct: "The Ancient One",
        options: ["Wong", "Mordo", "The Ancient One", "Agatha Harkness"],
        explanation: "The Ancient One trains Stephen Strange at Kamar-Taj."
      }
    ]
  },
  {
    match: ['javascript programming', 'javascript', 'js programming', 'js'],
    questions: [
      {
        question: "Which keyword declares a block-scoped variable in JavaScript?",
        correct: "let",
        options: ["var", "let", "define", "global"],
        explanation: "The let keyword declares a variable scoped to the nearest block."
      },
      {
        question: "What does the Array.prototype.map() method return?",
        correct: "A new array",
        options: ["The original array", "A new array", "A boolean", "A single number"],
        explanation: "map() creates and returns a new array with transformed values."
      },
      {
        question: "Which value is returned by typeof null in JavaScript?",
        correct: "object",
        options: ["null", "undefined", "object", "boolean"],
        explanation: "typeof null returns object because of a long-standing JavaScript behavior."
      },
      {
        question: "Which syntax creates an arrow function?",
        correct: "() => {}",
        options: ["function => {}", "() => {}", "func() {}", "lambda () {}"],
        explanation: "Arrow functions use the => syntax."
      },
      {
        question: "What is a Promise used for in JavaScript?",
        correct: "Handling asynchronous results",
        options: ["Styling HTML", "Handling asynchronous results", "Creating database tables", "Compiling CSS"],
        explanation: "Promises represent asynchronous work that may resolve or reject later."
      },
      {
        question: "Which method converts a JSON string into a JavaScript object?",
        correct: "JSON.parse()",
        options: ["JSON.stringify()", "JSON.parse()", "Object.fromJSON()", "parse.JSON()"],
        explanation: "JSON.parse() parses a JSON string into a JavaScript value."
      },
      {
        question: "Which operator checks both value and type equality?",
        correct: "===",
        options: ["==", "===", "=", "!="],
        explanation: "The strict equality operator === compares both type and value."
      },
      {
        question: "What does event.preventDefault() do?",
        correct: "Stops the browser's default action",
        options: ["Deletes an event", "Stops all JavaScript", "Stops the browser's default action", "Reloads the page"],
        explanation: "preventDefault() cancels the default browser behavior for an event."
      },
      {
        question: "Which JavaScript feature lets a function remember variables from its outer scope?",
        correct: "Closure",
        options: ["Closure", "Prototype", "Hoisting", "Mutation"],
        explanation: "A closure preserves access to variables from the scope where it was created."
      },
      {
        question: "Which method adds an item to the end of an array?",
        correct: "push()",
        options: ["pop()", "shift()", "push()", "slice()"],
        explanation: "push() appends one or more elements to the end of an array."
      }
    ]
  }
];

function getTopicFallbackQuestions(topic, limitNum) {
  const normalized = normalizeTopic(topic);
  const pool = topicFallbackPools.find(entry =>
    entry.match.some(alias => normalized.includes(normalizeTopic(alias)))
  );

  if (!pool) {
    return null;
  }

  return shuffleArray(pool.questions).slice(0, limitNum);
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
  const { category, difficulty, limit, topic } = req.query;
  const limitNum = parseInt(limit) || 10;
  const selectedDifficulty = difficulty || 'medium';
  const categoryName = topic ? topic : (categoryNames[category] || 'General Knowledge');
  
  const geminiKey = process.env.GEMINI_API_KEY;

  try {
    console.log(`[Quiz] Attempting Gemini question generation for Category/Topic: ${categoryName}, Difficulty: ${selectedDifficulty}, Limit: ${limitNum}`);
    
    // Generate unique questions every time by passing a random seed and asking for unique sub-topics
    const randomSeed = Math.random().toString(36).substring(7);
    const prompt = `Generate exactly ${limitNum} highly engaging multiple-choice trivia questions for the category/topic '${categoryName}' and difficulty level '${selectedDifficulty}'.
To ensure absolute variety, choose a completely unpredictable set of diverse sub-topics. Incorporate random seed token: '${randomSeed}'.
Each question must be a unique object containing:
- 'question': a string representing the question text.
- 'options': an array of exactly 4 strings representing the choice options.
- 'correct': a string matching exactly one of the options in the options array.
- 'explanation': a short sentence explaining why it is correct.
Respond with a strictly formatted JSON array containing exactly these properties. Return only the raw JSON array.`;

    const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`, {
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
      console.log(`[Quiz] Successfully generated ${parsedQuestions.length} dynamic questions via Gemini LLM!`);
      return res.json(parsedQuestions);
    } else {
      throw new Error('Gemini did not return a valid questions array');
    }

  } catch (err) {
    console.warn(`[Quiz] Gemini call failed/unauthorized (Reason: ${err.message}). Activating public OpenTDB API fallback...`);

    if (topic) {
      const topicFallback = getTopicFallbackQuestions(topic, limitNum);
      if (topicFallback) {
        console.log(`[Quiz] Serving curated custom-topic fallback questions for: ${topic}`);
        return res.json(topicFallback);
      }

      return res.status(502).json({
        message: `Could not generate custom questions for "${topic}". Check the Gemini API key or try a built-in category.`
      });
    }
    
    try {
      // Map 'advanced' difficulty back to OpenTDB's 'hard' if needed
      const openTdbDiff = selectedDifficulty === 'advanced' ? 'hard' : selectedDifficulty;
      const targetCategory = category || '9';
      
      let url = `https://opentdb.com/api.php?amount=${limitNum}&category=${targetCategory}&type=multiple`;
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
      
      // Slice emergency pool to limitNum
      res.json(emergencyPool.slice(0, limitNum));
    }
  }
});

module.exports = router;
