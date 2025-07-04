export function isAdult(dob: string): boolean {
  const birthDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= 18;
  }
  return age >= 18;
}

export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

export function isValidFileSize(file: File, maxSizeMB: number): boolean {
  return file.size <= maxSizeMB * 1024 * 1024;
} 