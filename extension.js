import * as Main from 'resource:///org/gnome/shell/ui/main.js';

export default class MyTestExtension {
    // did we activate the overview?
    _active = false;
    _signalIds = [];

    enable() {
        if (!Main.layoutManager._startingUp) {
            setTimeout(() => {
                this.check_window_destroyed(); // open overview after hibernation
            }, 100);
        }

        this._signalIds[0] = global.workspace_manager.connect('workspace-switched', () => this.check_workspace_switched());
        this._signalIds[1] = global.window_manager.connect('destroy', () => this.check_window_destroyed());
        this._signalIds[2] = global.display.connect('window-created', () => this.check_window_created());
    }

    disable() {
        global.workspace_manager.disconnect(this._signalIds[0]);
        global.window_manager.disconnect(this._signalIds[1]);
        global.display.disconnect(this._signalIds[2]);
    }

    hasWindowsActive() {
        return global.workspace_manager.get_active_workspace().list_windows().length > 0;
    }

    check_workspace_switched() {
        // when switching too fast it causes crash in animations
        setTimeout(() => {
            if (!this.hasWindowsActive()) {
                // workspace empty
                if (!Main.overview.visible) {
                    this._active = true;
                    Main.overview.show();
                }
            } else {
                // workspace not empty
                if (Main.overview.visible && this._active) {
                    this._active = false;
                    Main.overview.hide();
                }
            }
        }, 50);
    }

    check_window_created() {
        if (Main.overview.visible && this.hasWindowsActive()) { // overview visible and workspace not empty
            Main.overview.hide();
        }
    }

    check_window_destroyed() {
        if (!Main.overview.visible && !this.hasWindowsActive()) { // overview not visible and workspace empty
            this._active = true;
            Main.overview.show();
        }
    }
}