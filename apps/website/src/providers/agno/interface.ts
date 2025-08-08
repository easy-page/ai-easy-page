export type SlashCommandProcessorResult =
	| {
			type: 'schedule_tool';
			toolName: string;
			toolArgs: Record<string, unknown>;
	  }
	| {
			type: 'handled'; // Indicates the command was processed and no further action is needed.
	  };
