import type { AcademyModule, AcademyPath, AcademyResource, Lab, ModuleDetail, Scenario } from '../types';
import { api } from './api';

export const getAcademyPaths = () => api.get<AcademyPath[]>('/academy/paths');
export const getPathModules = (pathId: string) => api.get<AcademyModule[] | ModuleDetail[]>(`/academy/paths/${pathId}/modules`);
export const getAcademyModules = () => api.get<ModuleDetail[]>('/academy/modules');
export const getAcademyModule = (moduleId: string) => api.get<ModuleDetail>(`/academy/modules/${moduleId}`);
export const getScenarios = () => api.get<Scenario[]>('/academy/scenarios');
export const getLabs = () => api.get<Lab[]>('/academy/labs');
export const getLab = (labId: string) => api.get<Lab>(`/academy/labs/${labId}`);
export const getAcademyResources = () => api.get<AcademyResource[]>('/academy/resources');
