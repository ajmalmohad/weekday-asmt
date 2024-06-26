import { Job } from "../store/search-job-slice";
import { JobCard } from "./jobcard";
import { useEffect, useRef } from "react";
import Loading from '../assets/loading.gif';
import './css/joblists.css'
import { debounce } from "../utils/debounce";

export default function JobLists({
    jobs,
    loading,
    fetchData,
}: {
    jobs: Job[];
    loading: boolean;
    fetchData: () => void;
}) {
    const loadMoreRef = useRef(null);

    const debouncedFetchData = debounce(fetchData, 300);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const first = entries[0];
            if (first.isIntersecting) {
                console.log("Intersecting");
                debouncedFetchData();
            }
        }, {});

        const currentRef = loadMoreRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [debouncedFetchData]);

    if (loading) {
        return (
            <div className="loading">
                <img src={Loading} alt="loading" />
            </div>
        );
    }

    if (!jobs.length) {
        return (
            <div className="no-jobs">
                <p>No Jobs Found</p>
            </div>
        );
    }

    return (
        <div className="joblists">
            <div className="list">
                {jobs.map((job, idx) => (
                    <JobCard job={job} key={idx} />
                ))}
            </div>
            <div className="observer" ref={loadMoreRef}>Load More</div>
        </div>
    );
}