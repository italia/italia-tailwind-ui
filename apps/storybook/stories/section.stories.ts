import type { Meta, StoryObj } from "@storybook/html-vite";
import { section, doc, type SectionArgs } from "@italia-daisy/recipes/components/section";
import { example, describe } from "./helpers";

const meta: Meta<SectionArgs> = {
  title: "Componenti/Section",
  tags: ["autodocs"],
  render: (args) => section(args),
  args: {"title":"Titolo della sezione","lead":"Un testo introduttivo che spiega il contenuto della sezione.","variant":"muted","large":false},
  argTypes: {"variant":{"control":"select","options":["default","muted","primary","emphasis"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<SectionArgs>;

export const Playground: Story = {};

export const Base: Story = example(doc, "base");
export const Grigia: Story = example(doc, "grigia");
export const Primaria: Story = example(doc, "primaria");
export const Enfasi: Story = example(doc, "enfasi");
export const Immagine: Story = example(doc, "immagine");
