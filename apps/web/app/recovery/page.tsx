import Link from 'next/link';
import { AuthForm } from '../../components/auth-form';

export const metadata = { title: 'Recover your account' };

export default function RecoveryPage() {
  return (
    <>
      <AuthForm mode="recovery" />
      <p className="auth-backlink">
        <Link href="/">← Return home</Link>
      </p>
    </>
  );
}
