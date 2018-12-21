import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import AddBtn from "./AddBtn/AddBtn";
import ContactCard from "./Contact/ContactCard";
import Loader from "../../../ui/Loader/Loader";
import Search from "./Search/Search";

import {
	IContactData,
	IState,
	IUserData,
} from "../../../../shared/interfaces/interfaces";
import * as actions from "../../../../store/actions/actions";

import styles from "./contacts.module.css";
import sharedStyles from "../../../../shared/styles/sharedStyles.module.css";

const sortContacts = (user1: IContactData, user2: IContactData) => {
	if (user1.messages.length === 0 && user2.messages.length === 0) {
		return -1;
	} else if (user1.messages.length === 0 || user2.messages.length === 0) {
		return user2.messages.length - user1.messages.length;
	}
	return (
		user2.messages[user2.messages.length - 1].timestamp -
		user1.messages[user1.messages.length - 1].timestamp
	);
};

interface IProps {
	contacts: IContactData[];
	error: string;
	userData?: IUserData;
	isLoading: boolean;
	getContacts: (uid: string, privateKey: string) => void;
	selectContact: (index: number) => void;
}

function Contacts({
	contacts,
	error,
	isLoading,
	userData,
	getContacts,
	selectContact,
}: IProps) {
	const [query, setQuery] = useState("");

	useEffect(() => {
		if (userData && contacts.length === 0) {
			getContacts(userData.uid, userData.privateKey);
		}
	}, []);

	const filteredContacts = query
		? contacts.filter((contact) =>
				contact.username.toLowerCase().includes(query.toLowerCase())
		  )
		: [...contacts];
	filteredContacts.sort(sortContacts);

	const onClickHandler = (i: number) => {
		const uid = filteredContacts[i].uid;
		selectContact(contacts.findIndex((contact) => contact.uid === uid));
	};

	return (
		<div className={styles.Body} id="contacts">
			<Search query={query} setQuery={setQuery} />
			{error ? (
				<div className={styles.LoaderContainer}>
					<div className={sharedStyles.ErrorText}>
						<i className="fa fa-exclamation-circle d-inline-block pt-1" />
						<span className="d-inline-block pl-1 pb-2 text-wrap">
							{error}
						</span>
					</div>
				</div>
			) : isLoading ? (
				<div className={styles.LoaderContainer}>
					<Loader />
				</div>
			) : contacts.length === 0 ? (
				<div className={`text ${styles.LoaderContainer}`}>
					You don't have any contact
				</div>
			) : filteredContacts.length > 0 ? (
				filteredContacts.map((contactData, index) => {
					return (
						<ContactCard
							userData={contactData}
							key={contactData.uid}
							onClickHandler={() => onClickHandler(index)}
						/>
					);
				})
			) : (
				<div className={`text ${styles.LoaderContainer}`}>
					No match found
				</div>
			)}
			<span className={styles.BtnHolder}>
				<AddBtn />
			</span>
		</div>
	);
}

const mapStateToProps = (state: IState) => ({
	userData: state.auth.userData,
	contacts: state.contact.contacts,
	isLoading: state.contact.isLoading,
	error: state.contact.error,
});

const mapDispatchToProps = (dispatch: any) => ({
	getContacts: (uid: string, privateKey: string) =>
		dispatch(actions.getContacts(uid, privateKey)),
	selectContact: (index: number) => dispatch(actions.selectContact(index)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);
