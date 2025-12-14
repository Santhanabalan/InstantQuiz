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

  // Load questions from JSON
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
    const questionResults = questions.map((q, index) => {
      const userAnswer = examState.userAnswers[index];
      let isCorrect = false;
      let partialScore = 0;

      if (q.type === 'fill-in-blank') {
        // Fill-in-blank validation (case-insensitive, trimmed)
        const normalizedUserAnswer = (userAnswer || '').trim().toLowerCase();
        isCorrect = q.acceptableAnswers.some(
          acceptable => acceptable.trim().toLowerCase() === normalizedUserAnswer
        );

        return {
          questionIndex: index,
          questionText: q.questionText,
          type: 'fill-in-blank',
          acceptableAnswers: q.acceptableAnswers,
          userAnswer: userAnswer,
          isCorrect,
          partialScore: isCorrect ? 1 : 0,
          wasMarkedForReview: examState.markedForReview.has(index),
          explanation: q.explanation,
          metadata: q.metadata,
        };
      } else if (q.type === 'multi-select') {
        // Multi-select validation
        const userAnswers = Array.isArray(userAnswer) ? userAnswer.sort() : [];
        const correctAnswers = q.correctAnswers.sort();
        
        // All-or-nothing scoring (can be made configurable later)
        isCorrect = JSON.stringify(userAnswers) === JSON.stringify(correctAnswers);
        
        // Partial credit calculation (for future use)
        if (userAnswers.length > 0 && correctAnswers.length > 0) {
          const correctSelections = userAnswers.filter(ans => correctAnswers.includes(ans)).length;
          const incorrectSelections = userAnswers.filter(ans => !correctAnswers.includes(ans)).length;
          const missedSelections = correctAnswers.filter(ans => !userAnswers.includes(ans)).length;
          
          // Partial score: (correct - incorrect) / total correct, clamped to 0-1
          partialScore = Math.max(0, (correctSelections - incorrectSelections) / correctAnswers.length);
        }

        return {
          questionIndex: index,
          questionText: q.questionText,
          type: 'multi-select',
          options: q.options,
          userAnswer: userAnswers,
          correctAnswers: q.correctAnswers,
          isCorrect,
          partialScore: isCorrect ? 1 : 0, // Use all-or-nothing for now
          wasMarkedForReview: examState.markedForReview.has(index),
          explanation: q.explanation,
          metadata: q.metadata,
        };
      } else {
        // Single-choice validation
        isCorrect = userAnswer === q.correctAnswers[0];

        return {
          questionIndex: index,
          questionText: q.questionText,
          type: 'single-choice',
          options: q.options,
          userAnswer,
          correctAnswers: q.correctAnswers,
          isCorrect,
          partialScore: isCorrect ? 1 : 0,
          wasMarkedForReview: examState.markedForReview.has(index),
          explanation: q.explanation,
          metadata: q.metadata,
        };
      }
    });

    const correctCount = questionResults.filter(r => r.isCorrect).length;
    const incorrectCount = questionResults.filter(r => !r.isCorrect && r.userAnswer !== null && r.userAnswer !== '' && (!Array.isArray(r.userAnswer) || r.userAnswer.length > 0)).length;
    const unansweredCount = questionResults.filter(r => r.userAnswer === null || r.userAnswer === '' || (Array.isArray(r.userAnswer) && r.userAnswer.length === 0)).length;
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
  // Skip if not MCQ or if already fill-in-blank
  if (question.type === 'fill-in-blank' || !question.options) {
    return question;
  }

  // Create array of options with their indices
  const optionsWithIndices = question.options.map((value, index) => ({
    letter: String.fromCharCode(65 + index), // A, B, C, D, E
    value,
    index,
  }));
  
  // Shuffle the options
  const shuffled = shuffleArray(optionsWithIndices);
  
  // Map old correct answers to new positions
  const newCorrectAnswers = question.correctAnswers.map(oldLetter => {
    const oldIndex = oldLetter.charCodeAt(0) - 65;
    const originalValue = question.options[oldIndex];
    const newIndex = shuffled.findIndex(opt => opt.value === originalValue);
    return String.fromCharCode(65 + newIndex);
  });
  
  return {
    ...question,
    options: shuffled.map(opt => opt.value),
    correctAnswers: newCorrectAnswers,
  };
}
