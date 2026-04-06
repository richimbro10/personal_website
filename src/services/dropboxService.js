class DropboxService {
  async listFolder(path = '') {
    const res = await fetch(`/api/photos/list?path=${encodeURIComponent(path)}`);
    if (!res.ok) throw new Error('Failed to list photos');
    return res.json();
  }

  async getTemporaryLink(path) {
    const res = await fetch('/api/photos/download-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    });

    if (!res.ok) throw new Error('Failed to get link');
    return res.json();
  }
}

export default new DropboxService();