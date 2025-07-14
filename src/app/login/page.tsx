"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React,{ useState } from "react";

export default function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter()

      const handleSubmit = async (e:React.FormEvent<HTMLFormElement>)=> {
        e.preventDefault();

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false
        })

        if(res?.ok) {
            router.push("/")
        } else {
            router.push("/")
        }
      };
    

    
      return(
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>

            <div>
                Don't have an account?
                <button onClick={() => router.push("/register")}>Register</button>
            </div>
        </div>
    )    
}