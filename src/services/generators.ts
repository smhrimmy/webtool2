// Test Generators Service
import { 
  PasswordOptions, 
  GeneratedPassword,
  EmailObjectOptions,
  GeneratedEmailObject,
  FormSubmissionOptions,
  GeneratedFormSubmission
} from '@/types/generators';

// Password Generator
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const AMBIGUOUS = 'lIO01';
const CPANEL_SAFE_SYMBOLS = '!@#$%^*_+-=';

export function generatePassword(options: PasswordOptions): GeneratedPassword {
  let chars = '';
  
  if (options.includeLowercase) chars += LOWERCASE;
  if (options.includeUppercase) chars += UPPERCASE;
  if (options.includeNumbers) chars += NUMBERS;
  if (options.includeSymbols) {
    chars += options.cpanelCompatible ? CPANEL_SAFE_SYMBOLS : SYMBOLS;
  }
  
  if (options.excludeAmbiguous) {
    chars = chars.split('').filter(c => !AMBIGUOUS.includes(c)).join('');
  }
  
  if (chars.length === 0) chars = LOWERCASE + NUMBERS;
  
  let password = '';
  const array = new Uint32Array(options.length);
  crypto.getRandomValues(array);
  
  for (let i = 0; i < options.length; i++) {
    password += chars[array[i] % chars.length];
  }
  
  // Calculate strength
  const entropy = Math.log2(Math.pow(chars.length, options.length));
  let strength: GeneratedPassword['strength'] = 'weak';
  let crackTime = '< 1 second';
  
  if (entropy >= 128) {
    strength = 'very_strong';
    crackTime = 'centuries';
  } else if (entropy >= 80) {
    strength = 'strong';
    crackTime = 'years';
  } else if (entropy >= 60) {
    strength = 'good';
    crackTime = 'months';
  } else if (entropy >= 40) {
    strength = 'fair';
    crackTime = 'days';
  }
  
  return { password, strength, entropy: Math.round(entropy), crackTime };
}

// Email Object Generator
export function generateEmailObject(options: EmailObjectOptions): GeneratedEmailObject {
  const headers: Record<string, string> = {};
  const issues: string[] = [];
  
  headers['From'] = options.from;
  headers['To'] = options.to;
  headers['Subject'] = options.subject;
  
  if (options.includeMessageId) {
    const domain = options.from.split('@')[1] || 'example.com';
    headers['Message-ID'] = `<${Date.now()}.${Math.random().toString(36).substring(2)}@${domain}>`;
  } else {
    issues.push('Missing Message-ID header - may cause delivery issues');
  }
  
  if (options.includeDate) {
    headers['Date'] = new Date().toUTCString();
  } else {
    issues.push('Missing Date header - required by RFC 5322');
  }
  
  if (options.includeReturnPath) {
    headers['Return-Path'] = `<${options.from}>`;
  }
  
  headers['MIME-Version'] = '1.0';
  
  let mimeType = 'text/plain; charset=utf-8';
  let body = options.body;
  
  if (options.bodyType === 'html') {
    mimeType = 'text/html; charset=utf-8';
  } else if (options.bodyType === 'multipart') {
    const boundary = `----=_Part_${Date.now()}`;
    mimeType = `multipart/alternative; boundary="${boundary}"`;
    body = `--${boundary}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n${options.body}\r\n\r\n--${boundary}\r\nContent-Type: text/html; charset=utf-8\r\n\r\n<html><body>${options.body}</body></html>\r\n\r\n--${boundary}--`;
  }
  
  headers['Content-Type'] = mimeType;
  
  // Build raw email
  let raw = Object.entries(headers).map(([k, v]) => `${k}: ${v}`).join('\r\n');
  raw += '\r\n\r\n' + body;
  
  // Validate
  if (!options.from.includes('@')) issues.push('Invalid From address');
  if (!options.to.includes('@')) issues.push('Invalid To address');
  if (options.subject.length === 0) issues.push('Empty subject line');
  
  return {
    raw,
    headers,
    mimeType,
    issues,
    isValid: issues.length === 0,
  };
}

// Form Submission Generator
const FIRST_NAMES = {
  en: ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'James', 'Emma'],
  es: ['Juan', 'María', 'Carlos', 'Ana', 'Pedro', 'Lucía', 'Miguel', 'Carmen'],
  fr: ['Jean', 'Marie', 'Pierre', 'Sophie', 'Louis', 'Claire', 'Paul', 'Isabelle'],
  de: ['Hans', 'Anna', 'Peter', 'Maria', 'Klaus', 'Ursula', 'Stefan', 'Monika'],
};

const LAST_NAMES = {
  en: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Davis', 'Miller', 'Wilson'],
  es: ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Hernández', 'Pérez', 'Sánchez'],
  fr: ['Martin', 'Bernard', 'Thomas', 'Petit', 'Robert', 'Richard', 'Durand', 'Dubois'],
  de: ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker'],
};

const DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'example.com'];

const MESSAGES = [
  'I would like more information about your services.',
  'Please contact me regarding a quote.',
  'I have a question about my account.',
  'I am interested in scheduling a consultation.',
  'Could you please send me your product catalog?',
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateFormSubmission(options: FormSubmissionOptions): GeneratedFormSubmission {
  const fields: Record<string, string> = {};
  const locale = options.locale || 'en';
  
  if (options.includeName) {
    fields.firstName = randomItem(FIRST_NAMES[locale]);
    fields.lastName = randomItem(LAST_NAMES[locale]);
    fields.name = `${fields.firstName} ${fields.lastName}`;
  }
  
  if (options.includeEmail) {
    const name = fields.firstName?.toLowerCase() || 'user';
    fields.email = `${name}.${Math.floor(Math.random() * 1000)}@${randomItem(DOMAINS)}`;
  }
  
  if (options.includePhone) {
    fields.phone = `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`;
  }
  
  if (options.includeMessage) {
    fields.message = randomItem(MESSAGES);
  }
  
  if (options.includeAddress) {
    fields.address = `${Math.floor(Math.random() * 9999)} Main Street`;
    fields.city = 'Anytown';
    fields.state = 'CA';
    fields.zip = `${Math.floor(Math.random() * 90000 + 10000)}`;
  }
  
  // Custom fields
  options.customFields?.forEach(field => {
    switch (field.type) {
      case 'number':
        fields[field.name] = String(Math.floor(Math.random() * 1000));
        break;
      case 'date':
        fields[field.name] = new Date().toISOString().split('T')[0];
        break;
      case 'email':
        fields[field.name] = `custom.${Math.random().toString(36).substring(7)}@example.com`;
        break;
      default:
        fields[field.name] = `Test ${field.name}`;
    }
  });
  
  return {
    fields,
    json: JSON.stringify(fields, null, 2),
    urlEncoded: new URLSearchParams(fields).toString(),
  };
}
