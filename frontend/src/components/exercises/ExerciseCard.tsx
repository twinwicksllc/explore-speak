import React, { useState } from 'react';
import './ExerciseCard.css';

interface FillInBlankExercise {
  type: 'fillInBlank';
  exerciseId: string;
  question: string;
  correctAnswer: string;
  feedback: {
    correct: string;
    incorrect: string;
    explanation: string;
  };
}

interface MultipleChoiceExercise {
  type: 'multipleChoice';
  exerciseId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  feedback: {
    correct: string;
    incorrect: string;
    explanation: string;
  };
}

interface SentenceBuildingExercise {
  type: 'sentenceBuilding';
  exerciseId: string;
  question: string;
  wordBank: string[];
  correctAnswer: string;
  feedback: {
    correct: string;
    incorrect: string;
    explanation: string;
  };
}

type Exercise = FillInBlankExercise | MultipleChoiceExercise | SentenceBuildingExercise;

interface ExerciseCardProps {
  exercise: Exercise;
  onComplete: (isCorrect: boolean) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onComplete }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = () => {
    let answer = '';
    let correct = false;

    if (exercise.type === 'fillInBlank') {
      answer = userAnswer.trim();
      correct = answer.toLowerCase() === exercise.correctAnswer.toLowerCase();
    } else if (exercise.type === 'multipleChoice') {
      answer = userAnswer;
      correct = answer === exercise.correctAnswer;
    } else if (exercise.type === 'sentenceBuilding') {
      answer = selectedWords.join(' ');
      correct = answer === exercise.correctAnswer;
    }

    setIsCorrect(correct);
    setSubmitted(true);
  };

  const handleContinue = () => {
    onComplete(isCorrect);
  };

  const handleWordClick = (word: string, index: number) => {
    setSelectedWords([...selectedWords, word]);
  };

  const handleRemoveWord = (index: number) => {
    setSelectedWords(selectedWords.filter((_, i) => i !== index));
  };

  return (
    <div className="exercise-card">
      <div className="exercise-header">
        <span className="exercise-icon">📝</span>
        <h3>Exercise</h3>
      </div>

      <div className="exercise-question">{exercise.question}</div>

      {!submitted && (
        <>
          {exercise.type === 'fillInBlank' && (
            <div className="exercise-input">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="fill-blank-input"
                autoFocus
              />
            </div>
          )}

          {exercise.type === 'multipleChoice' && (
            <div className="exercise-options">
              {exercise.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setUserAnswer(option)}
                  className={`option-button ${userAnswer === option ? 'selected' : ''}`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {exercise.type === 'sentenceBuilding' && (
            <div className="sentence-building">
              <div className="selected-words">
                {selectedWords.length === 0 ? (
                  <span className="placeholder">Tap words below to build your sentence</span>
                ) : (
                  selectedWords.map((word, index) => (
                    <span
                      key={index}
                      className="selected-word"
                      onClick={() => handleRemoveWord(index)}
                    >
                      {word}
                    </span>
                  ))
                )}
              </div>
              <div className="word-bank">
                {exercise.wordBank.map((word, index) => (
                  <button
                    key={index}
                    onClick={() => handleWordClick(word, index)}
                    className="word-button"
                    disabled={selectedWords.includes(word)}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="submit-exercise-button"
            disabled={
              (exercise.type === 'fillInBlank' && !userAnswer.trim()) ||
              (exercise.type === 'multipleChoice' && !userAnswer) ||
              (exercise.type === 'sentenceBuilding' && selectedWords.length === 0)
            }
          >
            Check Answer
          </button>
        </>
      )}

      {submitted && (
        <div className={`exercise-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
          <div className="feedback-icon">{isCorrect ? '✅' : '❌'}</div>
          <div className="feedback-text">
            <strong>{isCorrect ? exercise.feedback.correct : exercise.feedback.incorrect}</strong>
            <p>{exercise.feedback.explanation}</p>
            {!isCorrect && (
              <p className="correct-answer">
                <strong>Correct answer:</strong> {exercise.correctAnswer}
              </p>
            )}
          </div>
          <button onClick={handleContinue} className="continue-button">
            Continue →
          </button>
        </div>
      )}
    </div>
  );
};

export default ExerciseCard;
