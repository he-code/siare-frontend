import { reactive } from 'vue';

type ValidationRules<T> = {
  [K in keyof T]?: Array<(value: T[K], values: T) => string | undefined>;
};

export function useFormValidation<T extends Record<string, unknown>>(rules: ValidationRules<T>) {
  const fieldErrors = reactive<Partial<Record<keyof T, string>>>({});
  let formError = '';

  function validateField<K extends keyof T>(field: K, values: T) {
    const fieldRules = rules[field];
    if (!fieldRules) return;
    for (const rule of fieldRules) {
      const error = rule(values[field], values);
      if (error) {
        fieldErrors[field] = error;
        return;
      }
    }
    delete fieldErrors[field];
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
          fieldErrors[field] = error;
          valid = false;
          break;
        }
      }
      if (!fieldErrors[field]) {
        delete fieldErrors[field];
      }
    }
    return valid;
  }

  function resetErrors() {
    formError = '';
    for (const key of Object.keys(fieldErrors)) {
      delete fieldErrors[key as keyof T];
    }
  }

  return { fieldErrors, formError, validateField, validateAll, resetErrors };
}
