export enum SolutionResult {
  WaitingJudge, // Wating Judge
  Judging, // Judging
  Skipped, // Skipped
  Accepted, // Accepted
  WrongAnswer, // Wrong Answer
  TimeLimitExceeded, // Time Limit Exceeded
  MemoryLimitExceeded, // Memory Limit Exceeded
  RuntimeError, // Runtime Error
  CompileError, // Compile Error
  PresentationError, // Presentation Error
  JudgementFailed, // Judgement Failed (Judge program error)
  SystemError, // System Error     (Judge framwork & Judge plugin error)
  OtherError // Other Error
}

export enum EntryType {
  user,
  group,
}

export const resultDisplay = [
  {
    outline: true,
    color: '#1abc9c',
    text: 'waiting_judge'
  },
  {
    outline: true,
    color: '#f39c12',
    text: 'judging'
  },
  {
    color: '#7f8c8d',
    textColor: 'white',
    text: 'skipped'
  },
  {
    color: '#2ecc71',
    textColor: 'white',
    text: 'accepted'
  },
  {
    color: '#e74c3c',
    textColor: 'white',
    text: 'wrong_answer'
  },
  {
    color: '#9b59b6',
    textColor: 'white',
    text: 'time_limit_exceeded'
  },
  {
    color: '#e67e22',
    textColor: 'white',
    text: 'memory_limit_exceeded'
  },
  {
    color: '#f1c40f',
    textColor: 'white',
    text: 'runtime_error'
  },
  {
    color: '#3498db',
    textColor: 'white',
    text: 'compile_error'
  },
  {
    color: '#27ae60',
    textColor: 'white',
    text: 'presentation_error'
  },
  {
    color: '#e74c3c',
    textColor: 'white',
    text: 'judgement_failed'
  },
  {
    outline: true,
    color: '#c0392b',
    text: 'system_error'
  },
  {
    outline: true,
    color: '#2c3e50',
    text: 'other_error'
  }
]
