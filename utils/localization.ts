import * as fs from 'node:fs';
import * as path from 'node:path';

interface LanguageItem {
  hint?: string;
  message: string;
  invalidMessage?: string;
  dirForPrompts?: {
    current: string;
    target: string;
  };
  toggleOptions?: {
    active: string;
    inactive: string;
  };
  selectOptions?: {
    [key: string]: { title: string; desc?: string };
  };
}

export interface Language {
  programName: LanguageItem;
  shouldOverride: LanguageItem;
  organizationName: LanguageItem;
  programCrateName: LanguageItem;
  programAddress: LanguageItem;
  programFramework: LanguageItem;
  clients: LanguageItem;
  jsClientPackageName: LanguageItem;
  rustClientCrateName: LanguageItem;
  errors: {
    anchorCliNotFound: string;
    cannotOverrideDirectory: string;
    invalidVersion: string;
    operationCancelled: string;
    solanaCliNotFound: string;
    solanaKeygenFailed: string;
  };
  defaultToggleOptions: {
    active: string;
    inactive: string;
  };
  instructions: {
    select: string;
    multiselect: string;
  };
  infos: {
    detectAnchorVersion: string;
    detectRustVersion: string;
    detectSolanaVersion: string;
    generateKeypair: string;
    scaffold: string;
    done: string;
  };
}

/**
 *
 * This function is used to link obtained locale with correct locale file in order to make locales reusable
 *
 * @param locale the obtained locale
 * @returns locale that linked with correct name
 */
function linkLocale(locale: string) {
  try {
    // @ts-ignore
    switch (Intl.getCanonicalLocales(locale)[0]) {
      case 'zh-TW':
      case 'zh-HK':
      case 'zh-MO':
        return 'zh-Hant';
        break;
      case 'zh-CN':
      case 'zh-SG':
        return 'zh-Hans';
        break;
      default:
        return locale;
    }
  } catch (error) {
    console.log(`${(error as Error).toString()}\n`);
    return locale;
  }
}

function getLocale() {
  const shellLocale =
    process.env.LC_ALL || // POSIX locale environment variables
    process.env.LC_MESSAGES ||
    process.env.LANG ||
    Intl.DateTimeFormat().resolvedOptions().locale || // Built-in ECMA-402 support
    'en-US'; // Default fallback

  return linkLocale(shellLocale.split('.')[0].replace('_', '-'));
}

export function getLanguage() {
  const locale = getLocale();

  // Note here __dirname would not be transpiled,
  // so it refers to the __dirname of the file `<repositoryRoot>/outfile.cjs`
  const localesRoot = path.resolve(__dirname, 'locales');
  const languageFilePath = path.resolve(localesRoot, `${locale}.json`);
  const doesLanguageExist = fs.existsSync(languageFilePath);

  const lang: Language = doesLanguageExist
    ? require(languageFilePath)
    : require(path.resolve(localesRoot, 'en-US.json'));

  return lang;
}
