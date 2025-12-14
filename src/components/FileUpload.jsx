import { motion } from 'framer-motion';
import { FileText, Loader2, Upload } from 'lucide-react';
import Papa from 'papaparse';
import { useCallback, useState } from 'react';
import { useQuiz } from '../contexts/QuizContext';

export const FileUpload = ({ onToast }) => {
  const { loadQuestions } = useQuiz();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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
            
            // Check for 6 columns
            if (row.length < 6) {
              errors.push(`Row ${rowNum}: Expected 6 columns, found ${row.length}`);
              return;
            }

            const [questionText, optionA, optionB, optionC, optionD, correctAnswer] = row.map(cell => 
              typeof cell === 'string' ? cell.trim() : String(cell || '')
            );

            // Validate correct answer
            const normalizedAnswer = correctAnswer.toUpperCase();
            if (!['A', 'B', 'C', 'D'].includes(normalizedAnswer)) {
              errors.push(`Row ${rowNum}: Invalid correct answer "${correctAnswer}". Must be A, B, C, or D`);
              return;
            }

            questions.push({
              id: `q-${Date.now()}-${index}`,
              questionText,
              optionA,
              optionB,
              optionC,
              optionD,
              correctAnswer: normalizedAnswer,
            });
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

    if (!file.name.endsWith('.csv')) {
      onToast('Please upload a CSV file', 'error');
      return;
    }

    parseCSV(file);
  }, [parseCSV, onToast]);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      onToast('Please upload a CSV file', 'error');
      return;
    }

    parseCSV(file);
  }, [parseCSV, onToast]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">InstantQuiz</h1>
          <p className="text-lg text-slate-600">Upload your CSV file to get started</p>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative border-2 border-dashed rounded-lg p-12 text-center transition-all
            ${isDragging 
              ? 'border-indigo-600 bg-indigo-50' 
              : 'border-slate-300 bg-white hover:border-slate-400'
            }
            ${isProcessing ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
          `}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            disabled={isProcessing}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Upload CSV file"
          />

          <div className="flex flex-col items-center gap-4">
            {isProcessing ? (
              <>
                <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
                <p className="text-lg font-medium text-slate-700">Processing CSV file...</p>
              </>
            ) : (
              <>
                <div className="p-4 rounded-full bg-indigo-100">
                  <Upload className="w-12 h-12 text-indigo-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-slate-900 mb-1">
                    Drag and drop CSV file here, or click to browse
                  </p>
                  <p className="text-sm text-slate-500">
                    File should contain: Question, Option A, Option B, Option C, Option D, Correct Answer
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">CSV Format Requirements</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Must have exactly 6 columns</li>
                <li>• Columns: Question Text, Option A, Option B, Option C, Option D, Correct Answer</li>
                <li>• Correct Answer must be A, B, C, or D</li>
                <li>• First row can optionally be a header row</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
