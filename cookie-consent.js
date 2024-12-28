document.addEventListener('DOMContentLoaded', () => {
    const cookieConsentPopup = document.getElementById('cookie-consent-popup');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    const manageCookiesBtn = document.getElementById('manage-cookies');
    const declineCookiesBtn = document.getElementById('decline-cookies');
    const cookiePreferencesModal = document.getElementById('cookie-preferences-modal');
    const savePreferencesBtn = document.getElementById('save-preferences');
    const closePreferencesBtn = document.getElementById('close-preferences');
    const cookiePreferencesForm = document.getElementById('cookie-preferences-form');

    // Comprehensive cookie management
    const CookieManager = {
        // Check if cookies are allowed
        areCookiesAllowed: function() {
            return localStorage.getItem('cookieConsent') === 'accepted' || 
                   localStorage.getItem('cookieConsent') === 'customized';
        },

        // Check if specific type of cookie is allowed
        isCookieTypeAllowed: function(cookieType) {
            if (this.areCookiesAllowed()) {
                return localStorage.getItem(cookieType) === 'true';
            }
            return false;
        },

        // Disable all tracking
        disableTracking: function() {
            // Remove any existing tracking scripts or cookies
            this.removeAnalyticsCookies();
            this.blockTrackingScripts();
        },

        // Remove analytics-related cookies
        removeAnalyticsCookies: function() {
            // Remove specific cookies or localStorage items related to tracking
            localStorage.removeItem('analyticsCookies');
            localStorage.removeItem('marketingCookies');
            
            // Clear any specific tracking cookies
            document.cookie.split(";").forEach(function(c) {
                const cookieName = c.trim().split('=')[0];
                if (cookieName.includes('_ga') || cookieName.includes('_gid')) {
                    document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                }
            });
        },

        // Block tracking scripts
        blockTrackingScripts: function() {
            // Remove any loaded analytics scripts
            const scripts = document.getElementsByTagName('script');
            for (let script of scripts) {
                if (script.src.includes('google-analytics.com') || 
                    script.src.includes('analytics.js') || 
                    script.src.includes('gtag.js')) {
                    script.remove();
                }
            }

            // Disable future tracking
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push = function() {};

            console.log('All tracking has been disabled');
        }
    };

    // Check if user has already made a cookie choice
    function checkCookieConsent() {
        const cookieConsent = localStorage.getItem('cookieConsent');
        
        if (!cookieConsent) {
            // No previous choice - show popup
            cookieConsentPopup.style.display = 'block';
            cookieConsentPopup.style.opacity = '1';
        } else if (cookieConsent === 'declined') {
            // Cookies were previously declined
            CookieManager.disableTracking();
            cookieConsentPopup.style.display = 'none';
        } else {
            // Cookies were accepted or customized
            cookieConsentPopup.style.display = 'none';
        }
    }

    // Accept all cookies
    function acceptAllCookies() {
        localStorage.setItem('cookieConsent', 'accepted');
        localStorage.setItem('analyticsCookies', 'true');
        localStorage.setItem('marketingCookies', 'true');
        
        cookieConsentPopup.style.opacity = '0';
        setTimeout(() => {
            cookieConsentPopup.style.display = 'none';
        }, 300);
    }

    // Decline all cookies
    function declineAllCookies() {
        localStorage.setItem('cookieConsent', 'declined');
        
        // Disable all tracking immediately
        CookieManager.disableTracking();
        
        cookieConsentPopup.style.opacity = '0';
        setTimeout(() => {
            cookieConsentPopup.style.display = 'none';
        }, 300);
    }

    // Save cookie preferences
    function saveCookiePreferences(event) {
        event.preventDefault();
        
        // Set consent status
        localStorage.setItem('cookieConsent', 'customized');
        
        // Save individual cookie preferences
        const analyticsCookies = document.getElementById('analytics-cookies').checked;
        const marketingCookies = document.getElementById('marketing-cookies').checked;
        
        localStorage.setItem('analyticsCookies', analyticsCookies);
        localStorage.setItem('marketingCookies', marketingCookies);
        
        // If no cookies are selected, treat as decline
        if (!analyticsCookies && !marketingCookies) {
            CookieManager.disableTracking();
        }
        
        // Close modal and hide popup
        cookiePreferencesModal.style.display = 'none';
        cookieConsentPopup.style.opacity = '0';
        setTimeout(() => {
            cookieConsentPopup.style.display = 'none';
        }, 300);
    }

    // Event Listeners
    acceptCookiesBtn.addEventListener('click', acceptAllCookies);
    manageCookiesBtn.addEventListener('click', openCookiePreferences);
    declineCookiesBtn.addEventListener('click', declineAllCookies);
    savePreferencesBtn.addEventListener('click', saveCookiePreferences);
    closePreferencesBtn.addEventListener('click', closeCookiePreferences);

    // Open cookie preferences modal
    function openCookiePreferences() {
        cookiePreferencesModal.style.display = 'flex';
    }

    // Close cookie preferences modal
    function closeCookiePreferences() {
        cookiePreferencesModal.style.display = 'none';
    }

    // Initial check for cookie consent
    checkCookieConsent();

    // Expose CookieManager for potential global access
    window.CookieManager = CookieManager;
});
