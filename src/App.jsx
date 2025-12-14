import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { ExamInterface } from './components/ExamInterface';
import { FileUpload } from './components/FileUpload';
import { QuizConfiguration } from './components/QuizConfiguration';
import { ResultsDashboard } from './components/ResultsDashboard';
import { ToastContainer } from './components/Toast';
import { QuizProvider, useQuiz } from './contexts/QuizContext';

function AppContent() {
  const { phase } = useQuiz();
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {phase === 'ingestion' && <FileUpload onToast={addToast} />}
          {phase === 'configuration' && <QuizConfiguration />}
          {phase === 'exam' && <ExamInterface />}
          {phase === 'analytics' && <ResultsDashboard />}
        </motion.div>
      </AnimatePresence>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}

function App() {
  return (
    <QuizProvider>
      <AppContent />
    </QuizProvider>
  );
}

export default App;
