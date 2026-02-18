
export interface ExtractedData {
  text: string;
  language: string;
  summary?: string;
  keyTopics?: string[];
  suggestedSolutions?: Array<{
    question: string;
    answer: string;
  }>;
}

export enum ProcessingStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  OCR = 'OCR',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
