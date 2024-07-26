import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
export default function LoginPage(props) {

    const [loading, setLoading] = useState(false);

    const onSubmitHandler = (e) => {
        if(loading) {
            return;
        }
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email').trim();
        const password = formData.get('password');
        if(email === "") {
            alert("Please enter an email");
            return;
        }

        if(password === "") {
            alert("Please enter a password");
            return;
        }

        const data = JSON.stringify({ email, password });
        console.log(data);
        setLoading(true);

        fetch("/api/v1/auth/login", {
            method: "post", body: data,
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
        }).then(res => {
            setLoading(false);
            if(res.status === 200) {
                window.location.href = "/";
            } else if(res.status === 401) {
                alert("Invalid email or passowrd");
                res.json().then(data => console.log(data));
            } else {
                alert("An error occurred");
            }
        });
    }
    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={onSubmitHandler}>
                <input type="text" name="email" placeholder="email" />
                <input type="password" name="password" placeholder="Password" />
                <button type="submit" disabled={loading}>{ loading ? "Loading..." : "Login" }</button>
            </form>
            <p className='mt-3'><a href='/forgot-password'>Forgot my password</a></p>
            <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </div>
    )
}