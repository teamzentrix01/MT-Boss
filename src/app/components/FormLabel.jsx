import RequiredAsterisk from './RequiredAsterisk';

export default function FormLabel({
  children,
  required = false,
  className,
  htmlFor,
  style,
  ...rest
}) {
  return (
    <label className={className} htmlFor={htmlFor} style={style} {...rest}>
      {children}
      {required ? (
        <>
          {' '}
          <RequiredAsterisk />
        </>
      ) : null}
    </label>
  );
}
