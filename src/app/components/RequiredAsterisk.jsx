/**
 * Visual marker for required form fields. Pair with inputs that have the `required` attribute
 * or equivalent validation. Hidden from screen readers when the label already states "required".
 */
export default function RequiredAsterisk({ className = '' }) {
  return (
    <span
      className={className ? `field-required ${className}` : 'field-required'}
      aria-hidden="true"
    >
      *
    </span>
  );
}
