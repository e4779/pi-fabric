import {
  INHERIT_VALUE,
  modelKey,
  sortByLastUsed
} from "./chunk-FPAFHMEI.js";

// src/ui/fabric-model-selector.ts
import {
  Container,
  fuzzyFilter,
  getKeybindings,
  Input,
  Spacer,
  Text
} from "@earendil-works/pi-tui";
var FabricModelSelector = class extends Container {
  theme;
  allEntries;
  filteredEntries;
  lastUsed;
  currentKey;
  currentValue;
  selectedIndex = 0;
  searchInput;
  listContainer = new Container();
  onSelectCallback;
  onCancelCallback;
  headerText;
  inheritLabel;
  inheritName;
  _focused = false;
  constructor(options) {
    super();
    this.theme = options.theme;
    this.lastUsed = options.source.lastUsed;
    this.currentValue = options.currentValue;
    this.currentKey = options.currentValue === INHERIT_VALUE ? null : options.currentValue;
    this.onSelectCallback = options.onSelect;
    this.onCancelCallback = options.onCancel;
    this.headerText = options.headerText ?? "Default model for Fabric agents and actors. Pick Inherit to use the host session's model.";
    this.inheritLabel = options.inheritLabel ?? INHERIT_VALUE;
    this.inheritName = options.inheritName ?? "Use the host session's default model";
    this.allEntries = this.buildEntries(options.source.models);
    this.filteredEntries = this.allEntries;
    const current = this.allEntries.findIndex((entry) => entry.value === this.currentValue);
    this.selectedIndex = current >= 0 ? current : 0;
    this.addChild(
      new Text(
        this.theme.fg("muted", this.headerText),
        0,
        0
      )
    );
    this.addChild(new Spacer(1));
    this.searchInput = new Input();
    this.searchInput.focused = true;
    this.searchInput.onSubmit = () => {
      const entry = this.filteredEntries[this.selectedIndex];
      if (entry) this.handleSelect(entry);
    };
    this.addChild(this.searchInput);
    this.addChild(new Spacer(1));
    this.addChild(this.listContainer);
    this.addChild(new Spacer(1));
    this.updateList();
  }
  get focused() {
    return this._focused;
  }
  set focused(value) {
    this._focused = value;
    this.searchInput.focused = value;
  }
  handleInput(keyData) {
    const kb = getKeybindings();
    if (kb.matches(keyData, "tui.select.up")) {
      if (this.filteredEntries.length === 0) return;
      this.selectedIndex = this.selectedIndex === 0 ? this.filteredEntries.length - 1 : this.selectedIndex - 1;
      this.updateList();
    } else if (kb.matches(keyData, "tui.select.down")) {
      if (this.filteredEntries.length === 0) return;
      this.selectedIndex = this.selectedIndex === this.filteredEntries.length - 1 ? 0 : this.selectedIndex + 1;
      this.updateList();
    } else if (kb.matches(keyData, "tui.select.confirm")) {
      const entry = this.filteredEntries[this.selectedIndex];
      if (entry) this.handleSelect(entry);
    } else if (kb.matches(keyData, "tui.select.cancel")) {
      this.onCancelCallback();
    } else {
      this.searchInput.handleInput(keyData);
      this.filterModels(this.searchInput.getValue());
    }
  }
  rpcChoices() {
    return this.allEntries.map((entry) => ({
      value: entry.value,
      label: entry.id,
      description: entry.isModel ? `${entry.provider} \xB7 ${entry.name}` : entry.name,
      current: entry.value === this.currentValue
    }));
  }
  selectRpc(value) {
    const entry = this.allEntries.find((candidate) => candidate.value === value);
    if (!entry) return false;
    this.handleSelect(entry);
    return true;
  }
  handleSelect(entry) {
    this.onSelectCallback(entry.value);
  }
  buildEntries(models) {
    const sorted = sortByLastUsed(models, this.lastUsed, this.currentKey);
    const inherit = {
      value: INHERIT_VALUE,
      id: this.inheritLabel,
      provider: "",
      name: this.inheritName,
      isModel: false
    };
    const modelEntries = sorted.map((model) => ({
      value: modelKey(model.provider, model.id),
      id: model.id,
      provider: model.provider,
      name: model.name ?? model.id,
      isModel: true
    }));
    return [inherit, ...modelEntries];
  }
  /** Filter by fuzzy match, then re-sort by recency (mirrors pi-model-sort). */
  sortEntries(entries) {
    const inherit = entries.find((entry) => !entry.isModel);
    const models = entries.filter((entry) => entry.isModel);
    const sorted = sortByLastUsed(
      models.map((entry) => ({ provider: entry.provider, id: entry.id, entry })),
      this.lastUsed,
      this.currentKey
    ).map((item) => item.entry);
    return inherit ? [inherit, ...sorted] : sorted;
  }
  filterModels(query) {
    const matches = query.trim() ? fuzzyFilter(this.allEntries, query, (entry) => this.searchText(entry)) : this.allEntries;
    this.filteredEntries = this.sortEntries(matches);
    const current = this.filteredEntries.findIndex((entry) => entry.value === this.currentValue);
    this.selectedIndex = current >= 0 ? current : Math.min(this.selectedIndex, Math.max(0, this.filteredEntries.length - 1));
    this.updateList();
  }
  /** Mirrors getModelSelectorSearchText from pi's /model selector. */
  searchText(entry) {
    if (!entry.isModel) return `${entry.id} ${entry.name}`;
    return `${entry.provider} ${entry.provider}/${entry.id} ${entry.provider} ${entry.id} ${entry.name}`;
  }
  updateList() {
    this.listContainer.clear();
    const maxVisible = 10;
    const total = this.filteredEntries.length;
    const startIndex = Math.max(
      0,
      Math.min(this.selectedIndex - Math.floor(maxVisible / 2), total - maxVisible)
    );
    const endIndex = Math.min(startIndex + maxVisible, total);
    for (let i = startIndex; i < endIndex; i++) {
      const entry = this.filteredEntries[i];
      if (!entry) continue;
      const isSelected = i === this.selectedIndex;
      const isCurrent = entry.value === this.currentValue;
      const badge = entry.provider ? ` ${this.theme.fg("muted", `[${entry.provider}]`)}` : "";
      const check = isCurrent ? this.theme.fg("success", " \u2713") : "";
      const line = isSelected ? `${this.theme.fg("accent", "\u2192 ")}${this.theme.fg("accent", entry.id)}${badge}${check}` : `  ${entry.id}${badge}${check}`;
      this.listContainer.addChild(new Text(line, 0, 0));
    }
    if (startIndex > 0 || endIndex < total) {
      this.listContainer.addChild(
        new Text(this.theme.fg("muted", `  (${this.selectedIndex + 1}/${total})`), 0, 0)
      );
    }
    if (total === 0) {
      this.listContainer.addChild(new Text(this.theme.fg("muted", "  No matching models"), 0, 0));
    } else {
      const selected = this.filteredEntries[this.selectedIndex];
      this.listContainer.addChild(new Spacer(1));
      this.listContainer.addChild(
        new Text(
          this.theme.fg("muted", `  Model Name: ${selected ? selected.name : ""}`),
          0,
          0
        )
      );
    }
  }
};

export {
  FabricModelSelector
};
//# sourceMappingURL=chunk-NLBLNR5A.js.map
