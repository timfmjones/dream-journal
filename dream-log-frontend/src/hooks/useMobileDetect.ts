// src/hooks/useMobileDetect.ts
import { useEffect, useState } from 'react';

interface MobileDetectResult {
  isMobile: boolean;
  isTablet: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isDesktop: boolean;
}

export const useMobileDetect = (): MobileDetectResult => {
  const [deviceInfo, setDeviceInfo] = useState<MobileDetectResult>({
    isMobile: false,
    isTablet: false,
    isIOS: false,
    isAndroid: false,
    isDesktop: true
  });

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      
      // Check if mobile
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      
      // Check if tablet
      const isTabletDevice = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent);
      
      // Check iOS
      const isIOSDevice = /iPhone|iPad|iPod/.test(userAgent) && !(window as any).MSStream;
      
      // Check Android
      const isAndroidDevice = /Android/.test(userAgent);
      
      // Also check screen size
      const screenWidth = window.innerWidth;
      const isMobileScreen = screenWidth < 768;
      const isTabletScreen = screenWidth >= 768 && screenWidth < 1024;
      
      setDeviceInfo({
        isMobile: (isMobileDevice && !isTabletDevice) || isMobileScreen,
        isTablet: isTabletDevice || isTabletScreen,
        isIOS: isIOSDevice,
        isAndroid: isAndroidDevice,
        isDesktop: !isMobileDevice && !isTabletDevice && screenWidth >= 1024
      });
    };

    checkDevice();
    
    // Re-check on resize
    window.addEventListener('resize', checkDevice);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  return deviceInfo;
};