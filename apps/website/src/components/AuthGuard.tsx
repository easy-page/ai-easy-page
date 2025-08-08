import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
	children: React.ReactNode;
	requireAuth?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
	children,
	requireAuth = true,
}) => {
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const { authService, isAuthenticated } = useAuth();

	useEffect(() => {
		const checkAuth = async () => {
			try {
				// 如果有 token，检查是否有效
				if (localStorage.getItem('access_token')) {
					const isValid = await authService.checkAuthStatus();
					if (!isValid && requireAuth) {
						navigate('/login');
						return;
					}
				} else if (requireAuth) {
					navigate('/login');
					return;
				}
			} catch (error) {
				console.error('Auth check failed:', error);
				if (requireAuth) {
					navigate('/login');
					return;
				}
			} finally {
				setLoading(false);
			}
		};

		checkAuth();
	}, [navigate, requireAuth, authService]);

	if (loading) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
					background: 'var(--background-dark)',
				}}
			>
				<Spin size="large" />
			</div>
		);
	}

	return <>{children}</>;
};

export default AuthGuard;
