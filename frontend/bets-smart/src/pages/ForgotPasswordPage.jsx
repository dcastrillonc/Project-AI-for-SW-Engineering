import { useState } from "react";

export default function ForgotPasswordPage(props) {

    const [loading, setLoading] = useState(false);
    
    const onSubmitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email').trim();

        if(email === "") {
            alert("Please enter your email");
            return;
        }

        setLoading(true);
        fetch("/api/v1/auth/forgot-password", {
            method: "post",
            body: JSON.stringify({ email }),
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
        }).then(res => {
            setLoading(false);
            if(res.status === 200) {
                alert("If a user exists with the provided email, the reset password email was sent.");
            } else {
                alert("An error occurred when trying to reset your password. Please try again");
                res.json().then(data => console.log(data));
            }
        });
    }

    return (
        <div>
            <h1>Forgot Password Page</h1>
            <form onSubmit={onSubmitHandler}>
                <input type="email" name="email" placeholder="Email" />
                <button type="submit">Send</button>
            </form>
        </div>
    )
}