import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import CheckoutClient from './CheckoutClient';

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const userSession = cookieStore.get('user_session');

  if (!userSession) {
    redirect(
      `/login?from=/checkout&notice=${encodeURIComponent(
        'يرجى تسجيل الدخول لإتمام الطلب'
      )}`
    );
  }

  return <CheckoutClient />;
}
