// src/data/questions.js
// NOTE: image paths are relative (no leading slash) so they work on GitHub Pages.
export const QUESTION_BANK = {
  Communication: [
    {
      id: "c1",
      img: "images/avatars/kid1.svg",
      prompt: "Your friend says, 'Hi!' What should you do?",
      choices: ["Say 'Hi!' and smile", "Say nothing", "Turn around"],
      answerIndex: 0
    },
    {
      id: "c2",
      img: "images/avatars/kid2.svg",
      prompt: "You can’t open your lunchbox. What should you say?",
      choices: ["Help me, please.", "Go away.", "I don’t know."],
      answerIndex: 0
    },
    {
      id: "c3",
      img: "images/avatars/kid3.svg",
      prompt: "Someone asks, 'How are you?' What is a good reply?",
      choices: ["I’m fine, thank you!", "No talking.", "Walk away."],
      answerIndex: 0
    },
    {
      id: "c4",
      img: "images/avatars/kid4.svg",
      prompt: "You didn’t hear what your teacher said. What should you do?",
      choices: ["Can you say that again, please?", "Ignore it.", "Talk to a friend instead."],
      answerIndex: 0
    }
  ],

  Emotions: [
    {
      id: "e1",
      img: "images/avatars/kid5.svg",
      prompt: "Which face shows 'happy'?",
      choices: ["😊", "😢", "😡"],
      answerIndex: 0
    },
    {
      id: "e2",
      img: "images/avatars/kid6.svg",
      prompt: "You feel sad because playtime ended. What can you do?",
      choices: ["Take a deep breath and think about something fun.", "Yell at your teacher.", "Run away."],
      answerIndex: 0
    },
    {
      id: "e3",
      img: "images/avatars/kid1.svg",
      prompt: "You are scared of a loud sound. What can help you feel calm?",
      choices: ["Cover your ears and breathe slowly.", "Scream louder.", "Push someone."],
      answerIndex: 0
    },
    {
      id: "e4",
      img: "images/avatars/kid2.svg",
      prompt: "Your classmate looks sad. What should you do?",
      choices: ["Ask, 'Are you okay?'", "Laugh at them.", "Walk away quickly."],
      answerIndex: 0
    }
  ],

  "Social Skills": [
    {
      id: "s1",
      img: "images/avatars/kid3.svg",
      prompt: "You are waiting for your turn in a game. What should you do?",
      choices: ["Wait patiently and watch others play.", "Yell, 'My turn now!'", "Grab the toy."],
      answerIndex: 0
    },
    {
      id: "s2",
      img: "images/avatars/kid4.svg",
      prompt: "Your friend points at a bird. What should you do?",
      choices: ["Look where they are pointing.", "Look at the ground.", "Close your eyes."],
      answerIndex: 0
    },
    {
      id: "s3",
      img: "images/avatars/kid5.svg",
      prompt: "Your friend shares a snack with you. What should you say?",
      choices: ["Thank you!", "Eat it silently.", "Throw it away."],
      answerIndex: 0
    },
    {
      id: "s4",
      img: "images/avatars/kid6.svg",
      prompt: "You accidentally bump into someone. What should you do?",
      choices: ["Say, 'Sorry!'", "Run away.", "Blame someone else."],
      answerIndex: 0
    }
  ]
}
