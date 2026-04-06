import { Dropbox } from 'dropbox';

class DropboxService {
  constructor() {
    this.dbx = null;
    this.isProduction = import.meta.env.PROD;
  }

  async listFolder(path = '') {
    try {
      if (this.isProduction) {
        // In production, use the Vercel Functions API
        const response = await fetch(`/api/photos/list?path=${encodeURIComponent(path)}`);
        
        if (!response.ok) {
          throw new Error(`Failed to list photos: ${response.statusText}`);
        }

        return await response.json();
      } else {
        // In local dev, use Dropbox client directly
        if (!this.dbx) {
          const token = import.meta.env.VITE_DROPBOX_TOKEN;
          if (!token) {
            throw new Error('Dropbox token not configured');
          }
          this.dbx = new Dropbox({ accessToken: token });
        }

        const response = await this.dbx.filesListFolder({ path });
        return { files: response.result.entries };
      }
    } catch (error) {
      console.error('Error listing photos:', error);
      throw error;
    }
  }

  async getTemporaryLink(path) {
    try {
      if (this.isProduction) {
        // In production, use the Vercel Functions API
        const response = await fetch('/api/photos/download-link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ path }),
        });

        if (!response.ok) {
          throw new Error(`Failed to get download link: ${response.statusText}`);
        }

        return await response.json();
      } else {
        // In local dev, use Dropbox client directly
        if (!this.dbx) {
          const token = import.meta.env.VITE_DROPBOX_TOKEN;
          if (!token) {
            throw new Error('Dropbox token not configured');
          }
          this.dbx = new Dropbox({ accessToken: token });
        }

        const linkResponse = await this.dbx.filesGetTemporaryLink({ path });
        return { url: linkResponse.result.link };
      }
    } catch (error) {
      console.error('Error getting temporary link:', error);
      throw error;
    }
  }

  isAuthenticated() {
    // No client-side authentication needed - using server credentials
    return true;
  }
}

export default new DropboxService();
