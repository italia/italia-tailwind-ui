import type { Meta, StoryObj } from "@storybook/html-vite";
import { progress, doc, type ProgressArgs } from "@italia-daisy/recipes/components/progress";
import { example, describe } from "./helpers";

const meta: Meta<ProgressArgs> = {
  title: "Componenti/Progress",
  tags: ["autodocs"],
  render: (args) => progress(args),
  args: {"value":60,"label":"Caricamento del documento","showValue":true,"color":"primary","size":"default"},
  argTypes: {"value":{"control":{"type":"range","min":0,"max":100}},"color":{"control":"select","options":["primary","success","warning","danger","info"]},"size":{"control":"inline-radio","options":["default","md","lg"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<ProgressArgs>;

export const Playground: Story = {};

export const Barra: Story = example(doc, "barra");
export const Colori: Story = example(doc, "colori");
export const Indeterminata: Story = example(doc, "indeterminata");
export const Ciambella: Story = example(doc, "ciambella");
export const Spinner: Story = example(doc, "spinner");
export const Pulsante: Story = example(doc, "pulsante");
