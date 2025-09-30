import React, { useMemo, useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export type TooltipPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'leftTop'
  | 'leftBottom'
  | 'rightTop'
  | 'rightBottom';

export interface TooltipProps {
  content: React.ReactNode;
  placement?: TooltipPlacement;
  offset?: number;
  openDelay?: number;
  closeDelay?: number;
  showArrow?: boolean;
  className?: string;
  style?: React.CSSProperties;
  usePortal?: boolean; // 渲染到 body，避免父容器 overflow 截断
  textColor?: string; // 文案颜色
  backgroundColor?: string; // 气泡背景色
  children: React.ReactElement;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  placement = 'top',
  offset = 8,
  openDelay = 80,
  closeDelay = 80,
  showArrow = true,
  className,
  style,
  usePortal = true,
  textColor = '#ECEFF3',
  backgroundColor = 'rgba(0,0,0,0.88)',
  children,
}) => {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (openTimer.current) window.clearTimeout(openTimer.current);
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    },
    [],
  );

  const handleMouseEnter = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    openTimer.current = window.setTimeout(() => setVisible(true), openDelay);
  };

  const handleMouseLeave = () => {
    if (openTimer.current) window.clearTimeout(openTimer.current);
    closeTimer.current = window.setTimeout(() => setVisible(false), closeDelay);
  };

  const wrapperStyle: React.CSSProperties = useMemo(
    () => ({
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
    }),
    [],
  );

  const [effectivePlacement, setEffectivePlacement] =
    useState<TooltipPlacement>(placement);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null,
  );
  const [arrowOffset, setArrowOffset] = useState<{
    left?: number;
    top?: number;
  } | null>(null);

  useEffect(() => {
    if (!visible) return;
    const trigger = triggerRef.current;
    const bubble = bubbleRef.current;
    if (!trigger || !bubble) return;
    const viewportPadding = 8;
    const rect = trigger.getBoundingClientRect();
    const bubbleRect = bubble.getBoundingClientRect();

    const fits = (pl: TooltipPlacement) => {
      switch (pl) {
        case 'top':
        case 'topLeft':
        case 'topRight':
          return rect.top - bubbleRect.height - offset >= viewportPadding;
        case 'bottom':
        case 'bottomLeft':
        case 'bottomRight':
          return (
            rect.bottom + bubbleRect.height + offset <=
            window.innerHeight - viewportPadding
          );
        case 'left':
        case 'leftTop':
        case 'leftBottom':
          return rect.left - bubbleRect.width - offset >= viewportPadding;
        case 'right':
        case 'rightTop':
        case 'rightBottom':
          return (
            rect.right + bubbleRect.width + offset <=
            window.innerWidth - viewportPadding
          );
      }
    };

    const opposite: Record<TooltipPlacement, TooltipPlacement> = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left',
      topLeft: 'bottomLeft',
      topRight: 'bottomRight',
      bottomLeft: 'topLeft',
      bottomRight: 'topRight',
      leftTop: 'rightTop',
      leftBottom: 'rightBottom',
      rightTop: 'leftTop',
      rightBottom: 'leftBottom',
    };

    if (!fits(placement)) {
      const alt = opposite[placement];
      setEffectivePlacement(fits(alt) ? alt : placement);
    } else {
      setEffectivePlacement(placement);
    }

    // 计算 fixed 坐标，避免被容器遮挡
    const vpW = window.innerWidth;
    const vpH = window.innerHeight;
    const clamp = (v: number, min: number, max: number) =>
      Math.min(Math.max(v, min), max);

    let top = 0;
    let left = 0;
    const gap = offset;

    const place = (pl: TooltipPlacement) => {
      switch (pl) {
        case 'top':
        case 'topLeft':
        case 'topRight': {
          top = rect.top - bubbleRect.height - gap;
          const idealLeft =
            pl === 'top'
              ? rect.left + rect.width / 2 - bubbleRect.width / 2
              : pl === 'topLeft'
              ? rect.left
              : rect.right - bubbleRect.width;
          left = clamp(
            idealLeft,
            viewportPadding,
            vpW - viewportPadding - bubbleRect.width,
          );
          break;
        }
        case 'bottom':
        case 'bottomLeft':
        case 'bottomRight': {
          top = rect.bottom + gap;
          const idealLeft =
            pl === 'bottom'
              ? rect.left + rect.width / 2 - bubbleRect.width / 2
              : pl === 'bottomLeft'
              ? rect.left
              : rect.right - bubbleRect.width;
          left = clamp(
            idealLeft,
            viewportPadding,
            vpW - viewportPadding - bubbleRect.width,
          );
          break;
        }
        case 'left':
        case 'leftTop':
        case 'leftBottom': {
          left = rect.left - bubbleRect.width - gap;
          const idealTop =
            pl === 'left'
              ? rect.top + rect.height / 2 - bubbleRect.height / 2
              : pl === 'leftTop'
              ? rect.top
              : rect.bottom - bubbleRect.height;
          top = clamp(
            idealTop,
            viewportPadding,
            vpH - viewportPadding - bubbleRect.height,
          );
          break;
        }
        case 'right':
        case 'rightTop':
        case 'rightBottom': {
          left = rect.right + gap;
          const idealTop =
            pl === 'right'
              ? rect.top + rect.height / 2 - bubbleRect.height / 2
              : pl === 'rightTop'
              ? rect.top
              : rect.bottom - bubbleRect.height;
          top = clamp(
            idealTop,
            viewportPadding,
            vpH - viewportPadding - bubbleRect.height,
          );
          break;
        }
      }
    };

    place(effectivePlacement);
    setCoords({ top, left });

    // 计算箭头相对气泡的位置，使其与触发器中心对齐
    const halfArrow = 4; // 与箭头宽高一致
    if (
      effectivePlacement === 'top' ||
      effectivePlacement === 'topLeft' ||
      effectivePlacement === 'topRight' ||
      effectivePlacement === 'bottom' ||
      effectivePlacement === 'bottomLeft' ||
      effectivePlacement === 'bottomRight'
    ) {
      const centerX = rect.left + rect.width / 2;
      const computedLeft = centerX - left - halfArrow; // 相对气泡
      const clampedLeft = Math.min(
        Math.max(computedLeft, halfArrow),
        bubbleRect.width - halfArrow,
      );
      setArrowOffset({ left: clampedLeft });
    } else {
      const centerY = rect.top + rect.height / 2;
      const computedTop = centerY - top - halfArrow;
      const clampedTop = Math.min(
        Math.max(computedTop, halfArrow),
        bubbleRect.height - halfArrow,
      );
      setArrowOffset({ top: clampedTop });
    }
  }, [visible, placement, offset, effectivePlacement]);

  const bubble = useMemo(() => {
    if (!visible) return null;

    const base: React.CSSProperties = {
      position: 'absolute',
      zIndex: 1000,
      maxWidth: 320,
      padding: '6px 10px',
      color: textColor,
      background: backgroundColor,
      borderRadius: 4,
      fontSize: 12,
      boxShadow:
        '0 6px 16px 0 rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)',
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
    };

    const pos: Record<TooltipPlacement, React.CSSProperties> = {
      top: {
        bottom: `calc(100% + ${offset}px)`,
        left: '50%',
        transform: 'translateX(-50%)',
      },
      bottom: {
        top: `calc(100% + ${offset}px)`,
        left: '50%',
        transform: 'translateX(-50%)',
      },
      left: {
        right: `calc(100% + ${offset}px)`,
        top: '50%',
        transform: 'translateY(-50%)',
      },
      right: {
        left: `calc(100% + ${offset}px)`,
        top: '50%',
        transform: 'translateY(-50%)',
      },
      topLeft: { bottom: `calc(100% + ${offset}px)`, left: 0 },
      topRight: { bottom: `calc(100% + ${offset}px)`, right: 0 },
      bottomLeft: { top: `calc(100% + ${offset}px)`, left: 0 },
      bottomRight: { top: `calc(100% + ${offset}px)`, right: 0 },
      leftTop: { right: `calc(100% + ${offset}px)`, top: 0 },
      leftBottom: { right: `calc(100% + ${offset}px)`, bottom: 0 },
      rightTop: { left: `calc(100% + ${offset}px)`, top: 0 },
      rightBottom: { left: `calc(100% + ${offset}px)`, bottom: 0 },
    };

    const arrowBase: React.CSSProperties = {
      position: 'absolute',
      width: 8,
      height: 8,
      background: backgroundColor,
      transform: 'rotate(45deg)',
      boxShadow:
        '0 6px 16px 0 rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)',
    };

    const arrowPos: Record<TooltipPlacement, React.CSSProperties> = {
      top: { top: '100%', left: '50%', marginLeft: -4, marginTop: -4 },
      bottom: { bottom: '100%', left: '50%', marginLeft: -4, marginBottom: -4 },
      left: { left: '100%', top: '50%', marginTop: -4, marginLeft: -4 },
      right: { right: '100%', top: '50%', marginTop: -4, marginRight: -4 },
      topLeft: { top: '100%', left: 12, marginTop: -4 },
      topRight: { top: '100%', right: 12, marginTop: -4 },
      bottomLeft: { bottom: '100%', left: 12, marginBottom: -4 },
      bottomRight: { bottom: '100%', right: 12, marginBottom: -4 },
      leftTop: { left: '100%', top: 12, marginLeft: -4 },
      leftBottom: { left: '100%', bottom: 12, marginLeft: -4 },
      rightTop: { right: '100%', top: 12, marginRight: -4 },
      rightBottom: { right: '100%', bottom: 12, marginRight: -4 },
    };

    const bubbleBody = (
      <div
        ref={bubbleRef}
        style={{
          ...base,
          ...(usePortal ? {} : pos[effectivePlacement]),
          opacity: visible ? 1 : 0,
          transition: 'opacity 120ms ease',
        }}
        className={className}
      >
        {content}
        {showArrow && (
          <span
            style={{
              ...arrowBase,
              ...arrowPos[effectivePlacement],
              ...(usePortal && arrowOffset
                ? effectivePlacement.startsWith('top') ||
                  effectivePlacement.startsWith('bottom')
                  ? { left: arrowOffset.left, marginLeft: 0 }
                  : { top: arrowOffset.top, marginTop: 0 }
                : {}),
            }}
          />
        )}
      </div>
    );

    if (usePortal && coords) {
      return createPortal(
        <div style={{ position: 'fixed', top: coords.top, left: coords.left }}>
          {bubbleBody}
        </div>,
        document.body,
      );
    }
    return bubbleBody;
  }, [
    visible,
    content,
    effectivePlacement,
    offset,
    showArrow,
    className,
    usePortal,
    coords,
    textColor,
    backgroundColor,
  ]);

  return (
    <span
      ref={triggerRef}
      style={{ ...wrapperStyle, ...style }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {bubble}
    </span>
  );
};

export default Tooltip;
