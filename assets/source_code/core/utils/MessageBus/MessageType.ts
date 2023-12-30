export enum MessageType {
	ButtonClick = 'Button_Click',
	ToggleClicked = 'SFX_Toggle_Click',
	UserBalanceChanged = "UserBalanceChanged",
	UserAvatarChanged = "UserAvatarChanged",
	UserActivePhoneDone = "UserActivePhoneDone",
	TEST = 'TEST_EVENT_SADKFJHASDKJFHDSF',

	DisplayNameIsSet = "DisplayNameIsSet",
	ReconnectingSocket = "ReconnectingSocket",
	SocketMiniReady = "SocketMiniReady",
	ConfigBGMChanged = "BGM_Changed",
	ConfigSFXChanged = "SFX_Changed",
	MusicPlayerStateChanged = "MusicPlayerStateChanged",
	LobbyChonRoomShown = "LobbyChonRoomShown",
	LobbyShown = "LobbyShown",
	OnFocus = "OnFocus",
	OnLostFocus = "OnLostFocus",
	HandleBannerClick = "HandleBannerClick",
	RepositionMiniGameNode = "RepositionMiniGameNode",
	MiniGameMinimized = "MiniGameMinimized",
	MiniGameMaximized = "MiniGameMaximized",
	MiniGameClosed = "MiniGameClosed",
	InviteTableGameClicked = "InviteTableGameClicked",
	UserDataChanged = "UserDataChanged",
	BankSlipCreated = "BankSlipCreated",

	Game_ForceLogOut = "Game_ForceLogOut",

	JP_Fetch = "JackpotNotify.Fetch",
	JP_AddActiveGame = "JackpotNotify.AddActiveGame",
	JP_RemoveActiveGame = "JackpotNotify.RemoveActiveGame",
	JP_OpenGame = "JackpotNotify.OpenGame",
	JP_CheckLogin = "JackpotNotify.CheckLogin",

	EventNeedRefresh = "Event_Need_Refresh",
	EventDataRefreshed = "Event_Data_Refreshed",
	EventBegin = "EventBegin",
	EventUpdate = "EventUpdate",
	EventEnd = "EventEnd",
	EventReset = "EventReset",
	HideEventBannerByID = "HideEventBanner",
    RefreshLobbyBanner = "HideLobbyBanner", 

	LoadScene = "SceneManager.LoadScene",
	LoadSceneComplete = "SceneManager.LoadSceneComplete",

	Lobby_OnNotificationClick = "Lobby.OnNotificationClick",
	Lobby_RequestNotificationComplete = "Lobby.RequestNotificationComplete",
	Lobby_ReceiveNotification = "Lobby.ReceiveNotification",
	Lobby_ReadNotification = "Lobby.ReadNotification",
	Plinko_UpdateMoney = "PlinkoUpdateMoney",

	Disconnect = "System.Disconnect",

	WebAppRespone = "WebAppRespone",
	MoveNode_TaiXiu_END = "MoveNode.TaiXiu.End",
	ForceStopBGM = "BGM.ForceStop",

	OpenWebURL = "OpenWebURL",
	UpdateJSSDK = "UpdateJSSDK",
	StorageChanged = "StorageChanged",
	OnClipboardContentReceived = "OnClipboardContentReceived",
	GetClipboard = "GetClipboard",
	SetClipboardData = "SetClipboardData",

    MiniGameNode_CardGameChat_MoveConRuoi = "MiniGameNode.CardGameChat.MoveConRuoi",
    MiniGameNode_UpdatePositionMiniGame = "MiniGameNode.UpdatePositionMiniGame"
}