export const MAX_RANDOM_PARAGRAPH_LENGTH = 20000;

export type RandomParagraphMode = 'complex' | 'readable';

type RandomParagraphOptions = {
    mode?: RandomParagraphMode;
    includeLowercase?: boolean;
    includeUppercase?: boolean;
    includeNumbers?: boolean;
    includeSpecialCharacters?: boolean;
    includeSpaces?: boolean;
    customSpecialCharacters?: string;
    readableWordPool?: string[];
};

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const DEFAULT_SPECIAL_CHARACTERS = "!@#$%^&*()-_=+[]{}|;:',.<>/?~";
const SPACES = '     ';
const DEFAULT_READABLE_WORD_POOL = [
    'analysis',
    'offence',
    'behaviour',
    'risk',
    'response',
    'report',
    'assessment',
    'support',
    'background',
    'history',
    'supervision',
    'progress',
    'review',
    'community',
    'safeguarding',
    'sentence',
];

function randomCharacter(chars: string): string {
    if (chars.length === 0) {
        throw new Error('Character source cannot be empty');
    }
    return chars.charAt(Math.floor(Math.random() * chars.length));
}

function shuffle(chars: string[]): string[] {
    for (let i = chars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const current = chars[i];
        const target = chars[j];
        if (current === undefined || target === undefined) {
            continue;
        }
        chars[i] = target;
        chars[j] = current;
    }
    return chars;
}

function generateReadableParagraph(length: number, readableWordPool: string[]): string {
    const words = readableWordPool.length > 0 ? readableWordPool : DEFAULT_READABLE_WORD_POOL;
    let paragraph = '';
    let sentenceWordCount = 0;

    while (paragraph.length < length) {
        const useNumber = sentenceWordCount > 0 && sentenceWordCount % 6 === 0;
        const token = useNumber
            ? String(Math.floor(Math.random() * 9000) + 1000)
            : words[Math.floor(Math.random() * words.length)] ?? 'text';

        if (paragraph.length === 0) {
            paragraph += token.charAt(0).toUpperCase() + token.slice(1);
        } else {
            paragraph += ` ${token}`;
        }

        sentenceWordCount++;

        if (sentenceWordCount >= 12) {
            paragraph += '. ';
            sentenceWordCount = 0;
        }
    }

    return paragraph.slice(0, length);
}

export function generateRandomParagraph(
    length: number,
    options: RandomParagraphOptions = {},
): string {
    if (!Number.isInteger(length) || length < 1) {
        throw new Error('Length must be a positive integer');
    }

    if (length > MAX_RANDOM_PARAGRAPH_LENGTH) {
        throw new Error(`Length must be less than or equal to ${MAX_RANDOM_PARAGRAPH_LENGTH}`);
    }

    const {
        mode = 'complex',
        includeLowercase = true,
        includeUppercase = true,
        includeNumbers = true,
        includeSpecialCharacters = true,
        includeSpaces = true,
        customSpecialCharacters = DEFAULT_SPECIAL_CHARACTERS,
        readableWordPool = DEFAULT_READABLE_WORD_POOL,
    } = options;

    if (mode === 'readable') {
        return generateReadableParagraph(length, readableWordPool);
    }

    const characterSets: string[] = [];
    const requiredCharacters: string[] = [];

    if (includeLowercase) {
        characterSets.push(LOWERCASE);
        requiredCharacters.push(randomCharacter(LOWERCASE));
    }

    if (includeUppercase) {
        characterSets.push(UPPERCASE);
        requiredCharacters.push(randomCharacter(UPPERCASE));
    }

    if (includeNumbers) {
        characterSets.push(NUMBERS);
        requiredCharacters.push(randomCharacter(NUMBERS));
    }

    if (includeSpecialCharacters && customSpecialCharacters.length > 0) {
        characterSets.push(customSpecialCharacters);
        requiredCharacters.push(randomCharacter(customSpecialCharacters));
    }

    if (includeSpaces) {
        characterSets.push(SPACES);
    }

    if (characterSets.length === 0) {
        throw new Error('At least one character type must be enabled');
    }

    if (requiredCharacters.length > length) {
        throw new Error('Requested length is too short for all required character groups');
    }

    const characterPool = characterSets.join('');
    const generatedCharacters = [...requiredCharacters];

    while (generatedCharacters.length < length) {
        generatedCharacters.push(randomCharacter(characterPool));
    }

    return shuffle(generatedCharacters).join('');
}

export function generateReadableRandomParagraph(length: number, readableWordPool?: string[]): string {
    return generateRandomParagraph(length, {
        mode: 'readable',
        ...(readableWordPool ? { readableWordPool } : {}),
    });
}
