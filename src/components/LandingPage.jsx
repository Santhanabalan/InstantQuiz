import { motion } from 'framer-motion';
import {
    BookOpen,
    CheckCircle2,
    Download,
    FileJson,
    Github,
    Palette,
    Sparkles,
    Timer,
    Zap,
} from 'lucide-react';
import { useQuiz } from '../contexts/QuizContext';

export const LandingPage = ({ onToast }) => {
  const { goToUpload } = useQuiz();

  const handleGetStarted = () => {
    goToUpload();
  };

  const handleSeeQuote = () => {
    onToast("Chill, it's free! 😎", 'success');
    setTimeout(() => {
      goToUpload();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-100 dark:bg-slate-950 px-4 sm:px-6 lg:px-8">
        {/* Animated Grid Background */}
        <div className="absolute inset-0">
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          
          {/* Animated gradient orbs */}
          <motion.div
            className="absolute top-0 -left-40 w-80 h-80 bg-purple-600 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute top-0 -right-40 w-80 h-80 bg-indigo-600 dark:bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20"
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute -bottom-40 left-1/2 w-80 h-80 bg-cyan-600 dark:bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20"
            animate={{
              x: [-100, 100, -100],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 backdrop-blur-sm px-6 py-3 rounded-full border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-base font-medium mb-8">
              <Sparkles className="w-5 h-5" />
              <span>Open Source • Forever Free</span>
            </div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-7xl sm:text-8xl lg:text-9xl font-bold mb-8"
            >
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient-x inline-block">
                InstantQuiz
              </span>
            </motion.h1>
            
            <p className="text-2xl sm:text-3xl lg:text-4xl text-slate-700 dark:text-slate-300 mb-6 max-w-4xl mx-auto font-semibold">
              Create, customize, and deliver beautiful quizzes in seconds
            </p>
            
            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 mb-16 max-w-3xl mx-auto">
              Perfect for education, training, certification, self-assessment, and more
            </p>

            {/* Use Cases Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {['Education', 'Training', 'Certification', 'Self-Assessment', 'Recruitment'].map((useCase) => (
                <span
                  key={useCase}
                  className="px-6 py-3 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-200 text-base sm:text-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  {useCase}
                </span>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="inline-flex items-center gap-3 px-12 py-6 bg-indigo-600 text-white dark:bg-indigo-600 dark:text-white font-bold text-xl sm:text-2xl rounded-xl shadow-2xl shadow-indigo-200 dark:shadow-indigo-900/50 hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-all"
            >
              <Zap className="w-7 h-7" />
              Get Started Free
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="min-h-screen flex items-center py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6">
              Everything You Need
            </h2>
            <p className="text-2xl sm:text-3xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Powerful features to create engaging quizzes with zero hassle
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-slate-700 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="min-h-screen flex items-center py-20 px-4 sm:px-6 lg:px-8 bg-slate-100 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6">
              "Pricing" Plans
            </h2>
            <p className="text-2xl sm:text-3xl text-slate-600 dark:text-slate-400 mb-8">
              Choose the plan that's right for you (hint: they're all free)
            </p>
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-8 py-4 rounded-full text-xl font-bold">
              <Sparkles className="w-6 h-6" />
              Open Source • Always Free
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -8 }}
                className={`bg-white dark:bg-slate-700 rounded-2xl p-10 shadow-xl ${
                  tier.featured ? 'ring-4 ring-indigo-500 scale-105' : ''
                }`}
              >
                {tier.featured && (
                  <div className="text-center mb-6">
                    <span className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-full text-base font-bold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 text-center">
                  {tier.name}
                </h3>
                
                <div className="text-center mb-6">
                  <span className="text-6xl font-bold text-slate-900 dark:text-white">
                    {tier.price}
                  </span>
                  <span className="text-xl text-slate-600 dark:text-slate-400 ml-2">
                    {tier.period}
                  </span>
                </div>
                
                <p className="text-lg text-slate-600 dark:text-slate-300 text-center mb-4 italic">
                  {tier.description}
                </p>
                
                <p className="text-base text-indigo-600 dark:text-indigo-400 text-center mb-8 font-semibold">
                  {tier.why}
                </p>
                
                <ul className="space-y-4 mb-10">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-slate-700 dark:text-slate-200 text-lg">
                      <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSeeQuote()}
                  className={`w-full py-4 rounded-xl text-lg font-bold transition-colors ${
                    tier.featured
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-500'
                  }`}
                >
                  See Quote
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-12">
              About InstantQuiz
            </h2>
            
            <div className="mx-auto mb-16 space-y-8">
              <p className="text-slate-600 dark:text-slate-300 text-2xl sm:text-3xl leading-relaxed">
                InstantQuiz is a modern, open-source quiz platform built for educators, trainers, and learners. 
                Upload your questions in JSON format, customize your quiz settings, and get instant results with 
                detailed analytics.
              </p>
              
              <p className="text-slate-600 dark:text-slate-300 text-2xl sm:text-3xl leading-relaxed">
                Built with React, featuring a beautiful dark mode, smooth animations, and a focus on user experience. 
                No servers, no databases, no tracking—just pure client-side magic.
              </p>
            </div>

            {/* GitHub Link */}
            <motion.a
              href="https://github.com/Santhanabalan/InstantQuiz"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-xl mb-16"
            >
              <Github className="w-7 h-7" />
              View on GitHub
            </motion.a>

            {/* Copyright */}
            <div className="border-t-2 border-slate-300 dark:border-slate-600 pt-12 mt-8">
              <p className="text-xl text-slate-600 dark:text-slate-300">
                © {new Date().getFullYear()} InstantQuiz. Open source and free forever.
              </p>
              <p className="text-lg text-slate-500 dark:text-slate-500 mt-4">
                Made with ❤️ for learners everywhere
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Features data
const features = [
  {
    icon: FileJson,
    title: 'JSON Format Support',
    description: 'Upload your questions in a simple, clean JSON format. No complicated spreadsheets or proprietary formats.',
  },
  {
    icon: BookOpen,
    title: 'Multiple Question Types',
    description: 'Support for single-choice, multi-select, and fill-in-the-blank questions to match any assessment style.',
  },
  {
    icon: Zap,
    title: 'Instant Configuration',
    description: 'Customize quiz settings on the fly—shuffle questions, set time limits, adjust passing scores, and more.',
  },
  {
    icon: Timer,
    title: 'Built-in Timer',
    description: 'Optional countdown timer to add urgency and track completion time for your assessments.',
  },
  {
    icon: CheckCircle2,
    title: 'Real-time Analytics',
    description: 'Get instant feedback with detailed score breakdowns, question-by-question analysis, and performance insights.',
  },
  {
    icon: Palette,
    title: 'Dark & Light Themes',
    description: 'Beautiful themes that adapt to your preference. Easy on the eyes, day or night.',
  },
  {
    icon: Download,
    title: 'Export Results',
    description: 'Download quiz results and analytics for record-keeping or further analysis.',
  },
  {
    icon: Sparkles,
    title: 'Smooth Animations',
    description: 'Polished transitions and animations powered by Framer Motion for a delightful user experience.',
  },
];

// Pricing tiers data
const pricingTiers = [
  {
    name: 'Personal',
    price: '$0',
    period: '/forever',
    description: 'For solo learners who don\'t share their snacks',
    why: 'Because paying for quizzes is so 2010',
    features: [
      'Unlimited quizzes',
      'All question types',
      'Full customization',
      'Analytics dashboard',
      'Dark mode',
      'Lifetime access',
    ],
    featured: false,
  },
  {
    name: 'Business',
    price: '$0',
    period: '/month',
    description: 'For teams who like to pretend they have a budget',
    why: 'Impress your boss by saving exactly $0',
    features: [
      'Everything in Personal',
      'Unlimited team members',
      'Enterprise-grade freeness',
      'Zero hidden costs',
      'No contracts required',
      'Cancel anytime (why though?)',
    ],
    featured: true,
  },
  {
    name: 'Enterprise',
    price: '$0',
    period: '/year',
    description: 'For corporations with procurement departments to confuse',
    why: 'Because \'free\' sounds suspicious without paperwork',
    features: [
      'Everything in Business',
      'Dedicated nothing',
      'Premium air support',
      '24/7 GitHub issues',
      'Open source forever',
      'Self-hosted freedom',
    ],
    featured: false,
  },
];
