import Gio from 'gi://Gio';
import Adw from 'gi://Adw';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';


export default class OverviewWhenEmptyPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const page = new Adw.PreferencesPage({
            title: _('Settings'),
            icon_name: 'dialog-information-symbolic',
        });
        window.add(page);

        const group = new Adw.PreferencesGroup({
            title: _('General Settings')
        });
        page.add(group);

        const row = new Adw.SwitchRow({
            title: _('Show overview after hibernation')
        });
        group.add(row);

        window._settings = this.getSettings();
        window._settings.bind('show-overview-after-hibernation', row, 'active', Gio.SettingsBindFlags.DEFAULT);
    }
}