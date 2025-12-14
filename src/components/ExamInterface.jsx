import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useQuiz } from '../contexts/QuizContext';
import { ProgressBar } from './ProgressBar';
import { Timer } from './Timer';

export const ExamInterface = () => {
  const { questions, config, examState, setAnswer, toggleMarkForReview, goToQuestion, submitQuiz } = useQuiz();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [direction, setDirection] = useState(0);

  const currentQuestion = questions[examState.currentQuestionIndex];
  const currentAnswer = examState.userAnswers[examState.currentQuestionIndex];
  const isMarked = examState.markedForReview.has(examState.currentQuestionIndex);
  const isFirst = examState.currentQuestionIndex === 0;
  const isLast = examState.currentQuestionIndex === questions.length - 1;

  const answeredCount = examState.userAnswers.filter(a => a !== null).length;
  const unansweredCount = questions.length - answeredCount;

  const handleNext = () => {
    if (!isLast) {
      setDirection(1);
      goToQuestion(examState.currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirst) {
      setDirection(-1);
      goToQuestion(examState.currentQuestionIndex - 1);
    }
  };

  const handleAnswerSelect = (option) => {
    setAnswer(examState.currentQuestionIndex, option);
  };

  const handleSubmit = () => {
    setShowConfirmation(true);
  };

  const confirmSubmit = () => {
    submitQuiz();
  };

  const handleTimeUp = () => {
    submitQuiz();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (showConfirmation) return;
      
      if (e.key === 'ArrowLeft') handlePrevious();
      else if (e.key === 'ArrowRight') handleNext();
      else if (['a', 'A'].includes(e.key)) handleAnswerSelect('A');
      else if (['b', 'B'].includes(e.key)) handleAnswerSelect('B');
      else if (['c', 'C'].includes(e.key)) handleAnswerSelect('C');
      else if (['d', 'D'].includes(e.key)) handleAnswerSelect('D');
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [examState.currentQuestionIndex, showConfirmation]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex flex-col transition-colors">
      {/* Header with Timer and Progress */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">InstantQuiz</h1>
            {config.timerEnabled && (
              <Timer
                startTime={examState.startTime}
                durationMinutes={config.timerMinutes}
                onTimeUp={handleTimeUp}
              />
            )}
          </div>
          <ProgressBar
            current={answeredCount}
            total={questions.length}
            currentIndex={examState.currentQuestionIndex}
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={examState.currentQuestionIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-slate-200 dark:border-gray-700 p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-slate-500 dark:text-gray-400">
                      Question {examState.currentQuestionIndex + 1} of {questions.length}
                    </span>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-2">
                      {currentQuestion.questionText}
                    </h2>
                  </div>
                  <button
                    onClick={() => toggleMarkForReview(examState.currentQuestionIndex)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                      isMarked
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700'
                        : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600'
                    }`}
                    aria-label={isMarked ? 'Unmark for review' : 'Mark for review'}
                  >
                    <Flag className={`w-4 h-4 ${isMarked ? 'fill-current' : ''}`} />
                    <span className="text-sm font-medium hidden sm:inline">
                      {isMarked ? 'Marked' : 'Mark'}
                    </span>
                  </button>
                </div>

                <div className="space-y-3">
                  {['A', 'B', 'C', 'D'].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswerSelect(option)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        currentAnswer === option
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-slate-200 dark:border-gray-600 hover:border-slate-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            currentAnswer === option
                              ? 'border-indigo-600 bg-indigo-600'
                              : 'border-slate-300 dark:border-gray-500'
                          }`}
                        >
                          {currentAnswer === option && (
                            <div className="w-3 h-3 rounded-full bg-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-slate-700 dark:text-gray-300 mr-2">{option}.</span>
                          <span className="text-slate-900 dark:text-gray-100">{currentQuestion[`option${option}`]}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handlePrevious}
              disabled={isFirst}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-200 rounded-md hover:bg-slate-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            {isLast ? (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
              >
                <Check className="w-5 h-5" />
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Submit Quiz?</h3>
              <p className="text-slate-600 dark:text-gray-300 mb-4">
                {unansweredCount > 0
                  ? `You have ${unansweredCount} unanswered question${unansweredCount > 1 ? 's' : ''}. Submit anyway?`
                  : 'Are you sure you want to submit your quiz? You cannot change answers after submission.'}
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 text-slate-700 dark:text-gray-200 font-medium rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSubmit}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
