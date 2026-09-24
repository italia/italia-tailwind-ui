import type { Meta, StoryObj } from "@storybook/html-vite";
import { select, doc, type SelectArgs } from "@italia-daisy/recipes/components/select";
import { example, describe } from "./helpers";

const meta: Meta<SelectArgs> = {
  title: "Componenti/Select",
  tags: ["autodocs"],
  render: (args) => select(args),
  args: {"label":"Seleziona una regione","placeholder":"Scegli un'opzione","size":"default","disabled":false,"required":false,"multiple":false},
  argTypes: {"size":{"control":"inline-radio","options":["sm","default","lg"]},"state":{"control":"select","options":["valid","invalid"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<SelectArgs>;

export const Playground: Story = {};

export const Base: Story = example(doc, "base");
export const Gruppi: Story = example(doc, "gruppi");
export const Disabilitato: Story = example(doc, "disabilitato");
export const Dimensioni: Story = example(doc, "dimensioni");
export const Multipla: Story = example(doc, "multipla");
export const Validazione: Story = example(doc, "validazione");
