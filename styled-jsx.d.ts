/// <reference types="styled-jsx" />

// https://stackoverflow.com/questions/66011598/styled-jsx-typescript-error-after-migrating-to-monorepo-structure-property-jsx
import 'react';

declare module 'react' {
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
}
