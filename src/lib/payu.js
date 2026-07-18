import crypto from 'crypto';

const REQUEST_UDF_FIELDS = ['udf1', 'udf2', 'udf3', 'udf4', 'udf5'];

function sha512(value) {
  return crypto.createHash('sha512').update(value).digest('hex');
}

export function getPayUConfig() {
  const key = process.env.PAYU_KEY?.trim();
  const salt = process.env.PAYU_SALT?.trim();
  const environment = process.env.PAYU_ENV === 'production' ? 'production' : 'test';

  if (!key || !salt) {
    throw new Error('PayU is not configured. Set PAYU_KEY and PAYU_SALT.');
  }

  return {
    key,
    salt,
    environment,
    paymentUrl: environment === 'production'
      ? 'https://secure.payu.in/_payment'
      : 'https://test.payu.in/_payment',
  };
}

export function createPayURequest(fields) {
  const config = getPayUConfig();
  const normalized = {
    key: config.key,
    txnid: String(fields.txnid),
    amount: Number(fields.amount).toFixed(2),
    productinfo: String(fields.productinfo),
    firstname: String(fields.firstname),
    email: String(fields.email),
    phone: String(fields.phone),
    surl: String(fields.surl),
    furl: String(fields.furl),
    udf1: String(fields.udf1 || ''),
    udf2: String(fields.udf2 || ''),
    udf3: String(fields.udf3 || ''),
    udf4: String(fields.udf4 || ''),
    udf5: String(fields.udf5 || ''),
  };

  const hashParts = [
    normalized.key,
    normalized.txnid,
    normalized.amount,
    normalized.productinfo,
    normalized.firstname,
    normalized.email,
    ...REQUEST_UDF_FIELDS.map((name) => normalized[name]),
    '', '', '', '', '',
    config.salt,
  ];

  return {
    endpoint: config.paymentUrl,
    fields: { ...normalized, hash: sha512(hashParts.join('|')) },
  };
}

export function verifyPayUResponse(fields) {
  const { key, salt } = getPayUConfig();
  const reverseParts = [
    salt,
    String(fields.status || ''),
    '', '', '', '', '',
    String(fields.udf5 || ''),
    String(fields.udf4 || ''),
    String(fields.udf3 || ''),
    String(fields.udf2 || ''),
    String(fields.udf1 || ''),
    String(fields.email || ''),
    String(fields.firstname || ''),
    String(fields.productinfo || ''),
    String(fields.amount || ''),
    String(fields.txnid || ''),
    key,
  ];

  if (fields.additionalCharges || fields.additional_charges) {
    reverseParts.unshift(String(fields.additionalCharges || fields.additional_charges));
  }

  const expected = sha512(reverseParts.join('|'));
  const received = String(fields.hash || '').toLowerCase();
  if (!received || received.length !== expected.length) return false;

  return crypto.timingSafeEqual(Buffer.from(received), Buffer.from(expected));
}
