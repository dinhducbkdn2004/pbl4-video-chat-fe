import { useState, useEffect } from 'react';

/**
 * A custom hook for responsive design
 * @returns {Object} Object containing screen size information
 */
const useResponsive = () => {
    const [screenSize, setScreenSize] = useState({
        isMobile: false,
        isTablet: false,
        isDesktop: false,
        screenWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
        screenHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
        size: 'md' // xs, sm, md, lg, xl
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            // Update screen size information
            setScreenSize({
                isMobile: width < 768,
                isTablet: width >= 768 && width < 1024,
                isDesktop: width >= 1024,
                screenWidth: width,
                screenHeight: height,
                size: width < 576 ? 'xs' : width < 768 ? 'sm' : width < 992 ? 'md' : width < 1200 ? 'lg' : 'xl'
            });
        };

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty array ensures effect runs only on mount and unmount

    // Helper functions for font sizes based on screen size
    const getFontSize = (baseSize) => {
        const { size } = screenSize;
        const sizeFactor = {
            xs: 0.75, // 75% of base size
            sm: 0.875, // 87.5% of base size
            md: 1, // 100% of base size
            lg: 1.125, // 112.5% of base size
            xl: 1.25 // 125% of base size
        };

        return `${baseSize * sizeFactor[size]}px`;
    };

    // Helper function for spacing based on screen size
    const getSpacing = (baseSpacing) => {
        const { isMobile, isTablet } = screenSize;

        if (isMobile) return baseSpacing * 0.75;
        if (isTablet) return baseSpacing * 0.875;
        return baseSpacing;
    };

    return {
        ...screenSize,
        getFontSize,
        getSpacing
    };
};

export default useResponsive;
