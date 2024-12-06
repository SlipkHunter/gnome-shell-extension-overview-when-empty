const Main = imports.ui.main;

// did we activate the overview?
let _active = false;

function check_with_delay() {
  // when switching too fast it causes crash in animations
  setTimeout(check, 100);
}

function check() {
  if (!global.workspace_manager.get_active_workspace().list_windows().length) {
    // workspace empty
    if (!Main.overview.visible) {
      _active = true;
      Main.overview.show();
    }
  } else {
    // workspace not empty
    if (Main.overview.visible && _active) {
      _active = false;
      Main.overview.hide();
    }
  }
}

let _signalIds = [];

function enable() {
  _signalIds[0] = global.workspace_manager.connect('workspace-switched', check_with_delay);
  _signalIds[1] = global.display.connect('restacked', check_with_delay);
}

function disable() {
  global.workspace_manager.disconnect(_signalIds[0]);
  global.display.disconnect(_signalIds[1]);
}
