import { createContext, useContext, useState } from 'react';

const QuizContext = createContext(null);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within QuizProvider');
  }
  return context;
};

export const QuizProvider = ({ children }) => {
  const [phase, setPhase] = useState('ingestion'); // 'ingestion' | 'configuration' | 'exam' | 'analytics'
  const [questions, setQuestions] = useState([]);
  const [originalQuestions, setOriginalQuestions] = useState([]); // Preserve original questions for retake
  const [config, setConfig] = useState({
    questionCount: 0,
    timerEnabled: false,
    timerMinutes: 30,
    passingScore: 70,
    shuffleQuestions: false,
    shuffleOptions: false,
  });
  const [examState, setExamState] = useState({
    currentQuestionIndex: 0,
    userAnswers: [],
    markedForReview: new Set(),
    startTime: null,
    endTime: null,
  });
  const [results, setResults] = useState(null);

  // Load questions from CSV
  const loadQuestions = (parsedQuestions) => {
    setQuestions(parsedQuestions);
    setOriginalQuestions(parsedQuestions); // Store original for retakes
    setConfig(prev => ({ ...prev, questionCount: parsedQuestions.length }));
    setPhase('configuration');
  };

  // Start quiz with configuration
  const startQuiz = (quizConfig) => {
    // Use original questions as base to preserve them for retakes
    let quizQuestions = [...originalQuestions];
    
    // Apply question shuffling if enabled
    if (quizConfig.shuffleQuestions) {
      quizQuestions = shuffleArray(quizQuestions);
    }
    
    // Take only the configured number of questions
    quizQuestions = quizQuestions.slice(0, quizConfig.questionCount);
    
    // Apply option shuffling if enabled
    if (quizConfig.shuffleOptions) {
      quizQuestions = quizQuestions.map(q => shuffleOptions(q));
    }
    
    // Set the exam questions (modified version)
    setQuestions(quizQuestions);
    setConfig(quizConfig);
    setExamState({
      currentQuestionIndex: 0,
      userAnswers: new Array(quizQuestions.length).fill(null),
      markedForReview: new Set(),
      startTime: Date.now(),
      endTime: null,
    });
    setPhase('exam');
  };

  // Update answer for current question
  const setAnswer = (questionIndex, answer) => {
    setExamState(prev => {
      const newAnswers = [...prev.userAnswers];
      newAnswers[questionIndex] = answer;
      return { ...prev, userAnswers: newAnswers };
    });
  };

  // Toggle mark for review
  const toggleMarkForReview = (questionIndex) => {
    setExamState(prev => {
      const newMarked = new Set(prev.markedForReview);
      if (newMarked.has(questionIndex)) {
        newMarked.delete(questionIndex);
      } else {
        newMarked.add(questionIndex);
      }
      return { ...prev, markedForReview: newMarked };
    });
  };

  // Navigate between questions
  const goToQuestion = (index) => {
    setExamState(prev => ({ ...prev, currentQuestionIndex: index }));
  };

  // Submit quiz and calculate results
  const submitQuiz = () => {
    const endTime = Date.now();
    const questionResults = questions.map((q, index) => ({
      questionIndex: index,
      questionText: q.questionText,
      options: {
        A: q.optionA,
        B: q.optionB,
        C: q.optionC,
        D: q.optionD,
      },
      userAnswer: examState.userAnswers[index],
      correctAnswer: q.correctAnswer,
      isCorrect: examState.userAnswers[index] === q.correctAnswer,
      wasMarkedForReview: examState.markedForReview.has(index),
    }));

    const correctCount = questionResults.filter(r => r.isCorrect).length;
    const incorrectCount = questionResults.filter(r => !r.isCorrect && r.userAnswer !== null).length;
    const unansweredCount = questionResults.filter(r => r.userAnswer === null).length;
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= config.passingScore;
    const timeSpent = config.timerEnabled ? Math.floor((endTime - examState.startTime) / 1000) : null;

    setResults({
      score,
      totalQuestions: questions.length,
      correctCount,
      incorrectCount,
      unansweredCount,
      passed,
      passingScore: config.passingScore,
      timeSpent,
      timeLimit: config.timerEnabled ? config.timerMinutes * 60 : null,
      questionResults,
    });
    
    setExamState(prev => ({ ...prev, endTime }));
    setPhase('analytics');
  };

  // Reset to start
  const reset = () => {
    setPhase('ingestion');
    setQuestions([]);
    setOriginalQuestions([]);
    setConfig({
      questionCount: 0,
      timerEnabled: false,
      timerMinutes: 30,
      passingScore: 70,
      shuffleQuestions: false,
      shuffleOptions: false,
    });
    setExamState({
      currentQuestionIndex: 0,
      userAnswers: [],
      markedForReview: new Set(),
      startTime: null,
      endTime: null,
    });
    setResults(null);
  };

  // Retake quiz (go back to configuration with same questions)
  const retakeQuiz = () => {
    // Restore original questions for reconfiguration
    setQuestions(originalQuestions);
    setConfig(prev => ({ ...prev, questionCount: originalQuestions.length }));
    setExamState({
      currentQuestionIndex: 0,
      userAnswers: [],
      markedForReview: new Set(),
      startTime: null,
      endTime: null,
    });
    setResults(null);
    setPhase('configuration');
  };

  const value = {
    phase,
    questions,
    config,
    examState,
    results,
    loadQuestions,
    startQuiz,
    setAnswer,
    toggleMarkForReview,
    goToQuestion,
    submitQuiz,
    reset,
    retakeQuiz,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

// Utility functions
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function shuffleOptions(question) {
  // Get the correct answer value before shuffling
  const correctOptionValue = question[`option${question.correctAnswer}`];
  
  // Create array of options with their keys
  const options = [
    { key: 'A', value: question.optionA },
    { key: 'B', value: question.optionB },
    { key: 'C', value: question.optionC },
    { key: 'D', value: question.optionD },
  ];
  
  // Shuffle the options
  const shuffled = shuffleArray(options);
  
  // Find the new position (index) of the correct answer in shuffled array
  const correctAnswerIndex = shuffled.findIndex(opt => opt.value === correctOptionValue);
  
  // If we can't find the correct answer (shouldn't happen), return original question
  if (correctAnswerIndex === -1) {
    console.error('Failed to find correct answer after shuffle:', question);
    return question;
  }
  
  // Map index to letter: 0='A', 1='B', 2='C', 3='D'
  const newCorrectAnswer = ['A', 'B', 'C', 'D'][correctAnswerIndex];
  
  return {
    ...question,
    optionA: shuffled[0].value,
    optionB: shuffled[1].value,
    optionC: shuffled[2].value,
    optionD: shuffled[3].value,
    correctAnswer: newCorrectAnswer,
  };
}
