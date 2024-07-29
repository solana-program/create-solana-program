import { getInputsFromArgs } from './inputArgs';
import { getDefaultInputs, type Inputs } from './inputCore';
import { getInputsFromPrompts } from './inputPrompts';
import type { Language } from './localization';

export async function getInputs(language: Language): Promise<Inputs> {
  const argInputs = getInputsFromArgs();
  const defaultInputs = getDefaultInputs(argInputs);

  if (argInputs.useDefaults) {
    return defaultInputs;
  }

  return getInputsFromPrompts(language, argInputs);
}
