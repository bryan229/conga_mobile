import { AppState } from 'react-native';

export type ApplicationState = 'BACKGROUND' | 'ACTIVE';

class AppStateService {
    private static _instance: AppStateService | null;

    static getInstance = (): AppStateService => {
        if (!this._instance) this._instance = new AppStateService();
        return this._instance;
    };

    onAppStateChanged = (listner: (state: ApplicationState) => void) => {
        return AppState.addEventListener('change', (nextState) => {
            const currentStatus = nextState === 'active' ? 'ACTIVE' : 'BACKGROUND';
            listner(currentStatus);
        });
    };
}

export default AppStateService.getInstance();
