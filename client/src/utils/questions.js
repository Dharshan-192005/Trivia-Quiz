export const fallbackQuestions = [
  {
    question: "What is the capital of France?",
    correct: "Paris",
    options: ["London", "Berlin", "Paris", "Madrid"]
  },
  {
    question: "Which planet is known as the Red Planet?",
    correct: "Mars",
    options: ["Venus", "Mars", "Jupiter", "Saturn"]
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    correct: "William Shakespeare",
    options: ["Charles Dickens", "Jane Austen", "William Shakespeare", "Leo Tolstoy"]
  },
  {
    question: "What is the largest ocean on Earth?",
    correct: "Pacific Ocean",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"]
  },
  {
    question: "How many sides does a hexagon have?",
    correct: "6",
    options: ["5", "6", "7", "8"]
  },
  {
    question: "What is the chemical symbol for Gold?",
    correct: "Au",
    options: ["Go", "Gd", "Au", "Ag"]
  },
  {
    question: "Which country is the largest by area?",
    correct: "Russia",
    options: ["China", "Canada", "USA", "Russia"]
  },
  {
    question: "Who painted the Mona Lisa?",
    correct: "Leonardo da Vinci",
    options: ["Michelangelo", "Raphael", "Leonardo da Vinci", "Donatello"]
  },
  {
    question: "What is the speed of light (approx)?",
    correct: "300,000 km/s",
    options: ["150,000 km/s", "300,000 km/s", "450,000 km/s", "600,000 km/s"]
  },
  {
    question: "Which element has the atomic number 1?",
    correct: "Hydrogen",
    options: ["Helium", "Oxygen", "Hydrogen", "Carbon"]
  },
  {
    question: "What is the longest river in the world?",
    correct: "Nile",
    options: ["Amazon", "Yangtze", "Mississippi", "Nile"]
  },
  {
    question: "How many bones are in the adult human body?",
    correct: "206",
    options: ["196", "206", "216", "226"]
  },
  {
    question: "Which year did World War II end?",
    correct: "1945",
    options: ["1943", "1944", "1945", "1946"]
  },
  {
    question: "What is the smallest planet in our solar system?",
    correct: "Mercury",
    options: ["Mercury", "Mars", "Venus", "Pluto"]
  },
  {
    question: "Who invented the telephone?",
    correct: "Alexander Graham Bell",
    options: ["Thomas Edison", "Nikola Tesla", "Alexander Graham Bell", "Albert Einstein"]
  },
  {
    question: "What is the currency of Japan?",
    correct: "Yen",
    options: ["Won", "Yuan", "Yen", "Baht"]
  },
  {
    question: "Which animal is known as the King of the Jungle?",
    correct: "Lion",
    options: ["Tiger", "Elephant", "Lion", "Leopard"]
  },
  {
    question: "How many planets are in our solar system?",
    correct: "8",
    options: ["7", "8", "9", "10"]
  },
  {
    question: "What is the hardest natural substance on Earth?",
    correct: "Diamond",
    options: ["Quartz", "Titanium", "Diamond", "Sapphire"]
  },
  {
    question: "Which country invented pizza?",
    correct: "Italy",
    options: ["Greece", "France", "Italy", "Spain"]
  },
  {
    question: "What is the square root of 144?",
    correct: "12",
    options: ["11", "12", "13", "14"]
  },
  {
    question: "Which language has the most native speakers in the world?",
    correct: "Mandarin Chinese",
    options: ["English", "Spanish", "Hindi", "Mandarin Chinese"]
  },
  {
    question: "How many continents are on Earth?",
    correct: "7",
    options: ["5", "6", "7", "8"]
  },
  {
    question: "What is the main ingredient in guacamole?",
    correct: "Avocado",
    options: ["Tomato", "Cucumber", "Avocado", "Spinach"]
  },
  {
    question: "Who was the first person to walk on the Moon?",
    correct: "Neil Armstrong",
    options: ["Buzz Aldrin", "Yuri Gagarin", "Neil Armstrong", "John Glenn"]
  },
  {
    question: "Which gas do plants absorb during photosynthesis?",
    correct: "Carbon Dioxide",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"]
  },
  {
    question: "What is the national sport of Canada?",
    correct: "Ice Hockey",
    options: ["Basketball", "Baseball", "Ice Hockey", "Lacrosse"]
  },
  {
    question: "How many strings does a standard guitar have?",
    correct: "6",
    options: ["4", "5", "6", "7"]
  },
  {
    question: "Which ocean is the deepest?",
    correct: "Pacific Ocean",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"]
  },
  {
    question: "What is the most spoken language in Brazil?",
    correct: "Portuguese",
    options: ["Spanish", "Portuguese", "French", "English"]
  },
  {
    question: "Which organ produces insulin?",
    correct: "Pancreas",
    options: ["Liver", "Kidney", "Heart", "Pancreas"]
  },
  {
    question: "What is the tallest mountain in the world?",
    correct: "Mount Everest",
    options: ["K2", "Kangchenjunga", "Mount Everest", "Lhotse"]
  },
  {
    question: "Who invented the light bulb?",
    correct: "Thomas Edison",
    options: ["Nikola Tesla", "Thomas Edison", "Benjamin Franklin", "James Watt"]
  },
  {
    question: "What is the chemical formula for water?",
    correct: "H2O",
    options: ["HO2", "H2O2", "H2O", "OH"]
  },
  {
    question: "Which planet has the most moons?",
    correct: "Saturn",
    options: ["Jupiter", "Saturn", "Uranus", "Neptune"]
  },
  {
    question: "What year did the Titanic sink?",
    correct: "1912",
    options: ["1910", "1911", "1912", "1913"]
  },
  {
    question: "How many colors are in a rainbow?",
    correct: "7",
    options: ["5", "6", "7", "8"]
  },
  {
    question: "What is the capital of Australia?",
    correct: "Canberra",
    options: ["Sydney", "Melbourne", "Brisbane", "Canberra"]
  },
  {
    question: "Which scientist developed the theory of relativity?",
    correct: "Albert Einstein",
    options: ["Isaac Newton", "Galileo Galilei", "Nikola Tesla", "Albert Einstein"]
  },
  {
    question: "What is the largest continent?",
    correct: "Asia",
    options: ["Africa", "Asia", "North America", "Europe"]
  }
];

export function getRandomQuestions(count = 10) {
  const shuffled = [...fallbackQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
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
        question: "Which movie first brings the Avengers together as a team?",
        correct: "The Avengers",
        options: ["Iron Man 2", "Captain America: The First Avenger", "The Avengers", "Thor"],
        explanation: "The Avengers is the first MCU film where the core team assembles."
      },
      {
        question: "Who is revealed as Peter Quill's father in Guardians of the Galaxy Vol. 2?",
        correct: "Ego",
        options: ["Yondu", "Ego", "Thanos", "The Collector"],
        explanation: "Ego the Living Planet is revealed as Peter Quill's biological father."
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
        question: "Which operator checks both value and type equality?",
        correct: "===",
        options: ["==", "===", "=", "!="],
        explanation: "The strict equality operator === compares both type and value."
      }
    ]
  }
];

function normalizeTopic(topic = '') {
  return topic.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export function getTopicFallbackQuestions(topic, count = 10) {
  const normalized = normalizeTopic(topic);
  const pool = topicFallbackPools.find(entry =>
    entry.match.some(alias => normalized.includes(normalizeTopic(alias)))
  );

  if (!pool) return null;
  return [...pool.questions].sort(() => Math.random() - 0.5).slice(0, count);
}
