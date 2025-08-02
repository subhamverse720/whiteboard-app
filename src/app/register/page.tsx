'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (res.ok) {
                router.push('/login');
            } else {
                const data = await res.json();
                setError(data.message || 'Something went wrong!');
            }
        } catch (err) {
            setError('Failed to register');
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
                    <h2 className="card-title text-2xl justify-center">Create an Account</h2>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="input input-bordered"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
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
                        <button type="submit" className="btn btn-primary">Sign Up</button>
                    </div>
                    <div className="text-center mt-4 text-sm">
                        {'Already have an account? '}
                        <Link href="/login" className="link link-primary">
                            Login
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
