/** Standalone unit tests for booking date overlap (no DB imports). */

function datesOverlap(startA, endA, startB, endB) {
  const aStart = new Date(startA);
  const bStart = new Date(startB);
  const aEnd = endA ? new Date(endA) : new Date('9999-12-31');
  const bEnd = endB ? new Date(endB) : new Date('9999-12-31');
  return aStart < bEnd && bStart < aEnd;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(datesOverlap('2026-01-01', '2026-06-01', '2026-05-01', '2026-12-01') === true, 'overlap mid');
assert(datesOverlap('2026-01-01', '2026-03-01', '2026-03-01', '2026-06-01') === false, 'touching end exclusive');
assert(datesOverlap('2026-01-01', null, '2026-06-01', '2026-07-01') === true, 'open ended overlap');
assert(datesOverlap('2026-01-01', '2026-02-01', '2026-03-01', '2026-04-01') === false, 'no overlap');

console.log('property-booking-overlap tests passed');
