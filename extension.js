import * as Main from 'resource:///org/gnome/shell/ui/main.js';

export default class OverviewWhenEmptyExtension {
    // did we activate the overview?
    _active = false;
    _signalIds = [];

    enable() {
        this.showOverviewAfterHibernation()

        this._signalIds[0] = global.workspace_manager.connect('workspace-switched', () => this.check_workspace_switched());
        this._signalIds[1] = global.window_manager.connect('destroy', () => this.showOverview());
        this._signalIds[2] = global.display.connect('window-created', () => this.hideOverview());
    }

    disable() {
        global.workspace_manager.disconnect(this._signalIds[0]);
        global.window_manager.disconnect(this._signalIds[1]);
        global.display.disconnect(this._signalIds[2]);
    }

    hasWindowsActive() {
        return global.workspace_manager.get_active_workspace().list_windows().length > 0;
    }

    showOverviewAfterHibernation() {
        if (!Main.layoutManager._startingUp) {
            setTimeout(() => { this.showOverview(); }, 100);
        }
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

    /**
     * Hides overview if it is visible with an active window
     */
    hideOverview() {
        if (Main.overview.visible && this.hasWindowsActive()) {
            Main.overview.hide();
        }
    }

    /**
     * Shows overview if it is not visible and does not have an active window
     */
    showOverview() {
        if (!Main.overview.visible && !this.hasWindowsActive()) {
            this._active = true;
            Main.overview.show();
        }
    }
}