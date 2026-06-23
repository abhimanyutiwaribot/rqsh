export interface TextField  { 
  value: string;
  cursor: number; 
}

export function makeField(value = ""): TextField {
  return { value, cursor: value.length };
}

export function tfInsert(f: TextField, ch: string): TextField {
  return { value: f.value.slice(0, f.cursor) + ch + f.value.slice(f.cursor), cursor: f.cursor + ch.length };
}

export function tfDelete(f: TextField): TextField {
  if (f.cursor === 0) return f;
  return { value: f.value.slice(0, f.cursor - 1) + f.value.slice(f.cursor), cursor: f.cursor - 1 };
}

export function tfLeft(f: TextField):  TextField { return { ...f, cursor: Math.max(0, f.cursor - 1) }; }
export function tfRight(f: TextField): TextField { return { ...f, cursor: Math.min(f.value.length, f.cursor + 1) }; }
