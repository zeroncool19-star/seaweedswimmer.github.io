// AdService - AdMob integration (same as v43)
class AdService {
  constructor() {
    this.AdMob = null;
    this.initialized = false;
    this.bannerAdShown = false;
  }

  async initialize() {
    try {
      const module = await import('@capacitor-community/admob');
      this.AdMob = module.AdMob;
      
      await this.AdMob.initialize({
        initializeForTesting: false,
      });
      
      this.initialized = true;
      console.log('✅ AdMob initialized');
    } catch (error) {
      console.log('AdMob not available in web environment');
    }
  }

  async showMenuBannerAd() {
    if (!this.initialized || !this.AdMob) return;
    
    try {
      await this.AdMob.showBanner({
        adId: 'ca-app-pub-9069068945892968/1234567890',
        position: 'BOTTOM_CENTER',
        margin: 0,
      });
      this.bannerAdShown = true;
    } catch (error) {
      console.log('Banner ad error:', error);
    }
  }

  async showGameplayBannerAd() {
    if (!this.initialized || !this.AdMob) return;
    
    try {
      await this.AdMob.showBanner({
        adId: 'ca-app-pub-9069068945892968/1234567890',
        position: 'BOTTOM_CENTER',
        margin: 0,
      });
      this.bannerAdShown = true;
    } catch (error) {
      console.log('Banner ad error:', error);
    }
  }

  async hideAllAds() {
    if (!this.initialized || !this.AdMob || !this.bannerAdShown) return;
    
    try {
      await this.AdMob.hideBanner();
      this.bannerAdShown = false;
    } catch (error) {
      console.log('Hide ad error:', error);
    }
  }

  async removeBannerAd() {
    if (!this.initialized || !this.AdMob) return;
    
    try {
      await this.AdMob.removeBanner();
      this.bannerAdShown = false;
    } catch (error) {
      console.log('Remove ad error:', error);
    }
  }

  async showGameOverAd() {
    if (!this.initialized || !this.AdMob) return;
    
    try {
      await this.AdMob.prepareInterstitial({
        adId: 'ca-app-pub-9069068945892968/0987654321',
      });
      
      await this.AdMob.showInterstitial();
    } catch (error) {
      console.log('Interstitial ad error:', error);
    }
  }
}

export default AdService;
