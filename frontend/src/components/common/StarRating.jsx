import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, size = 14, showCount = false, count = 0 }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map((star) => (
        <Star key={star} size={size}
          className={star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'} />
      ))}
      {showCount && <span className="text-xs text-gray-500 ml-1">({count})</span>}
    </div>
  );
}
