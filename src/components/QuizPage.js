import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, Award } from 'lucide-react';

const QuizPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const questions = [
    {
      question: "Wat is de standaard checkout flow in Shopify?",
      options: [
        "Cart → Checkout → Payment → Confirmation",
        "Product → Cart → Payment → Checkout",
        "Checkout → Cart → Payment → Confirmation",
        "Payment → Cart → Checkout → Confirmation"
      ],
      correct: 0
    },
    {
      question: "Welke programmeertaal wordt gebruikt voor Shopify themes?",
      options: ["JavaScript", "PHP", "Liquid", "Python"],
      correct: 2
    },
    {
      question: "Wat is de maximale bestandsgrootte voor product afbeeldingen?",
      options: ["5MB", "10MB", "20MB", "50MB"],
      correct: 2
    }
  ];

  const handleAnswer = (selectedAnswer) => {
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      return score + (answer === questions[index].correct ? 1 : 0);
    }, 0);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setQuizStarted(false);
  };

  if (!quizStarted) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Shopify Knowledge Quiz</h1>
          <p className="text-white/70 mb-8">Test je kennis over Shopify ontwikkeling</p>
          
          <div className="gradient-card rounded-xl p-8 max-w-md mx-auto">
            <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-white text-xl font-semibold mb-4">Klaar om te beginnen?</h2>
            <p className="text-white/70 mb-6">Deze quiz bevat {questions.length} vragen over Shopify ontwikkeling.</p>
            <button 
              onClick={() => setQuizStarted(true)}
              className="btn-primary px-8 py-3 rounded-lg text-white font-medium flex items-center space-x-2 mx-auto"
            >
              <Play className="w-5 h-5" />
              <span>Start Quiz</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Quiz Resultaten</h1>
          
          <div className="gradient-card rounded-xl p-8 max-w-md mx-auto">
            <div className="mb-6">
              {percentage >= 70 ? (
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              ) : (
                <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              )}
              <h2 className="text-white text-2xl font-bold mb-2">{percentage}%</h2>
              <p className="text-white/70">Je hebt {score} van de {questions.length} vragen goed beantwoord</p>
            </div>
            
            <div className="space-y-4">
              {questions.map((q, index) => (
                <div key={index} className="text-left">
                  <p className="text-white text-sm mb-1">{q.question}</p>
                  <div className="flex items-center">
                    {answers[index] === q.correct ? (
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 mr-2" />
                    )}
                    <span className="text-white/70 text-sm">{q.options[q.correct]}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={resetQuiz}
              className="btn-primary px-6 py-2 rounded-lg text-white font-medium mt-6"
            >
              Opnieuw proberen
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Shopify Knowledge Quiz</h1>
        <p className="text-white/70">Vraag {currentQuestion + 1} van {questions.length}</p>
      </div>

      <div className="gradient-card rounded-xl p-8 max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="w-full bg-white/20 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-blue-purple h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <h2 className="text-white text-xl font-semibold mb-6">{question.question}</h2>
        </div>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className="w-full text-left p-4 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
