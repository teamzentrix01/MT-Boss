import ConstructionCalculator from '../components/ConstructionCalculator';
import { cookies } from 'next/headers';

export default async function CalculatorPage() {
  const cookieStore = await cookies();
  const isAuthenticated = Boolean(cookieStore.get('auth-token')?.value);

  return <ConstructionCalculator initialIsLoggedIn={isAuthenticated} />;
}
