import { Transform, TransformFnParams } from 'class-transformer';

export function ToBoolean(): (target: unknown, key: string) => void {
  return Transform((params: TransformFnParams) => {
    const { value } = params;
    if (typeof value === 'boolean') {
      return value;
    }
    if (value?.toString()?.toLowerCase() === 'false') {
      return false;
    }
    if (value?.toString()?.toLowerCase() === 'true') {
      return true;
    }

    return undefined;
  });
}
