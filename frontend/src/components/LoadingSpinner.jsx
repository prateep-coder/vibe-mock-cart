import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div
          className={`${sizeClasses[size]} border-4 border-primary-200 rounded-full animate-spin`}
          style={{ 
            borderTopColor: 'transparent',
            borderRightColor: 'transparent'
          }}
        />
        <div
          className={`${sizeClasses[size]} absolute top-0 left-0 border-4 border-transparent border-t-primary-600 rounded-full animate-spin`}
          style={{ animationDuration: '1.5s' }}
        />
      </div>
      {text && (
        <div className="text-center">
          <p className={`text-gray-600 font-medium ${textSizes[size]} mb-2`}>
            {text}
          </p>
          <div className="flex space-x-1 justify-center">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const ShimmerLoader = () => (
  <div className="animate-pulse-slow space-y-4">
    <div className="shimmer rounded-xl h-48"></div>
    <div className="space-y-3">
      <div className="shimmer h-4 rounded"></div>
      <div className="shimmer h-4 rounded w-3/4"></div>
      <div className="shimmer h-4 rounded w-1/2"></div>
    </div>
  </div>
);

export default LoadingSpinner;