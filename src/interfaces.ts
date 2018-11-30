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
    text: 'Waiting Judge'
  },
  {
    outline: true,
    color: '#f39c12',
    text: 'Judging'
  },
  {
    color: '#7f8c8d',
    text: 'Skipped',
    textColor: 'white'
  },
  {
    color: '#2ecc71',
    text: 'Accepted',
    textColor: 'white'
  },
  {
    color: '#e74c3c',
    text: 'Wrong Answer',
    textColor: 'white'
  },
  {
    color: '#9b59b6',
    text: 'Time Limit Exceeded',
    textColor: 'white'
  },
  {
    color: '#e67e22',
    text: 'Memory Limit Exceeded',
    textColor: 'white'
  },
  {
    color: '#f1c40f',
    text: 'Runtime Error',
    textColor: 'white'
  },
  {
    color: '#3498db',
    text: 'Compile Error',
    textColor: 'white'
  },
  {
    color: '#27ae60',
    text: 'Presentation Error',
    textColor: 'white'
  },
  {
    color: '#e74c3c',
    text: 'Judgement Failed',
    textColor: 'white'
  },
  {
    outline: true,
    color: '#c0392b',
    text: 'SystemError'
  },
  {
    outline: true,
    color: '#2c3e50',
    text: 'OtherError'
  }
]
