import { useState } from "react"

export default function ResetPasswordPage(props) {
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = (e) => {
        e.preventDefault();
        if(loading) return;
        const formData = new FormData(e.target);
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword').trim();

        const token = window.location.search.replace(/^\?t=/, "");

        if(password.length < 6) {
            alert("Password must be at least 6 characters long");
            return;
        }

        if(password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        setLoading(true);
        fetch("/api/v1/auth/reset-password", {
            method: "post",
            body: JSON.stringify({ password, token }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            if(res.status === 200) {
                alert("Password reset successful. Please proceed to login");
                window.location.href = "/login";
            } else {
                alert("An error occurred. Please try again");
                res.json().then(data => {
                    console.log(data);
                });
            }
        });
    }
    return (
        <div className="div">
            <h1>Reset your password</h1>
            <form onSubmit={onSubmitHandler}>
                <input type="password" placeholder="Enter your new passord" name="password" />
                <input type="password" placeholder="Confirm your new password" name="confirmPassword" />
                <input type="submit" value="Reset password" />
            </form>
        </div>
    )
}