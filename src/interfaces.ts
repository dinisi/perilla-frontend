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
