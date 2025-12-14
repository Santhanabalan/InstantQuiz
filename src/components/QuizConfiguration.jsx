import { motion } from 'framer-motion';
import { ArrowLeft, Play, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useQuiz } from '../contexts/QuizContext';

export const QuizConfiguration = () => {
  const { questions, config, startQuiz, reset } = useQuiz();
  const [formConfig, setFormConfig] = useState(config);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormConfig({
      ...config,
      questionCount: questions.length,
    });
  }, [config, questions.length]);

  const validateForm = () => {
    const newErrors = {};
    
    if (formConfig.passingScore < 0 || formConfig.passingScore > 100) {
      newErrors.passingScore = 'Passing score must be between 0 and 100';
    }
    
    if (formConfig.timerEnabled && (formConfig.timerMinutes < 1 || formConfig.timerMinutes > 999)) {
      newErrors.timerMinutes = 'Timer must be between 1 and 999 minutes';
    }
    
    if (formConfig.questionCount < 1 || formConfig.questionCount > questions.length) {
      newErrors.questionCount = `Question count must be between 1 and ${questions.length}`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      startQuiz(formConfig);
    }
  };

  const handleQuestionCountChange = (value) => {
    setFormConfig(prev => ({ ...prev, questionCount: parseInt(value) }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="mb-6">
          <button
            onClick={reset}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Upload Different File
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-slate-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-indigo-100">
              <Settings className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Configure Your Quiz</h2>
              <p className="text-sm text-slate-600">{questions.length} questions available</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Count */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Number of Questions: {formConfig.questionCount}
              </label>
              <input
                type="range"
                min="1"
                max={questions.length}
                value={formConfig.questionCount}
                onChange={(e) => handleQuestionCountChange(e.target.value)}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>1</span>
                <span>{questions.length}</span>
              </div>
              {errors.questionCount && (
                <p className="text-sm text-red-600 mt-1">{errors.questionCount}</p>
              )}
            </div>

            {/* Timer Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Enable Timer</p>
                <p className="text-sm text-slate-600">Add a countdown timer to your quiz</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formConfig.timerEnabled}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, timerEnabled: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Timer Duration */}
            {formConfig.timerEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Timer Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={formConfig.timerMinutes}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, timerMinutes: parseInt(e.target.value) || 1 }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.timerMinutes && (
                  <p className="text-sm text-red-600 mt-1">{errors.timerMinutes}</p>
                )}
              </motion.div>
            )}

            {/* Passing Score */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Passing Score (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formConfig.passingScore}
                onChange={(e) => setFormConfig(prev => ({ ...prev, passingScore: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.passingScore && (
                <p className="text-sm text-red-600 mt-1">{errors.passingScore}</p>
              )}
            </div>

            {/* Shuffle Questions */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Shuffle Questions</p>
                <p className="text-sm text-slate-600">Randomize the order of questions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formConfig.shuffleQuestions}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, shuffleQuestions: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Shuffle Options */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Shuffle Answer Options</p>
                <p className="text-sm text-slate-600">Randomize the order of A, B, C, D</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formConfig.shuffleOptions}
                  onChange={(e) => setFormConfig(prev => ({ ...prev, shuffleOptions: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Summary */}
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
              <h3 className="font-semibold text-indigo-900 mb-2">Quiz Summary</h3>
              <ul className="text-sm text-indigo-800 space-y-1">
                <li>• {formConfig.questionCount} questions</li>
                <li>• {formConfig.timerEnabled ? `${formConfig.timerMinutes} minute timer` : 'No time limit'}</li>
                <li>• {formConfig.passingScore}% to pass</li>
                <li>• Questions {formConfig.shuffleQuestions ? 'will be' : 'will not be'} shuffled</li>
                <li>• Options {formConfig.shuffleOptions ? 'will be' : 'will not be'} shuffled</li>
              </ul>
            </div>

            {/* Start Button */}
            <button
              type="submit"
              disabled={Object.keys(errors).length > 0}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors"
            >
              <Play className="w-5 h-5" />
              Start Quiz
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
