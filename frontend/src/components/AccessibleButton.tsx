import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';
import { theme } from '../design-system/theme';

interface AccessibleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    fullWidth?: boolean;
    ariaLabel?: string;
}

const StyledButton = styled.button<{
    variant?: 'primary' | 'secondary' | 'danger';
    fullWidth?: boolean;
}>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border-radius: ${theme.borderRadius.sm};
    border: none;
    font-size: ${theme.typography.fontSize.normal};
    font-weight: ${theme.typography.fontWeight.medium};
    cursor: pointer;
    transition: all ${theme.transitions.duration.short} ${theme.transitions.easing.easeInOut};
    width: ${props => props.fullWidth ? '100%' : 'auto'};

    // Варианты кнопок
    background-color: ${props => {
        switch(props.variant) {
            case 'primary': return theme.colors.primary.main;
            case 'secondary': return theme.colors.secondary.light;
            case 'danger': return theme.colors.secondary.main;
            default: return theme.colors.primary.main;
        }
    }};

    color: ${props => {
        switch(props.variant) {
            case 'secondary': return theme.colors.text.primary;
            default: return 'white';
        }
    }};

    &:hover {
        opacity: 0.9;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    &:focus {
        outline: 2px solid ${theme.colors.primary.light};
        outline-offset: 2px;
    }

    &:disabled {
        background-color: ${theme.colors.text.disabled};
        cursor: not-allowed;
        opacity: 0.5;
    }

    // Состояния фокуса для клавиатуры
    &:focus-visible {
        box-shadow: 0 0 0 3px ${theme.colors.primary.light};
    }
`;

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
    ({ children, variant = 'primary', fullWidth = false, ariaLabel, ...props }, ref) => {
        return (
            <StyledButton
                ref={ref}
                variant={variant}
                fullWidth={fullWidth}
                aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
                {...props}
            >
                {children}
            </StyledButton>
        );
    }
);

AccessibleButton.displayName = 'AccessibleButton';

export default AccessibleButton;
