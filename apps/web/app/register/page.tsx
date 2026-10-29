import Link from 'next/link';
import { AuthForm } from '../../components/auth-form';

export const metadata = { title: 'Create an account' };

export default function RegisterPage() {
  return (
    <>
      <AuthForm mode="register" />
      <p className="auth-backlink">
        <Link href="/">← Return home</Link>
      </p>
    </>
  );
}
