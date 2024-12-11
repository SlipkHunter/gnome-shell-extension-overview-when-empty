const Main = imports.ui.main;

// did we activate the overview?
let _active = false;

function hasWindowsActive() {
  return global.workspace_manager.get_active_workspace().list_windows().length
}

function check_workspace_switched() {
  // when switching too fast it causes crash in animations
  setTimeout(function() {
    if (!hasWindowsActive()) {
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
  }, 50);
}

function check_window_created() {
  if (Main.overview.visible && hasWindowsActive()) { // overview visible and workspace not empty
    Main.overview.hide();
  }
}

function check_window_destroyed() {
  if (!Main.overview.visible && !hasWindowsActive()) { // overview not visible and workspace empty
    _active = true;
    Main.overview.show();
  }
}

let _signalIds = [];

function enable() {
  _signalIds[0] = global.workspace_manager.connect('workspace-switched', check_workspace_switched);
  _signalIds[1] = global.window_manager.connect('destroy', check_window_destroyed);
  _signalIds[2] = global.display.connect('window-created', check_window_created);
}

function disable() {
  global.workspace_manager.disconnect(_signalIds[0]);
  global.window_manager.disconnect(_signalIds[1]);
  global.display.disconnect(_signalIds[2]);
}
