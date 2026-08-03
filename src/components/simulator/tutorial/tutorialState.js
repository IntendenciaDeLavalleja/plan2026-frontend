export const SIMULATOR_CALCULATOR_PATH = '/simulador/calcular';

export function getPreviousTutorialStepIndex(currentStep) {
  return Math.max(0, currentStep - 1);
}

export function getNextTutorialStepIndex(currentStep, totalSteps) {
  return Math.min(Math.max(0, totalSteps - 1), currentStep + 1);
}

export function isLastTutorialStep(currentStep, totalSteps) {
  return currentStep === totalSteps - 1;
}
