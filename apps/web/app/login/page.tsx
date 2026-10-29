import Link from 'next/link';
import { AuthForm } from '../../components/auth-form';

export const metadata = { title: 'Log in' };

export default function LoginPage() {
  return (
    <>
      <AuthForm mode="login" />
      <p className="auth-backlink">
        <Link href="/">← Return home</Link>
      </p>
    </>
  );
}
