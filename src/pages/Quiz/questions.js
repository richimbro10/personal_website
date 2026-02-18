const questions = [
  {
    id: 1,
    question: "What is my middle name?",
    type: "text",
    correct: "Robert"
  },
  {
    id: 2,
    question: "What model is my car?",
    choices: [
      "Hyundai Elantra",
      "Hyundai Sonata",
      "Hyundai Tuscon",
      "Hyunda Ellana"
    ],
    correct: 0
  },
  {
    id: 3,
    question: "Which country have I NOT been to?",
    choices: [
      "Puerto Rico",
      "Canada",
      "Dominican Republic",
      "Mexico"
    ],
    correct: 1
  },
  {
    id: 4,
    question: "What is my favorite animal? (absolute layup)",
    type: "text",
    correct: "Turtle"
  },
  {
    id: 5,
    question: "What is my all-time favorite song? (title)",
    type: "text",
    correct: "Fine By Me"
  },
  {
    id: 6,
    question: "Rich is a black belt in what?",
    choices: [
      "Mixed Martia Arts",
      "Karate",
      "Taekwondo",
      "Jiu Jitsu"
    ],
    correct: 2
  },
  {
    id: 7,
    question: "What is my lowest score ever in golf?",
    type: "number",
    correct: 84,
    tolerance: 2
  },
  {
    id: 8,
    question: "What is my best score ever in bowling?",
    type: "number",
    correct: 267,
    tolerance: 5
  },
  {
    id: 9,
    question: "What former Yankees reliever do I have autograph of?",
    choices: [
      "Aroldis Chapman",
      "Dellin Betances",
      "Chad Green",
      "David Robertson"
    ],
    correct: 1
  }
];

export default questions;
