import logger from './logger';

export class AdzunaClient {
    private appId: string;
    private appKey: string;
    private country: string = 'in'; // Default to India based on user timezone
    private baseURL: string = 'https://api.adzuna.com/v1/api/jobs';

    constructor() {
        this.appId = process.env.ADZUNA_APP_ID || '';
        this.appKey = process.env.ADZUNA_APP_KEY || ''; // User provided key
    }

    isConfigured(): boolean {
        return !!this.appId && !!this.appKey;
    }

    /**
     * Search for jobs on Adzuna
     * @param query Job title or keyword
     * @param location Optional location
     * @returns Array of job objects
     */
    async searchJobs(query: string, location: string = ''): Promise<any[]> {
        if (!this.isConfigured()) {
            logger.warn('Adzuna API not configured (missing App ID or Key). Returning empty results.');
            return [];
        }

        try {
            // Construct URL
            // Endpoint: /v1/api/jobs/{country}/search/{page}
            let url = `${this.baseURL}/${this.country}/search/1?app_id=${this.appId}&app_key=${this.appKey}&results_per_page=3&what=${encodeURIComponent(query)}`;

            if (location) {
                url += `&where=${encodeURIComponent(location)}`;
            }

            logger.info(`Fetching jobs from Adzuna: ${url.replace(this.appId, '***').replace(this.appKey, '***')}`);

            const response = await fetch(url);

            if (!response.ok) {
                logger.error(`Adzuna API error: ${response.status} ${response.statusText}`);
                const text = await response.text();
                logger.error(`Adzuna Response: ${text}`);
                return [];
            }

            const data = await response.json();

            // Map Adzuna results to our format
            // Adzuna result item: { title, company: { display_name }, location: { area }, redirect_url, description }
            return (data.results || []).map((job: any) => ({
                query: job.title, // Use title as display
                platform: 'Adzuna', // Mark as Adzuna
                reason: `${job.company?.display_name || 'Company'} - ${job.location?.area?.join(', ')}${location ? '' : ' (Location)'}`,
                url: job.redirect_url,
                description: job.description
            }));

        } catch (error) {
            logger.error('Error fetching jobs from Adzuna:', error);
            return [];
        }
    }
}

export const adzunaClient = new AdzunaClient();
