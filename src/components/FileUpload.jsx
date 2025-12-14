import { motion } from 'framer-motion';
import { Download, FileText, Loader2, Upload } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useQuiz } from '../contexts/QuizContext';

export const FileUpload = ({ onToast }) => {
  const { loadQuestions } = useQuiz();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const parseJSON = useCallback((file) => {
    setIsProcessing(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        
        if (!json.questions || !Array.isArray(json.questions)) {
          onToast('Invalid JSON format: missing "questions" array', 'error');
          setIsProcessing(false);
          return;
        }

        if (json.questions.length === 0) {
          onToast('No questions found in JSON file', 'error');
          setIsProcessing(false);
          return;
        }

        const questions = [];
        const errors = [];

        json.questions.forEach((q, index) => {
          const rowNum = index + 1;

          // Validate required fields
          if (!q.question || typeof q.question !== 'string') {
            errors.push(`Question ${rowNum}: Missing or invalid question text`);
            return;
          }

          if (!q.type || !['single-choice', 'multi-select', 'fill-in-blank'].includes(q.type)) {
            errors.push(`Question ${rowNum}: Invalid type "${q.type}". Must be single-choice, multi-select, or fill-in-blank`);
            return;
          }

          // Validate type-specific fields
          if (q.type === 'fill-in-blank') {
            if (!q.correctAnswers || !Array.isArray(q.correctAnswers) || q.correctAnswers.length === 0) {
              errors.push(`Question ${rowNum}: Fill-in-blank must have correctAnswers array`);
              return;
            }

            questions.push({
              id: q.id || `q-${Date.now()}-${index}`,
              questionText: q.question,
              type: 'fill-in-blank',
              acceptableAnswers: q.correctAnswers,
              explanation: q.explanation,
              metadata: q.metadata,
            });
          } else {
            // Single-choice or multi-select
            if (!q.options || !Array.isArray(q.options) || q.options.length < 2 || q.options.length > 5) {
              errors.push(`Question ${rowNum}: Options must be array with 2-5 items`);
              return;
            }

            if (!q.correctAnswers || !Array.isArray(q.correctAnswers) || q.correctAnswers.length === 0) {
              errors.push(`Question ${rowNum}: Missing correctAnswers array`);
              return;
            }

            const invalidIndices = q.correctAnswers.filter(idx => 
              typeof idx !== 'number' || idx < 0 || idx >= q.options.length
            );

            if (invalidIndices.length > 0) {
              errors.push(`Question ${rowNum}: Invalid correctAnswers indices`);
              return;
            }

            questions.push({
              id: q.id || `q-${Date.now()}-${index}`,
              questionText: q.question,
              type: q.type,
              options: q.options,
              correctAnswers: q.correctAnswers.map(idx => String.fromCharCode(65 + idx)),
              explanation: q.explanation,
              metadata: q.metadata,
            });
          }
        });

        if (errors.length > 0) {
          onToast(errors[0], 'error');
          setIsProcessing(false);
          return;
        }

        if (questions.length === 0) {
          onToast('No valid questions found', 'error');
          setIsProcessing(false);
          return;
        }

        loadQuestions(questions);
        onToast(`Successfully loaded ${questions.length} question${questions.length > 1 ? 's' : ''}`, 'success');
        setIsProcessing(false);
      } catch (error) {
        onToast('Failed to parse JSON file: ' + error.message, 'error');
        setIsProcessing(false);
      }
    };
    reader.readAsText(file);
  }, [loadQuestions, onToast]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (file.name.endsWith('.json')) {
      parseJSON(file);
    } else {
      onToast('Please upload a JSON file', 'error');
    }
  }, [parseJSON, onToast]);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.name.endsWith('.json')) {
      parseJSON(file);
    } else {
      onToast('Please upload a JSON file', 'error');
    }
  }, [parseJSON, onToast]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDownloadExample = useCallback(() => {
    const link = document.createElement('a');
    link.href = '/example-quiz.json';
    link.download = 'example-quiz.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-gray-900 p-4 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">InstantQuiz</h1>
          <p className="text-lg text-slate-600 dark:text-gray-300">Upload your JSON file to get started</p>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative border-2 border-dashed rounded-lg p-12 text-center transition-all
            ${isDragging 
              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' 
              : 'border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-slate-400 dark:hover:border-gray-500'
            }
            ${isProcessing ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
          `}
        >
          <input
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            disabled={isProcessing}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Upload quiz file"
          />

          <div className="flex flex-col items-center gap-4">
            {isProcessing ? (
              <>
                <Loader2 className="w-16 h-16 text-indigo-600 dark:text-indigo-400 animate-spin" />
                <p className="text-lg font-medium text-slate-700 dark:text-gray-200">Processing JSON file...</p>
              </>
            ) : (
              <>
                <div className="p-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                  <Upload className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                    Drop JSON file here, or click to browse
                  </p>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    Supports .json format only
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">JSON Format Specification</h3>
                <button
                  onClick={handleDownloadExample}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Example
                </button>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Upload a JSON file with a <code className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/50 rounded text-xs">questions</code> array. Each question supports optional fields like <code className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/50 rounded text-xs">id</code>, <code className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/50 rounded text-xs">explanation</code>, and <code className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/50 rounded text-xs">metadata</code>.
                </p>

                <div className="text-sm space-y-2">
                  <p className="font-medium text-blue-900 dark:text-blue-100">Question Types:</p>
                  <ul className="text-blue-800 dark:text-blue-200 space-y-1 ml-4">
                    <li><strong>single-choice:</strong> One correct answer from options</li>
                    <li><strong>multi-select:</strong> Multiple correct answers from options</li>
                    <li><strong>fill-in-blank:</strong> Text input with acceptable answers</li>
                  </ul>
                </div>

                <details className="text-sm">
                  <summary className="cursor-pointer font-medium text-blue-900 dark:text-blue-100 hover:text-blue-700 dark:hover:text-blue-300">
                    View Example JSON Structure
                  </summary>
                  <pre className="mt-2 text-xs bg-white dark:bg-gray-800 p-3 rounded border border-blue-200 dark:border-blue-700 overflow-x-auto">
{`{
  "questions": [
    {
      "id": "react-001",
      "question": "What is React?",
      "type": "single-choice",
      "options": ["A library", "A framework"],
      "correctAnswers": [0],
      "explanation": "React is a JavaScript library...",
      "metadata": {
        "difficulty": "easy",
        "category": "React Basics",
        "tags": ["javascript", "react"]
      }
    },
    {
      "question": "Select state hooks",
      "type": "multi-select",
      "options": ["useState", "useEffect", "useReducer"],
      "correctAnswers": [0, 2]
    },
    {
      "question": "What is JSX?",
      "type": "fill-in-blank",
      "correctAnswers": ["JavaScript XML", "JSX"]
    }
  ]
}`}</pre>
                </details>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
