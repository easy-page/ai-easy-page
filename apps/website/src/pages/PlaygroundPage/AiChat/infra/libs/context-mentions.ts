import { Fzf } from 'fzf';

/*
Mention regex:
- **Purpose**: 
  - To identify and highlight specific mentions in text that start with '@'. 
  - These mentions can be file paths, URLs, or the exact word 'problems'.
  - Ensures that trailing punctuation marks (like commas, periods, etc.) are not included in the match, allowing punctuation to follow the mention without being part of it.

- **Regex Breakdown**:
  - `/@`: 
	- **@**: The mention must start with the '@' symbol.
  
  - `((?:\/|\w+:\/\/)[^\s]+?|problems\b)`:
	- **Capturing Group (`(...)`)**: Captures the part of the string that matches one of the specified patterns.
	- `(?:\/|\w+:\/\/)`: 
	  - **Non-Capturing Group (`(?:...)`)**: Groups the alternatives without capturing them for back-referencing.
	  - `\/`: 
		- **Slash (`/`)**: Indicates that the mention is a file or folder path starting with a '/'.
	  - `|`: Logical OR.
	  - `\w+:\/\/`: 
		- **Protocol (`\w+://`)**: Matches URLs that start with a word character sequence followed by '://', such as 'http://', 'https://', 'ftp://', etc.
	- `[^\s]+?`: 
	  - **Non-Whitespace Characters (`[^\s]+`)**: Matches one or more characters that are not whitespace.
	  - **Non-Greedy (`+?`)**: Ensures the smallest possible match, preventing the inclusion of trailing punctuation.
	- `|`: Logical OR.
	- `problems\b`: 
      - **Exact Word ('problems')**: Matches the exact word 'problems'.
      - **Word Boundary (`\b`)**: Ensures that 'problems' is matched as a whole word and not as part of another word (e.g., 'problematic').
    - `terminal\b`:
      - **Exact Word ('terminal')**: Matches the exact word 'terminal'.
      - **Word Boundary (`\b`)**: Ensures that 'terminal' is matched as a whole word and not as part of another word (e.g., 'terminals').

  - `(?=[.,;:!?]?(?=[\s\r\n]|$))`:
	- **Positive Lookahead (`(?=...)`)**: Ensures that the match is followed by specific patterns without including them in the match.
	- `[.,;:!?]?`: 
	  - **Optional Punctuation (`[.,;:!?]?`)**: Matches zero or one of the specified punctuation marks.
	- `(?=[\s\r\n]|$)`: 
	  - **Nested Positive Lookahead (`(?=[\s\r\n]|$)`)**: Ensures that the punctuation (if present) is followed by a whitespace character, a line break, or the end of the string.
  
- **Summary**:
  - The regex effectively matches:
	- Mentions that are file or folder paths starting with '/' and containing any non-whitespace characters (including periods within the path).
	- URLs that start with a protocol (like 'http://') followed by any non-whitespace characters (including query parameters).
	- The exact word 'problems'.
  - The exact word 'terminal'.
	- The exact word 'git-changes'.
  - It ensures that any trailing punctuation marks (such as ',', '.', '!', etc.) are not included in the matched mention, allowing the punctuation to follow the mention naturally in the text.

- **Global Regex**:
  - `mentionRegexGlobal`: Creates a global version of the `mentionRegex` to find all matches within a given string.

*/
export const mentionRegex =
	/@((?:\/|\w+:\/\/)[^\s]+?|[a-f0-9]{7,40}\b|problems\b|terminal\b|git-changes\b)(?=[.,;:!?]?(?=[\s\r\n]|$))/;
export const MentionRegexGlobal = new RegExp(mentionRegex.source, 'g');

export function insertMention(
	text: string,
	position: number,
	value: string
): { newValue: string; mentionIndex: number } {
	const beforeCursor = text.slice(0, position);
	const afterCursor = text.slice(position);

	// Find the position of the last '@' symbol before the cursor
	const lastAtIndex = beforeCursor.lastIndexOf('@');

	let newValue: string;
	let mentionIndex: number;

	if (lastAtIndex !== -1) {
		// If there's an '@' symbol, replace everything after it with the new mention
		const beforeMention = text.slice(0, lastAtIndex);
		newValue =
			beforeMention + '@' + value + ' ' + afterCursor.replace(/^[^\s]*/, '');
		mentionIndex = lastAtIndex;
	} else {
		// If there's no '@' symbol, insert the mention at the cursor position
		newValue = beforeCursor + '@' + value + ' ' + afterCursor;
		mentionIndex = position;
	}

	return { newValue, mentionIndex };
}

export function removeMention(
	text: string,
	position: number
): { newText: string; newPosition: number } {
	const beforeCursor = text.slice(0, position);
	const afterCursor = text.slice(position);

	// Check if we're at the end of a mention
	const matchEnd = beforeCursor.match(new RegExp(mentionRegex.source + '$'));

	if (matchEnd) {
		// If we're at the end of a mention, remove it
		const newText =
			text.slice(0, position - matchEnd[0].length) +
			afterCursor.replace(' ', ''); // removes the first space after the mention
		const newPosition = position - matchEnd[0].length;
		return { newText, newPosition };
	}

	// If we're not at the end of a mention, just return the original text and position
	return { newText: text, newPosition: position };
}

export enum ContextMenuOptionType {
	File = 'file',
	Folder = 'folder',
	Problems = 'problems',
	Terminal = 'terminal',
	URL = 'url',
	Git = 'git',
	NoResults = 'noResults',
}

export interface ContextMenuQueryItem {
	type: ContextMenuOptionType;
	value?: string;
	label?: string;
	description?: string;
}

export function getContextMenuOptions(
	query: string,
	selectedType: ContextMenuOptionType | null = null,
	queryItems: ContextMenuQueryItem[]
): ContextMenuQueryItem[] {
	const workingChanges: ContextMenuQueryItem = {
		type: ContextMenuOptionType.Git,
		value: 'git-changes',
		label: 'Working changes',
		description: 'Current uncommitted changes',
	};

	if (query === '') {
		if (selectedType === ContextMenuOptionType.File) {
			const files = queryItems
				.filter((item) => item.type === ContextMenuOptionType.File)
				.map((item) => ({
					type: ContextMenuOptionType.File,
					value: item.value,
				}));
			return files.length > 0
				? files
				: [{ type: ContextMenuOptionType.NoResults }];
		}

		if (selectedType === ContextMenuOptionType.Folder) {
			const folders = queryItems
				.filter((item) => item.type === ContextMenuOptionType.Folder)
				.map((item) => ({
					type: ContextMenuOptionType.Folder,
					value: item.value,
				}));
			return folders.length > 0
				? folders
				: [{ type: ContextMenuOptionType.NoResults }];
		}

		if (selectedType === ContextMenuOptionType.Git) {
			const commits = queryItems.filter(
				(item) => item.type === ContextMenuOptionType.Git
			);
			return commits.length > 0
				? [workingChanges, ...commits]
				: [workingChanges];
		}

		return [
			{ type: ContextMenuOptionType.URL },
			{ type: ContextMenuOptionType.Problems },
			{ type: ContextMenuOptionType.Terminal },
			{ type: ContextMenuOptionType.Git },
			{ type: ContextMenuOptionType.Folder },
			{ type: ContextMenuOptionType.File },
		];
	}

	const lowerQuery = query.toLowerCase();
	const suggestions: ContextMenuQueryItem[] = [];

	// Check for top-level option matches
	if ('git'.startsWith(lowerQuery)) {
		suggestions.push({
			type: ContextMenuOptionType.Git,
			label: 'Git Commits',
			description: 'Search repository history',
		});
	} else if ('git-changes'.startsWith(lowerQuery)) {
		suggestions.push(workingChanges);
	}
	if ('problems'.startsWith(lowerQuery)) {
		suggestions.push({ type: ContextMenuOptionType.Problems });
	}
	if (query.startsWith('http')) {
		suggestions.push({ type: ContextMenuOptionType.URL, value: query });
	}

	// Add exact SHA matches to suggestions
	if (/^[a-f0-9]{7,40}$/i.test(lowerQuery)) {
		const exactMatches = queryItems.filter(
			(item) =>
				item.type === ContextMenuOptionType.Git &&
				item.value?.toLowerCase() === lowerQuery
		);
		if (exactMatches.length > 0) {
			suggestions.push(...exactMatches);
		} else {
			// If no exact match but valid SHA format, add as option
			suggestions.push({
				type: ContextMenuOptionType.Git,
				value: lowerQuery,
				label: `Commit ${lowerQuery}`,
				description: 'Git commit hash',
			});
		}
	}

	// Create searchable strings array for fzf
	const searchableItems = queryItems.map((item) => ({
		original: item,
		searchStr: [item.value, item.label, item.description]
			.filter(Boolean)
			.join(' '),
	}));

	// Initialize fzf instance for fuzzy search
	const fzf = new Fzf(searchableItems, {
		selector: (item) => item.searchStr,
	});

	// Get fuzzy matching items
	const matchingItems = query
		? fzf.find(query).map((result) => result.item.original)
		: [];

	// Separate matches by type
	const fileMatches = matchingItems.filter(
		(item) =>
			item.type === ContextMenuOptionType.File ||
			item.type === ContextMenuOptionType.Folder
	);
	const gitMatches = matchingItems.filter(
		(item) => item.type === ContextMenuOptionType.Git
	);
	const otherMatches = matchingItems.filter(
		(item) =>
			item.type !== ContextMenuOptionType.File &&
			item.type !== ContextMenuOptionType.Folder &&
			item.type !== ContextMenuOptionType.Git
	);

	// Combine suggestions with matching items in the desired order
	if (suggestions.length > 0 || matchingItems.length > 0) {
		const allItems = [
			...suggestions,
			...fileMatches,
			...gitMatches,
			...otherMatches,
		];

		// Remove duplicates based on type and value
		const seen = new Set();
		const deduped = allItems.filter((item) => {
			const key = `${item.type}-${item.value}`;
			if (seen.has(key)) return false;
			seen.add(key);
			return true;
		});

		return deduped;
	}

	return [{ type: ContextMenuOptionType.NoResults }];
}

export function shouldShowContextMenu(text: string, position: number): boolean {
	const beforeCursor = text.slice(0, position);
	const atIndex = beforeCursor.lastIndexOf('@');

	if (atIndex === -1) return false;

	const textAfterAt = beforeCursor.slice(atIndex + 1);

	// Check if there's any whitespace after the '@'
	if (/\s/.test(textAfterAt)) return false;

	// Don't show the menu if it's a URL
	if (textAfterAt.toLowerCase().startsWith('http')) return false;

	// Don't show the menu if it's a problems or terminal
	if (
		textAfterAt.toLowerCase().startsWith('problems') ||
		textAfterAt.toLowerCase().startsWith('terminal')
	)
		return false;

	// NOTE: it's okay that menu shows when there's trailing punctuation since user could be inputting a path with marks

	// Show the menu if there's just '@' or '@' followed by some text (but not a URL)
	return true;
}
