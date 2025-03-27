import React, { useState, ReactNode } from 'react';
import { Transition } from '@headlessui/react';

type TooltipProps = {
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  maxWidth?: string;
};

export default function Tooltip({ 
  children, 
  content, 
  position = 'top', 
  maxWidth = 'max-w-xs' 
}: TooltipProps) {
  const [isShowing, setIsShowing] = useState(false);
  
  if (!content) return <>{children}</>;
  
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 translate-y-2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 -translate-x-2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 translate-x-2 ml-2',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsShowing(true)}
        onMouseLeave={() => setIsShowing(false)}
        className="inline-block"
      >
        {children}
      </div>
      
      <Transition
        show={isShowing}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div 
          className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow-lg ${maxWidth} ${positionClasses[position]}`}
          style={{ lineHeight: '1.4', minWidth: '150px', whiteSpace: 'normal', wordBreak: 'break-word' }}
        >
          <div className="relative">
            {/* Triangle pointer for tooltip */}
            <div className={`absolute ${position === 'top' ? 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full' : 
              position === 'bottom' ? 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-full' : 
              position === 'left' ? 'right-0 top-1/2 transform translate-x-full -translate-y-1/2' : 
              'left-0 top-1/2 transform -translate-x-full -translate-y-1/2'}`}>
              <div className={`w-2 h-2 bg-gray-800 transform ${position === 'top' ? 'rotate-45' : 
                position === 'bottom' ? 'rotate-45' : 
                position === 'left' ? 'rotate-45' : 
                'rotate-45'}`}></div>
            </div>
            {content}
          </div>
        </div>
      </Transition>
    </div>
  );
}
