import { reactive } from 'vue';

export function useFormValidation<T extends Record<string, unknown>>() {
  const fieldErrors = reactive<Record<string, string>>({});
  let formError = '';

  function setFieldError(field: string, error: string) {
    fieldErrors[field] = error;
  }

  function clearFieldError(field: string) {
    delete fieldErrors[field];
  }

  function validateAll(rules: Array<{ field: string; validate: (values: T) => string | undefined }>, values: T): boolean {
    formError = '';
    let valid = true;
    for (const key of Object.keys(fieldErrors)) {
      delete fieldErrors[key];
    }
    for (const { field, validate } of rules) {
      const error = validate(values);
      if (error) {
        fieldErrors[field] = error;
        valid = false;
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

  return { fieldErrors, formError, setFieldError, clearFieldError, validateAll, resetErrors };
}
