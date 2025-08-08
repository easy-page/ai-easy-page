import React from 'react';

interface SpinnerProps {
    size?: number;
    className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 20, className = '' }) => {
    return (
        <div
            className={className}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: size,
                height: size,
            }}
        >
            <style>
                {`
                    @keyframes antRotate {
                        to { transform: rotate(405deg); }
                    }
                    @keyframes antSpinMove {
                        to { opacity: 1; }
                    }
                `}
            </style>
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                }}
            >
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        animation: 'antRotate 2.4s infinite linear', // 从 1.2s 改为 2.4s
                    }}
                >
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
                        (degree, index) => (
                            <span
                                key={index}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    width: size * 0.05,
                                    height: size * 0.25,
                                    marginTop: -(size * 0.25) / 2,
                                    marginLeft: -(size * 0.05) / 2,
                                    transformOrigin: 'center center',
                                    transform: `rotate(${degree}deg) translate(0, ${
                                        -size * 0.3
                                    }px)`,
                                    backgroundColor: 'hsl(var(--primary))',
                                    borderRadius: size * 0.025,
                                    display: 'block',
                                    opacity: 0.3,
                                    animation: 'antSpinMove 2s infinite linear alternate', // 从 1s 改为 2s
                                    animationDelay: `${-2.4 + index * 0.2}s`, // 调整延迟时间
                                }}
                            />
                        )
                    )}
                </div>
            </div>
        </div>
    );
};
