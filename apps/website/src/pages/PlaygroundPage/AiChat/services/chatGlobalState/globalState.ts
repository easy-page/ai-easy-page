import { createIdentifier } from '../../infra';
import { Memento } from '../../infra/storage';

export interface GlobalState extends Memento {}

export const GlobalState = createIdentifier<GlobalState>('GlobalState');
