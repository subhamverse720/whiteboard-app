'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (res?.error) {
                setError('Invalid credentials');
                return;
            }

            router.replace('/room');
        } catch (err) {
            setError('Failed to login');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-animation p-4">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card w-full max-w-sm shadow-2xl bg-base-100/50 backdrop-blur-lg"
            >
                <form className="card-body" onSubmit={handleSubmit}>
                    <h2 className="card-title text-2xl justify-center">Welcome Back!</h2>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="email"
                            placeholder="email@example.com"
                            className="input input-bordered"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="password"
                            className="input input-bordered"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-error text-sm text-center">{error}</p>}
                    <div className="form-control mt-6">
                        <button type="submit" className="btn btn-primary">Login</button>
                    </div>
                    <div className="text-center mt-4 text-sm">
                        {"Don't have an account? "}
                        <Link href="/register" className="link link-primary">
                            Sign Up
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
