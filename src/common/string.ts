// https://stackoverflow.com/questions/40716894/angular2-or-typescript-left-padding-a-string-with-zeros
export function padLeft(text: string, padChar: string, size: number): string {
  return (String(padChar).repeat(size) + text).substr( (size * -1), size) ;
}
