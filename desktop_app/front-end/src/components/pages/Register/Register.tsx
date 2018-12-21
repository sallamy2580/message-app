import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import AuthBackground from "../../ui/AuthBackground/AuthBackground";
import Button from "../../ui/Button/Button";
import GoogleAuth from "../../ui/GoogleAuth/GoogleAuth";
import Input from "../../ui/Input/Input";
import Loader from "../../ui/Loader/Loader";

import firebase from "../../../firebase/firebase";
import { IState } from "../../../shared/interfaces/interfaces";
import * as actions from "../../../store/actions/actions";

import styles from "../../../shared/styles/sharedStyles.module.css";

interface IProps {
	error: string;
	isLoading: boolean;
	user?: firebase.User;
	emailRegister: (email: string, password: string) => void;
	emailRegisterFail: (message: string) => void;
}

function Register({
	error,
	isLoading,
	user,
	emailRegister,
	emailRegisterFail,
}: IProps) {
	const [confirmPassword, setConfirmPassword] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	useEffect(() => {
		emailRegisterFail("");
	}, []);

	const onSubmitHandler = async (event: React.FormEvent) => {
		event.preventDefault();
		if (email.length === 0) {
			emailRegisterFail("Enter a valid Email Address");
			return;
		}
		if (password.length < 6) {
			emailRegisterFail("Password length must be greater than 6");
			return;
		}
		if (password !== confirmPassword) {
			emailRegisterFail("Password and Confirm Password must match");
			return;
		}
		emailRegister(email, password);
	};

	if (user) {
		return <Redirect to="/" />;
	}

	return (
		<AuthBackground>
			<div className={styles.Body}>
				<h1 className="text">REGISTER</h1>
				<hr className="mt-0" />
				<form className="py-2" onSubmit={onSubmitHandler}>
					<Input
						placeholder="Email"
						val={email}
						onChangeFunc={(email: string) => setEmail(email)}
						type="email"
					/>
					<Input
						placeholder="Password"
						val={password}
						onChangeFunc={(password: string) =>
							setPassword(password)
						}
						type="password"
					/>
					<Input
						placeholder="Confirm Password"
						val={confirmPassword}
						onChangeFunc={(password: string) =>
							setConfirmPassword(password)
						}
						type="password"
					/>
					<p className={`text ${styles.RedirectText}`}>
						Already a member? <Link to="/login">Login</Link>
					</p>
					{error && (
						<>
							<div className={styles.ErrorText}>
								<i className="fa fa-exclamation-circle d-inline-block pt-1" />
								<span className="d-inline-block pl-1 pb-2 text-wrap">
									{error}
								</span>
							</div>
						</>
					)}
					{isLoading ? <Loader /> : <Button>Register</Button>}
				</form>
				<GoogleAuth />
			</div>
		</AuthBackground>
	);
}

const mapStateToProps = (state: IState) => ({
	user: state.auth.user,
	isLoading: state.auth.isLoading,
	error: state.auth.error,
});

const mapDispatchToProps = (dispatch: any) => ({
	emailRegister: (email: string, password: string) =>
		dispatch(actions.emailRegister(email, password)),
	emailRegisterFail: (message: string) =>
		dispatch(actions.emailRegisterFail(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
