import { createElement } from 'react';
import type { Service } from './bookingTypes';

// Icon components as simple SVG strings (to avoid JSX in non-TSX file)
// These are placeholder icons — actual icons will be rendered in the components
const ScissorsIcon = createElement('span', { 'data-icon': 'scissors' });
const RulerIcon = createElement('span', { 'data-icon': 'ruler' });
const BriefcaseIcon = createElement('span', { 'data-icon': 'briefcase' });
const ShirtIcon = createElement('span', { 'data-icon': 'shirt' });

export const SERVICES: Service[] = [
  {
    id: 'fatos-medida',
    name: 'Fatos Sob Medida',
    description: 'Consulta completa de alfaiataria bespoke para criação de fatos personalizados.',
    duration: '90 min',
    icon: ScissorsIcon,
  },
  {
    id: 'ajustes',
    name: 'Ajustes de Roupa',
    description: 'Ajustes e alterações em peças existentes para um caimento perfeito.',
    duration: '30 min',
    icon: RulerIcon,
  },
  {
    id: 'uniformes',
    name: 'Uniformes Corporativos',
    description: 'Consulta para criação de uniformes profissionais para empresas.',
    duration: '60 min',
    icon: BriefcaseIcon,
  },
  {
    id: 'tradicional',
    name: 'Vestuário Tradicional',
    description: 'Capulanas e trajes tradicionais africanos feitos com arte e tradição.',
    duration: '60 min',
    icon: ShirtIcon,
  },
];
