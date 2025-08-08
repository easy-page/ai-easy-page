import { NavItemEnum } from './constant';

export interface Role {
    id: number;
    name: string;
}
export interface UserInfo {
    userId: string;
    userMis: string;
    userName: string;
    userAvatar: string;
    userEmail?: string;
    roles?: Array<Role>;
}

export type NavItemBaseInfo = {
    id: string;
    icon: React.ReactNode;
    label: string;
    isHighlighted?: boolean;
    className?: string;
    rightIcon?: React.ReactNode;
};
