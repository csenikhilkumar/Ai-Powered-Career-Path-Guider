import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, BookOpen, PlayCircle, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['All', 'Development', 'Design', 'Business', 'Data Science'];

// Resource interfaces
interface YouTubeVideo {
    title: string;
    channel: string;
    reason: string;
}

interface JobQuery {
    query: string;
    platform: string;
    reason: string;
}

interface NewsTopic {
    topic: string;
    source: string;
    context: string;
}

interface LearningResources {
    youtubeVideos: YouTubeVideo[];
    jobSearchQueries: JobQuery[];
    newsTopics: NewsTopic[];
}

import { useEffect } from 'react';
import axios from 'axios';
import { Briefcase, Newspaper } from 'lucide-react';

export default function Learning() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [resources, setResources] = useState<LearningResources | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                // Get token from storage
                const token = localStorage.getItem('token');

                // TODO: Get actual user's active career path title. 
                // For now, we'll try to fetch from local storage or default to "Full Stack Developer"
                const careerPathTitle = localStorage.getItem('activeCareerPath') || 'Full Stack Developer';

                const response = await axios.post('http://localhost:3000/ai/resources', {
                    careerPathTitle: careerPathTitle,
                    currentStage: 'Intermediate', // Can be dynamic
                    interests: []
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    setResources(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch learning resources:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResources();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Learning Hub</h1>
                <p className="text-neutral-500">Curated resources to accelerate your growth</p>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                    {CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`
                whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all
                ${activeCategory === category
                                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                                    : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50 dark:bg-dark-surface dark:border-dark-border dark:text-neutral-400'}
              `}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <Input
                        placeholder="Search resources..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Recommended Videos Section */}
            <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-neutral-900 dark:text-white">
                    <PlayCircle className="text-red-600" /> Recommended Videos
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence>
                        {resources?.youtubeVideos.map((video, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Card hover className="h-full p-5 border-neutral-200 dark:border-dark-border flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-lg mb-1 line-clamp-2 text-neutral-900 dark:text-white">{video.title}</h3>
                                        <p className="text-sm text-neutral-500 mb-2">{video.channel}</p>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">{video.reason}</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(video.title)}`, '_blank')}
                                    >
                                        Watch on YouTube
                                    </Button>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Job Market Section */}
            <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-neutral-900 dark:text-white">
                    <Briefcase className="text-blue-600" /> Recent Job Opportunities
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {resources?.jobSearchQueries.map((job, index) => (
                        <Card key={index} className="p-5 border-neutral-200 dark:border-dark-border">
                            <h3 className="font-bold text-lg mb-1 text-neutral-900 dark:text-white">{job.query}</h3>
                            <div className="flex gap-2 mb-3">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full dark:bg-blue-900/30 dark:text-blue-300">{job.platform}</span>
                            </div>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">{job.reason}</p>
                            <Button
                                variant="primary"
                                className="w-full"
                                onClick={() => {
                                    const url = job.platform === 'LinkedIn'
                                        ? `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.query)}`
                                        : job.platform === 'Indeed'
                                            ? `https://www.indeed.com/jobs?q=${encodeURIComponent(job.query)}`
                                            : `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encodeURIComponent(job.query)}`;
                                    window.open(url, '_blank');
                                }}
                            >
                                Search on {job.platform}
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Industry News Section */}
            <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-neutral-900 dark:text-white">
                    <Newspaper className="text-green-600" /> Industry News
                </h2>
                <div className="space-y-4">
                    {resources?.newsTopics.map((news, index) => (
                        <Card key={index} className="p-5 border-neutral-200 dark:border-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="font-bold text-lg text-neutral-900 dark:text-white">{news.topic}</h3>
                                <p className="text-sm text-neutral-500">{news.source} • {news.context}</p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(news.topic + " news")}&tbm=nws`, '_blank')}
                            >
                                Read News
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
