export type Question = {
  id: number;
  text: string;
} & (
  | { type: 'text' }
  | { type: 'select'; options: string[] }
  | { type: 'rating'; min: number; max: number }
);

export interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
}

export interface Answer {
  questionId: number;
  questionText: string;
  answerText: string;
}
