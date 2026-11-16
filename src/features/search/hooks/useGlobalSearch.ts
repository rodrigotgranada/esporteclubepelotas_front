import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { searchService } from '../services/search.service';
import { GlobalSearchResponse } from '../types/search.types';
import { GLOBAL_SEARCH_TEXTS } from '../constants/search.constants';

const EMPTY_RESPONSE: GlobalSearchResponse = {
  query: '',
  totalResults: 0,
  news: [],
  athletes: [],
  idols: [],
  matches: [],
  transparency: [],
};

export const useGlobalSearch = (limit = 5) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GlobalSearchResponse>(EMPTY_RESPONSE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      abortControllerRef.current?.abort();
      setResults(EMPTY_RESPONSE);
      setIsLoading(false);
      setError(null);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const data = await searchService.searchGlobal(trimmed, limit, controller.signal);
        setResults(data);
        setHasSearched(true);
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error('Erro na busca global:', err);
        setError(GLOBAL_SEARCH_TEXTS.ERROR_MESSAGE);
        setHasSearched(true);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 280);

    return () => {
      clearTimeout(timer);
    };
  }, [query, limit]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleChange = useCallback((value: string) => {
    setQuery(value);
  }, []);

  const handleClear = useCallback(() => {
    abortControllerRef.current?.abort();
    setQuery('');
    setResults(EMPTY_RESPONSE);
    setIsLoading(false);
    setError(null);
    setHasSearched(false);
  }, []);

  return {
    query,
    results,
    isLoading,
    error,
    hasSearched,
    handleChange,
    handleClear,
  };
};

