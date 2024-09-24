import { createRoot } from "react-dom/client";
import ConfirmAlert from "./delete-modal";


export const confirmAlert = (options?: {
	title?: string;
	message?: string;
	confirmLabel?: string;
	cancelLabel?: string;
}): Promise<void> => {
	return new Promise((resolve, reject) => {
		const div = document.createElement("div");
		document.body.appendChild(div);

		const handleConfirm = () => {
			resolve();
			cleanup();
		};

		const handleCancel = () => {
			reject();
			cleanup();
		};

		const root = createRoot(div);
		const cleanup = () => {
			root.unmount();
			document.body.removeChild(div);
		};

		root.render(
			<ConfirmAlert
				title={options?.title}
				message={options?.message}
				confirmLabel={options?.confirmLabel}
				cancelLabel={options?.cancelLabel}
				onConfirm={handleConfirm}
				onCancel={handleCancel} />
		);
	});
};

