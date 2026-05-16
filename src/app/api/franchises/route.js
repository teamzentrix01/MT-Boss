import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT * FROM franchises ORDER BY created_at DESC'
    );
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Franchises fetch error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name, fatherName, dob, gender, maritalStatus, phone, email,
      occupation, qualification, annualIncome, idType, idNumber, pan,
      address, district, city, state, pinCode, currentBusiness, experience,
      constructionExp, employees, network, bankName, branchName,
      accountNumber, ifscCode, model, investment, territory, referralSource,
      startDate, serviceCategory, officeArea, officeDistrict, premisesOwnership,
      leaseDuration, officeArea_sqft, officeType, message, otherFranchise,
      trainingWilling,
    } = body;

    if (!name || !email || !phone || !model) {
      return NextResponse.json({ success: false, error: 'Required fields missing' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO franchises (
        name, father_name, dob, gender, marital_status, phone, email,
        occupation, qualification, annual_income, id_type, id_number, pan,
        address, district, city, state, pin_code, current_business, experience,
        construction_exp, employees, network, bank_name, branch_name,
        account_number, ifsc_code, model, investment, territory, referral_source,
        start_date, service_category, office_area, office_district, premises_ownership,
        lease_duration, office_area_sqft, office_type, message, other_franchise,
        training_willing
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,
        $19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,
        $35,$36,$37,$38,$39,$40,$41,$42
      ) RETURNING *`,
      [
        name, fatherName, dob, gender, maritalStatus, phone, email,
        occupation, qualification, annualIncome, idType, idNumber, pan,
        address, district, city, state, pinCode, currentBusiness, experience,
        constructionExp, employees, network, bankName, branchName,
        accountNumber, ifscCode, model, investment, territory, referralSource,
        startDate, serviceCategory, officeArea, officeDistrict, premisesOwnership,
        leaseDuration, officeArea_sqft, officeType, message, otherFranchise,
        trainingWilling,
      ]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Franchise submit error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const { id, status } = await req.json();
    const result = await pool.query(
      'UPDATE franchises SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}