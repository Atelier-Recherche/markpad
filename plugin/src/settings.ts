import { App, PluginSettingTab, Setting } from "obsidian";
import type MarkpadPlugin from "./main";

export interface MarkpadSettings {
  serverUrl: string;
  apiKey: string;
  userId: string;
  displayName: string;
  color: string;
  defaultRoomPassword: string;
}

export const DEFAULT_SETTINGS: MarkpadSettings = {
  serverUrl: "http://localhost:1234",
  apiKey: "",
  userId: "",
  displayName: "Obsidian User",
  color: "#7c3aed",
  defaultRoomPassword: ""
};

export class MarkpadSettingTab extends PluginSettingTab {
  public constructor(app: App, private readonly plugin: MarkpadPlugin) {
    super(app, plugin);
  }

  public display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Server URL")
      .setDesc("Adresse du serveur Markpad.")
      .addText((text) =>
        text.setValue(this.plugin.settings.serverUrl).onChange(async (value) => {
          this.plugin.settings.serverUrl = value.trim();
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName("API Key")
      .setDesc("Clé API utilisée pour créer les sessions.")
      .addText((text) =>
        text.setValue(this.plugin.settings.apiKey).onChange(async (value) => {
          this.plugin.settings.apiKey = value.trim();
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName("User ID")
      .setDesc("Identifiant unique de l'utilisateur.")
      .addText((text) =>
        text.setValue(this.plugin.settings.userId).onChange(async (value) => {
          this.plugin.settings.userId = value.trim();
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName("Display name")
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
      .setName("Cursor color")
      .setDesc("Couleur utilisée pour le curseur local.")
      .addText((text) =>
        text.setValue(this.plugin.settings.color).onChange(async (value) => {
          this.plugin.settings.color = value.trim();
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName("Default room password")
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
  }
}
