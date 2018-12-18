import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import Modal from "../../../../ui/Modal/Modal";

import { IContactData } from "../../../../../shared/interfaces/interfaces";
import * as actions from "../../../../../store/actions/actions";

import styles from "./userInfo.module.css";

interface IProps {
	userData: IContactData;
	clearSelectContact: () => void;
}

function UserInfo({ userData, clearSelectContact }: IProps) {
	const [isShown, setIsShown] = useState(false);

	return (
		<>
			<div className={styles.Body} onClick={() => setIsShown(true)}>
				<Link to="/">
					<i
						className="fa fa-arrow-left mr-3 fs-6 text"
						aria-hidden="true"
						onClick={clearSelectContact}
					/>
				</Link>
				<div className={styles.UserDetails}>
					<div className={`mr-2 ${styles.ProfilePicure}`}>
						<img src={userData.photoUrl} alt="" />
					</div>
					<span className="text fw-bold fs-6">
						{userData.username}
					</span>
				</div>
			</div>
			<Modal
				title="User Profile"
				isShown={isShown}
				changeVisibility={setIsShown}
			>
				<div className={styles.ModalBody}>
					<img src={userData.photoUrl} alt=" " />
					<h5 className="d-inline-block mt-4 text-break text-center">
						<span>Username: </span>
						<span className="fw-light">{userData.username}</span>
					</h5>
					<h5 className="d-inline-block my-2 text-break text-center">
						<span>About: </span>
						<span className="fw-light"> {userData.about} </span>
					</h5>
				</div>
			</Modal>
		</>
	);
}

const mapDispatchToProps = (dispatch: any) => ({
	clearSelectContact: () => dispatch(actions.clearSelectContact()),
});

export default connect(null, mapDispatchToProps)(UserInfo);
