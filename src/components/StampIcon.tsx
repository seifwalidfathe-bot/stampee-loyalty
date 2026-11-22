import React from 'react';
import { Coffee, Star, Scissors, Pizza, Heart, Gift, UtensilsCrossed, Car } from 'lucide-react';
import { StampIconType } from '../types';

interface StampIconProps {
  type: StampIconType;
  className?: string;
  size?: number;
}

export const StampIcon: React.FC<StampIconProps> = ({ type, className = "w-6 h-6", size }) => {
  switch (type) {
    case 'coffee':
      return <Coffee className={className} size={size} />;
    case 'star':
      return <Star className={className} size={size} />;
    case 'scissors':
      return <Scissors className={className} size={size} />;
    case 'pizza':
      return <Pizza className={className} size={size} />;
    case 'heart':
      return <Heart className={className} size={size} />;
    case 'gift':
      return <Gift className={className} size={size} />;
    case 'burger':
      return <UtensilsCrossed className={className} size={size} />;
    case 'car':
      return <Car className={className} size={size} />;
    default:
      return <Coffee className={className} size={size} />;
  }
};
