import React from "react";

import { decrypt } from "../../../../../cryptography/cipher";

import styles from "./chatMessage.module.css";

interface IProps {
	isUserSent: boolean;
	text: string;
	sharedKey: string;
	timestamp: number;
	reference?: (node: any) => void;
}

export default function ChatMessage({
	isUserSent,
	text,
	sharedKey,
	timestamp,
	reference,
}: IProps) {
	const date = new Date(timestamp);

	return (
		<div
			className={`text ${styles.Body} ${
				isUserSent ? styles.Sent : styles.Received
			}`}
		>
			<span className="text-break"> {decrypt(text, sharedKey)} </span>
			<br />
			{reference === undefined ? (
				<span
					className={styles.Time}
				>{`${date.getHours()}:${date
					.getMinutes()
					.toString()
					.padStart(2, "0")}`}</span>
			) : (
				<span
					ref={reference}
					className={styles.Time}
				>{`${date.getHours()}:${date
					.getMinutes()
					.toString()
					.padStart(2, "0")}`}</span>
			)}
		</div>
	);
}
