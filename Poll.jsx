import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { pollQuestions } from "../components/poll/pollQuestions";
import ProgressBar from "../components/poll/ProgressBar";
import PollQuestion from "../components/poll/PollQuestion";
import ResultsSummary from "../components/poll/ResultsSummary";
import WelcomeScreen from "../components/poll/WelcomeScreen";

export default function Poll() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);

  const currentQuestion = pollQuestions[currentIndex];
  const isLastQuestion = currentIndex === pollQuestions.length - 1;
  const hasAnswer = answers[currentQuestion?.id] !== undefined;

  const handleSelect = useCallback((value) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
  }, [currentQuestion]);

  const handleNext = useCallback(async () => {
    if (isLastQuestion) {
      setSaving(true);
      await base44.entities.PollResponse.create({
        answers,
        completed_at: new Date().toISOString()
      });
      setSaving(false);
      setCompleted(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [isLastQuestion, answers]);

  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handleRestart = useCallback(() => {
    setStarted(false);
    setCurrentIndex(0);
    setAnswers({});
    setCompleted(false);
  }, []);

  const bgGradient = started && !completed
    ? currentQuestion.gradient
    : "from-indigo-600 via-purple-600 to-pink-600";

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} transition-all duration-700 relative overflow-hidden`}>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/3 blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-5 py-10">
        {/* Progress bar - only show during questions */}
        {started && !completed && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md mb-10"
          >
            <ProgressBar current={currentIndex + 1} total={pollQuestions.length} />
          </motion.div>
        )}

        {/* Main content area */}
        <div className="flex-1 flex items-center justify-center w-full">
          <AnimatePresence mode="wait">
            {!started ? (
              <WelcomeScreen
                key="welcome"
                onStart={() => setStarted(true)}
                totalQuestions={pollQuestions.length}
              />
            ) : completed ? (
              <ResultsSummary
                key="results"
                answers={answers}
                onRestart={handleRestart}
              />
            ) : (
              <PollQuestion
                key={currentQuestion.id}
                question={currentQuestion}
                selected={answers[currentQuestion.id]}
                onSelect={handleSelect}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        {started && !completed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md flex items-center justify-between mt-10"
          >
            <button
              onClick={handleBack}
              disabled={currentIndex === 0}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                currentIndex === 0
                  ? "opacity-0 pointer-events-none"
                  : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!hasAnswer || saving}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                hasAnswer
                  ? "bg-white text-gray-900 hover:bg-white/90 shadow-lg shadow-white/10"
                  : "bg-white/20 text-white/40 cursor-not-allowed"
              }`}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                <>
                  {isLastQuestion ? "Finish" : "Next"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
