import { useState } from "react";

export default function SignUpPage(props) {

    const [loading, setLoading] = useState(false);

    const onSubmitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        if(name === "") {
            alert("Please enter a name");
            return;
        }

        if(email === "") {
            alert("Please enter an email");
            return;
        }

        if(password.length < 6) {
            alert("Password must be at least 6 characters long");
            return;
        }

        if(password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        setLoading(true);

        fetch("/api/v1/users", {
            method: "post",
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({name, email, password})
        }).then(res => {
            setLoading(false);
            if(res.status === 201 || res.status === 200) {
                alert("User created successfully. Please proceede to login");
                window.location.href = "/login";
            } else {
                res.json().then(data => {
                    alert("An error occurred " + data.message);
                })
            }
        }).catch(() => {
            alert("An error occurred while creating user");
        });

    }

    return (
        <div className="container">
            <h1>Sign Up</h1>
            <form onSubmit={onSubmitHandler}>
                <input type="text" placeholder="Name" name="name"  className="form-control"/>
                <input type="text" placeholder="Email" name="email"  className="form-control"/>
                <input type="password" placeholder="Password" name="password" className="form-control"/>
                <input type="password" placeholder="Confirm Password" name="confirmPassword" className="form-control"/>
                <button className="mt-3" type="submit">{loading ? "Loading..." : "Sign Up" }</button>
                <p className="mt-3">Already have an account? <a href="/login">Login</a></p>
            </form>
        </div>
    )
}