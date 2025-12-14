import { motion } from 'framer-motion';
import { CheckCircle2, ChevronDown, ChevronUp, Flag, MinusCircle, RotateCcw, Upload, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useQuiz } from '../contexts/QuizContext';

export const ResultsDashboard = () => {
  const { results, config, reset, retakeQuiz } = useQuiz();
  const [filter, setFilter] = useState('all'); // 'all' | 'correct' | 'incorrect' | 'marked'
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());

  const toggleExpand = (index) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedQuestions(newExpanded);
  };

  const filteredResults = results.questionResults.filter((result) => {
    if (filter === 'correct') return result.isCorrect;
    if (filter === 'incorrect') return !result.isCorrect && result.userAnswer !== null;
    if (filter === 'marked') return result.wasMarkedForReview;
    return true;
  });

  const formatTime = (seconds) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Quiz Results</h1>
            <p className="text-slate-600">
              {results.passed ? 'Congratulations! You passed!' : 'Keep practicing!'}
            </p>
          </div>

          {/* Score Ring */}
          <div className="bg-white rounded-lg shadow-md border border-slate-200 p-8 mb-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <ScoreRing score={results.score} passed={results.passed} />
              </div>
              <div className="flex-1 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Correct</span>
                    </div>
                    <p className="text-2xl font-bold text-green-700">{results.correctCount}</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium text-red-900">Incorrect</span>
                    </div>
                    <p className="text-2xl font-bold text-red-700">{results.incorrectCount}</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <MinusCircle className="w-5 h-5 text-slate-600" />
                      <span className="text-sm font-medium text-slate-900">Unanswered</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-700">{results.unansweredCount}</p>
                  </div>
                </div>
                {results.timeSpent && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900">
                      Time: {formatTime(results.timeSpent)} / {formatTime(results.timeLimit)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={retakeQuiz}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Retake Quiz
            </button>
            <button
              onClick={reset}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md transition-colors"
            >
              <Upload className="w-5 h-5" />
              Upload New CSV
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Review Questions</h2>
            <div className="flex flex-wrap gap-2">
              <FilterButton
                active={filter === 'all'}
                onClick={() => setFilter('all')}
                count={results.questionResults.length}
              >
                All
              </FilterButton>
              <FilterButton
                active={filter === 'correct'}
                onClick={() => setFilter('correct')}
                count={results.correctCount}
                color="green"
              >
                Correct
              </FilterButton>
              <FilterButton
                active={filter === 'incorrect'}
                onClick={() => setFilter('incorrect')}
                count={results.incorrectCount}
                color="red"
              >
                Incorrect
              </FilterButton>
              <FilterButton
                active={filter === 'marked'}
                onClick={() => setFilter('marked')}
                count={results.questionResults.filter(r => r.wasMarkedForReview).length}
                color="amber"
              >
                Marked
              </FilterButton>
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-3">
            {filteredResults.map((result, idx) => (
              <QuestionReviewCard
                key={result.questionIndex}
                result={result}
                isExpanded={expandedQuestions.has(result.questionIndex)}
                onToggle={() => toggleExpand(result.questionIndex)}
              />
            ))}
            {filteredResults.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No questions match this filter
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const ScoreRing = ({ score, passed }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-48 h-48">
      <svg className="w-full h-full transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="96"
          cy="96"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="12"
        />
        {/* Progress circle */}
        <motion.circle
          cx="96"
          cy="96"
          r={radius}
          fill="none"
          stroke={passed ? '#10b981' : '#ef4444'}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.p
          className="text-4xl font-bold text-slate-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}%
        </motion.p>
        <p className={`text-sm font-semibold ${passed ? 'text-green-600' : 'text-red-600'}`}>
          {passed ? 'PASSED' : 'FAILED'}
        </p>
      </div>
    </div>
  );
};

const FilterButton = ({ active, onClick, children, count, color = 'indigo' }) => {
  const colors = {
    indigo: active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    green: active ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    red: active ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    amber: active ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-medium transition-colors ${colors[color]}`}
    >
      {children} ({count})
    </button>
  );
};

const QuestionReviewCard = ({ result, isExpanded, onToggle }) => {
  const borderColor = result.isCorrect
    ? 'border-l-green-500'
    : result.userAnswer === null
    ? 'border-l-slate-400'
    : 'border-l-red-500';

  const icon = result.isCorrect ? (
    <CheckCircle2 className="w-5 h-5 text-green-600" />
  ) : result.userAnswer === null ? (
    <MinusCircle className="w-5 h-5 text-slate-500" />
  ) : (
    <XCircle className="w-5 h-5 text-red-600" />
  );

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-slate-200 border-l-4 ${borderColor} overflow-hidden`}>
      <button
        onClick={onToggle}
        className="w-full p-4 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-start gap-3">
          {icon}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-slate-500">
                Question {result.questionIndex + 1}
              </span>
              {result.wasMarkedForReview && (
                <Flag className="w-4 h-4 text-amber-600 fill-current" />
              )}
            </div>
            <p className="text-slate-900 font-medium line-clamp-2">
              {result.questionText}
            </p>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
          )}
        </div>
      </button>

      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-slate-200 p-4 bg-slate-50"
        >
          <div className="space-y-2">
            {['A', 'B', 'C', 'D'].map((option) => {
              const isUserAnswer = result.userAnswer === option;
              const isCorrectAnswer = result.correctAnswer === option;

              return (
                <div
                  key={option}
                  className={`p-3 rounded-md border ${
                    isCorrectAnswer
                      ? 'border-green-500 bg-green-50'
                      : isUserAnswer
                      ? 'border-red-500 bg-red-50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-slate-700">{option}.</span>
                    <span className={isUserAnswer && !isCorrectAnswer ? 'line-through text-slate-500' : 'text-slate-900'}>
                      {result.options[option]}
                    </span>
                    {isCorrectAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto flex-shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {result.userAnswer === null && (
            <p className="mt-3 text-sm text-slate-600 italic">You did not answer this question</p>
          )}
        </motion.div>
      )}
    </div>
  );
};
