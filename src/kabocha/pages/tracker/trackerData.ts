import type { Messages } from "../../i18n";
import en from "../../i18n/locales/en_us.json";
import parity from "../../../data/parity.generated.json";
import type { Category, Entry, Status, TrackerData } from "./types";

interface ParityItem {
  category: string;
  name: string;
  status: string;
  note?: string;
  summary?: string;
  checklist?: string[];
  ids?: string[];
  source?: string;
  group?: string;
}

interface ParityCategory {
  name: string;
  total: number;
}

const categoryText = en.tracker.categories as Record<string, { label: string; unit?: string; description?: string }>;

function labelFor(id: string): string {
  return categoryText[id]?.label ?? id.charAt(0).toUpperCase() + id.slice(1);
}

function unitFor(id: string): string {
  return categoryText[id]?.unit ?? "features";
}

function descriptionFor(id: string): string {
  return categoryText[id]?.description ?? "Implemented.";
}

const items = parity.items as ParityItem[];
const categories: Category[] = (parity.categories as ParityCategory[]).map((category) => {
  const entries: Entry[] = items
    .filter((item) => item.category === category.name)
    .map((item, index) => ({
      id: item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + index,
      name: item.name,
      group: item.group ?? category.name,
      groupLabel: item.group ?? labelFor(category.name),
      status: "done" as Status,
      note: item.summary || (!item.source && !item.checklist?.length && !item.ids?.length ? `${labelFor(category.name)}: ${item.name}` : undefined),
      items: item.checklist?.map((text) => ({ text, done: true })),
      ids: item.ids,
      source: item.source,
      cat: category.name,
      catLabel: labelFor(category.name),
    }));
  return {
    id: category.name,
    label: labelFor(category.name),
    unit: unitFor(category.name),
    description: descriptionFor(category.name),
    entries,
  };
});

const allEntries = categories.flatMap((category) => category.entries);

export const trackerData: TrackerData = {
  version: "1.0",
  commit: "master",
  updated: new Date(parity.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
  categories,
  all: {
    id: "all",
    ...en.tracker.categories.all,
    label: "All",
    unit: "entries",
    description: "Every tracked vanilla entry, implemented in Kabocha.",
    entries: allEntries,
  },
};

function textLookup(source: Record<string, string>, messages: Record<string, string>): (text: string) => string {
  const translations = new Map(Object.entries(source).map(([key, text]) => [text, messages[key] ?? text]));
  return (text) => translations.get(text) ?? text;
}

export function getTrackerData(t: Messages): TrackerData {
  const source = en.tracker;
  const messages = t.tracker;
  const groups = textLookup(source.groups, messages.groups);
  const notes = textLookup(source.notes, messages.notes);
  const sourceCategories: Record<string, Pick<Category, "label" | "unit" | "description">> = source.categories;
  const translatedCategories: typeof sourceCategories = messages.categories;

  const translated = trackerData.categories.map((category) => {
    const original = sourceCategories[category.id];
    const target = translatedCategories[category.id];
    const text = {
      label: original?.label === category.label ? (target?.label ?? category.label) : category.label,
      unit: original?.unit === category.unit ? (target?.unit ?? category.unit) : category.unit,
      description: original?.description === category.description ? (target?.description ?? category.description) : category.description,
    };
    return {
      ...category,
      ...text,
      entries: category.entries.map((entry) => ({
        ...entry,
        catLabel: text.label,
        groupLabel: entry.group === undefined ? undefined : groups(entry.group),
        note: entry.note === undefined ? undefined : notes(entry.note),
      })),
    };
  });

  return {
    ...trackerData,
    categories: translated,
    all: {
      ...trackerData.all,
      label: messages.categories.all.label,
      unit: messages.categories.all.unit,
      description: messages.categories.all.description,
      entries: translated.flatMap((category) => category.entries),
    },
  };
}
