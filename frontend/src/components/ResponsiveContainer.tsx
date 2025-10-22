import React from 'react';
import styled from 'styled-components';
import { theme } from '../design-system/theme';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  padding?: keyof typeof theme.spacing;
}

export const ResponsiveContainer = styled.div<ResponsiveContainerProps>`
  width: 100%;
  max-width: ${props => {
    switch(props.maxWidth) {
      case 'xs': return theme.breakpoints.xs;
      case 'sm': return theme.breakpoints.sm;
      case 'md': return theme.breakpoints.md;
      case 'lg': return theme.breakpoints.lg;
      case 'xl': return theme.breakpoints.xl;
      default: return theme.breakpoints.lg;
    }
  }};
  margin: 0 auto;
  padding: ${props => theme.spacing[props.padding || 'md']};

  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing.sm};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.xs};
  }
`;

export const ResponsiveGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.sm};
  }
`;

export const FlexContainer = styled.div<{
  direction?: 'row' | 'column';
  justify?: 'start' | 'end' | 'center' | 'space-between';
  align?: 'start' | 'end' | 'center' | 'stretch';
}>`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  justify-content: ${props => props.justify || 'start'};
  align-items: ${props => props.align || 'center'};
  width: 100%;
`;
