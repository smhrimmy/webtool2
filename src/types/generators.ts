// Test Generator Types

export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous: boolean;
  cpanelCompatible: boolean;
}

export interface GeneratedPassword {
  password: string;
  strength: 'weak' | 'fair' | 'good' | 'strong' | 'very_strong';
  entropy: number;
  crackTime: string;
}

export interface EmailObjectOptions {
  from: string;
  to: string;
  subject: string;
  body: string;
  bodyType: 'plain' | 'html' | 'multipart';
  includeMessageId: boolean;
  includeDate: boolean;
  includeReturnPath: boolean;
  attachments?: { name: string; type: string; content: string }[];
}

export interface GeneratedEmailObject {
  raw: string;
  headers: Record<string, string>;
  mimeType: string;
  issues: string[];
  isValid: boolean;
}

export interface FormSubmissionOptions {
  includeEmail: boolean;
  includeName: boolean;
  includePhone: boolean;
  includeMessage: boolean;
  includeAddress: boolean;
  customFields?: { name: string; type: 'text' | 'number' | 'date' | 'email' }[];
  locale: 'en' | 'es' | 'fr' | 'de';
}

export interface GeneratedFormSubmission {
  fields: Record<string, string>;
  json: string;
  urlEncoded: string;
}
