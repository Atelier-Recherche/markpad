import { App, Modal, PluginSettingTab, Setting } from "obsidian";
import type MarkpadPlugin from "./main";
import { syncUserIdFromAuthToken } from "./jwt";

import { t, type LocaleId } from "./locale";

export interface MarkpadSettings {
  serverUrl: string;
  /** JWT obtenu sur la page Mon compte après connexion par e-mail. */
  authToken: string;
  userId: string;
  displayName: string;
  color: string;
  /** Interface plugin (réglages, commandes). */
  locale: LocaleId;
  defaultRoomPassword: string;
  /** Reconnecter automatiquement au WebSocket quand une note avec markpadShare est ouverte */
  autoReconnect: boolean;
  /** Logs horodatés dans la console (Ctrl+Shift+I) pour diagnostiquer Obsidian ↔ Yjs ↔ Web */
  debugCollab: boolean;
}

export const DEFAULT_SETTINGS: MarkpadSettings = {
  serverUrl: "http://localhost:1234",
  authToken: "",
  userId: "",
  displayName: "Obsidian User",
  color: "#7c3aed",
  locale: "fr",
  defaultRoomPassword: "",
  autoReconnect: true,
  debugCollab: false
};

export class MarkpadSettingTab extends PluginSettingTab {
  public constructor(app: App, private readonly plugin: MarkpadPlugin) {
    super(app, plugin);
  }

  public display(): void {
    const { containerEl } = this;
    containerEl.empty();
    const L = this.plugin.settings.locale;

    new Setting(containerEl)
      .setName(t(L, "language"))
      .setDesc("Interface du plugin (réglages et noms de commandes).")
      .addDropdown((drop) =>
        drop
          .addOption("fr", "Français")
          .addOption("en", "English")
          .addOption("es", "Español")
          .addOption("de", "Deutsch")
          .setValue(this.plugin.settings.locale)
          .onChange(async (value) => {
            this.plugin.settings.locale = value as typeof this.plugin.settings.locale;
            await this.plugin.saveSettings();
            this.display();
          })
      );

    new Setting(containerEl)
      .setName(t(L, "serverUrl"))
      .setDesc("Adresse du serveur Markpad.")
      .addText((text) =>
        text.setValue(this.plugin.settings.serverUrl).onChange(async (value) => {
          this.plugin.settings.serverUrl = value.trim();
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName(t(L, "authToken"))
      .setDesc(t(L, "authTokenDesc"))
      .addText((text) =>
        text.setValue(this.plugin.settings.authToken).onChange(async (value) => {
          this.plugin.settings.authToken = value.trim();
          syncUserIdFromAuthToken(this.plugin.settings);
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName(t(L, "userId"))
      .setDesc(t(L, "userIdDesc"))
      .addText((text) =>
        text.setValue(this.plugin.settings.userId).onChange(async (value) => {
          this.plugin.settings.userId = value.trim();
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName(t(L, "displayName"))
      .setDesc("Nom affiché pour les curseurs distants.")
      .addText((text) =>
        text
          .setValue(this.plugin.settings.displayName)
          .onChange(async (value) => {
            this.plugin.settings.displayName = value.trim();
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(t(L, "cursorColor"))
      .setDesc("Couleur utilisée pour le curseur local.")
      .addText((text) =>
        text.setValue(this.plugin.settings.color).onChange(async (value) => {
          this.plugin.settings.color = value.trim();
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName(t(L, "defaultRoomPassword"))
      .setDesc("Mot de passe optionnel appliqué par défaut aux partages.")
      .addText((text) =>
        text
          .setPlaceholder("laisser vide pour aucune protection")
          .setValue(this.plugin.settings.defaultRoomPassword)
          .onChange(async (value) => {
            this.plugin.settings.defaultRoomPassword = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName(t(L, "autoReconnect"))
      .setDesc(
        "Si une note contient markpadShare dans le frontmatter, reconnecter le WebSocket à l’ouverture (user ID requis ; mot de passe = défaut ci-dessus)."
      )
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.autoReconnect).onChange(async (value) => {
          this.plugin.settings.autoReconnect = value;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName(t(L, "debugLogs"))
      .setDesc(
        "Affiche dans la console développeur (Ctrl+Shift+I) des messages horodatés : résolution CodeMirror, pont CM→Y, mises à jour Y.Doc, sync WebSocket. Désactive quand tu as fini de déboguer."
      )
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.debugCollab).onChange(async (value) => {
          this.plugin.settings.debugCollab = value;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName("Purger les ancres de partage dossier")
      .setDesc(
        "Arrête tous les partages dossier actifs, supprime les fichiers `.markpad-folder-share.md` restants et réinitialise l’état local (sessions serveur terminées si possible)."
      )
      .addButton((btn) =>
        btn.setButtonText("Purger…").onClick(() => {
          new MarkpadConfirmModal(
            this.app,
            "Supprimer les ancres .markpad-folder-share.md et réinitialiser les partages dossier ?",
            () => { void this.plugin.purgeFolderShareAnchors(); }
          ).open();
        })
      );
  }
}

/**
 * Modal de confirmation compatible Android.
 * Remplace window.confirm() qui est bloqué dans les WebViews Android depuis API 17+.
 */
class MarkpadConfirmModal extends Modal {
  public constructor(
    app: App,
    private readonly message: string,
    private readonly onConfirm: () => void
  ) {
    super(app);
  }

  public onOpen(): void {
    const { contentEl } = this;
    contentEl.createEl("p", { text: this.message });
    const row = contentEl.createDiv({ cls: "modal-button-container" });
    row.createEl("button", { text: "Annuler" })
      .addEventListener("click", () => this.close());
    const confirmBtn = row.createEl("button", {
      text: "Confirmer",
      cls: "mod-warning"
    });
    confirmBtn.addEventListener("click", () => {
      this.close();
      this.onConfirm();
    });
  }

  public onClose(): void {
    this.contentEl.empty();
  }
}
