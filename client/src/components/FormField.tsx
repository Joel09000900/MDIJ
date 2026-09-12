import type { ReactNode } from "react";

type Props = {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
};

export default function FormField({ label, name, error, required, children }: Props) {
  return (
    <div className={`field${error ? " has-error" : ""}`}>
      <label htmlFor={name}>
        {label}
        {required && <span className="field__required"> *</span>}
      </label>
      {children}
      {error && (
        <p className="field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
