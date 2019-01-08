import React from "react";
import ReactDOM from "react-dom";

import styles from "./modal.module.css";

interface IProps {
	children?: React.ReactNode;
	isShown: boolean;
	title?: string;
	changeVisibility: (value: boolean) => void;
}

export default function Modal({
	children,
	isShown,
	title,
	changeVisibility,
}: IProps) {
	const closeHandler = () => changeVisibility(false);

	return ReactDOM.createPortal(
		<>
			<div
				className={`${styles.Backdrop} ${isShown && styles.Visible}`}
				onClick={closeHandler}
			/>
			<div className={`${styles.Body} ${isShown && styles.Visible}`}>
				<div className={styles.Top}>
					<h4 className="text d-inline-block mb-0"> {title} </h4>
					<span className={styles.BtnHolder}>
						<i
							className="material-icons text"
							onClick={closeHandler}
						>
							close
						</i>
					</span>
				</div>
				<hr />
				<div className={styles.ChildHolder}>{children}</div>
			</div>
		</>,
		document.querySelector("#root-container")!
	);
}
