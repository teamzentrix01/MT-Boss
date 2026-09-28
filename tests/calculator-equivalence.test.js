/**
 * Test to prove that with use_real_rates = false (the default),
 * the calculator output is 100% byte-for-byte identical to the original un-overridden calculation.
 */
import { getEffectiveRate } from '../pm-calculator-bridge.js';

function runEquivalenceTest() {
  console.log('--- Testing Calculator Equivalence with use_real_rates = false ---');

  // Baseline mock settings
  const baseSettings = {
    cityRate: { labour: 310, transport: 18 },
    quality: { labourMultiplier: 1.0, finishMultiplier: 1.0 },
    foundation: { materialMultiplier: 1.0, labourMultiplier: 1.0 },
    materialFactors: { steel: 3.8, cement: 0.42, bricks: 8.2, sand: 1.35, aggregate: 0.9 },
    materialPrices: { steel: 66, cement: 410, bricks: 10, sand: 48, aggregate: 46 },
  };

  const project = { area: 1200, floors: 2, quality: 'Standard' };
  const builtUpArea = project.area * project.floors;
  const floorWastage = 1 + (project.floors - 1) * 0.035;

  // 1. Original calculation (without any overrides helper)
  function originalCalc() {
    const materials = Object.entries(baseSettings.materialFactors).map(([key, factor]) => {
      const effFactor = factor * baseSettings.foundation.materialMultiplier * floorWastage * baseSettings.quality.finishMultiplier;
      const qty = Math.max(Math.ceil(builtUpArea * effFactor), 1);
      const price = Math.round(baseSettings.materialPrices[key]);
      return { key, qty, price, amount: qty * price };
    });

    const materialTotal = materials.reduce((s, m) => s + m.amount, 0);
    const labourBase = builtUpArea * baseSettings.cityRate.labour * baseSettings.quality.labourMultiplier * baseSettings.foundation.labourMultiplier;
    const labourTotal = Math.round(labourBase);
    const transportTotal = Math.round(builtUpArea * baseSettings.cityRate.transport);
    const supervisionTotal = Math.round((materialTotal + labourTotal) * 0.035);
    const contingencyTotal = Math.round((materialTotal + labourTotal + transportTotal) * 0.025);
    const grandTotal = materialTotal + labourTotal + transportTotal + supervisionTotal + contingencyTotal;

    return { builtUpArea, materials, materialTotal, labourTotal, transportTotal, supervisionTotal, contingencyTotal, grandTotal };
  }

  // 2. New calculation with getEffectiveRate where useRealRates = false (even if overrides exist in array)
  function newCalcWithFlagOff() {
    const rateOverrides = {
      useRealRates: false,
      overrides: [
        { metric_key: 'labour_rate', new_value: 500 },
        { metric_key: 'rate_steel', new_value: 99 },
        { metric_key: 'qty_cement', new_value: 1.5 },
      ],
    };

    const materials = Object.entries(baseSettings.materialFactors).map(([key, factor]) => {
      const effFactorBase = getEffectiveRate('qty_' + key, project.quality, factor, rateOverrides);
      const effFactor = effFactorBase * baseSettings.foundation.materialMultiplier * floorWastage * baseSettings.quality.finishMultiplier;
      const qty = Math.max(Math.ceil(builtUpArea * effFactor), 1);
      const rawPrice = baseSettings.materialPrices[key];
      const effPrice = getEffectiveRate('rate_' + key, project.quality, rawPrice, rateOverrides);
      const price = Math.round(effPrice);
      return { key, qty, price, amount: qty * price };
    });

    const materialTotal = materials.reduce((s, m) => s + m.amount, 0);
    const effLabourRate = getEffectiveRate('labour_rate', project.quality, baseSettings.cityRate.labour, rateOverrides);
    const labourBase = builtUpArea * effLabourRate * baseSettings.quality.labourMultiplier * baseSettings.foundation.labourMultiplier;
    const labourTotal = Math.round(labourBase);
    const transportTotal = Math.round(builtUpArea * baseSettings.cityRate.transport);
    const supervisionTotal = Math.round((materialTotal + labourTotal) * 0.035);
    const contingencyTotal = Math.round((materialTotal + labourTotal + transportTotal) * 0.025);
    const grandTotal = materialTotal + labourTotal + transportTotal + supervisionTotal + contingencyTotal;

    return { builtUpArea, materials, materialTotal, labourTotal, transportTotal, supervisionTotal, contingencyTotal, grandTotal };
  }

  const resultOrig = JSON.stringify(originalCalc());
  const resultNew = JSON.stringify(newCalcWithFlagOff());

  if (resultOrig === resultNew) {
    console.log('✅ EQUIVALENCE PROVEN: Output is 100% byte-for-byte identical when use_real_rates = false.');
    console.log('Result length:', resultNew.length, 'bytes');
    return true;
  } else {
    console.error('❌ MISMATCH DETECTED:');
    console.error('Original:', resultOrig);
    console.error('New:', resultNew);
    throw new Error('Calculator equivalence test failed');
  }
}

runEquivalenceTest();
