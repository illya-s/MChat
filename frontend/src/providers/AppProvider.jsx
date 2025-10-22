import { createContext } from "react";


const AppContext = createContext(null);

export function AppProvider({ children }) {
	return (
		<AppContext>
			{children}
		</AppContext>
	)
}