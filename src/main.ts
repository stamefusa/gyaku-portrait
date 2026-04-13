import type { AppState, Screen } from './types';
import { mountHome }    from './screens/HomeScreen';
import { mountCamera }  from './screens/CameraScreen';
import { mountPicker }  from './screens/PickerScreen';
import { mountConfirm } from './screens/ConfirmScreen';
import { mountResult }  from './screens/ResultScreen';

const state: AppState = {
  pendingImage: null,
  confirmedImage: null,
  previousScreen: null,
};

const app = document.getElementById('app')!;

function navigate(screen: Screen) {
  app.innerHTML = '';
  switch (screen) {
    case 'home':    mountHome(app, state, navigate);    break;
    case 'camera':  mountCamera(app, state, navigate);  break;
    case 'picker':  mountPicker(app, state, navigate);  break;
    case 'confirm': mountConfirm(app, state, navigate); break;
    case 'result':  mountResult(app, state, navigate);  break;
  }
}

navigate('home');
