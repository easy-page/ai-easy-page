export enum SenceInputComponentEnum {
	Input = 'input',
	Select = 'select',
	File = 'file',
	Image = 'image',
	Icons = 'icons',
	Text = 'text', // 默认文本
}

export enum SenceInputComponentOperationEnum {
	ChooseFile = 'chooseFile',
	FileUrl = 'fileUrl',
}

export enum IconsName {
	RightArrow = 'rightArrow',
}

export enum SenceOperationEnum {
	UploadContent = 'uploadContent',
	Select = 'select',
	Switch = 'switch',
	DialogInput = 'dialogInput',
	UploadFile = 'uploadFile',
	DownloadFile = 'downloadFile',
	UploadImage = 'uploadImage',
}

export enum UploadContentFromEnum {
	Local = 'local',
	Cloud = 'cloud',
}

export enum SenceTemplateComponentEnum {
	Select = 'select',
	ImageCard = 'imageCard',
	TextCard = 'textCard',
	AudioCard = 'audioCard',
}

export enum ChatMode {
	NewChat = 'newChat',
	Conversation = 'conversation',
}
