const prefix = 'secloudive-lab-';

function storage(): Storage | null {
  return typeof window === 'undefined' ? null : window.localStorage;
}

export function labChecklistKey(labId: string): string {
  return `${prefix}${labId}`;
}

export function loadLabChecklist(labId: string, stepCount: number): boolean[] {
  const fallback = Array.from({ length: stepCount }, () => false);
  const value = storage()?.getItem(labChecklistKey(labId));
  if (!value) return fallback;
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? fallback.map((_, index) => parsed[index] === true) : fallback;
  } catch {
    return fallback;
  }
}

export function saveLabChecklist(labId: string, checked: boolean[]): void {
  storage()?.setItem(labChecklistKey(labId), JSON.stringify(checked));
}

export function clearLabChecklist(labId: string): void {
  storage()?.removeItem(labChecklistKey(labId));
}
