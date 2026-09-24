import type { Meta, StoryObj } from "@storybook/html-vite";
import { checkbox, doc } from "@italia-daisy/recipes/components/checkbox";
import type { ChoiceArgs } from "@italia-daisy/recipes/components/checkbox";
import { example, describe } from "./helpers";

const meta: Meta<ChoiceArgs> = {
  title: "Componenti/Checkbox",
  tags: ["autodocs"],
  render: (args) => checkbox(args),
  args: {"label":"Accetto i termini del servizio","checked":false,"disabled":false,"required":false,"size":"default"},
  argTypes: {"size":{"control":"inline-radio","options":["sm","default","lg"]}},
  parameters: { docs: { description: { component: describe(doc) } } },
};
export default meta;
type Story = StoryObj<ChoiceArgs>;

export const Playground: Story = {};

export const Base: Story = example(doc, "base");
export const Gruppo: Story = example(doc, "gruppo");
export const InLinea: Story = example(doc, "in-linea");
export const Descrizione: Story = example(doc, "descrizione");
export const Disabilitato: Story = example(doc, "disabilitato");
export const Dimensioni: Story = example(doc, "dimensioni");
export const Validazione: Story = example(doc, "validazione");
