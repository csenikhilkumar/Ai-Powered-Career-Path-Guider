import { useState, useEffect } from 'react';
import { careerApi } from '@/api/career';
import { CareerPath, CareerFilters } from '@/types/career';

export function useCareerPaths(filters?: CareerFilters) {
    const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCareerPaths = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await careerApi.getCareerPaths(filters);
                setCareerPaths(data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch career paths');
                console.error('Error fetching career paths:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCareerPaths();
    }, [filters?.category, filters?.difficulty, filters?.minSalary, filters?.maxSalary]);

    return { careerPaths, loading, error };
}
