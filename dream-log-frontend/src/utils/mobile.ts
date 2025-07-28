// src/utils/mobile.ts - Mobile-specific utility functions

/**
 * Trigger haptic feedback on supported devices
 */
export const vibrate = (pattern: number | number[] = 50) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

/**
 * Share content using Web Share API
 */
export const shareContent = async (data: ShareData): Promise<boolean> => {
  try {
    if (navigator.share) {
      await navigator.share(data);
      return true;
    }
    // Fallback to clipboard
    if (data.text) {
      await navigator.clipboard.writeText(data.text);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Share failed:', error);
    return false;
  }
};

/**
 * Check if Web Share API is available
 */
export const canShare = (): boolean => {
  return 'share' in navigator;
};

/**
 * Prevent pull-to-refresh on mobile browsers
 */
export const preventPullToRefresh = () => {
  let touchStartY = 0;
  
  document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: false });
  
  document.addEventListener('touchmove', (e) => {
    const touchY = e.touches[0].clientY;
    const touchDiff = touchY - touchStartY;
    
    // Prevent refresh when pulling down at the top
    if (touchDiff > 0 && window.scrollY === 0) {
      e.preventDefault();
    }
  }, { passive: false });
};

/**
 * Enable smooth scrolling behavior
 */
export const enableSmoothScrolling = () => {
  document.documentElement.style.scrollBehavior = 'smooth';
};

/**
 * Lock screen orientation
 */
export const lockOrientation = async (orientation: OrientationLockType = 'portrait') => {
  if ('orientation' in screen && 'lock' in screen.orientation) {
    try {
      await screen.orientation.lock(orientation);
      return true;
    } catch (error) {
      console.error('Orientation lock failed:', error);
      return false;
    }
  }
  return false;
};

/**
 * Get safe area insets for notched devices
 */
export const getSafeAreaInsets = () => {
  const styles = getComputedStyle(document.documentElement);
  return {
    top: parseInt(styles.getPropertyValue('--sat') || '0'),
    right: parseInt(styles.getPropertyValue('--sar') || '0'),
    bottom: parseInt(styles.getPropertyValue('--sab') || '0'),
    left: parseInt(styles.getPropertyValue('--sal') || '0')
  };
};

/**
 * Check if app is installed as PWA
 */
export const isPWA = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
};

/**
 * Request persistent storage
 */
export const requestPersistentStorage = async (): Promise<boolean> => {
  if (navigator.storage && navigator.storage.persist) {
    const isPersisted = await navigator.storage.persist();
    return isPersisted;
  }
  return false;
};

/**
 * Get device info
 */
export const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/.test(ua);
  const isAndroid = /Android/.test(ua);
  const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua);
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  return {
    isMobile,
    isIOS,
    isAndroid,
    isTablet,
    isTouchDevice,
    userAgent: ua,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1
  };
};

/**
 * Check network connection status
 */
export const getNetworkStatus = () => {
  const connection = (navigator as any).connection || 
                    (navigator as any).mozConnection || 
                    (navigator as any).webkitConnection;
  
  return {
    online: navigator.onLine,
    type: connection?.effectiveType || 'unknown',
    downlink: connection?.downlink || null,
    rtt: connection?.rtt || null,
    saveData: connection?.saveData || false
  };
};

/**
 * Request wake lock to keep screen on
 */
export const requestWakeLock = async () => {
  if ('wakeLock' in navigator) {
    try {
      const wakeLock = await (navigator as any).wakeLock.request('screen');
      return wakeLock;
    } catch (error) {
      console.error('Wake lock request failed:', error);
      return null;
    }
  }
  return null;
};

/**
 * Format bytes to human readable string
 */
export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Get storage usage info
 */
export const getStorageInfo = async () => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0,
        usageFormatted: formatBytes(estimate.usage || 0),
        quotaFormatted: formatBytes(estimate.quota || 0),
        percentUsed: ((estimate.usage || 0) / (estimate.quota || 1)) * 100
      };
    } catch (error) {
      console.error('Storage estimate failed:', error);
    }
  }
  return null;
};

/**
 * Save data to IndexedDB for offline support
 */
export const saveOfflineData = async (key: string, data: any) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('DreamLogOffline', 1);
    
    request.onerror = () => reject(request.error);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['dreams'], 'readwrite');
      const store = transaction.objectStore('dreams');
      const putRequest = store.put({ key, data, timestamp: Date.now() });
      
      putRequest.onsuccess = () => resolve(true);
      putRequest.onerror = () => reject(putRequest.error);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('dreams')) {
        db.createObjectStore('dreams', { keyPath: 'key' });
      }
    };
  });
};

/**
 * Get data from IndexedDB
 */
export const getOfflineData = async (key: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('DreamLogOffline', 1);
    
    request.onerror = () => reject(request.error);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['dreams'], 'readonly');
      const store = transaction.objectStore('dreams');
      const getRequest = store.get(key);
      
      getRequest.onsuccess = () => resolve(getRequest.result?.data);
      getRequest.onerror = () => reject(getRequest.error);
    };
  });
};

/**
 * Clear all offline data
 */
export const clearOfflineData = async () => {
  return new Promise((resolve, reject) => {
    const deleteRequest = indexedDB.deleteDatabase('DreamLogOffline');
    deleteRequest.onsuccess = () => resolve(true);
    deleteRequest.onerror = () => reject(deleteRequest.error);
  });
};