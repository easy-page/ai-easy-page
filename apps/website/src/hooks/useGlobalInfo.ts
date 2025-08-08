import { useEffect, useState } from 'react';
import { useObservable } from './useObservable';
import { ChatService } from '../services/chatGlobalState';
import { AuthService } from '../services/auth/authService';
import { useService } from '@/infra';
import { queryTeams } from '@/apis/team';

export const useGlobalInfo = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const chatService = useService(ChatService);
	const authService = useService(AuthService);
	const userTeams = useObservable(chatService.globalState.userTeams$, []);
	const [isLoading, setIsLoading] = useState(false);
	useEffect(() => {
		const fetchInitInfos = async () => {
			setIsLoading(true);
			try {
				// 先尝试从服务器获取最新的用户信息
				const userInfoResult = await authService.getUserInfo();
				if (userInfoResult.success && userInfoResult.data) {
					const currentUser = userInfoResult.data.user;

					const response = await queryTeams({
						page_num: 1,
						page_size: 100,
					});
					if (response.success && response.data) {
						console.log('response:', response);
						const userMis = currentUser?.mis || '';
						// 设置用户的团队
						const myTeams = response.data.data.filter(
							(team) =>
								team.admin_user.split(',').includes(userMis || '') ||
								team.members.split(',').includes(userMis || '')
						);
						console.log('myTeams:', response.data.data, currentUser);
						chatService.globalState.setUserTeams(myTeams);
					}
				}
			} catch (error) {
				console.error('获取用户信息失败:', error);
			} finally {
				setIsLoading(false);
			}
		};

		// 检查是否有用户信息，如果没有则获取
		const currentUser = authService.getCurrentUser();
		if (!currentUser) {
			fetchInitInfos();
		}
	}, [authService, chatService]);
	return {
		chatService,
		setSearchQuery,
		isLoading,
		searchQuery,
		userTeams,
	};
};
