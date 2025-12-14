import { motion } from 'framer-motion';
import { FileText, Loader2, Upload } from 'lucide-react';
import Papa from 'papaparse';
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

          if (!q.question || typeof q.question !== 'string') {
            errors.push(`Question ${rowNum}: Missing or invalid question text`);
            return;
          }

          if (!q.type || !['single-choice', 'multi-select', 'fill-in-blank'].includes(q.type)) {
            errors.push(`Question ${rowNum}: Invalid type "${q.type}"`);
            return;
          }

          if (q.type === 'fill-in-blank') {
            if (!q.correctAnswers || !Array.isArray(q.correctAnswers) || q.correctAnswers.length === 0) {
              errors.push(`Question ${rowNum}: Fill-in-blank must have correctAnswers array`);
              return;
            }

            questions.push({
              id: `q-${Date.now()}-${index}`,
              questionText: q.question,
              type: 'fill-in-blank',
              acceptableAnswers: q.correctAnswers,
            });
          } else {
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
              id: `q-${Date.now()}-${index}`,
              questionText: q.question,
              type: q.type,
              options: q.options,
              correctAnswers: q.correctAnswers.map(idx => String.fromCharCode(65 + idx)),
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

  const parseCSV = useCallback((file) => {
    setIsProcessing(true);
    
    Papa.parse(file, {
      complete: (results) => {
        try {
          // Check if data exists
          if (!results.data || results.data.length === 0) {
            onToast('CSV file is empty', 'error');
            setIsProcessing(false);
            return;
          }

          // Filter out empty rows
          const data = results.data.filter(row => 
            row.length >= 6 && row.some(cell => cell && cell.trim())
          );

          if (data.length === 0) {
            onToast('CSV file is empty', 'error');
            setIsProcessing(false);
            return;
          }

          // Determine if first row is header
          const hasHeader = data[0].some(cell => 
            typeof cell === 'string' && 
            (cell.toLowerCase().includes('question') || 
             cell.toLowerCase().includes('option') ||
             cell.toLowerCase().includes('answer'))
          );

          const questionRows = hasHeader ? data.slice(1) : data;

          // Validate and transform questions
          const questions = [];
          const errors = [];

          questionRows.forEach((row, index) => {
            const rowNum = hasHeader ? index + 2 : index + 1;
            
            // Support variable column count (6-8 columns)
            if (row.length < 6) {
              errors.push(`Row ${rowNum}: Expected at least 6 columns, found ${row.length}`);
              return;
            }

            // Parse all cells
            const cells = row.map(cell => 
              typeof cell === 'string' ? cell.trim() : String(cell || '')
            );

            const questionText = cells[0];
            const correctAnswerRaw = cells[cells.length - 1];
            
            // Extract options (everything between question and correct answer)
            const optionCells = cells.slice(1, cells.length - 1);

            // Validate question text
            if (!questionText) {
              errors.push(`Row ${rowNum}: Question text is required`);
              return;
            }

            // Filter non-empty options
            const nonEmptyOptions = optionCells.filter(opt => {
              const normalized = (opt || '').toLowerCase().trim();
              return normalized !== '' && normalized !== 'blank';
            });

            // Detect fill-in-the-blank questions (all options empty or "blank")
            const isFillInBlank = nonEmptyOptions.length === 0;

            if (isFillInBlank) {
              // Fill-in-the-blank question
              // correctAnswer can be pipe-separated for multiple acceptable answers
              const acceptableAnswers = correctAnswerRaw
                .split('|')
                .map(ans => ans.trim())
                .filter(ans => ans.length > 0);

              if (acceptableAnswers.length === 0) {
                errors.push(`Row ${rowNum}: Fill-in-blank question must have at least one acceptable answer`);
                return;
              }

              questions.push({
                id: `q-${Date.now()}-${index}`,
                questionText,
                type: 'fill-in-blank',
                acceptableAnswers,
              });
            } else {
              // Multiple choice question (2-5 options)
              if (nonEmptyOptions.length < 2 || nonEmptyOptions.length > 5) {
                errors.push(`Row ${rowNum}: Multiple choice questions must have 2-5 options, found ${nonEmptyOptions.length}`);
                return;
              }

              // Parse correct answers (can be single: "A" or multiple: "A,C,D")
              const correctAnswersParsed = correctAnswerRaw
                .split(',')
                .map(ans => ans.trim().toUpperCase())
                .filter(ans => ans.length > 0);

              if (correctAnswersParsed.length === 0) {
                errors.push(`Row ${rowNum}: Correct answer is required`);
                return;
              }

              // Remove duplicates
              const correctAnswers = [...new Set(correctAnswersParsed)];

              // Validate correct answers against available options
              const optionLetters = nonEmptyOptions.map((_, i) => String.fromCharCode(65 + i)); // A, B, C, D, E
              const invalidAnswers = correctAnswers.filter(ans => !optionLetters.includes(ans));
              
              if (invalidAnswers.length > 0) {
                errors.push(`Row ${rowNum}: Invalid correct answer(s) "${invalidAnswers.join(', ')}" - question only has options ${optionLetters.join(', ')}`);
                return;
              }

              // Determine question type based on number of correct answers
              const questionType = correctAnswers.length > 1 ? 'multi-select' : 'single-choice';

              questions.push({
                id: `q-${Date.now()}-${index}`,
                questionText,
                type: questionType,
                options: nonEmptyOptions,
                correctAnswers,
              });
            }
          });

          if (errors.length > 0) {
            onToast(errors[0], 'error');
            setIsProcessing(false);
            return;
          }

          if (questions.length === 0) {
            onToast('No valid questions found in CSV', 'error');
            setIsProcessing(false);
            return;
          }

          // Success!
          loadQuestions(questions);
          onToast(`${questions.length} questions loaded successfully`, 'success');
          setIsProcessing(false);
        } catch (error) {
          onToast('Error parsing CSV file', 'error');
          setIsProcessing(false);
        }
      },
      error: () => {
        onToast('Error reading CSV file', 'error');
        setIsProcessing(false);
      },
    });
  }, [loadQuestions, onToast]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (file.name.endsWith('.json')) {
      parseJSON(file);
    } else if (file.name.endsWith('.csv')) {
      parseCSV(file);
    } else {
      onToast('Please upload a JSON or CSV file', 'error');
    }
  }, [parseJSON, parseCSV, onToast]);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.name.endsWith('.json')) {
      parseJSON(file);
    } else if (file.name.endsWith('.csv')) {
      parseCSV(file);
    } else {
      onToast('Please upload a JSON or CSV file', 'error');
    }
  }, [parseJSON, parseCSV, onToast]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
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
          <p className="text-lg text-slate-600 dark:text-gray-300">Upload your CSV file to get started</p>
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
            accept=".csv,.json"
            onChange={handleFileSelect}
            disabled={isProcessing}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Upload quiz file"
          />

          <div className="flex flex-col items-center gap-4">
            {isProcessing ? (
              <>
                <Loader2 className="w-16 h-16 text-indigo-600 dark:text-indigo-400 animate-spin" />
                <p className="text-lg font-medium text-slate-700 dark:text-gray-200">Processing CSV file...</p>
              </>
            ) : (
              <>
                <div className="p-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                  <Upload className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                    Drag and drop quiz file here, or click to browse
                  </p>
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    Supports JSON or CSV format
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Format Requirements</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">JSON Format (Recommended)</h4>
                  <pre className="text-xs bg-white dark:bg-gray-800 p-2 rounded border border-blue-200 dark:border-blue-700 overflow-x-auto">
{`{
  "questions": [
    {
      "question": "What is React?",
      "type": "single-choice",
      "options": ["A library", "A framework"],
      "correctAnswers": [0]
    },
    {
      "question": "Select all state hooks",
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
                </div>

                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">CSV Format</h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Columns: Question, Option1, Option2, [Option3-5], Correct Answer</li>
                    <li>• 2-5 options per question</li>
                    <li>• Single choice: "A", Multi-select: "A,C", Fill-in: "answer|alternative"</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
