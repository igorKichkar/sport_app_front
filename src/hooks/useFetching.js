import { useState } from "react";

export function useFetching(callback) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({});

    const fetching = async function (...args) {
      
        try {
            setIsLoading(true);
            const response = await callback(...args);
            return response;
        }
        catch (e) {
            setError(e);
        } finally {
            setIsLoading(false);
        }
    }
    return [fetching, isLoading, error];
}