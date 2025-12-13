import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Carousel = ({ items, title }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(1);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const containerRef = useRef(null);

  // Responsive logic
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisibleItems(3);
      } else if (window.innerWidth >= 640) {
        setVisibleItems(2);
      } else {
        setVisibleItems(1);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    if (activeIndex < items.length - visibleItems) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const prevSlide = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  };

  // Touch/Swipe handlers
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <div 
      className="w-full py-8" 
      ref={containerRef} 
      tabIndex="0" 
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Content Carousel"
    >
      {title && (
        <div className="flex justify-between items-center mb-6 px-1">
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-8 w-8"
              onClick={prevSlide}
              disabled={activeIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-8 w-8"
              onClick={nextSlide}
              disabled={activeIndex >= items.length - visibleItems}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div 
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${activeIndex * (100 / visibleItems)}%)`,
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 px-2"
              style={{ width: `${100 / visibleItems}%` }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="h-48 bg-slate-200 w-full object-cover rounded-t-lg overflow-hidden relative">
                     {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                             No Image
                        </div>
                     )}
                     
                     {item.badge && (
                        <span className="absolute top-2 right-2 bg-white/90 px-2 py-1 text-xs font-bold rounded text-indigo-600 shadow-sm">
                            {item.badge}
                        </span>
                     )}
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{item.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2 min-h-[2.5rem]">{item.description}</p>
                    {item.action && (
                        <div className="pt-2">
                             {item.action}
                        </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: Math.ceil(items.length - visibleItems + 1) }).map((_, idx) => (
          <button
            key={idx}
            className={`h-2 rounded-full transition-all ${
              idx === activeIndex ? 'w-6 bg-indigo-600' : 'w-2 bg-slate-300'
            }`}
            onClick={() => setActiveIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
