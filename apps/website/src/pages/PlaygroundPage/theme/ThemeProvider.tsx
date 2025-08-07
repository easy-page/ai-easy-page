import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

export enum Theme {
	Dark = 'dark',
	Light = 'light',
	Blue = 'blue',
	Yellow = 'yellow',
	System = 'system',
}

// type Theme = 'dark' | 'light' | 'blue' | 'system';

type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
};

type ThemeProviderState = {
	theme: Theme;
	nextTheme: Theme;
	setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
	theme: Theme.Blue,
	nextTheme: Theme.Yellow,
	setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function JarvisThemeProvider({
	children,
	defaultTheme = Theme.Blue,
	storageKey = 'jarvis-ui-theme',
	...props
}: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(
		() => (localStorage.getItem(storageKey) as Theme) || defaultTheme
	);

	const [nextTheme, setNextTheme] = useState<Theme>(Theme.Blue);

	useEffect(() => {
		const root = window.document.documentElement;

		root.classList.remove(Theme.Blue, Theme.Yellow);

		if (theme === Theme.System) {
			const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
				.matches
				? Theme.Dark
				: Theme.Blue;

			root.classList.add(systemTheme);
		} else {
			root.classList.add(theme);
		}

		const next: Theme = (() => {
			switch (theme) {
				case Theme.Dark:
					return Theme.Dark;
				case Theme.Light:
					return Theme.Blue;
				case Theme.Blue:
					return Theme.System;
				case Theme.System:
					return Theme.Yellow;
				case Theme.Yellow:
					return Theme.Dark;
				default:
					return Theme.Yellow;
			}
		})();

		setNextTheme(next);
	}, [theme]);

	const value = {
		theme,
		nextTheme,
		setTheme: (newTheme: Theme) => {
			localStorage.setItem(storageKey, newTheme);
			setTheme(newTheme);
		},
	};

	return (
		<ThemeProviderContext.Provider {...props} value={value}>
			{children}
		</ThemeProviderContext.Provider>
	);
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext);
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};
