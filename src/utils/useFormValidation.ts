import { reactive } from 'vue';

type ValidationRules<T> = {
  [K in keyof T]?: Array<(value: T[K], values: T) => string | undefined>;
};

export function useFormValidation<T extends Record<string, unknown>>(rules: ValidationRules<T>) {
  const fieldErrors = reactive<Record<string, string | undefined>>({});
  let formError = '';

  function validateField<K extends keyof T>(field: K, values: T) {
    const fieldRules = rules[field];
    if (!fieldRules) return;
    for (const rule of fieldRules) {
      const error = rule(values[field], values);
      if (error) {
        fieldErrors[field as string] = error;
        return;
      }
    }
    delete fieldErrors[field as string];
  }

  function validateAll(values: T): boolean {
    formError = '';
    let valid = true;
    for (const field of Object.keys(rules) as Array<keyof T>) {
      const fieldRules = rules[field];
      if (!fieldRules) continue;
      for (const rule of fieldRules) {
        const error = rule(values[field], values);
        if (error) {
          fieldErrors[field as string] = error;
          valid = false;
          break;
        }
      }
      if (!fieldErrors[field as string]) {
        delete fieldErrors[field as string];
      }
    }
    return valid;
  }

  function resetErrors() {
    formError = '';
    for (const key of Object.keys(fieldErrors)) {
      delete fieldErrors[key];
    }
  }

  return { fieldErrors, formError, validateField, validateAll, resetErrors } as {
    fieldErrors: Partial<Record<keyof T, string>>;
    formError: string;
    validateField: <K extends keyof T>(field: K, values: T) => void;
    validateAll: (values: T) => boolean;
    resetErrors: () => void;
  };
}
