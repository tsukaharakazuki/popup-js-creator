import { useCallback } from 'react';
import type { PopupConfig } from '../types/popup';
import { useLocalStorage } from './useLocalStorage';

export interface PopupProject {
  id: string;
  name: string;
  config: PopupConfig;
  updatedAt: string;
}

export function usePopupProjects() {
  const [projects, setProjects] = useLocalStorage<PopupProject[]>('popup-projects', []);

  const saveProject = useCallback(
    (config: PopupConfig) => {
      setProjects((prev) => {
        const existing = prev.findIndex((p) => p.id === config.id);
        const project: PopupProject = {
          id: config.id,
          name: config.name,
          config,
          updatedAt: new Date().toISOString(),
        };
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = project;
          return updated;
        }
        return [project, ...prev];
      });
    },
    [setProjects],
  );

  const deleteProject = useCallback(
    (id: string) => {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    },
    [setProjects],
  );

  const getProject = useCallback(
    (id: string) => projects.find((p) => p.id === id),
    [projects],
  );

  return { projects, saveProject, deleteProject, getProject };
}
