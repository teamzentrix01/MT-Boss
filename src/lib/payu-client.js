export function redirectToPayU(payment) {
  if (!payment?.endpoint || !payment?.fields) {
    throw new Error('The server did not return valid PayU checkout details.');
  }

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = payment.endpoint;

  Object.entries(payment.fields).forEach(([name, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = String(value ?? '');
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}
