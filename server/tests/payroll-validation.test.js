import test from 'node:test';
import assert from 'node:assert/strict';

import { validatePayrollInput, calculatePayrollDetails } from '../src/validation.js';

test('validatePayrollInput rejects empty period or workers', () => {
  const result = validatePayrollInput({ month: '', workers: [] });

  assert.equal(result.valid, false);
  assert.ok(result.errors.length >= 2);
});

test('validatePayrollInput accepts valid input', () => {
  const result = validatePayrollInput({
    month: '2026-10',
    workers: [
      {
        worker_id: 1,
        worked_days: 22,
        base_salary: 2000,
      },
    ],
  });

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test('calculatePayrollDetails computes gross and net with configurable parameters', () => {
  const result = calculatePayrollDetails(
    {
      base_salary: 2000,
      family_allowance: 150,
      other_income: 50,
      overtime_hours: 4,
      deductions: 100,
      employer_contributions: 30,
      worked_days: 22,
    },
    {
      overtime_rate: 20,
      absence_penalty_rate: 0.02,
    }
  );

  assert.ok(result.gross > 0);
  assert.ok(result.net > 0);
  assert.equal(result.overtimeValue, 80);
  assert.ok(result.deductions >= 100);
});
