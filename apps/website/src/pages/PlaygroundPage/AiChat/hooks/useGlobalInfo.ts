import { useEffect, useState } from 'react';
import { useObservable } from './useObservable';
import { ChatService } from '../services/chatGlobalState';
import { useService } from '../infra';

export const useGlobalInfo = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const chatService = useService(ChatService);
	const userInfo = useObservable(chatService.globalState.userInfo$, null);
	const userTeams = useObservable(chatService.globalState.userTeams$, []);
	const [isLoading, setIsLoading] = useState(false);
	useEffect(() => {
		const fetchInitInfos = async () => {
			setIsLoading(true);
			try {
				const userInfo = await getUserInfo({});
				chatService.globalState.setUserInfo({
					userAvatar:
						'https://s3plus.meituan.net/zspt-fe/huichang/%E5%8D%8E%E8%8E%B1%E5%A3%AB.jpg',
					userName: userInfo.data?.mis,
					userMis: userInfo.data?.mis,
					userId: userInfo.data?.mis,
					userEmail: '',
					roles: userInfo.data?.roles || [],
				});
				const response = await queryTeams({
					page_num: 1,
					page_size: 100,
				});
				if (response.success && response.data) {
					console.log('response:', response);
					const userMis = userInfo?.data?.mis || '';
					// 设置用户的团队
					const myTeams = response.data.data.filter(
						(team) =>
							team.admin_user.split(',').includes(userMis || '') ||
							team.members.split(',').includes(userMis || '')
					);
					console.log('myTeams:', response.data.data, userInfo);
					chatService.globalState.setUserTeams(myTeams);
				}
			} catch (error) {
				console.error('获取团队列表失败:', error);
			} finally {
				setIsLoading(false);
			}
		};

		if (!userInfo) {
			fetchInitInfos();
		}
	}, [userInfo]);
	return {
		chatService,
		setSearchQuery,
		isLoading,
		searchQuery,
		setAllTeams,
		allTeams,
		userTeams,
		userInfo,
	};
};
